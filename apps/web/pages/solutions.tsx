import Head from 'next/head';
import Link from 'next/link';
import SectionHeader from '../components/SectionHeader';

const SOLUTIONS = [
  {
    index: '01',
    category: 'AI',
    title: 'AGENTES AUTÔNOMOS & COPILOTOS',
    description:
      'Sistemas de raciocínio contextual com memória de longo prazo, tool calling e orquestração multi-modelo. Autonomia operacional com supervisão humana onde importa.',
    capabilities: ['Agentes L3', 'Copilotos jurídicos', 'Roteamento multi-modelo', 'Memória semântica'],
  },
  {
    index: '02',
    category: 'AUTOMATION',
    title: 'AUTOMAÇÃO DE PROCESSOS & VLM',
    description:
      'Extração, normalização e encaminhamento inteligente de documentos e fluxos não estruturados. Eliminação de gargalos operacionais analógicos.',
    capabilities: ['Extração VLM', 'Reconciliação', 'Triagem documental', 'Onboarding regulatório'],
  },
  {
    index: '03',
    category: 'DIGITAL PRODUCTS',
    title: 'PLATAFORMAS DE BAIXA LATÊNCIA',
    description:
      'Aplicações web B2B, portais de alta densidade informativa e painéis de comando em tempo real com tolerância zero a latência.',
    capabilities: ['Sub-20ms', 'Consoles de controlo', 'Portais B2B', 'Dados em tempo real'],
  },
  {
    index: '04',
    category: 'INTERNAL SYSTEMS',
    title: 'SISTEMAS INTERNOS & PAINÉIS',
    description:
      'Ferramentas que dão controlo à operação: dashboards, motores de decisão e infraestrutura de dados que convergem cada silo informativo.',
    capabilities: ['Dashboards', 'Motores de decisão', 'Infraestrutura de dados', 'Workflows'],
  },
  {
    index: '05',
    category: 'INTEGRATIONS',
    title: 'INTEGRAÇÃO CIRÚRGICA',
    description:
      'Acoplamento de novas camadas de inteligência em sistemas legados (SAP, TOTVS, Salesforce, AS400) sem reconstrução traumática.',
    capabilities: ['ERPs legados', 'Wrappers de compliance', 'AS400', 'Pontes de IA'],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Head>
        <title>Solutions — Código Binário</title>
        <meta
          name="description"
          content="O que exatamente o Código Binário consegue construir para si. IA, automação, produtos digitais, sistemas internos e integrações."
        />
      </Head>

      <section className="relative w-full bg-background">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-12 md:pt-24">
          <SectionHeader
            eyebrow="// SOLUTIONS"
            title={
              <>
                O QUE EXACTAMENTE
                <br />
                CONSTRUÍMOS PARA SI?
              </>
            }
            description="Cada solução é um sistema desenhado a partir do problema real. Não vendemos templates — vendemos engenharia."
          />
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 pb-24">
          <div className="border-t border-outline-variant">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.index}
                className="group grid grid-cols-1 md:grid-cols-12 gap-5 py-8 border-b border-outline-variant transition-colors duration-200 hover:bg-surface-container/40"
              >
                <div className="md:col-span-1 font-mono text-headline-md text-primary">
                  {sol.index}
                </div>
                <div className="md:col-span-3">
                  <div className="tech-label mb-2">{sol.category}</div>
                  <h3 className="font-mono text-headline-md uppercase text-on-surface group-hover:text-primary transition-colors duration-200">
                    {sol.title}
                  </h3>
                </div>
                <div className="md:col-span-4 md:col-start-6">
                  <p className="font-mono text-body-sm text-on-surface-variant leading-relaxed">
                    {sol.description}
                  </p>
                </div>
                <div className="md:col-span-3 md:col-start-10">
                  <div className="flex flex-wrap gap-1.5">
                    {sol.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-1 bg-surface border border-outline-variant font-mono text-code-telemetry text-on-surface-variant"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-surface-container border border-outline-variant px-6 py-14">
            <h2 className="font-mono text-headline-lg uppercase text-on-surface tracking-tight">
              Tem um problema que <span className="text-primary">estas soluções</span> deveriam
              resolver?
            </h2>
            <p className="mt-4 font-mono text-body-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Descreva-o no Binary Diagnostic e receba uma recomendação arquitectónica
              personalizada.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/diagnostic" className="btn-primary">
                START DIAGNOSTIC →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}