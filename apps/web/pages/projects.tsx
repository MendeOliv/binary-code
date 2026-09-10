import Head from 'next/head';
import SectionHeader from '../components/SectionHeader';

const PROJECTS = [
  {
    id: 'PROJECT_001',
    name: 'SYNAPSE_VLM',
    type: 'Autonomous Document & ERP Ingestion Engine',
    status: 'PRODUCTION // STABLE',
    statusColor: 'text-primary',
    problem:
      'Reconciliação fiscal manual com alta redundância operacional e erro humano recorrente.',
    solution:
      'Sistema autónomo de extração de faturas e reconciliação fiscal com processamento vetorial assíncrono e inferência multimodal.',
    stack: ['Fastify v4', 'TypeScript Strict', 'pgvector', 'Python 3.12', 'Docker Sandbox'],
    metrics: [
      { label: 'LATENCY THRESHOLD', value: '< 2.8s', note: 'End-to-end parsed' },
      { label: 'BOTTLENECK', value: '0.00%', note: 'Zero Human Dependency' },
      { label: 'VERIFICATION', value: 'STRICT', note: 'Type Safe' },
    ],
  },
  {
    id: 'PROJECT_002',
    name: 'KERNEL_OBSERVER',
    type: 'Telemetry & Multi-Agent Network Orchestrator',
    status: 'STAGING // BENCHMARKING',
    statusColor: 'text-secondary',
    problem:
      'Auditoria contínua de contratos e conformidade fragmentada em múltiplos silos de dados.',
    solution:
      'Orquestrador de nós de inferência distribuída com topologia de grafos supervisionada e verificação de segurança em tempo real.',
    stack: ['Rust (Core)', 'LangGraph', 'Supabase', 'Redis Streams', 'gRPC'],
    metrics: [
      { label: 'CONCURRENCY', value: '64k NODES', note: 'Async Runtime' },
      { label: 'SYNC OVERHEAD', value: '< 14ms', note: 'Redis Pub/Sub' },
      { label: 'AUDIT', value: '99.998%', note: 'Convergence' },
    ],
  },
  {
    id: 'PROJECT_003',
    name: 'PROCESS_AUTOMATION',
    type: 'VLM Document Intelligence Pipeline',
    status: 'DEPLOYABLE',
    statusColor: 'text-primary',
    problem: 'Triagem e processamento de documentos não estruturados com alto custo operacional.',
    solution:
      'Pipeline de extração VLM com esquemas rígidos, normalização e encaminhamento inteligente por categoria de fluxo.',
    stack: ['Vision-LM', 'FastAPI', 'Postgres', 'Airflow', 'Terraform'],
    metrics: [
      { label: 'THROUGHPUT', value: '1.2k DOC/MIN', note: 'Batch + Stream' },
      { label: 'ACCURACY', value: '99.4%', note: 'Field-level' },
      { label: 'HUMAN EFFORT', value: '-94%', note: 'Reduction' },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>Projects — Código Binário</title>
        <meta
          name="description"
          content="Sistemas construídos pelo Código Binário. Cases de engenharia de software, IA e automação em produção."
        />
      </Head>

      <section className="relative w-full bg-background">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-12 md:pt-24">
          <SectionHeader
            eyebrow="// SYSTEMS ADVANCING"
            title={
              <>
                PROJECTO & WO
                R K
                <br />
                — SISTEMAS CONSTRUÍDOS
              </>
            }
            description="Cada projecto é um sistema real, descrito como um sistema: problema, solução, stack e telemetria. Sem portfolio genérico."
          />
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col gap-8">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="bg-surface-container border border-outline-variant"
            >
              {/* Header strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-5 py-3">
                <div className="flex items-center gap-2.5 font-mono text-label-sm">
                  <span className="state-dot" aria-hidden="true" />
                  <span className="text-primary font-semibold tracking-wider">
                    {project.id}{' // '}{project.name}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 font-mono text-code-telemetry ${
                    project.statusColor === 'text-primary'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  [{project.status}]
                </span>
              </div>

              <div className="px-5 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: identity */}
                <div className="lg:col-span-5">
                  <span className="font-mono text-code-telemetry text-secondary uppercase tracking-widest">
                    SYSTEM TYPE
                  </span>
                  <h3 className="mt-1 font-mono text-headline-md text-on-surface">
                    {project.type}
                  </h3>

                  <div className="mt-5 font-mono text-body-sm text-on-surface-variant leading-relaxed">
                    <div className="mb-4">
                      <div className="tech-label mb-1">{'// PROBLEM'}</div>
                      <p>{project.problem}</p>
                    </div>
                    <div>
                      <div className="tech-label mb-1">{'// SOLUTION'}</div>
                      <p>{project.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Right: telemetry + stack */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="bg-surface-container-lowest p-4 flex flex-col">
                        <span className="font-mono text-label-sm text-outline uppercase">
                          {m.label}
                        </span>
                        <span className="mt-1 font-mono text-headline-md text-on-surface">
                          {m.value}
                        </span>
                        <span className="font-mono text-code-telemetry text-on-surface-variant">
                          {m.note}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <span className="font-mono text-code-telemetry text-outline uppercase">
                      CORE STACK ARCHITECTURE:
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-code-telemetry">
                      {project.stack.map((tech, i) => (
                        <span
                          key={tech}
                          className={
                            i === 0
                              ? 'px-2.5 py-1 bg-primary text-on-primary'
                              : 'px-2.5 py-1 bg-surface text-on-surface border border-outline-variant'
                          }
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
                    <span className="font-mono text-code-telemetry text-outline">
                      {'ENDPOINT: GET /api/projects/'}{project.id}
                    </span>
                    <span className="font-mono text-label-sm text-on-surface-variant uppercase tracking-widest">
                      [UNDER NDA]
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}