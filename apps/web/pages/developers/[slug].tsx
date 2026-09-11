import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { developers, getDeveloperBySlug, Developer } from '../../lib/developers';
import { GetStaticPaths, GetStaticProps } from 'next';

interface ProfileProps {
  developer: Developer;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: developers.map((d) => ({ params: { slug: d.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ProfileProps> = async ({ params }) => {
  const developer = getDeveloperBySlug(params?.slug as string);
  if (!developer) return { notFound: true };
  return { props: { developer } };
};

export default function DeveloperProfile({ developer: dev }: ProfileProps) {
  const title = `${dev.name} — ${dev.role} · Código Binário`;
  const description = dev.shortBio;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
      </Head>

      {/* Breadcrumb */}
      <section className="w-full px-gutter-mobile md:px-margin pt-space-lg pb-space-md bg-surface-container-lowest border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
          <div
            className="flex flex-wrap items-center gap-space-xs font-label-telemetry text-label-telemetry tracking-widest text-text-secondary uppercase"
            aria-label="Caminho de navegação"
          >
            <span className="text-primary" aria-hidden="true">//</span>
            <Link href="/developers" className="hover:text-on-surface transition-colors">Equipe de Engenharia</Link>
            <span className="text-text-tertiary" aria-hidden="true">&gt;</span>
            <span>Perfil de Sistema</span>
            <span className="text-text-tertiary" aria-hidden="true">&gt;</span>
            <span className="text-primary font-bold">[{dev.name.toUpperCase()}]</span>
          </div>
          <Link
            href="/developers"
            className="inline-flex items-center gap-space-xs font-label-code text-label-code text-primary hover:text-tertiary transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
            <span>Voltar para Equipe</span>
          </Link>
        </div>
      </section>

      {/* HERO: PHOTO + DOSSIER */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left column */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="relative bg-surface-container-low rounded-lg p-space-md overflow-hidden shadow-card">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary-container/15 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

              <div className="flex items-center justify-between font-label-telemetry text-label-telemetry text-text-secondary pb-space-sm">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" aria-hidden="true" />
                  STATUS: ACTIVE
                </span>
                <span className="text-primary font-label-code tracking-wider">[SYS-AUTH: VERIFIED]</span>
              </div>

              {/* Official photo */}
              <div className="relative w-full aspect-square rounded overflow-hidden bg-bg-surface-base">
                <Image
                  src={dev.photo}
                  alt={dev.photoAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-surface-base via-transparent to-transparent opacity-70 pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-center justify-between font-label-telemetry text-label-telemetry">
                  <span className="px-space-xs py-0.5 rounded bg-bg-surface-base/90 text-primary uppercase font-bold tracking-wider">
                    NODE // {dev.node}
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high/90 text-on-surface-variant uppercase">
                    {dev.credential}
                  </span>
                </div>
              </div>

              {/* Cluster info */}
              <div className="mt-space-md flex flex-col gap-space-xs bg-bg-surface-elevated p-space-sm rounded font-label-telemetry text-label-telemetry text-text-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary uppercase">// CLUSTER:</span>
                  <span className="text-on-surface font-semibold">{dev.cluster}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary uppercase">// ROLE:</span>
                  <span className="text-primary font-label-code">{dev.role.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary uppercase">// FORMAÇÃO:</span>
                  <span className="text-on-surface-variant">{dev.credential.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Official social links — only real channels */}
            {dev.socials.length > 0 && (
              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm">
                <span className="font-label-telemetry text-label-telemetry text-text-secondary uppercase tracking-widest">
                  // CANAIS OFICIAIS
                </span>
                <div className={`grid grid-cols-2 gap-space-xs ${dev.socials.length > 2 ? 'sm:grid-cols-3' : ''}`}>
                  {dev.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 px-space-sm py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary transition-colors font-label-code text-label-code"
                    >
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">{s.icon}</span>
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-primary tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" aria-hidden="true" />
                {dev.systemsRole}
              </div>
              <h1 className="font-display text-display-mobile md:text-display text-text-primary tracking-tight">
                {dev.name}
              </h1>
              <p className="font-headline-sm text-headline-sm text-secondary tracking-normal">
                {dev.role} • {dev.credential}
              </p>
            </div>

            {/* Executive summary */}
            <div className="bg-surface-container-low p-space-lg rounded-lg shadow-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-container" aria-hidden="true" />
              <p className="font-body-lg text-body-md md:text-body-lg text-on-surface leading-relaxed">{dev.bio}</p>
            </div>

            {/* Metadata matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {dev.metadata.map((m) => (
                <div key={m.label} className="bg-bg-surface-elevated p-space-md rounded">
                  <span className="font-label-telemetry text-label-telemetry uppercase text-text-secondary">{m.label}</span>
                  <div className="font-label-counter text-label-counter text-primary mt-1">{m.value}</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{m.note}</p>
                </div>
              ))}
            </div>

            {/* Areas of practice */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-telemetry text-label-telemetry text-text-secondary uppercase tracking-widest">
                // ÁREAS DE ATUAÇÃO
              </span>
              <div className="flex flex-wrap gap-1.5 pt-space-xs">
                {dev.areas.map((area) => (
                  <span
                    key={area}
                    className="px-space-sm py-0.5 rounded bg-surface-container-high border border-border-subtle font-label-code text-label-code text-on-surface"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center gap-space-sm px-space-lg py-space-sm rounded bg-primary-container text-on-primary-container font-label-code text-label-code uppercase tracking-wider hover:bg-primary transition-all shadow-cta-glow font-bold"
              >
                [INICIAR DIAGNÓSTICO →]
              </Link>
              <div className="flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-text-secondary">
                <span className="material-symbols-outlined text-primary text-base" aria-hidden="true">verified_user</span>
                <span>CAPACIDADE ATIVA: {dev.cluster}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl bg-surface-container-lowest border-y border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-sm">
            <div className="flex flex-col gap-space-xs">
              <span className="tech-label">// DOMÍNIOS DE ATUAÇÃO</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">
                Competências Técnicas &amp; Domínios
              </h2>
            </div>
            <div className="font-label-telemetry text-label-telemetry text-text-secondary uppercase">
              ESFERA OPERACIONAL: PRODUTO • SISTEMA • INFRA
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {dev.domains.map((d, i) => (
              <div
                key={d.title}
                className="bg-surface-container-low p-space-lg rounded flex flex-col justify-between hover:bg-surface-container transition-all"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">{d.icon}</span>
                    <span className="font-label-counter text-label-counter text-text-tertiary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{d.title}</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">{d.description}</p>
                </div>
                <div className="pt-space-md mt-space-md border-t border-border-subtle">
                  <span className="font-label-telemetry text-label-telemetry text-primary">{d.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACKS */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="tech-label">// MATRIZ DE DOMÍNIO TÉCNICO</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">
              Stacks &amp; Ferramentas
            </h2>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Tecnologias aplicadas em engenharia e operações da Código Binário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {dev.stacks.map((s) => (
              <div
                key={s.title}
                className="bg-bg-surface-base p-space-md rounded flex items-center gap-space-md border border-border-subtle"
              >
                <div className="w-12 h-12 shrink-0 rounded bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">{s.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">{s.title}</span>
                  <span className="font-label-telemetry text-label-telemetry text-text-secondary uppercase">{s.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRIBUTIONS — platform engineering, no invented metrics */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl bg-surface-container-lowest border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="tech-label">// ENGENHARIA APLICADA NA CÓDIGO BINÁRIO</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">
              Contribuições na Plataforma
            </h2>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Frentes de engenharia onde {dev.name.split(' ')[0]} atua diretamente nos sistemas da Código Binário.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            {CONTRIBUTIONS[dev.slug].map((c, i) => (
              <div
                key={c.title}
                className="bg-surface p-space-lg rounded-lg flex flex-col justify-between shadow-card relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-space-sm font-label-counter text-label-counter text-primary">
                  CASE // {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs text-primary font-label-telemetry text-label-telemetry">
                    <span className="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
                    {c.tag}
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{c.title}</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">{c.description}</p>
                  <div className="bg-bg-surface-elevated p-space-sm rounded font-label-code text-label-code text-on-surface-variant flex flex-col gap-1">
                    <div className="text-text-tertiary">// ESCOPO</div>
                    {c.scope.map((line) => (
                      <div key={line}>&gt; {line}</div>
                    ))}
                  </div>
                </div>
                <div className="pt-space-md mt-space-md flex items-center justify-between font-label-telemetry text-label-telemetry text-text-secondary">
                  <span>STACK: {c.stack}</span>
                  <span className="text-primary font-bold">[ATIVO]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl bg-surface">
        <div className="max-w-5xl mx-auto bg-surface-container-low rounded-lg p-space-xl relative overflow-hidden shadow-card">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-center text-center gap-space-md">
            <div className="flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-primary uppercase tracking-widest">
              <span className="material-symbols-outlined text-base" aria-hidden="true">psychology</span>
              <span>// SESSÃO TÉCNICA DIRETA COM {dev.name.toUpperCase()}</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight max-w-2xl">
              {dev.cta}
            </h2>
            <p className="font-body-md text-body-md text-text-secondary max-w-xl">
              Submeta o diagnóstico inicial da sua operação. A equipa analisa o caso e define a
              direção técnica adequada ao seu contexto.
            </p>
            <div className="pt-space-sm flex flex-col sm:flex-row items-center gap-space-md">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wider hover:bg-primary transition-all shadow-cta-glow-lg font-bold"
              >
                <span>[INICIAR DIAGNÓSTICO →]</span>
              </Link>
            </div>
            <div className="pt-space-sm flex flex-wrap justify-center items-center gap-space-lg font-label-telemetry text-label-telemetry text-text-tertiary">
              <span>• SEM REUNIÕES DE VENDAS DESNECESSÁRIAS</span>
              <span>• ANÁLISE DIRETA POR ENGENHEIRO</span>
              <span>• SIGILO GARANTIDO</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Contributions grounded in the company's own platform (website + Binary Diagnostic flow)
const CONTRIBUTIONS: Record<string, { tag: string; title: string; description: string; scope: string[]; stack: string }[]> = {
  'elisio-nascimento': [
    {
      tag: 'DATA LAYER',
      title: 'Persistência do Pipeline de Diagnóstico',
      description:
        'Modelagem e operação da camada de dados do Binary Diagnostic: sessões de discovery, mensagens, diagnósticos estruturados e leads no Supabase.',
      scope: ['Esquemas relacionais normalizados', 'Consultas e índices de leitura', 'Integridade transacional ACID'],
      stack: 'SUPABASE · POSTGRESQL',
    },
    {
      tag: 'API CORE',
      title: 'API de Discovery & Leads',
      description:
        'Endpoints que sustentam a entrevista guiada por IA e a captura de leads, com proteção de rotas administrativas por chave.',
      scope: ['Contratos REST tipados', 'Validação de payload', 'Proteção fail-closed de rotas admin'],
      stack: 'FASTIFY · TYPESCRIPT',
    },
    {
      tag: 'RELIABILITY',
      title: 'Resiliência de Backend em Produção',
      description:
        'Operação do serviço de API em produção com fallback entre provedores de IA e tratamento estruturado de erros.',
      scope: ['Fallback multi-provider', 'Logs seguros sem dados sensíveis', 'Deploy contínuo no Render'],
      stack: 'NODE · RENDER · SUPABASE',
    },
  ],
  'mendes-bessa': [
    {
      tag: 'DIAGNOSTIC ENGINE',
      title: 'Orquestração do Binary Diagnostic',
      description:
        'Motor de entrevista guiada que conduz a conversa, extrai fatos estruturados e decide o momento da geração do diagnóstico.',
      scope: ['Extração de fatos [FACTS]', 'Gatilho determinístico de diagnóstico', 'Fallback Gemini → Groq'],
      stack: 'GEMINI · GROQ · TYPESCRIPT',
    },
    {
      tag: 'AI PIPELINE',
      title: 'Prompts & Análise Estruturada',
      description:
        'Design de prompts de sistema com saída em JSON restritivo, prevenção de alucinações e síntese executiva do diagnóstico.',
      scope: ['Prompt de discovery e de síntese', 'JSON schema restritivo', 'Avaliação de confiança'],
      stack: 'PROMPT ENGINEERING · JSON MODE',
    },
    {
      tag: 'PLATFORM',
      title: 'Arquitetura da Plataforma',
      description:
        'Definição da arquitetura do monorepo (web, API, shared), integração frontend/backend e infraestrutura de deploy.',
      scope: ['Monorepo pnpm + Turborepo', 'CORS e variáveis de ambiente', 'Pipelines Vercel → Render → Supabase'],
      stack: 'TURBOREPO · VERCEL · RENDER',
    },
  ],
  'mbumba-guilherme': [
    {
      tag: 'INTERFACE SYSTEM',
      title: 'Website & Design System',
      description:
        'Materialização do design system Binary Cybernetic Engine em componentes Next.js reutilizáveis: navegação, cards, telemetria e layouts.',
      scope: ['Componentes tipados e reutilizáveis', 'Responsividade mobile-first', 'Estados de hover e foco'],
      stack: 'NEXT.JS · TAILWIND · TYPESCRIPT',
    },
    {
      tag: 'DIAGNOSTIC UX',
      title: 'Experiência do Diagnóstico',
      description:
        'Interface de entrevista em tempo real, apresentação do relatório de diagnóstico e fluxo de captura de lead com validação.',
      scope: ['Chat de discovery reativo', 'Brief de diagnóstico estruturado', 'Formulário de lead acessível'],
      stack: 'REACT · FETCH · A11Y',
    },
    {
      tag: 'SEO & PERFORMANCE',
      title: 'SEO, Metadados & Otimização',
      description:
        'Metadados Open Graph por página, imagens otimizadas via next/image e HTML semântico em todas as rotas públicas.',
      scope: ['Meta tags e hierarchy de headings', 'next/image com sizes responsivos', 'HTML semântico e labels'],
      stack: 'NEXT/HEAD · NEXT/IMAGE',
    },
  ],
};
