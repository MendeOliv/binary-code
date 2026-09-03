import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { config } from 'dotenv';

config();

export class AIProviderService {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private gemini: GoogleGenAI | null = null;
  private groq: Groq | null = null;

  constructor() {
    this.initClients();
  }

  private initClients() {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // Log key presence without revealing values
    console.log('[AIProvider] Initializing clients...');
    if (anthropicKey) console.log('[AIProvider] Anthropic key detected.');
    if (openaiKey) console.log('[AIProvider] OpenAI key detected.');
    if (geminiKey) console.log('[AIProvider] Gemini key detected.');
    if (groqKey) console.log('[AIProvider] Groq key detected.');

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

  async generateText(systemPrompt: string, userPrompt: string, provider?: string, jsonMode: boolean = false): Promise<string> {
    const primary = (provider || process.env.PRIMARY_PROVIDER || 'gemini').toLowerCase();
    
    // Explicit check for Gemini if it's the primary or forced
    if (primary === 'gemini' && !process.env.GEMINI_API_KEY) {
      throw new Error("Gemini provider is not configured: GEMINI_API_KEY is missing");
    }

    const fallbackSequence = [primary];
    const providers = ['gemini', 'anthropic', 'openai', 'groq'];
    for (const p of providers) {
      if (!fallbackSequence.includes(p)) {
        fallbackSequence.push(p);
      }
    }

    let lastError: any = null;
    for (const prov of fallbackSequence) {
      try {
        console.log(`[AIProvider] Attempting generation with provider: ${prov}${jsonMode ? ' (JSON Mode)' : ''}`);
        
        if (prov === 'anthropic' && this.anthropic) {
          return await this.callAnthropic(systemPrompt, userPrompt, jsonMode);
        }
        if (prov === 'openai' && this.openai) {
          return await this.callOpenAI(systemPrompt, userPrompt, jsonMode);
        }
        if (prov === 'gemini' && this.gemini) {
          return await this.callGemini(systemPrompt, userPrompt, jsonMode);
        }
        if (prov === 'groq' && this.groq) {
          return await this.callGroq(systemPrompt, userPrompt, jsonMode);
        }
        
        if (['gemini', 'anthropic', 'openai', 'groq'].includes(prov)) {
           console.warn(`[AIProvider] Provider ${prov} not initialized (missing API key).`);
        } else {
           console.warn(`[AIProvider] Provider ${prov} is not implemented.`);
        }
      } catch (error: any) {
        console.error(`[AIProvider] Provider ${prov} call failed:`, error.message || error);
        lastError = error;
      }
    }

    throw new Error(`All LLM providers failed. Last error: ${lastError?.message || lastError}`);
  }

  private async callAnthropic(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic client not initialized');
    const msg = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: jsonMode ? 0.0 : 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    
    return msg.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
    if (!this.openai) throw new Error('OpenAI client not initialized');
    const options: any = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: jsonMode ? 0.0 : 0.7,
    };

    if (jsonMode) {
      options.response_format = { type: 'json_object' };
    }

    const completion = await this.openai.chat.completions.create(options);
    return completion.choices[0].message.content ?? '';
  }

  private async callGemini(systemPrompt: string, userPrompt: string, jsonMode: boolean): Promise<string> {
      if (!this.gemini) throw new Error('Gemini client not initialized');

      const response = await this.gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        systemInstruction: systemPrompt,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
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
      model: 'llama3-8b-8192',
      temperature: jsonMode ? 0.0 : 0.7,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    });
    return completion.choices[0].message.content ?? '';
  }
}

export const aiProvider = new AIProviderService();
