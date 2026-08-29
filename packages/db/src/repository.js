import { supabase } from './supabase';
export class SupabaseRepository {
    client;
    constructor() {
        this.client = supabase;
    }
    // --- Project Operations ---
    async createProject(data) {
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
        if (error)
            throw error;
        return result;
    }
    async listProjects() {
        const { data, error } = await this.client.from('projects').select('*');
        if (error)
            throw error;
        return data;
    }
    async getProject(id) {
        const { data, error } = await this.client
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data ?? null;
    }
    // --- State Operations ---
    async createInitialState(projectId) {
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
        if (error)
            throw error;
        return data;
    }
    async getProjectState(projectId) {
        const { data, error } = await this.client
            .from('state')
            .select('*')
            .eq('project_id', projectId)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data ?? null;
    }
    async updateProjectState(projectId, data) {
        const { data: result, error } = await this.client
            .from('state')
            .upsert({
            project_id: projectId,
            ...data,
            updated_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    // --- Decision Operations ---
    async createDecision(data) {
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
        if (error)
            throw error;
        return result;
    }
    async listDecisions(projectId, status) {
        let query = this.client.from('decisions').select('*').eq('project_id', projectId);
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async getDecision(id) {
        const { data, error } = await this.client
            .from('decisions')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data ?? null;
    }
    async updateDecision(id, data) {
        const { data: result, error } = await this.client
            .from('decisions')
            .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .select()
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return result ?? null;
    }
    async revokeDecision(id, replacedById) {
        return this.updateDecision(id, {
            status: 'revoked',
            replaced_by: replacedById,
        });
    }
    async searchDecisionsFts(projectId, queryText) {
        const { data, error } = await this.client
            .from('decisions')
            .select('*')
            .eq('project_id', projectId)
            .textSearch('content', queryText)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    // --- Requirement Operations ---
    async createRequirement(data) {
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
        if (error)
            throw error;
        return result;
    }
    async listRequirements(projectId) {
        const { data, error } = await this.client
            .from('requirements')
            .select('*')
            .eq('project_id', projectId);
        if (error)
            throw error;
        return data;
    }
    async getRequirement(id) {
        const { data, error } = await this.client
            .from('requirements')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data ?? null;
    }
    async searchRequirementsFts(projectId, queryText) {
        const { data, error } = await this.client
            .from('requirements')
            .select('*')
            .eq('project_id', projectId)
            .textSearch('content', queryText)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    // --- Task Operations ---
    async createTask(data) {
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
        if (error)
            throw error;
        return result;
    }
    async listTasks(projectId) {
        const { data, error } = await this.client
            .from('tasks')
            .select('*')
            .eq('project_id', projectId);
        if (error)
            throw error;
        return data;
    }
    async getTask(id) {
        const { data, error } = await this.client
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data ?? null;
    }
    async updateTask(id, data) {
        const { data: result, error } = await this.client
            .from('tasks')
            .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .select()
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return result ?? null;
    }
    async searchTasksFts(projectId, queryText) {
        const { data, error } = await this.client
            .from('tasks')
            .select('*')
            .eq('project_id', projectId)
            .textSearch('description', queryText)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    // --- Memory Item Operations ---
    async createMemoryItem(data) {
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
        if (error)
            throw error;
        return result;
    }
    async getMemoryItems(projectId) {
        const { data, error } = await this.client
            .from('memory_items')
            .select('*')
            .eq('project_id', projectId);
        if (error)
            throw error;
        return data;
    }
    async searchMemoryItemsFts(projectId, queryText) {
        const { data, error } = await this.client
            .from('memory_items')
            .select('*')
            .eq('project_id', projectId)
            .textSearch('content', queryText)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    // --- Conflict Operations ---
    async createConflict(data) {
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
        if (error)
            throw error;
        return result;
    }
    async listConflicts(projectId, resolved) {
        let query = this.client.from('conflicts').select('*').eq('project_id', projectId);
        if (resolved !== undefined) {
            query = query.eq('resolved', resolved);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async resolveConflict(id, resolution) {
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
        if (error && error.code !== 'PGRST116')
            throw error;
        return result ?? null;
    }
    // --- Request Log Operations ---
    async createRequestLog(projectId, question, retrievedIds, reason, modelUsed) {
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
        if (error)
            throw error;
        return data;
    }
    async listRequestLogs(projectId) {
        const { data, error } = await this.client
            .from('request_logs')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
}
// Single global repository instance
export const repo = new SupabaseRepository();
//# sourceMappingURL=repository.js.map