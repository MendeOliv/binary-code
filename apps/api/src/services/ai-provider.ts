import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { config } from 'dotenv';

config();

export type ErrorType =
  | 'timeout'
  | 'rate_limit'
  | 'auth_error'
  | 'unavailable'
  | 'http_error'
  | 'invalid_response'
  | 'invalid_json'
  | 'unknown';

export class AIServiceError extends Error {
  readonly type: ErrorType;
  constructor(type: ErrorType, message: string) {
    super(message);
    this.type = type;
    this.name = 'AIServiceError';
  }
}

/** Pure error classifier — exported for deterministic unit testing. */
export function classifyAIError(error: any, provider: string): AIServiceError {
  if (error instanceof AIServiceError) return error;
  const message = String(error?.message || '') + ' ' + String(error?.status || '');
  const code = error?.code;
  if (error?.name === 'TimeoutError' || error?.type === 'request_timeout' || message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return new AIServiceError('timeout', `${provider}: request timed out`);
  }
  if (error?.status === 429 || code === 'rate_limit_exceeded' || message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
    return new AIServiceError('rate_limit', `${provider}: rate limited`);
  }
  if (error?.status === 401 || error?.status === 403 || code === 'invalid_api_key' || message.includes('401') || message.includes('403') || message.includes('api key')) {
    return new AIServiceError('auth_error', `${provider}: authentication failed`);
  }
  if (error?.status === 404 || message.includes('404')) {
    return new AIServiceError('unavailable', `${provider}: model not available (404)`);
  }
  if (error?.status && error.status >= 500) {
    return new AIServiceError('unavailable', `${provider}: provider error (${error.status})`);
  }
  if (error?.status) {
    return new AIServiceError('http_error', `${provider}: HTTP ${error.status}`);
  }
  if (code === 'ECONNRESET' || code === 'ENOTFOUND' || code === 'ECONNREFUSED') {
    return new AIServiceError('unavailable', `${provider}: network error (${code})`);
  }
  return new AIServiceError('unknown', message || 'unknown error');
}

export interface AIResult {
  text: string;
  providerUsed: string;
  fallbackChain: string[];
  attempts: number;
}

// Canonical fallback chain (spec §7): Gemini → Groq → NVIDIA → Anthropic → OpenAI
const CANONICAL_ORDER = ['gemini', 'groq', 'nvidia', 'anthropic', 'openai'];

const INTERNAL_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 60_000;

export class AIProviderService {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private gemini: GoogleGenAI | null = null;
  private groq: Groq | null = null;
  private lastProviderUsed: string | null = null;

  constructor() {
    this.initClients();
  }

  private initClients() {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    console.log('[AIProvider] Initializing clients...');
    if (anthropicKey) console.log('[AIProvider] Anthropic key detected.');
    if (openaiKey) console.log('[AIProvider] OpenAI key detected.');
    if (geminiKey) console.log('[AIProvider] Gemini key detected.');
    if (groqKey) console.log('[AIProvider] Groq key detected.');
    // NVIDIA is initialized on-demand via fetch (OpenAI-compatible); its key is
    // never logged.

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
    if (geminiKey) {
      this.gemini = new GoogleGenAI({ apiKey: geminiKey });
    }
    if (groqKey) {
      this.groq = new Groq({ apiKey: groqKey });
    }
  }

  private isConfigured(provider: string): boolean {
    switch (provider) {
      case 'gemini': return Boolean(process.env.GEMINI_API_KEY && this.gemini);
      case 'groq': return Boolean(process.env.GROQ_API_KEY && this.groq);
      case 'nvidia': return Boolean(process.env.NVIDIA_API_KEY);
      case 'anthropic': return Boolean(process.env.ANTHROPIC_API_KEY && this.anthropic);
      case 'openai': return Boolean(process.env.OPENAI_API_KEY && this.openai);
      default: return false;
    }
  }

  /** Provider priority order honoring PRIMARY_PROVIDER / FALLBACK_PROVIDER. */
  buildFallbackChain(excludeProviders: string[] = []): string[] {
    const primary = (process.env.PRIMARY_PROVIDER || 'gemini').toLowerCase();
    const secondary = (process.env.FALLBACK_PROVIDER || 'groq').toLowerCase();
    const exclusion = new Set(excludeProviders.map((p) => p.toLowerCase()));
    const chain: string[] = [];
    for (const p of [primary, secondary, ...CANONICAL_ORDER]) {
      if (exclusion.has(p)) continue;
      if (!chain.includes(p)) chain.push(p);
    }
    return chain;
  }

  getLastProviderUsed(): string | null {
    return this.lastProviderUsed;
  }

