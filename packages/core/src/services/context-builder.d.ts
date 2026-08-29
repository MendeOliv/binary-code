export declare class ContextBuilder {
    private encoding;
    constructor();
    /**
     * Estimates the number of tokens in a text block.
     * Falls back to character division if tiktoken is not available.
     */
    estimateTokens(text: string): number;
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
    buildContext(retrievedItems: any[], tokenLimit?: number): string;
}
export declare const contextBuilder: ContextBuilder;
//# sourceMappingURL=context-builder.d.ts.map