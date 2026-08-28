import { repo } from '../../db/src/repository';
import type { 
  DecisionResponse,
  RequirementResponse,
  TaskResponse,
  MemoryItemResponse,
  StateResponse
} from '../../shared/src/models';

export class RetrievalService {
  /**
   * Retrieve context items for a given project and query using full-text search.
   * Returns an array of items formatted for the context builder.
   */
  async retrieveContext(projectId: string, query: string): Promise<Array<any>> {
    const items: Array<any> = [];

    // Search decisions
    const decisions = await repo.searchDecisionsFts(projectId, query);
    for (const d of decisions) {
      items.push({
        id: d.id,
        category: 'decision',
        title: d.topic, // using topic as title
        content: d.content,
        metadata: {
          status: d.status,
          source: d.source,
          confidence: d.confidence,
        },
      });
    }

    // Search requirements
    const requirements = await repo.searchRequirementsFts(projectId, query);
    for (const r of requirements) {
      items.push({
        id: r.id,
        category: 'requirement',
        title: null, // requirements don't have a title in the schema
        content: r.content,
        metadata: {
          status: r.status,
        },
      });
    }

    // Search tasks
    const tasks = await repo.searchTasksFts(projectId, query);
    for (const t of tasks) {
      items.push({
        id: t.id,
        category: 'task',
        title: t.title,
        content: t.description || '', // use description as content
        metadata: {
          status: t.status,
        },
      });
    }

    // Search memory items
    const memories = await repo.searchMemoryItemsFts(projectId, query);
    for (const m of memories) {
      items.push({
        id: m.id,
        category: 'memory_item',
        title: m.title,
        content: m.content,
        metadata: {
          type: m.type,
          source: m.source,
          confidence: m.confidence,
          status: m.status,
        },
      });
    }

    // Optionally, include the state as a memory item? The state is not typically searched by content.
    // But we can include the current state snapshot as a general memory item if needed.
    // We'll skip for now, as the state is more structured and handled separately in the orchestrator.

    return items;
  }
}

// Single global instance
export const retrievalService = new RetrievalService();