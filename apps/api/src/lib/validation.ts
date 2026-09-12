/**
 * Zod runtime validation for public inputs and AI structured output.
 *
 * The AI's output is NEVER trusted just because we asked for JSON. Every
 * structured AI result is parsed and validated here before anything is
 * persisted. Invalid output must never reach the database.
 *
 * Public input schemas reject malformed/oversized payloads with HTTP 400 so
 * invalid data never reaches the Discovery orchestrator.
 */
import { z } from 'zod';
import { LEAD_ACTIVITY_TYPES } from '@shared/models';

// ──────────────────────────────────────────────────────────────────────────
// PUBLIC INPUT SCHEMAS
// ──────────────────────────────────────────────────────────────────────────

export const MAX_DISCOVERY_MESSAGE_LENGTH = 4000;
export const MAX_SESSION_ID_LENGTH = 64;
export const MAX_LEAD_FIELD_LENGTH = 200;

/** POST /api/discovery/chat */
export const DiscoveryChatInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(MAX_DISCOVERY_MESSAGE_LENGTH, `Message exceeds ${MAX_DISCOVERY_MESSAGE_LENGTH} characters`),
  sessionId: z
    .string()
    .trim()
    .max(MAX_SESSION_ID_LENGTH, `sessionId exceeds ${MAX_SESSION_ID_LENGTH} characters`)
    .optional(),
}).strict();

export type DiscoveryChatInput = z.infer<typeof DiscoveryChatInputSchema>;

/** POST /api/leads (public) */
export const LeadCreateInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(MAX_LEAD_FIELD_LENGTH, `Name exceeds ${MAX_LEAD_FIELD_LENGTH} characters`),
  email: z.string().trim().email('Invalid email').max(MAX_LEAD_FIELD_LENGTH).optional().or(z.literal('')),
  phone: z.string().trim().max(MAX_LEAD_FIELD_LENGTH).optional().or(z.literal('')),
  company: z.string().trim().max(MAX_LEAD_FIELD_LENGTH).optional().or(z.literal('')),
  notes: z.string().trim().max(2000, 'Notes exceed 2000 characters').optional(),
  diagnosticId: z.string().trim().max(MAX_SESSION_ID_LENGTH).optional(),
  sessionId: z.string().trim().max(MAX_SESSION_ID_LENGTH).optional(),
}).strict();

export type LeadCreateInput = z.infer<typeof LeadCreateInputSchema>;

// ──────────────────────────────────────────────────────────────────────────
// ADMIN / CRM SCHEMAS (FASE 4/5/6)
// ──────────────────────────────────────────────────────────────────────────

export const LEAD_STATUSES = ['new', 'contacted', 'consultation', 'proposal', 'won', 'lost'] as const;
export const LEAD_PRIORITIES = ['low', 'medium', 'high'] as const;
export const LEAD_CLASSIFICATIONS = ['HOT', 'WARM', 'QUALIFIED', 'LOW'] as const;

/** PATCH /api/leads/:id (admin only). */
export const LeadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    priority: z.enum(LEAD_PRIORITIES).optional(),
    score: z.number().int().min(0).max(100).optional(),
    classification: z.enum(LEAD_CLASSIFICATIONS).optional(),
    requiresHumanReview: z.boolean().optional(),
    onSiteRequired: z.boolean().nullable().optional(),
    assignedTo: z.string().trim().max(200).nullable().optional(),
    nextAction: z.string().trim().max(500).nullable().optional(),
    followUpAt: z.string().datetime({ offset: true }).nullable().optional(),
    estimatedValue: z.number().min(0).nullable().optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
    name: z.string().trim().min(1).max(200).optional(),
    email: z.string().trim().email().nullable().optional(),
    phone: z.string().trim().max(200).nullable().optional(),
    company: z.string().trim().max(200).nullable().optional(),
  })
  .strict();
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;

/** POST /api/leads/:id/activities (admin only). */
export const ActivityCreateSchema = z
  .object({
    type: z.enum(LEAD_ACTIVITY_TYPES),
    description: z.string().trim().min(1, 'Description is required').max(1000),
    createdBy: z.string().trim().max(200).optional(),
  })
  .strict();
export type ActivityCreateInput = z.infer<typeof ActivityCreateSchema>;

