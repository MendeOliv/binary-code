import { repo } from '@db/repository';
import { aiProvider } from './ai-provider';
import { contextBuilder } from './context-builder';
import { retrievalService } from './retrieval';
import type { 
  ChatResponse,
  ExtractedMemory
} from '@shared/models';

export class OrchestratorService {
  /**
   * Check if the retrieved context is sufficient to answer the user's query.
   * Uses a quick evaluation prompt in JSON mode.
   */
  async checkContextSufficiency(query: string, retrievedItems: Array<any>): Promise<{ isSufficient: boolean; reasoning: string; clarificationQuestion?: string }> {
    // Formulate items summary
    const itemsSummary = retrievedItems.map(item => ({
      id: item.id,
      category: item.category,
      title: item.title,
      content: item.content,
    }));

    const systemPrompt = (
      "You are the Sufficiency Checker module of the Hermes backend orchestrator.\n" +
      "Your task is to analyze the user's query and the list of retrieved database items, \n" +
      "and determine if the retrieved context is SUFFICIENT to formulate a complete, accurate response, \n" +
      "or if critical information is missing, causing ambiguity.\n\n" +
      "If the user query is a general question, greeting, or does not require project-specific facts, \n" +
      "it is automatically sufficient (isSufficient: true).\n" +
      "If the query requires project details that are not in the retrieved items, isSufficient is false.\n\n" +
      "Respond ONLY with a JSON object in this exact format:\n" +
      "{\n" +
      "  \"isSufficient\": true or false,\n" +
      "  \"reasoning\": \"A short explanation of why it is or isn't sufficient\",\n" +
      "  \"clarificationQuestion\": \"If isSufficient is false, formulate a clear clarification question for the user. If true, set to null\"\n" +
      "}"
    );

    const userPrompt = (
      `User Query: ${query}\n\n` +
      `Retrieved Database Items:\n${JSON.stringify(itemsSummary, null, 2)}\n\n` +
      "Check sufficiency:"
    );

    try {
      const rawResponse = await aiProvider.generateText(systemPrompt, userPrompt, undefined, true);
      const cleaned = rawResponse.trim();
      // Remove markdown code block if present
      let jsonStr = cleaned;
      if (jsonStr.startsWith("```")) {
        const lines = jsonStr.split('\n');
        if (lines[0].startsWith("```")) {
          lines.shift();
        }
        if (lines[lines.length - 1].startsWith("```")) {
          lines.pop();
        }
        jsonStr = lines.join('\n').trim();
      }
      const result = JSON.parse(jsonStr);
      return {
        isSufficient: Boolean(result.isSufficient),
        reasoning: result.reasoning || "",
        clarificationQuestion: result.clarificationQuestion ?? undefined,
      };
    } catch (error) {
      console.error("Error during sufficiency check:", error);
      // Failsafe: assume sufficient to avoid blocking the user
      return {
        isSufficient: true,
        reasoning: "Failsafe bypass due to evaluation error",
        clarificationQuestion: undefined,
      };
    }
  }

  /**
   * Run the orchestrator pipeline for a given project and query.
   */
  async runPipeline(projectId: string, query: string, forcedProvider?: string): Promise<ChatResponse> {
    // 1. Query relevant items from Supabase using full-text search
    const retrievedItems = await retrievalService.retrieveContext(projectId, query);
    const retrievedIds = retrievedItems.map(item => item.id);

    // 2. Check for active conflicts first (we'll implement a simple conflict check for now)
    // For now, we skip conflict detection to keep it simple, but we can add it later.
    let isSufficient = true;
    let clarificationQuestion: string | undefined;
    let reasoning = "Information is sufficient and free of active conflicts.";

    // 3. Run sufficiency evaluator
    const sufficiencyResult = await this.checkContextSufficiency(query, retrievedItems);
    isSufficient = sufficiencyResult.isSufficient;
    reasoning = sufficiencyResult.reasoning;
    clarificationQuestion = sufficiencyResult.clarificationQuestion;

    // 4. If not sufficient, bypass LLM logic and return clarification
    if (!isSufficient) {
      // Log the insufficient retrieval query
      await repo.createRequestLog(
        projectId,
        query,
        retrievedIds,
        reasoning,
        forcedProvider || process.env.PRIMARY_PROVIDER || 'anthropic',
      );

      return {
        response: clarificationQuestion || "Preciso de mais informações para responder.",
        requiresClarification: true,
        clarificationQuestion,
        projectId,
        extractedMemory: undefined,
      };
    }

    // 5. Build minimal context using the context builder
    const contextStr = contextBuilder.buildContext(retrievedItems);

    // 6. Call AI model (with context)
    const systemPrompt = (
      "You are the core reasoning engine of Código Binário. \n" +
      "You have access to the project's confirmed decisions, requirements, tasks, and state \n" +
      "recalled from the database.\n" +
      "Use the provided context to answer the user's question accurately.\n" +
      "Do not contradict the active decisions or requirements. \n" +
      "Keep your responses technical, concise, and focused."
    );

    const userPrompt = (
      `Here is the relevant project context retrieved from the database:\n` +
      `----------------------------------------\n` +
      `${contextStr}\n` +
      `----------------------------------------\n\n` +
      `User Message: ${query}\n\n` +
      `Response:`
    );

    const modelName = forcedProvider || process.env.PRIMARY_PROVIDER || 'anthropic';
    const aiResponse = await aiProvider.generateText(systemPrompt, userPrompt, modelName, false);

    // 7. Post-process: extract and persist memories
    // We'll use a placeholder memory extractor for now; we'll implement it fully later.
    const extractionResult = {
      extracted: {
        decisions: [],
        revokedDecisions: [],
        requirements: [],
        tasks: [],
        state: undefined,
      },
      persistedSummary: {}, // placeholder
    };

    // 8. Register request logs for observability
    await repo.createRequestLog(
      projectId,
      query,
      retrievedIds,
      `Sufficiency check: ${reasoning}. Extracted: ${JSON.stringify(extractionResult.persistedSummary)}`,
      modelName,
    );

    // Build response payload
    return {
      response: aiResponse,
      requiresClarification: false,
      clarificationQuestion: undefined,
      projectId,
      extractedMemory: extractionResult.extracted,
    };
  }
}

// Single global instance
export const orchestrator = new OrchestratorService();