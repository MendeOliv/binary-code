export interface ProjectBase {
    name: string;
    status?: string;
    currentPhaseId?: string;
}
export interface ProjectCreate extends ProjectBase {
}
export interface ProjectResponse extends ProjectBase {
    id: string;
    createdAt: string;
    updatedAt: string;
}
export interface StateBase {
    currentPhase: Record<string, any>;
    completed: any[];
    inProgress: any[];
    next: any[];
    openQuestions: any[];
}
export interface StateUpdate extends StateBase {
}
export interface StateResponse extends StateBase {
    projectId: string;
    updatedAt: string;
}
export interface DecisionBase {
    topic: string;
    content: string;
    reason?: string;
    source: string;
    confidence: number;
    status: string;
}
export interface DecisionCreate extends DecisionBase {
    id: string;
}
export interface DecisionUpdate {
    topic?: string;
    content?: string;
    reason?: string;
    source?: string;
    confidence?: number;
    status?: string;
    replacedBy?: string;
}
export interface DecisionResponse extends DecisionBase {
    id: string;
    projectId: string;
    replacedBy?: string;
    createdAt: string;
    updatedAt: string;
}
export interface RequirementBase {
    content: string;
    status: string;
}
export interface RequirementCreate extends RequirementBase {
    id: string;
}
export interface RequirementResponse extends RequirementBase {
    id: string;
    projectId: string;
    createdAt: string;
}
export interface TaskBase {
    title: string;
    description?: string;
    status: string;
}
export interface TaskCreate extends TaskBase {
    id: string;
}
export interface TaskUpdate {
    title?: string;
    description?: string;
    status?: string;
}
export interface TaskResponse extends TaskBase {
    id: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}
export interface MemoryItemBase {
    type: string;
    title?: string;
    content: string;
    source?: string;
    confidence: number;
    status?: string;
}
export interface MemoryItemCreate extends MemoryItemBase {
}
export interface MemoryItemResponse extends MemoryItemBase {
    id: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}
export interface ConflictBase {
    itemAId: string;
    itemBId: string;
    description: string;
    resolved: boolean;
    resolution?: string;
}
export interface ConflictCreate extends ConflictBase {
}
export interface ConflictResponse extends ConflictBase {
    id: string;
    projectId: string;
    createdAt: string;
}
export interface ChatRequest {
    message: string;
    provider?: string;
}
export interface ExtractedMemory {
    decisions: DecisionCreate[];
    revokedDecisions: string[];
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
export interface RequestLogResponse {
    id: string;
    projectId: string;
    question: string;
    retrievedIds: string[];
    reason?: string;
    modelUsed?: string;
    createdAt: string;
}
//# sourceMappingURL=models.d.ts.map