  /**
   * Legacy interface (spec-compatible): returns raw text from the first
   * provider that succeeds. Used by the project orchestrator.
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    provider?: string,
    jsonMode: boolean = false
  ): Promise<string> {
    const { text } = await this.generateSmart(systemPrompt, userPrompt, {
      provider,
      jsonMode,
    });
    return text;
  }

  /**
   * Full chain with metadata. Returns { text, providerUsed } and robust error
   * classification. When `excludeProviders` is set, those are skipped so an
   * invalid-JSON response from one provider can trigger a clean retry through
   * the remaining fallbacks (spec §8).
   */
  async generateSmart(
    systemPrompt: string,
    userPrompt: string,
    options: { provider?: string; jsonMode?: boolean; excludeProviders?: string[] } = {}
  ): Promise<AIResult> {
    const { jsonMode = false, excludeProviders = [] } = options;
    const fallbackChain = this.buildFallbackChain(excludeProviders);
    let attempts = 0;
    let lastError: Error | null = null;

    for (const prov of fallbackChain) {
      if (!this.isConfigured(prov)) {
        console.warn(`[AIProvider] Provider ${prov} not configured (missing API key).`);
        continue;
      }
      attempts++;
      try {
        const startedAt = Date.now();
        let text: string;
        switch (prov) {
          case 'gemini': text = await this.callGemini(systemPrompt, userPrompt, jsonMode); break;
          case 'groq': text = await this.callGroq(systemPrompt, userPrompt, jsonMode); break;
          case 'nvidia': text = await this.callNVIDIA(systemPrompt, userPrompt, jsonMode); break;
          case 'anthropic': text = await this.callAnthropic(systemPrompt, userPrompt, jsonMode); break;
          case 'openai': text = await this.callOpenAI(systemPrompt, userPrompt, jsonMode); break;
          default: continue;
        }
        const durationMs = Date.now() - startedAt;
        this.lastProviderUsed = prov;
        console.log(`[AIProvider] success provider=${prov} json=${jsonMode} duration_ms=${durationMs}`);
        return { text, providerUsed: prov, fallbackChain, attempts };
      } catch (error: any) {
        const classified = this.classifyError(error, prov);
        if (!options.provider) {
          console.warn(`[AIProvider] AI provider failed: ${prov} (${classified.type})`);
          console.log(`[AIProvider] Trying fallback: ${prov === fallbackChain[fallbackChain.length - 1] ? 'none' : fallbackChain[fallbackChain.length - 1]}`);
        }
        lastError = error;
      }
    }

    throw new AIServiceError(
      lastError instanceof AIServiceError ? lastError.type : 'unavailable',
      `All LLM providers failed. Last error: ${lastError?.message || 'unknown'}` + ' (details withheld)'
    );
  }

  private classifyError(error: any, provider: string): AIServiceError {
      return classifyAIError(error, provider);
    }

  // ── Provider callers ────────────────────────────────────────────────────

  private async callAnthropic(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic client not initialized');
    const msg = await this.anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: jsonMode ? 0.0 : 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    return msg.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.openai) throw new Error('OpenAI client not initialized');
    const options: any = {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: jsonMode ? 0.0 : 0.7,
    };
    if (jsonMode) options.response_format = { type: 'json_object' };
    const completion = await this.openai.chat.completions.create(options);
    return completion.choices[0].message.content ?? '';
  }

  private async callGemini(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.gemini) throw new Error('Gemini client not initialized');
    const response = await this.gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    });
    return response.text || '';
  }

  private async callGroq(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.groq) throw new Error('Groq client not initialized');
    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: process.env.GROQ_MODEL || 'groq/compound-mini',
      temperature: jsonMode ? 0.0 : 0.7,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    });
    return completion.choices[0].message.content ?? '';
  }

  /**
   * NVIDIA NIM hosted — OpenAI-compatible endpoint (spec §7).
   * Endpoint: https://integrate.api.nvidia.com/v1
   * Auth:     Authorization: Bearer $NVIDIA_API_KEY
   * Model:    $NVIDIA_MODEL (default nvidia/llama-3.1-nemotron-70b-instruct)
   * The API key is never logged or exposed.
   */
  private async callNVIDIA(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) throw new Error('NVIDIA client not initialized');
    const model = process.env.NVIDIA_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct';
    const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: jsonMode ? 0.0 : 0.7,
      max_tokens: 4000,
    };
    if (jsonMode) body['response_format'] = { type: 'json_object' };

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(INTERNAL_TIMEOUT_MS),
      });
    } catch (error: any) {
      throw new AIServiceError('timeout', `nvidia: request failed (${error?.message})`);
    }

    if (!response.ok) {
      const err = new Error(`nvidia HTTP ${response.status}`);
      (err as any).status = response.status;
      throw err;
    }

    const data: any = await response.json().catch(() => ({
      choices: [{ message: { content: '' } }],
    }));
    return data?.choices?.[0]?.message?.content ?? '';
  }
}

export const aiProvider = new AIProviderService();