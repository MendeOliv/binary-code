import Head from 'next/head';
import Link from 'next/link';

interface Enclave {
  id: string;
  index: string;
  accent: 'primary' | 'secondary';
  title: string;
  description: string;
  problem: string;
  delivery: string;
  when: string;
  stackLabel: string;
  stack: string[];
}

const ENCLAVES: Enclave[] = [
  {
    id: 'capability-01',
    index: '01',
    accent: 'primary',
    title: 'AI Engineering',
    description:
      'Construção de ecossistemas orientados a contexto executivo. Transformamos inferência bruta em pipelines de decisão integrados ao núcleo da sua operação.',
    problem:
      'Modelos generativos sem contexto corporativo, fragmentados em silos ou tratados como gimmicks de marketing sem retorno mensurável.',
    delivery:
      'RAG avançado com base vetorial, agentes autônomos multi-step e assistentes sincronizados ao ERP/CRM central.',
    when:
      'Quando o volume de dados não estruturados é crítico ou processos operacionais dependem de raciocínio contextual dinâmico.',
    stackLabel: '// STACK & FERRAMENTAS:',
    stack: ['LLMs Enterprise', 'LangChain', 'LlamaIndex', 'Vector DBs (Qdrant/Pinecone)', 'Python Core', 'Custom Embeddings'],
  },
  {
    id: 'capability-02',
    index: '02',
    accent: 'secondary',
    title: 'Software Engineering',
    description:
      'Engenharia de software de baixa latência e tolerância zero a falhas. Aplicações críticas onde consistência e performance são requisitos inegociáveis.',
    problem:
      'Dependência de plataformas genéricas no-code/SaaS rígidas que não atendem às especificidades de negócio e criam custos ocultos.',
    delivery:
      'Aplicações web corporativas de missão crítica, barramentos de APIs imutáveis e consoles de comando sob medida.',
    when:
      'Quando as regras de negócio são altamente especializadas ou a performance e concorrência simultânea são vetores vitais.',
    stackLabel: '// STACK & FERRAMENTAS:',
    stack: ['TypeScript', 'Next.js', 'Node.js Engine', 'PostgreSQL', 'Fastify', 'Docker Enclaves'],
  },
  {
    id: 'capability-03',
    index: '03',
    accent: 'primary',
    title: 'Automation & Workflows',
    description:
      'Orquestração autônoma de fluxos transacionais. Substituímos processos braçais por pipelines sem atrito com validação semântica.',
    problem:
      'Centenas de horas desperdiçadas em tarefas redundantes, extração manual de dados e planilhas desconectadas com alto índice de erro.',
    delivery:
      'Workflows automatizados ponta a ponta, pipelines orquestrados via n8n e automação omnicanal (webhooks, email, mensageria).',
    when:
      'Para estancar gargalos operacionais imediatos e escalar o volume de atendimento e processamento sem aumentar headcount.',
    stackLabel: '// STACK & FERRAMENTAS:',
    stack: ['n8n Enterprise', 'Webhook Relays', 'Redis Queues', 'Document OCR/Parser', 'Email Transacional'],
  },
  {
    id: 'capability-04',
    index: '04',
    accent: 'secondary',
    title: 'Systems & Infrastructure',
    description:
      'Arquitetura soberana, governança de dados e computação de alta eficiência. Topologias de rede seguras com observabilidade ponta a ponta.',
    problem:
      'Sistemas instáveis que caem sob picos, custos de cloud inflacionados de forma opaca e ausência de alertas preditivos.',
    delivery:
      'Arquitetura híbrida (nuvem e on-premise), orquestração de containers Linux otimizados e telemetria com alertas.',
    when:
      'Antes de escalar produtos para alto tráfego concorrente, reduzir custos predatórios ou atender exigências de auditoria.',
    stackLabel: '// STACK & FERRAMENTAS:',
    stack: ['Linux Hardened', 'Docker', 'Terraform (IaC)', 'Prometheus & Grafana', 'Zero Trust'],
  },
  {
    id: 'capability-05',
    index: '05',
    accent: 'primary',
    title: 'Digital Products & MVPs',
    description:
      'Validação de produto em ritmo acelerado com solidez estrutural. Versões de mercado de alta tração com arquitetura para escalar.',
    problem:
      'Meses e grandes investimentos em funcionalidades sem validação real de clientes pagantes ou feedback empírico.',
    delivery:
      'MVPs construídos sobre código de padrão de produção, prontos para receber tráfego, capturar receita e testar tração.',
    when:
      'Quando ventures ou founders precisam testar uma tese de mercado com velocidade sem contrair débito técnico intransponível.',
    stackLabel: '// STACK & FERRAMENTAS:',
    stack: ['Next.js Framework', 'Supabase Auth & Data', 'Payment Gateways', 'Tailwind Design System', 'Vercel Edge'],
  },
  {
    id: 'capability-06',
    index: '06',
    accent: 'secondary',
    title: 'Technical Consulting & Discovery',
    description:
      'Auditoria técnica de precisão e planejamento estratégico de arquitetura. Diagnosticamos gargalos ocultos antes da contratação errada.',
    problem:
      'Empresas que sabem que enfrentam ineficiências, mas ficam paralisadas sem saber qual tecnologia ou arquitetura adotar.',
    delivery:
      'Sessões de discovery técnico, auditoria de código legado, matriz de viabilidade econômica e blueprints de arquitetura.',
    when:
      'No estágio prévio a investimentos pesados, migrações complexas ou quando uma modernização legada não pode falhar.',
    stackLabel: '// ENTREGÁVEIS & ARTEFATOS:',
    stack: ['Technical RFC Documents', 'Architecture Blueprints', 'Cost vs ROI Projection', 'Threat Modeling Matrix'],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Head>
        <title>Soluções — Código Binário</title>
        <meta
          name="description"
          content="Arquitetura soberana e engenharia de alta precisão: AI Engineering, Software Engineering, Automação, Infraestrutura, Produtos Digitais e Consultoria Técnica."
        />
      </Head>

      {/* Telemetry diagnostic bar */}
      <section className="w-full px-gutter-mobile md:px-margin pt-space-lg pb-space-md">
        <div className="w-full bg-surface-container-lowest p-space-md rounded-lg flex flex-wrap items-center justify-between gap-space-md shadow-sm border border-border-subtle">
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-primary uppercase">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" aria-hidden="true" />
              SYS//CAPABILITIES: 06_ACTIVE_ENCLAVES
            </span>
            <span className="hidden sm:inline font-label-telemetry text-label-telemetry text-text-secondary" aria-hidden="true">|</span>
            <span className="hidden sm:inline font-label-code text-label-code text-on-surface-variant">
              SPEC: ENTERPRISE_GRADE_ORCHESTRATION
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-label-telemetry text-label-telemetry text-secondary uppercase">// AI, SYSTEMS &amp; DIGITAL SOLUTIONS</span>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="w-full px-gutter-mobile md:px-margin pt-space-md pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
          <div className="lg:col-span-8 flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs tech-label">
              <span className="material-symbols-outlined text-base" aria-hidden="true">terminal</span>
              <span>// CORE ENGINEERING CAPABILITIES</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary uppercase tracking-tight">
              Arquitetura Soberana &amp; Engenharia de Alta Precisão
            </h1>
            <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-3xl pt-space-xs">
              Eliminamos o abismo entre protótipos superficiais e infraestrutura corporativa
              resiliente. Nossos blocos de engenharia operam sob rigor técnico, telemetria contínua
              e escalabilidade sem dependência técnica.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end gap-space-xs">
            <span className="font-label-telemetry text-label-telemetry text-on-surface-variant uppercase">
              AUDITED CODEBASES // {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-space-sm bg-surface-container-high px-space-md py-space-xs rounded">
              <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">verified_user</span>
              <span className="font-label-code text-label-code text-primary">ZERO GIMMICK POLICY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick filter pills */}
      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <nav className="flex items-center gap-space-sm overflow-x-auto pb-space-xs" aria-label="Índice de capacidades">
          <span className="font-label-telemetry text-label-telemetry text-text-secondary uppercase shrink-0">// JUMP_TO:</span>
          {ENCLAVES.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface-variant font-label-code text-label-code hover:bg-surface-container-high hover:text-primary transition-colors shrink-0"
            >
              [{e.index}_{e.title.split(' ')[0].replace('&', '').toUpperCase()}]
            </a>
          ))}
        </nav>
      </section>

      {/* Main solutions stream */}
      <section className="w-full px-gutter-mobile md:px-margin flex flex-col gap-space-xl pb-space-xl">
        {ENCLAVES.map((e) => (
          <article
            key={e.id}
            id={e.id}
            className="w-full bg-surface-container-low rounded-xl p-space-lg md:p-space-xl shadow-card relative overflow-hidden scroll-mt-24"
          >
            <div className="flex flex-col lg:flex-row gap-space-xl justify-between items-start">
              {/* Content */}
              <div className="flex flex-col gap-space-md w-full lg:w-7/12">
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`inline-flex items-center gap-space-xs font-label-telemetry text-label-telemetry uppercase ${
                      e.accent === 'primary' ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        e.accent === 'primary' ? 'bg-primary-container' : 'bg-secondary-container'
                      }`}
                      aria-hidden="true"
                    />
                    <span>// ARCHITECTURE ENCLAVE {e.index}</span>
                  </div>
                  <span className="font-label-counter text-label-counter text-text-tertiary">{e.index} / 06</span>
                </div>

                <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary uppercase tracking-tight">
                  {e.title}
                </h2>
                <p className="font-body-md text-body-md text-text-secondary">{e.description}</p>

                {/* Problem vs Delivery matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs">
                    <div className="flex items-center gap-space-xs text-error font-label-telemetry text-label-telemetry uppercase">
                      <span className="material-symbols-outlined text-base" aria-hidden="true">warning</span>
                      <span>O Problema</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{e.problem}</p>
                  </div>
                  <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs">
                    <div
                      className={`flex items-center gap-space-xs font-label-telemetry text-label-telemetry uppercase ${
                        e.accent === 'primary' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base" aria-hidden="true">check_circle</span>
                      <span>O Que Construímos</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{e.delivery}</p>
                  </div>
                </div>

                {/* When to deploy */}
                <div className="bg-surface-container-high p-space-md rounded-lg flex flex-col gap-space-xs">
                  <span
                    className={`font-label-telemetry text-label-telemetry uppercase ${
                      e.accent === 'primary' ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    // QUANDO UTILIZAR:
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface">{e.when}</p>
                </div>

                {/* Stack pills */}
                <div className="flex flex-col gap-space-xs pt-space-xs">
                  <span className="font-label-telemetry text-label-telemetry text-text-tertiary uppercase">{e.stackLabel}</span>
                  <div className="flex flex-wrap gap-space-xs">
                    {e.stack.map((tool) => (
                      <span
                        key={tool}
                        className="px-space-sm py-space-xs bg-surface-container text-on-surface font-label-code text-label-code rounded"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-space-md">
                  <Link href="/diagnostic" className="btn-primary">
                    <span>[SOLICITAR DIAGNÓSTICO PARA ESTA ÁREA →]</span>
                  </Link>
                </div>
              </div>

              {/* Telemetry panel */}
              <div className="w-full lg:w-4/12 flex flex-col gap-space-md">
                <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-md">
                  <div
                    className={`flex items-center justify-between font-label-telemetry text-label-telemetry text-text-secondary uppercase`}
                  >
                    <span>MODULE STATUS</span>
                    <span className={e.accent === 'primary' ? 'text-primary' : 'text-secondary'}>OPERATIONAL</span>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded font-label-code text-label-code text-on-surface-variant flex flex-col gap-1 overflow-x-auto">
                    <span className="text-primary">&gt; module::{e.title.toLowerCase().replace(/[^a-z]+/g, '_')}::load()</span>
                    <span className="text-on-surface">&gt; status: ACTIVE [ENCLAVE_{e.index}]</span>
                    <span className="text-text-secondary">&gt; scope: produto · sistema · infra</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${e.accent === 'primary' ? 'bg-primary-container' : 'bg-secondary-container'}`}
                      style={{ width: `${100 - Number(e.index)}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-label-telemetry text-label-telemetry text-text-tertiary">
                    <span>CAPABILITY INDEX</span>
                    <span>{e.index} / 06</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Methodology matrix */}
      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="w-full bg-surface-container-low rounded-xl p-space-lg md:p-space-xl flex flex-col gap-space-lg shadow-card border border-border-subtle">
          <div className="flex flex-col gap-space-xs">
            <span className="tech-label">// METHODOLOGY MATRIX</span>
            <h3 className="font-headline-md text-headline-md text-text-primary uppercase">
              Como Nossas Soluções se Diferenciam
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm">
              <span className="tech-label">// SOBERANIA DE CÓDIGO</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Propriedade Total dos Ativos</h4>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Você é proprietário de cada linha de código, modelo e infraestrutura provisionada.
                Sem lock-in, sem dependências proprietárias de terceiros.
              </p>
            </div>
            <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm">
              <span className="font-label-telemetry text-label-telemetry text-secondary uppercase tracking-widest">
                // OBSERVABILIDADE
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Telemetria em Tempo Real</h4>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Cada pipeline ou agente de IA entregue vem munido de instrumentos de medição de
                latência, taxa de erro e consumo.
              </p>
            </div>
            <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm">
              <span className="tech-label">// ALINHAMENTO EXECUTIVO</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">ROI &amp; Eficiência Operacional</h4>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Cada iniciativa parte de um problema de negócio concreto e termina em um resultado
                mensurável para a operação.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
