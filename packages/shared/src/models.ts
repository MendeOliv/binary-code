// Shared models for the Código Binário system

// --- Project Schemas ---
export interface ProjectBase {
  name: string;
  status?: string;
  currentPhaseId?: string;
}

export interface ProjectCreate extends ProjectBase {}

export interface ProjectResponse extends ProjectBase {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// --- State Schemas (Project State Snapshot) ---
export interface StateBase {
  currentPhase: Record<string, any>;
  completed: any[];
  inProgress: any[];
  next: any[];
  openQuestions: any[];
}

export interface StateUpdate extends StateBase {}

export interface StateResponse extends StateBase {
  projectId: string;
  updatedAt: string; // ISO string
}

// --- Decision Schemas ---
export interface DecisionBase {
  topic: string;
  content: string;
  reason?: string;
  source: string; // user or model_inference
  confidence: number;
  status: string; // active or revoked
}

export interface DecisionCreate extends DecisionBase {
  id: string; // Custom decision ID, e.g. DEC-001
  projectId: string;
  replacedBy?: string;
}

export interface DecisionUpdate {
  topic?: string;
  content?: string;
  reason?: string;
  source?: string;
  confidence?: number;
  status?: string;
  replacedBy?: string;
  replaced_by?: string; // DB column name
}

export interface DecisionResponse extends DecisionBase {
  id: string;
  projectId: string;
  replacedBy?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// --- Requirement Schemas ---
export interface RequirementBase {
  content: string;
  status: string; // pending
}

export interface RequirementCreate extends RequirementBase {
  id: string; // Custom requirement ID, e.g. REQ-001
  projectId: string;
}

export interface RequirementResponse extends RequirementBase {
  id: string;
  projectId: string;
  createdAt: string; // ISO string
}

// --- Task Schemas ---
export interface TaskBase {
  title: string;
  description?: string;
  status: string; // pending, in_progress, done
}

export interface TaskCreate extends TaskBase {
  id: string; // Custom task ID, e.g. TASK-001
  projectId: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
}

export interface TaskResponse extends TaskBase {
  id: string;
  projectId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// --- Memory Item Schemas ---
export interface MemoryItemBase {
  type: string; // decision, requirement, task, state, knowledge, history
  title?: string;
  content: string;
  source?: string;
  confidence: number;
  status?: string;
}

export interface MemoryItemCreate extends MemoryItemBase {
  projectId: string;
}

export interface MemoryItemResponse extends MemoryItemBase {
  id: string;
  projectId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// --- Conflict Schemas ---
export interface ConflictBase {
  itemAId: string;
  itemBId: string;
  description: string;
  resolved: boolean;
  resolution?: string;
}

export interface ConflictCreate extends ConflictBase {
  projectId: string;
}

export interface ConflictResponse extends ConflictBase {
  id: string;
  projectId: string;
  createdAt: string; // ISO string
}

// --- Chat Schemas ---
export interface ChatRequest {
  message: string;
  provider?: string;
}

export interface ExtractedMemory {
  decisions: DecisionCreate[];
  revokedDecisions: string[]; // IDs of decisions to revoke
  requirements: RequirementCreate[];
  tasks: TaskCreate[];
  state?: StateUpdate;
}

export interface ChatResponse {
  response: string;
  requiresClarification: boolean;
  clarificationQuestion?: string;
  projectId: string;
  extractedMemory?: ExtractedMemory;
}

// --- Request Log Schemas ---
export interface RequestLogResponse {
  id: string;
  projectId: string;
  question: string;
  retrievedIds: string[];
  reason?: string;
  modelUsed?: string;
  createdAt: string; // ISO string
}

// --- Discovery Session Schemas ---
export interface DiscoverySessionCreate {
  initialProblem: string;
}

export interface DiscoverySessionResponse {
  id: string;
  status: string;
  initialProblem: string;
  extractedFacts: Record<string, any>;
  complexity: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Discovery Message Schemas ---
export interface DiscoveryMessageCreate {
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface DiscoveryMessageResponse {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  createdAt: string;
}

// --- Diagnostic Brief Schemas ---
export interface DiagnosticCreate {
  sessionId: string;
  problemIdentified: string;
  processAffected?: string;
  impactEstimated?: string;
  solutionRecommended?: string;
  technologiesNeeded?: string[];
  complexity: string; // low, medium, high
  nextStep: string; // budget, consultation, analysis
  reasoning?: string;
  confidence?: number;
  // --- Diagnostic Engine (FASE 3) ---
  technicalDirection?: string | null;
  architectureDirection?: string | null;
  implementationConsiderations?: string | null;
  risks?: string[];
  opportunities?: string[];
  // --- Lead Engine (FASE 3) ---
  score?: number;
  scoreReasons?: string[];
  priority?: string;
  classification?: string;
  requiresHumanReview?: boolean;
  onSiteRequired?: boolean;
}

export interface DiagnosticResponse {
  id: string;
  sessionId: string;
  problemIdentified: string;
  processAffected: string | null;
  impactEstimated: string | null;
  solutionRecommended: string | null;
  technologiesNeeded: string[];
  complexity: string;
  nextStep: string;
  reasoning: string | null;
  confidence: number;
  createdAt: string;
  // --- Diagnostic Engine (FASE 3) ---
  technicalDirection: string | null;
  architectureDirection: string | null;
  implementationConsiderations: string | null;
  risks: string[];
  opportunities: string[];
  score: number;
  scoreReasons: string[];
  priority: string;
  classification: string;
  requiresHumanReview: boolean;
  onSiteRequired: boolean;
}

// --- Lead Schemas ---
export interface LeadCreate {
  diagnosticId?: string;
  sessionId?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface LeadUpdate {
  name?: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string;
  notes?: string | null;
  score?: number;
  priority?: string;
  classification?: string;
  requiresHumanReview?: boolean;
  // --- Mini CRM (FASE 5) ---
  assignedTo?: string | null;
  nextAction?: string | null;
  followUpAt?: string | null;
  estimatedValue?: number | null;
  onSiteRequired?: boolean | null;
}

export interface LeadResponse {
  id: string;
  diagnosticId: string | null;
  sessionId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // --- Lead Engine (FASE 3) ---
  score: number | null;
  priority: string | null;
  classification: string | null;
  requiresHumanReview: boolean | null;
  // --- Mini CRM (FASE 5) ---
  assignedTo: string | null;
  nextAction: string | null;
  followUpAt: string | null;
  estimatedValue: number | null;
  onSiteRequired: boolean | null;
}

// --- Lead Activities (Mini CRM, FASE 5) ---
export const LEAD_ACTIVITY_TYPES = [
  'lead_created',
  'note',
  'call',
  'email',
  'meeting',
  'status_change',
  'assignment',
  'follow_up',
  'diagnostic_review',
] as const;
export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number];

export interface LeadActivityCreate {
  leadId: string;
  type: LeadActivityType;
  description: string;
  createdBy?: string;
}

export interface LeadActivityResponse {
  id: string;
  leadId: string;
  type: string;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
}

// --- Discovery Chat Schemas ---
export interface DiscoveryChatRequest {
  message: string;
  sessionId?: string; // if continuing an existing session
}

export interface DiscoveryChatResponse {
  response: string;
  sessionId: string;
  phase: 'interview' | 'diagnosis';
  diagnostic?: DiagnosticResponse;
  extractedFacts?: Record<string, any>;
}
