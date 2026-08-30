import type { MemoryItemResponse } from '@shared/models';

export class ContextBuilder {
  private encoding: any; // placeholder for tiktoken if we want to add later

  constructor() {
    // We could load tiktoken here, but for simplicity we use a rough heuristic.
    // In a real implementation, you might want to use @xenova/transformers or similar.
    this.encoding = null;
  }

  /**
   * Estimates the number of tokens in a text block.
   * Falls back to character division if tiktoken is not available.
   */
  estimateTokens(text: string): number {
    if (this.encoding) {
      // @ts-ignore
      return this.encoding.encode(text).length;
    }
    // Rough heuristic: 4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Builds a structured context string from retrieved database items, prioritizing based on trust hierarchy:
   * 1. Confirmed Decisions (highest trust)
   * 2. Official States
   * 3. Requirements
   * 4. Inferred / General Memory Items (lowest trust)
   *
   * Applies strict token limits. If context exceeds tokenLimit, items are discarded
   * from the bottom of the hierarchy first.
   */
  buildContext(retrievedItems: any[], tokenLimit = 6000): string {
    // Separate items by trust hierarchy categories
    const confirmedDecisions: string[] = [];
    const officialStates: string[] = [];
    const requirements: string[] = [];
    const generalMemories: string[] = [];

    for (const item of retrievedItems) {
      const category = (item.category || '').toLowerCase();
      const content = item.content || '';

      // Check metadata or category
      const status = (item.metadata?.status || '').toLowerCase();

      if (category === 'decision' && status !== 'revoked') {
        confirmedDecisions.push(content);
      } else if (category === 'state' || (category === 'general' && content.includes('State:'))) {
        officialStates.push(content);
      } else if (category === 'requirement' || category === 'task') {
        requirements.push(content);
      } else {
        generalMemories.push(content);
      }
    }

    // Build context sequentially, keeping track of tokens
    const contextParts: string[] = [];

    // Helper to safely append items and respect token limit
    const appendSection = (title: string, items: string[]) => {
      if (!items.length) return;
      const sectionHeader = `\n=== ${title} ===\n`;
      let currentTokens = this.estimateTokens(contextParts.join(''));

      const sectionParts: string[] = [];
      for (let idx = 0; idx < items.length; idx++) {
        const itemStr = `${idx + 1}. ${items[idx]}\n`;
        const itemTokens = this.estimateTokens(itemStr);

        // Check if this item would exceed our budget
        if (
          currentTokens +
          this.estimateTokens(sectionHeader) +
          this.estimateTokens(sectionParts.join('')) +
          itemTokens >
          tokenLimit
        ) {
          console.log(
            `Token limit of ${tokenLimit} reached. Omitting subsequent context items in ${title}.`
          );
          break;
        }
        sectionParts.push(itemStr);
      }

      if (sectionParts.length) {
        contextParts.push(sectionHeader);
        contextParts.push(...sectionParts);
      }
    };

    // Append sections in order of trust hierarchy (highest first)
    appendSection('CONFIRMED DECISIONS (HIGH TRUST)', confirmedDecisions);
    appendSection('OFFICIAL STATE AND METADATA', officialStates);
    appendSection('REQUIREMENTS AND ACTIVE TASKS', requirements);
    appendSection('INFERRED CONTEXT AND MEMORY (LOW TRUST)', generalMemories);

    const joinedContext = contextParts.join('').trim();
    if (!joinedContext) {
      return 'No relevant context found in database.';
    }

    return joinedContext;
  }
}

// Single global instance
export const contextBuilder = new ContextBuilder();