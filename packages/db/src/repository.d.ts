import { ProjectCreate, ProjectResponse, StateUpdate, StateResponse, DecisionCreate, DecisionUpdate, DecisionResponse, RequirementCreate, RequirementResponse, TaskCreate, TaskUpdate, TaskResponse, MemoryItemCreate, MemoryItemResponse, ConflictCreate, ConflictResponse, RequestLogResponse } from '../../shared/src/models';
export declare class SupabaseRepository {
    private client;
    constructor();
    createProject(data: ProjectCreate): Promise<ProjectResponse>;
    listProjects(): Promise<ProjectResponse[]>;
    getProject(id: string): Promise<ProjectResponse | null>;
    createInitialState(projectId: string): Promise<StateResponse>;
    getProjectState(projectId: string): Promise<StateResponse | null>;
    updateProjectState(projectId: string, data: StateUpdate): Promise<StateResponse>;
    createDecision(data: DecisionCreate): Promise<DecisionResponse>;
    listDecisions(projectId: string, status?: string): Promise<DecisionResponse[]>;
    getDecision(id: string): Promise<DecisionResponse | null>;
    updateDecision(id: string, data: DecisionUpdate): Promise<DecisionResponse | null>;
    revokeDecision(id: string, replacedById?: string): Promise<DecisionResponse | null>;
    searchDecisionsFts(projectId: string, queryText: string): Promise<DecisionResponse[]>;
    createRequirement(data: RequirementCreate): Promise<RequirementResponse>;
    listRequirements(projectId: string): Promise<RequirementResponse[]>;
    getRequirement(id: string): Promise<RequirementResponse | null>;
    searchRequirementsFts(projectId: string, queryText: string): Promise<RequirementResponse[]>;
    createTask(data: TaskCreate): Promise<TaskResponse>;
    listTasks(projectId: string): Promise<TaskResponse[]>;
    getTask(id: string): Promise<TaskResponse | null>;
    updateTask(id: string, data: TaskUpdate): Promise<TaskResponse | null>;
    searchTasksFts(projectId: string, queryText: string): Promise<TaskResponse[]>;
    createMemoryItem(data: MemoryItemCreate): Promise<MemoryItemResponse>;
    getMemoryItems(projectId: string): Promise<MemoryItemResponse[]>;
    searchMemoryItemsFts(projectId: string, queryText: string): Promise<MemoryItemResponse[]>;
    createConflict(data: ConflictCreate): Promise<ConflictResponse>;
    listConflicts(projectId: string, resolved?: boolean): Promise<ConflictResponse[]>;
    resolveConflict(id: string, resolution: string): Promise<ConflictResponse | null>;
    createRequestLog(projectId: string, question: string, retrievedIds: string[], reason?: string, modelUsed?: string): Promise<RequestLogResponse>;
    listRequestLogs(projectId: string): Promise<RequestLogResponse[]>;
}
export declare const repo: SupabaseRepository;
//# sourceMappingURL=repository.d.ts.map