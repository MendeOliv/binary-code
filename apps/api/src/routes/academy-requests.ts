import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import { leadLimiter, makeRateLimitHook } from '../lib/rate-limit';
import { AcademyRequestSchema, validateInput } from '../lib/validation';
import { notificationService, buildPublicNextStep } from '../services/notification';

const COURSE_NAMES: Record<string, string> = {
  'forex-trading': 'Forex Trading', 'crypto-trading': 'Crypto Trading', 'engenharia-de-ia': 'Engenharia de IA',
  'engenharia-de-prompting': 'Engenharia de Prompting', 'vibe-coding': 'Vibe Coding', automacao: 'Automação',
  'bot-trading': 'Bot Trading', 'sistemas-de-ia': 'Sistemas de IA',
};

export async function academyRequestRoutes(fastify: FastifyInstance) {
  fastify.post('/', { onRequest: makeRateLimitHook(leadLimiter) }, async (request, reply) => {
    const input = validateInput(AcademyRequestSchema, request.body as unknown);
    if (!input.ok) return reply.code(400).send({ error: input.error });
    const courseId = input.data.courseId || null;
    if (courseId && !COURSE_NAMES[courseId]) return reply.code(400).send({ error: 'Invalid academy course' });
    try {
      const existing = await repo.getLeadByRequestId(input.data.requestId);
      if (existing) return reply.code(200).send(existing);
      const lead = await repo.createLead({
        requestId: input.data.requestId,
        source: 'academy',
        academyCourseId: courseId || undefined,
        name: input.data.name,
        email: input.data.email,
        phone: input.data.phone || undefined,
        notes: input.data.message,
      });
      await repo.createLeadActivity({ leadId: lead.id, type: 'lead_created', description: 'Pedido de formação criado na Código Binário Academy', createdBy: 'academy' });
      const course = courseId ? COURSE_NAMES[courseId] : 'Formação personalizada';
      notificationService.notifyNewAcademyRequest({ leadId: lead.id, name: lead.name, email: lead.email, phone: lead.phone, course, message: input.data.message, createdAt: lead.createdAt }).catch((error) => request.log.error(error, 'academy internal notification failed'));
      notificationService.sendClientConfirmation({ name: lead.name, company: null, problemSummary: course, nextStep: buildPublicNextStep('analysis'), email: lead.email }).catch((error) => request.log.error(error, 'academy client confirmation failed'));
      return reply.code(201).send(lead);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