/** UUID path/query params guard. */
export const ResourceIdSchema = z.object({
  id: z.string().uuid('Invalid id'),
});
export type ResourceId = z.infer<typeof ResourceIdSchema>;

// ──────────────────────────────────────────────────────────────────────────
// STRUCTURED AI OUTPUT — DIAGNOSTIC (snake_case as returned by the model)
// ──────────────────────────────────────────────────────────────────────────
// Mirrors the exact JSON contract in services/prompts.ts (DIAGNOSTIC_SCHEMA).
// Optional fields carry safe defaults so a partially-structured model response
// can still be validated instead of being discarded wholesale.

export const COMPLEXITY_VALUES = ['low', 'medium', 'high'] as const;
export const NEXT_STEP_VALUES = ['budget', 'consultation', 'analysis'] as const;

export const DiagnosticAISchema = z.object({
  // Facts the client explicitly provided (never inferred).
  problem_identified: z.string().min(1, 'problem_identified is required'),
  process_affected: z.string().trim().min(1).optional(),
  impact_estimated: z.string().trim().min(1).optional(),
  solution_recommended: z.string().trim().min(1).optional(),
  technologies_needed: z.array(z.string().trim().min(1)).default([]),
  complexity: z.enum(COMPLEXITY_VALUES).default('medium'),
  next_step: z.enum(NEXT_STEP_VALUES).default('analysis'),
  reasoning: z.string().trim().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
  // Diagnostic Engine (FASE 3)
  technical_direction: z.string().trim().optional(),
  architecture_direction: z.string().trim().optional(),
  implementation_considerations: z.string().trim().optional(),
  risks: z.array(z.string().trim().min(1)).default([]),
  opportunities: z.array(z.string().trim().min(1)).default([]),
  // AI vs FACTS separation (spec §10)
  client_stated_facts: z.array(z.string().trim().min(1)).default([]),
  technical_inferences: z.array(z.string().trim().min(1)).default([]),
  // Signals the AI may recommend — the backend decides the final flag.
  on_site_required: z.boolean().default(false),
  requires_human_review: z.boolean().default(false),
});

export type DiagnosticAI = z.infer<typeof DiagnosticAISchema>;

/** Lead classification thresholds (spec §12). */
export const LEAD_THRESHOLDS = {
  HOT: 80,
  WARM: 60,
  QUALIFIED: 40,
} as const;

export function classifyScore(score: number): string {
  if (score >= LEAD_THRESHOLDS.HOT) return 'HOT';
  if (score >= LEAD_THRESHOLDS.WARM) return 'WARM';
  if (score >= LEAD_THRESHOLDS.QUALIFIED) return 'QUALIFIED';
  return 'LOW';
}

/**
 * Extract raw JSON text from a model response, tolerating markdown fences and
 * leading/trailing prose. Returns null when no valid JSON object could be found.
 */
export function extractJsonObject(raw: string): string | null {
  if (!raw) return null;
  let text = raw.trim();
  // Strip ```json ... ``` fences.
  if (text.startsWith('```')) {
    const lines = text.split('\n');
    if (lines[0].trim().startsWith('```')) lines.shift();
    if (lines.length && lines[lines.length - 1].trim().startsWith('```')) lines.pop();
    text = lines.join('\n').trim();
  }
  // Try direct parse first.
  try {
    JSON.parse(text);
    if (text.startsWith('{')) return text;
  } catch {
    /* fall through */
  }
  // Find the outermost {...} block (last-resort recovery).
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.slice(start, end + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parse + validate a model response into a DiagnosticAI. Returns null when the
 * output cannot be recovered. Never throws user-facing internals.
 */
export function parseDiagnostic(raw: string): DiagnosticAI | null {
  const json = extractJsonObject(raw);
  if (!json) return null;
  const result = DiagnosticAISchema.safeParse(JSON.parse(json));
  if (!result.success) return null;
  return result.data;
}

/** Convenience type-safe validator result helper. */
export function validateInput<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value: unknown
): { ok: true; data: z.infer<TSchema> } | { ok: false; error: string } {
  const result = schema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  const issue = result.error.issues[0];
  return { ok: false, error: issue ? issue.message : 'Invalid payload' };
}