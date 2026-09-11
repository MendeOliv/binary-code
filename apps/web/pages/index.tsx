import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { developers } from '../lib/developers';

const PROBLEMS = [
  {
    icon: 'hourglass_disabled',
    title: 'Processos manuais e lentos',
    description:
      'Tarefas repetitivas introduzem ruído, fadiga operacional e tempos de resposta incompatíveis com a velocidade do mercado.',
    solution: 'Motores de execução e automação de workflows',
  },
  {
    icon: 'alt_route',
    title: 'Sistemas desconectados',
    description:
      'Múltiplos softwares isolados fragmentam a integridade dos dados da empresa, gerando retrabalho constante de conciliação.',
    solution: 'Integrações e barramentos orientados a eventos',
  },
  {
    icon: 'trending_up',
    title: 'Gargalos de escala',
    description:
      'O aumento de demanda passa a exigir contratações desproporcionais quando a arquitetura tecnológica não suporta volumes elásticos.',
    solution: 'Arquitetura e workloads concorrentes',
  },
  {
    icon: 'psychology',
    title: 'IA sem valor tangível',
    description:
      'Projetos de IA sem conexão com bases proprietárias ou modelos com alucinações que nunca são integrados às operações diárias.',
    solution: 'RAG determinístico e validação de contexto',
  },
  {
    icon: 'speed',
    title: 'Software genérico e baixa performance',
    description:
      'Sistemas genéricos de terceiros que não atendem às suas particularidades de negócio e impõem custos exorbitantes de licença. Desenhamos plataformas personalizadas de alto desempenho.',
    solution: 'Arquitetura sob medida, sem bloatware',
    wide: true,
  },
];

const PILLARS = [
  {
    icon: 'smart_toy',
    index: '01',
    title: 'Engenharia de IA',
    description:
      'Arquiteturas RAG, agentes e assistentes inteligentes, orquestração de LLMs e IA aplicada onde cria vantagem real.',
    stack: 'LLMs, agentes, RAG, AI workflows',
  },
  {
    icon: 'code_blocks',
    index: '02',
    title: 'Engenharia de Software',
    description:
      'Aplicações web, APIs, backend, bases de dados, dashboards e sistemas personalizados construídos com rigor técnico.',
    stack: 'TypeScript, Node, PostgreSQL, Next.js',
  },
  {
    icon: 'sync_saved_locally',
    index: '03',
    title: 'Automação & Integrações',
    description:
      'Workflows orquestrados, automação empresarial, IA aplicada a processos e integrações profundas com CRMs e ERPs.',
    stack: 'n8n, webhooks, filas, APIs',
  },
  {
    icon: 'terminal',
    index: '04',
    title: 'Sistemas & Infraestrutura',
    description:
      'Arquitetura, deployment, Linux, redes e observabilidade — infraestrutura confiável para operações críticas.',
    stack: 'Linux, Docker, redes, monitorização',
  },
  {
    icon: 'layers',
    index: '05',
    title: 'Produtos Digitais',
    description:
      'MVPs robustos, ferramentas internas, plataformas e produtos digitais prontos para evoluir com o negócio.',
    stack: 'MVPs, plataformas, ferramentas internas',
  },
  {
    icon: 'troubleshoot',
    index: '06',
    title: 'Consultoria & Discovery',
    description:
      'Análise de problemas, diagnóstico, arquitetura e definição de solução antes de qualquer linha de código.',
    stack: 'Discovery, diagnóstico, blueprint técnico',
  },
];

const METHOD = [
  { index: '01', title: 'Descoberta', description: 'Mapeamento detalhado dos fluxos e gargalos prioritários.', tag: 'Escopo definido' },
  { index: '02', title: 'Diagnóstico', description: 'Identificação precisa de pontos de falha e desperdício.', tag: 'Causa raiz' },
  { index: '03', title: 'Arquitetura', description: 'Desenho de dados, segurança e seleção técnica de IA.', tag: 'Especificação' },
  { index: '04', title: 'Construção', description: 'Desenvolvimento modular com testes e validações rigorosas.', tag: 'Código limpo' },
  { index: '05', title: 'Deploy', description: 'Implementação em ambiente isolado sem indisponibilidade.', tag: 'Zero-downtime' },
  { index: '06', title: 'Evolução', description: 'Monitorização ativa, refinamento contínuo e suporte direto.', tag: 'Observabilidade' },
];

const AREAS = ['AI Engineering', 'Software Engineering', 'Automation', 'Systems & Infrastructure', 'Digital Products', 'Consulting & Discovery'];

