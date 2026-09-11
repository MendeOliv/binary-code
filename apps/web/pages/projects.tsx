import Head from 'next/head';
import Link from 'next/link';

/**
 * Systems & cases. The flagship case is the company's own platform (real,
 * verifiable in this repository). Client-facing systems remain NDA-protected:
 * we present problem/solution/stack without inventing results or metrics.
 */
const PROJECTS = [
  {
    id: 'PROJECT_001',
    name: 'BINARY_DIAGNOSTIC',
    type: 'Motor de Diagnóstico Guiado por IA',
    status: 'EM PRODUÇÃO',
    active: true,
    problem:
      'Empresas sabem que têm ineficiências operacionais, mas não conseguem traduzir o problema em requisitos técnicos nem escolher a arquitetura certa.',
    solution:
      'Entrevista de discovery guiada por IA (Gemini com fallback Groq) que extrai fatos estruturados da conversa e gera um diagnóstico técnico com solução recomendada, complexidade e próximos passos — persistido no Supabase e convertido em lead.',
    stack: ['Next.js', 'Fastify', 'Gemini', 'Groq', 'Supabase'],
    scope: [
      'SESSION // discovery_sessions + messages',
      'ANALYSIS // diagnóstico estruturado JSON',
      'PIPELINE // diagnóstico → lead → notificação',
      'SECURITY // rotas admin protegidas por chave',
    ],
    telemetry: 'PLATFORM // Este website e a API que o alimenta',
  },
  {
    id: 'PROJECT_002',
    name: 'PLATFORM_CORE',
    type: 'Monorepo Web + API + Shared Models',
    status: 'EM PRODUÇÃO',
    active: true,
    problem:
      'Frontend, backend e modelos de dados precisam evoluir em sincronia sem quebrar contratos nem duplicar lógica.',
    solution:
      'Arquitetura monorepo (pnpm + Turborepo) com Next.js na Vercel, API Fastify no Render e modelos TypeScript compartilhados entre as pontas, com CORS restrito e variáveis de ambiente segregadas.',
    stack: ['pnpm Workspaces', 'Turborepo', 'Next.js 14', 'Fastify 5', 'TypeScript'],
    scope: [
      'WEB // apps/web (Vercel)',
      'API // apps/api (Render)',
      'SHARED // packages/shared models',
      'DEPLOY // CI por ambiente',
    ],
    telemetry: 'PLATFORM // Infraestrutura desta operação',
  },
  {
    id: 'PROJECT_003',
    name: 'CLIENT_SYSTEMS',
    type: 'Sistemas Sob Medida para Clientes',
    status: 'SOB NDA',
    active: false,
    problem:
      'Cada cliente opera com fluxos, ERPs e restrições próprias que plataformas genéricas não atendem.',
    solution:
      'Sistemas personalizados de software, automação e IA desenhados a partir do diagnóstico. Detalhes, métricas e resultados permanecem protegidos por acordos de confidencialidade.',
    stack: ['Sob contrato', 'Por projeto'],
    scope: [
      'DISCOVERY // diagnóstico define escopo',
      'BUILD // engenharia sob medida',
      'NDA // detalhes sob confidencialidade',
    ],
    telemetry: 'POLICY // Sem divulgação de dados de clientes',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>Projetos — Código Binário</title>
        <meta
          name="description"
          content="Sistemas construídos pela Código Binário: engenharia de software, IA e automação em produção. Cases descritos como sistemas — problema, solução, stack."
        />
      </Head>

      {/* Telemetry bar */}
      <section className="w-full px-gutter-mobile md:px-margin pt-space-lg pb-space-md">
        <div className="max-w-7xl mx-auto bg-surface-container-lowest p-space-md rounded-lg flex flex-wrap items-center justify-between gap-space-md border border-border-subtle shadow-sm">
          <span className="inline-flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-primary uppercase">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" aria-hidden="true" />
            SYS//PROJECTS: REGISTRY_OPEN
          </span>
          <span className="font-label-code text-label-code text-text-secondary">
            POLICY: NO_INVENTED_METRICS
          </span>
        </div>
      </section>

      {/* Header */}
      <section className="w-full px-gutter-mobile md:px-margin pt-space-md pb-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs tech-label">
            <span className="material-symbols-outlined text-base" aria-hidden="true">folder_open</span>
            <span>// SYSTEM REGISTRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight uppercase">
            Projetos &amp; Cases — Sistemas Construídos
          </h1>
          <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-3xl pt-space-xs">
            Cada projeto é um sistema real, descrito como um sistema: problema, solução, stack e
            escopo. Sem portfólio genérico, sem números inventados.
          </p>
        </div>
      </section>

      {/* Projects stream */}
      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="bg-surface-container-low border border-border-subtle rounded-xl overflow-hidden shadow-card"
            >
              {/* Header strip */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-border-subtle bg-surface-container-lowest px-space-lg py-space-sm">
                <div className="flex items-center gap-space-sm font-label-telemetry text-label-telemetry">
                  <span className="state-dot" aria-hidden="true" />
                  <span className="text-primary font-bold tracking-wider">
                    {project.id} // {project.name}
                  </span>
                </div>
                <span
                  className={`px-space-sm py-0.5 rounded font-label-code text-label-code ${
                    project.active ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  [{project.status}]
                </span>
              </div>

              <div className="px-space-lg py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Left: identity */}
                <div className="lg:col-span-5">
                  <span className="font-label-telemetry text-label-telemetry text-secondary uppercase tracking-widest">
                    SYSTEM TYPE
                  </span>
                  <h2 className="mt-1 font-headline-md text-headline-md text-text-primary">{project.type}</h2>

                  <div className="mt-space-md font-body-sm text-body-sm text-on-surface-variant leading-relaxed flex flex-col gap-space-md">
                    <div>
                      <div className="tech-label mb-1">// PROBLEMA</div>
                      <p>{project.problem}</p>
                    </div>
                    <div>
                      <div className="tech-label mb-1">// SOLUÇÃO</div>
                      <p>{project.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Right: scope + stack */}
                <div className="lg:col-span-7">
                  <div className="bg-bg-surface-base p-space-md rounded font-label-code text-label-code text-on-surface-variant flex flex-col gap-1">
                    <div className="text-text-tertiary">// ESCOPO DO SISTEMA</div>
                    {project.scope.map((line) => (
                      <div key={line}>&gt; {line}</div>
                    ))}
                  </div>

                  <div className="mt-space-lg flex flex-col gap-space-sm">
                    <span className="font-label-telemetry text-label-telemetry text-text-tertiary uppercase">
                      // STACK & ARQUITETURA:
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-label-code text-label-code">
                      {project.stack.map((tech, i) => (
                        <span
                          key={tech}
                          className={
                            i === 0 && project.active
                              ? 'px-space-sm py-0.5 rounded bg-primary-container text-on-primary-container'
                              : 'px-space-sm py-0.5 rounded bg-surface-container text-on-surface border border-border-subtle'
                          }
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-space-lg flex items-center justify-between gap-space-sm border-t border-border-subtle pt-space-md">
                    <span className="font-label-telemetry text-label-telemetry text-outline uppercase">
                      {project.telemetry}
                    </span>
                    {!project.active && (
                      <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                        [NDA]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="max-w-4xl mx-auto bg-bg-surface-elevated border border-border-subtle rounded-xl p-space-xl text-center shadow-card">
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary tracking-tight">
            Tem um problema que precisa de um <span className="text-primary">sistema</span>?
          </h2>
          <p className="mt-space-sm font-body-md text-body-md text-text-secondary max-w-xl mx-auto leading-relaxed">
            Descreva o contexto no Binary Diagnostic e receba uma recomendação arquitetural
            personalizada.
          </p>
          <div className="mt-space-lg flex justify-center">
            <Link href="/diagnostic" className="btn-primary px-space-lg py-3">
              [INICIAR DIAGNÓSTICO →]
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
