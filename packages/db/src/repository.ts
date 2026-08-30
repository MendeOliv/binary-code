import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { 
  ProjectBase, ProjectCreate, ProjectResponse,
  StateBase, StateUpdate, StateResponse,
  DecisionBase, DecisionCreate, DecisionUpdate, DecisionResponse,
  RequirementBase, RequirementCreate, RequirementResponse,
  TaskBase, TaskCreate, TaskUpdate, TaskResponse,
  MemoryItemBase, MemoryItemCreate, MemoryItemResponse,
  ConflictBase, ConflictCreate, ConflictResponse,
  RequestLogResponse,
  DiscoverySessionCreate, DiscoverySessionResponse,
  DiscoveryMessageCreate, DiscoveryMessageResponse,
  DiagnosticCreate, DiagnosticResponse,
  LeadCreate, LeadUpdate, LeadResponse
} from '../../shared/src/models';

export class SupabaseRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  // --- Project Operations ---
  async createProject(data: ProjectCreate): Promise<ProjectResponse> {
    const { data: result, error } = await this.client
      .from('projects')
      .insert([
        {
          name: data.name,
          status: data.status,
          current_phase_id: data.currentPhaseId,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listProjects(): Promise<ProjectResponse[]> {
    const { data, error } = await this.client.from('projects').select('*');
    if (error) throw error;
    return data;
  }

  async getProject(id: string): Promise<ProjectResponse | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  // --- State Operations ---
  async createInitialState(projectId: string): Promise<StateResponse> {
    const { data, error } = await this.client
      .from('state')
      .insert([
        {
          project_id: projectId,
          current_phase: {},
          completed: [],
          in_progress: [],
          next: [],
          open_questions: [],
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProjectState(projectId: string): Promise<StateResponse | null> {
    const { data, error } = await this.client
      .from('state')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  async updateProjectState(projectId: string, data: StateUpdate): Promise<StateResponse> {
    const { data: result, error } = await this.client
      .from('state')
      .upsert({
        project_id: projectId,
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // --- Decision Operations ---
  async createDecision(data: DecisionCreate): Promise<DecisionResponse> {
    const { data: result, error } = await this.client
      .from('decisions')
      .insert([
        {
          id: data.id,
          project_id: data.projectId,
          topic: data.topic,
          content: data.content,
          reason: data.reason,
          source: data.source,
          confidence: data.confidence,
          status: data.status,
          replaced_by: data.replacedBy,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listDecisions(projectId: string, status?: string): Promise<DecisionResponse[]> {
    let query = this.client.from('decisions').select('*').eq('project_id', projectId);
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getDecision(id: string): Promise<DecisionResponse | null> {
    const { data, error } = await this.client
      .from('decisions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  async updateDecision(id: string, data: DecisionUpdate): Promise<DecisionResponse | null> {
    const { data: result, error } = await this.client
      .from('decisions')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return result ?? null;
  }

  async revokeDecision(id: string, replacedById?: string): Promise<DecisionResponse | null> {
    return this.updateDecision(id, {
      status: 'revoked',
      replaced_by: replacedById,
    });
  }

  async searchDecisionsFts(projectId: string, queryText: string): Promise<DecisionResponse[]> {
    const { data, error } = await this.client
      .from('decisions')
      .select('*')
      .eq('project_id', projectId)
      .textSearch('content', queryText)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // --- Requirement Operations ---
  async createRequirement(data: RequirementCreate): Promise<RequirementResponse> {
    const { data: result, error } = await this.client
      .from('requirements')
      .insert([
        {
          id: data.id,
          project_id: data.projectId,
          content: data.content,
          status: data.status,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listRequirements(projectId: string): Promise<RequirementResponse[]> {
    const { data, error } = await this.client
      .from('requirements')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }

  async getRequirement(id: string): Promise<RequirementResponse | null> {
    const { data, error } = await this.client
      .from('requirements')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  async searchRequirementsFts(projectId: string, queryText: string): Promise<RequirementResponse[]> {
    const { data, error } = await this.client
      .from('requirements')
      .select('*')
      .eq('project_id', projectId)
      .textSearch('content', queryText)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // --- Task Operations ---
  async createTask(data: TaskCreate): Promise<TaskResponse> {
    const { data: result, error } = await this.client
      .from('tasks')
      .insert([
        {
          id: data.id,
          project_id: data.projectId,
          title: data.title,
          description: data.description,
          status: data.status,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listTasks(projectId: string): Promise<TaskResponse[]> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }

  async getTask(id: string): Promise<TaskResponse | null> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  async updateTask(id: string, data: TaskUpdate): Promise<TaskResponse | null> {
    const { data: result, error } = await this.client
      .from('tasks')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return result ?? null;
  }

  async searchTasksFts(projectId: string, queryText: string): Promise<TaskResponse[]> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .textSearch('description', queryText)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // --- Memory Item Operations ---
  async createMemoryItem(data: MemoryItemCreate): Promise<MemoryItemResponse> {
    const { data: result, error } = await this.client
      .from('memory_items')
      .insert([
        {
          project_id: data.projectId,
          type: data.type,
          title: data.title,
          content: data.content,
          source: data.source,
          confidence: data.confidence,
          status: data.status,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async getMemoryItems(projectId: string): Promise<MemoryItemResponse[]> {
    const { data, error } = await this.client
      .from('memory_items')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }

  async searchMemoryItemsFts(projectId: string, queryText: string): Promise<MemoryItemResponse[]> {
    const { data, error } = await this.client
      .from('memory_items')
      .select('*')
      .eq('project_id', projectId)
      .textSearch('content', queryText)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // --- Conflict Operations ---
  async createConflict(data: ConflictCreate): Promise<ConflictResponse> {
    const { data: result, error } = await this.client
      .from('conflicts')
      .insert([
        {
          project_id: data.projectId,
          item_a_id: data.itemAId,
          item_b_id: data.itemBId,
          description: data.description,
          resolved: data.resolved,
          resolution: data.resolution,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listConflicts(projectId: string, resolved?: boolean): Promise<ConflictResponse[]> {
    let query = this.client.from('conflicts').select('*').eq('project_id', projectId);
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async resolveConflict(id: string, resolution: string): Promise<ConflictResponse | null> {
    const { data: result, error } = await this.client
      .from('conflicts')
      .update({
        resolved: true,
        resolution: resolution,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return result ?? null;
  }

  // --- Request Log Operations ---
  async createRequestLog(
    projectId: string,
    question: string,
    retrievedIds: string[],
    reason?: string,
    modelUsed?: string
  ): Promise<RequestLogResponse> {
    const { data, error } = await this.client
      .from('request_logs')
      .insert([
        {
          project_id: projectId,
          question: question,
          retrieved_ids: retrievedIds,
          reason: reason,
          model_used: modelUsed,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async listRequestLogs(projectId: string): Promise<RequestLogResponse[]> {
    const { data, error } = await this.client
      .from('request_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // ===========================================================================
  // DISCOVERY PIPELINE OPERATIONS
  // ===========================================================================

  // --- Discovery Session Operations ---
  async createDiscoverySession(data: DiscoverySessionCreate): Promise<DiscoverySessionResponse> {
    const { data: result, error } = await this.client
      .from('discovery_sessions')
      .insert([{ initial_problem: data.initialProblem }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDiscoverySession(result);
  }

  async getDiscoverySession(id: string): Promise<DiscoverySessionResponse | null> {
    const { data, error } = await this.client
      .from('discovery_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapDiscoverySession(data) : null;
  }

  async updateDiscoverySession(id: string, updates: { status?: string; complexity?: string; extractedFacts?: Record<string, any> }): Promise<DiscoverySessionResponse | null> {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.complexity !== undefined) dbUpdates.complexity = updates.complexity;
    if (updates.extractedFacts !== undefined) dbUpdates.extracted_facts = updates.extractedFacts;

    const { data: result, error } = await this.client
      .from('discovery_sessions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return result ? this.mapDiscoverySession(result) : null;
  }

  // --- Discovery Message Operations ---
  async createDiscoveryMessage(data: DiscoveryMessageCreate): Promise<DiscoveryMessageResponse> {
    const { data: result, error } = await this.client
      .from('discovery_messages')
      .insert([{
        session_id: data.sessionId,
        role: data.role,
        content: data.content,
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDiscoveryMessage(result);
  }

  async listDiscoveryMessages(sessionId: string): Promise<DiscoveryMessageResponse[]> {
    const { data, error } = await this.client
      .from('discovery_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(m => this.mapDiscoveryMessage(m));
  }

  // --- Diagnostic Operations ---
  async createDiagnostic(data: DiagnosticCreate): Promise<DiagnosticResponse> {
    const { data: result, error } = await this.client
      .from('diagnostics')
      .insert([{
        session_id: data.sessionId,
        problem_identified: data.problemIdentified,
        process_affected: data.processAffected,
        impact_estimated: data.impactEstimated,
        solution_recommended: data.solutionRecommended,
        technologies_needed: data.technologiesNeeded || [],
        complexity: data.complexity,
        next_step: data.nextStep,
        reasoning: data.reasoning,
        confidence: data.confidence ?? 0.8,
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDiagnostic(result);
  }

  async getDiagnosticBySession(sessionId: string): Promise<DiagnosticResponse | null> {
    const { data, error } = await this.client
      .from('diagnostics')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapDiagnostic(data) : null;
  }

  // --- Lead Operations ---
  async createLead(data: LeadCreate): Promise<LeadResponse> {
    const { data: result, error } = await this.client
      .from('leads')
      .insert([{
        diagnostic_id: data.diagnosticId,
        session_id: data.sessionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        notes: data.notes,
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapLead(result);
  }

  async updateLead(id: string, data: LeadUpdate): Promise<LeadResponse | null> {
    const dbUpdates: Record<string, any> = {};
    if (data.name !== undefined) dbUpdates.name = data.name;
    if (data.email !== undefined) dbUpdates.email = data.email;
    if (data.phone !== undefined) dbUpdates.phone = data.phone;
    if (data.company !== undefined) dbUpdates.company = data.company;
    if (data.status !== undefined) dbUpdates.status = data.status;
    if (data.notes !== undefined) dbUpdates.notes = data.notes;

    const { data: result, error } = await this.client
      .from('leads')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return result ? this.mapLead(result) : null;
  }

  async listLeads(status?: string): Promise<LeadResponse[]> {
    let query = this.client.from('leads').select('*');
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data.map(l => this.mapLead(l));
  }

  // --- Mappers (snake_case DB -> camelCase) ---
  private mapDiscoverySession(row: any): DiscoverySessionResponse {
    return {
      id: row.id,
      status: row.status,
      initialProblem: row.initial_problem,
      extractedFacts: row.extracted_facts || {},
      complexity: row.complexity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapDiscoveryMessage(row: any): DiscoveryMessageResponse {
    return {
      id: row.id,
      sessionId: row.session_id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at,
    };
  }

  private mapDiagnostic(row: any): DiagnosticResponse {
    return {
      id: row.id,
      sessionId: row.session_id,
      problemIdentified: row.problem_identified,
      processAffected: row.process_affected,
      impactEstimated: row.impact_estimated,
      solutionRecommended: row.solution_recommended,
      technologiesNeeded: row.technologies_needed || [],
      complexity: row.complexity,
      nextStep: row.next_step,
      reasoning: row.reasoning,
      confidence: row.confidence,
      createdAt: row.created_at,
    };
  }

  private mapLead(row: any): LeadResponse {
    return {
      id: row.id,
      diagnosticId: row.diagnostic_id,
      sessionId: row.session_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// Single global repository instance
export const repo = new SupabaseRepository();