export default function Home() {
  return (
    <>
      <Head>
        <title>Código Binário — AI, Systems &amp; Digital Solutions</title>
        <meta
          name="description"
          content="A Código Binário entende problemas complexos e transforma-os em sistemas, automações e soluções digitais funcionais — utilizando Inteligência Artificial quando ela realmente cria vantagem."
        />
      </Head>

      {/* ============ HERO ============ */}
      <section className="relative w-full overflow-hidden bg-bg-canvas px-gutter-mobile md:px-margin pt-space-xl pb-20 md:pb-24 border-b border-border-subtle">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-40 right-0 w-[520px] h-[520px] soft-glow pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center pt-space-lg pb-space-lg gap-space-lg">
          <div className="inline-flex flex-wrap items-center justify-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high border border-border-subtle text-body-sm">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-medium text-text-primary">Engenharia de Software &amp; IA Aplicada</span>
            <span className="text-text-tertiary mx-1" aria-hidden="true">•</span>
            <span className="text-text-secondary">Arquiteturas Escaláveis</span>
          </div>

          <h1 className="font-display text-display-mobile md:text-display tracking-tight text-text-primary font-bold">
            <span className="block">O problema é o input.</span>
            <span className="text-primary">O sistema é a resposta.</span>
          </h1>

          <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-2xl leading-relaxed">
            A Código Binário entende problemas complexos e transforma-os em sistemas, automações e
            soluções digitais funcionais — utilizando Inteligência Artificial quando ela realmente
            cria vantagem.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
            <Link href="/diagnostic" className="btn-primary px-space-lg py-3 font-body-md font-semibold">
              Iniciar Diagnóstico Técnico <span className="font-bold" aria-hidden="true">→</span>
            </Link>
            <Link href="/projects" className="btn-secondary px-space-lg py-3">
              Ver Casos de Sucesso
            </Link>
          </div>

          <div className="mt-space-md pt-space-md border-t border-border-subtle w-full max-w-2xl grid grid-cols-3 gap-space-sm items-center justify-around text-text-secondary font-body-sm">
            <div className="flex flex-col items-center">
              <span className="text-text-primary font-semibold text-headline-sm">06</span>
              <span className="text-text-tertiary text-body-sm text-center">Áreas de engenharia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-text-primary font-semibold text-headline-sm">03</span>
              <span className="text-text-tertiary text-body-sm text-center">Engenheiros dedicados</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-text-primary font-semibold text-headline-sm">24h</span>
              <span className="text-text-tertiary text-body-sm text-center">Resposta ao diagnóstico</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEMAS QUE RESOLVEMOS ============ */}
      <section className="w-full bg-bg-surface-base px-gutter-mobile md:px-margin py-20 md:py-24 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-border-subtle pb-space-lg">
            <div>
              <span className="text-primary font-body-sm font-semibold tracking-wide uppercase">
                Vulnerabilidades Operacionais
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mt-space-xs font-semibold">
                Problemas que eliminamos na raiz
              </h2>
            </div>
            <p className="font-body-md text-body-md text-text-secondary max-w-md">
              Falhas estruturais em fluxos legados drenam margens e paralisam a inovação.
              Reconstruímos a sua infraestrutura com precisão e clareza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className={`bg-bg-surface-elevated p-space-lg rounded border border-border-subtle hover:border-outline transition-colors flex flex-col justify-between ${
                  p.wide ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">{p.icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">{p.title}</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">{p.description}</p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-border-subtle flex items-center justify-between text-body-sm gap-space-sm">
                  <span className="text-text-tertiary shrink-0">Solução:</span>
                  <span className="text-primary font-medium text-right">{p.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CAPACIDADES (6 PILARES) ============ */}
      <section className="w-full bg-bg-canvas px-gutter-mobile md:px-margin py-20 md:py-24 border-b border-border-subtle relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="text-primary font-body-sm font-semibold tracking-wide uppercase">Capacidades Técnicas</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary font-semibold">
              Nossos pilares de engenharia
            </h2>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Combinamos rigor metodológico de engenharia de software com técnicas avançadas de
              inteligência artificial aplicada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="bg-bg-surface-elevated rounded p-space-lg border border-border-subtle hover:border-outline transition-colors flex flex-col justify-between"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">{pillar.icon}</span>
                    <span className="font-label-counter text-label-counter text-text-tertiary">{pillar.index}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">{pillar.title}</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">{pillar.description}</p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-border-subtle text-body-sm text-text-tertiary">
                  <span className="text-secondary font-medium">Stack:</span> {pillar.stack}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
            <span className="font-label-telemetry text-label-telemetry text-text-tertiary uppercase">// AREAS:</span>
            {AREAS.map((a) => (
              <span
                key={a}
                className="px-space-sm py-0.5 rounded bg-bg-surface-elevated border border-border-subtle font-label-telemetry text-label-telemetry text-on-surface-variant"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MÉTODO ============ */}
      <section className="w-full bg-bg-surface-base px-gutter-mobile md:px-margin py-20 md:py-24 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="text-primary font-body-sm font-semibold tracking-wide uppercase">Metodologia</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary font-semibold">
              O ciclo de entrega em 6 etapas
            </h2>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Cada linha de código é antecedida por diagnóstico analítico claro. Do entendimento do
              negócio ao suporte contínuo em produção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
            {METHOD.map((step) => (
              <div
                key={step.index}
                className="bg-bg-surface-elevated p-space-md rounded border border-border-subtle flex flex-col justify-between"
              >
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-counter text-label-counter text-primary">{step.index}</span>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">{step.title}</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary">{step.description}</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-border-subtle text-body-sm text-text-tertiary">
                  {step.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EQUIPE (PREVIEW) ============ */}
      <section className="w-full bg-bg-canvas px-gutter-mobile md:px-margin py-20 md:py-24 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="text-primary font-body-sm font-semibold tracking-wide uppercase">Equipe de Engenharia</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mt-space-xs font-semibold">
                Quem constrói os sistemas
              </h2>
            </div>
            <Link
              href="/developers"
              className="inline-flex items-center gap-1 text-primary hover:text-primary-fixed-dim transition-colors font-body-sm font-medium"
            >
              Ver equipe completa <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {developers.map((dev) => (
              <article
                key={dev.slug}
                className="bg-bg-surface-elevated rounded-lg border border-border-subtle overflow-hidden flex flex-col hover:border-outline transition-colors group"
              >
                <Link href={`/developers/${dev.slug}`} className="h-64 w-full overflow-hidden bg-bg-surface-base relative block" tabIndex={-1} aria-hidden="true">
                  <Image
                    src={dev.photo}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                  />
                </Link>
                <div className="p-space-md flex flex-col justify-between flex-grow gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">{dev.name}</h3>
                    <p className="text-primary font-body-sm font-medium">{dev.role}</p>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-space-xs leading-relaxed">
                      {dev.shortBio}
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t border-border-subtle flex items-center justify-between gap-space-sm">
                    <span className="font-label-telemetry text-label-telemetry text-text-tertiary uppercase">
                      {dev.focusTags.join(' • ')}
                    </span>
                    <Link
                      href={`/developers/${dev.slug}`}
                      className="font-label-code text-label-code text-primary hover:text-tertiary transition-colors shrink-0"
                      aria-label={`Ver perfil de ${dev.name}`}
                    >
                      [VER PERFIL →]
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA DIAGNÓSTICO ============ */}
      <section className="w-full bg-bg-canvas px-gutter-mobile md:px-margin py-24 md:py-28 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto bg-bg-surface-elevated rounded-xl p-space-xl md:p-16 border border-border-subtle flex flex-col items-center text-center shadow-card">
          <span className="text-primary font-body-sm font-semibold uppercase tracking-wider mb-space-xs">
            Diagnóstico Gratuito de Engenharia
          </span>
          <h2 className="font-display text-display-mobile md:text-[40px] md:leading-[48px] text-text-primary max-w-2xl leading-tight font-bold">
            Você não precisa saber a solução.
            <br />
            <span className="text-primary">Precisa apenas do problema real.</span>
          </h2>
          <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-xl mt-space-md mb-space-xl leading-relaxed">
            Apresente os gargalos operacionais da sua empresa. Analisamos a sua infraestrutura e
            entregamos a especificação técnica ideal para o seu crescimento.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center gap-space-sm px-8 py-4 bg-primary text-on-primary font-body-md font-semibold rounded hover:bg-primary-fixed-dim transition-colors"
          >
            Agendar Diagnóstico com Engenheiro <span className="font-bold" aria-hidden="true">→</span>
          </Link>
          <div className="mt-space-lg flex flex-wrap justify-center items-center gap-space-md text-body-sm text-text-secondary">
            <span>Resposta em 24 horas</span>
            <span aria-hidden="true">•</span>
            <span>Sem compromisso</span>
            <span aria-hidden="true">•</span>
            <span>Conversa direta com time técnico</span>
          </div>
        </div>
      </section>
    </>
  );
}
