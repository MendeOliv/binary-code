import Head from 'next/head';
import Link from 'next/link';
import SectionHeader from '../components/SectionHeader';

const CAPABILITIES = [
  {
    index: '01',
    title: 'DIGITAL SYSTEMS',
    description:
      'Aplicações web, plataformas de baixa latência e consoles de dados construídos com rigor técnico. Software sob medida para o seu domínio.',
    code: 'STACK // NEXT.TS, TYPESCRIPT, NODE',
  },
  {
    index: '02',
    title: 'AI SYSTEMS',
    description:
      'Agentes autónomos, copilotos e sistemas de raciocínio contextual com memória de longo prazo para operações críticas.',
    code: 'STACK // LLM, RAG, ORCHESTRATION',
  },
  {
    index: '03',
    title: 'AUTOMATION',
    description:
      'Extração, normalização e encaminhamento inteligente de documentos e fluxos não estruturados. Eliminação de gargalos operacionais.',
    code: 'STACK // PIPELINES, VLM, RPA',
  },
  {
    index: '04',
    title: 'INTERNAL SYSTEMS',
    description:
      'Ferramentas internas, painéis de controlo e motores de decisão que convertem a complexidade da operação em controlo real.',
    code: 'STACK // API, DASHBOARDS, EDGE',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Código Binário — Diagnostic Intelligence</title>
        <meta
          name="description"
          content="Código Binário constrói sistemas, resolve problemas complexos e transforma problemas em software. SYSTEM / INTELLIGENCE / ENGINEERING."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/svg/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo-icon-192.png" />
        <meta
          property="og:image"
          content="/svg/codigo-binario-exact.svg"
        />
      </Head>

      {/* ============ HERO ============ */}
      <section className="relative w-full bg-background overflow-hidden">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
        <div
          className="absolute -top-40 -right-40 w-[560px] h-[560px] soft-glow pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 tech-label mb-7">
              <span className="state-dot" aria-hidden="true" />
              SYSTEM / INTELLIGENCE / ENGINEERING
            </div>

            <h1 className="font-mono text-headline-xl md:text-[44px] md:leading-[1.05] uppercase text-on-surface tracking-tight">
              The problem is the input.
              <br />
              <span className="text-primary">The system is the answer.</span>
            </h1>

            <p className="mt-7 font-mono text-body-md md:text-body-lg text-on-surface-variant leading-relaxed max-w-xl">
              Construímos sistemas que convertem complexidade em controlo.
              Usamos a inteligência artificial como ferramenta de engenharia —
              não como promessa. Descreva o problema; nós desenhamos o sistema.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/diagnostic" className="btn-primary">
                START DIAGNOSTIC →
              </Link>
              <Link href="/solutions" className="btn-ghost">
                EXPLORE SYSTEMS
              </Link>
            </div>

            {/* Terminal-like metadata */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-code-telemetry text-outline">
              <span>STATUS: OPERATIONAL</span>
              <span>KERNEL: STABLE</span>
              <span>INPUT: AWAITING</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="w-full bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <SectionHeader
            eyebrow="// CAPABILITIES"
            title={
              <>
                SISTEMAS QUE CONVERTEM <br className="hidden sm:block" /> COMPLEXIDADE EM
                CONTROL&OCT;O
              </>
            }
            description="Não fazemos sites genéricos. Construímos infraestrutura de software e inteligência para operações que não podem falhar."
          />

          {/* Editorial list */}
          <div className="mt-14 border-t border-outline-variant">
            {CAPABILITIES.map((cap, idx) => (
              <div
                key={cap.index}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-7 border-b border-outline-variant transition-colors duration-200 hover:bg-surface-container/40"
              >
                <div className="md:col-span-1 font-mono text-headline-md text-primary">
                  {cap.index}
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-mono text-headline-md uppercase text-on-surface group-hover:text-primary transition-colors duration-200">
                    {cap.title}
                  </h3>
                  <span className="mt-1 hidden md:block font-mono text-code-telemetry text-outline">
                    {cap.code}
                  </span>
                </div>
                <div className="md:col-span-6 md:col-start-6 lg:col-span-6">
                  <p className="font-mono text-body-sm text-on-surface-variant leading-relaxed max-w-xl">
                    {cap.description}
                  </p>
                </div>
                <div className="md:col-span-1 hidden md:flex items-start justify-end">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors duration-200">
                    arrow_outward
                  </span>
                </div>
                {idx === 0 && (
                  <span className="md:hidden font-mono text-code-telemetry text-outline col-span-full">
                    {cap.code}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DIAGNOSTIC CTA ============ */}
      <section className="relative w-full bg-background overflow-hidden">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container border border-outline-variant text-primary font-mono text-label-sm uppercase tracking-widest">
              <span className="state-dot" aria-hidden="true" />
              [SYS.READY]
            </div>
          </div>

          <h2 className="font-mono text-headline-xl md:text-[40px] md:leading-[1.08] uppercase text-on-surface tracking-tight">
            Você não precisa saber a solução.
            <br />
            <span className="text-primary">Você precisa conhecer o seu problema.</span>
          </h2>

          <p className="mt-6 font-mono text-body-md text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            Entre no Binary Diagnostic — uma entrevista técnica guiada por IA que transforma a sua
            descrição num diagnóstico arquitectónico real.
          </p>

          <div className="mt-9 flex justify-center">
            <Link href="/diagnostic" className="btn-primary">
              INICIAR DIAGNÓSTICO →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}