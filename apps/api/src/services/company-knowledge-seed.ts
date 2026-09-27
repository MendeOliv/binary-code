import { createHash } from 'node:crypto';
import { normalize } from '../lib/company-knowledge';

/**
 * The RAG source of truth about Código Binário (seeded into `company_knowledge`).
 *
 * RULES FOR THIS FILE (non-negotiable):
 *  - Every entry must be verifiable in this repository or on the public website.
 *    `sourceUrl` points at the page that proves it.
 *  - NO invented facts: no address, phone number, client names, client counts,
 *    success metrics, awards, certifications, delivery deadlines or project
 *    prices. Where the company does not publish something, the entry says so
 *    explicitly (that is the honest and useful answer).
 *  - PURE DATA: this module has no database or network dependency, so it is
 *    unit-testable and importable anywhere.
 */

export interface SeedEntry {
  category: string;
  title: string;
  content: string;
  sourceUrl: string;
  tags: string[];
}

const SITE = 'https://codigobinario.it.ao';
// Official public address (verified Resend sender). Source of truth:
// apps/web/components/Footer.tsx + apps/web/pages/privacidade.tsx on origin/master.
// NOTE: eng@codigobinario.it.ao was replaced by contacto@ — do not reintroduce it.
const CONTACT = 'contacto@codigobinario.it.ao';

export const COMPANY_KNOWLEDGE_SEED: SeedEntry[] = [
  // ── Identity ───────────────────────────────────────────────────────────
  {
    category: 'identity',
    title: 'O que é a Código Binário',
    content:
      'A Código Binário é uma empresa de engenharia — AI, Systems & Digital Solutions. Entende problemas complexos e transforma-os em sistemas, automações e soluções digitais funcionais, utilizando Inteligência Artificial quando ela realmente cria vantagem. Posicionamento oficial: «O problema é o input. O sistema é a resposta.»',
    sourceUrl: SITE,
    tags: ['empresa', 'identidade', 'sobre', 'quem somos', 'o que fazemos'],
  },
  {
    category: 'identity',
    title: 'Marca, nome e domínio oficial',
    content:
      'O nome oficial da marca é "Código Binário". O domínio oficial e canónico é https://codigobinario.it.ao. O domínio antigo codigobinario.io está descontinuado e não deve ser referido.',
    sourceUrl: SITE,
    tags: ['marca', 'dominio', 'site', 'website'],
  },
  {
    category: 'identity',
    title: 'Idioma e localização',
    content:
      'A Código Binário é uma empresa de consultoria tecnológica sediada em Angola. Comunica em português (português de Angola). Não publica morada física.',
    sourceUrl: SITE,
    tags: ['angola', 'idioma', 'localizacao', 'portugues'],
  },
  {
    category: 'identity',
    title: 'Números divulgados no site oficial',
    content:
      'O site oficial apresenta três números: 06 áreas de engenharia, 03 engenheiros dedicados e 24 horas como tempo de resposta ao diagnóstico. São os únicos indicadores institucionais publicados — a empresa não divulga número de clientes, volume de projetos nem métricas de resultados.',
    sourceUrl: SITE,
    tags: ['numeros', 'areas', 'equipa', 'resposta', 'indicadores'],
  },
  {
    category: 'identity',
    title: 'Diferenciais técnicos',
    content:
      'Três diferenciais declarados: (1) Soberania de código — o cliente é proprietário de cada linha de código, modelo e infraestrutura provisionada, sem lock-in nem dependências proprietárias de terceiros; (2) Observabilidade — cada pipeline ou agente de IA entregue vem instrumentado para medir latência, taxa de erro e consumo; (3) Alinhamento executivo — cada iniciativa parte de um problema de negócio concreto e termina num resultado mensurável para a operação. Política declarada: "zero gimmick" — sem protótipos superficiais nem IA decorativa.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['diferenciais', 'vantagens', 'porque escolher', 'soberania', 'lock-in'],
  },

  // ── Services / capabilities ────────────────────────────────────────────
  {
    category: 'services',
    title: 'As 6 áreas de engenharia (pilares)',
    content:
      'A Código Binário organiza o trabalho em seis pilares: (01) Engenharia de IA — arquiteturas RAG, agentes, assistentes inteligentes e orquestração de LLMs; (02) Engenharia de Software — aplicações web, APIs, backend, bases de dados, dashboards e sistemas personalizados; (03) Automação & Integrações — workflows orquestrados, automação empresarial e integrações com CRMs e ERPs; (04) Sistemas & Infraestrutura — arquitetura, deployment, Linux, redes e observabilidade; (05) Produtos Digitais — MVPs robustos, ferramentas internas e plataformas; (06) Consultoria & Discovery — análise de problemas, diagnóstico, arquitetura e definição de solução antes de qualquer linha de código.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['servicos', 'pilares', 'areas', 'capacidades', 'especialidades'],
  },
  {
    category: 'capabilities',
    title: 'AI Engineering (o que inclui)',
    content:
      'AI Engineering: construção de ecossistemas orientados a contexto. Problema típico resolvido: modelos generativos sem contexto corporativo, fragmentados em silos ou tratados como gimmicks de marketing sem retorno mensurável. Entrega: RAG avançado com base vetorial, agentes autónomos multi-step e assistentes sincronizados ao ERP/CRM. Tecnologias usadas: LLMs, LangChain, LlamaIndex, bases vetoriais (Qdrant/Pinecone), Python, embeddings personalizados. Aplicável quando o volume de dados não estruturados é crítico ou os processos dependem de raciocínio contextual dinâmico.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['ia', 'ai', 'rag', 'llm', 'agentes', 'embeddings'],
  },
  {
    category: 'capabilities',
    title: 'Software Engineering (o que inclui)',
    content:
      'Software Engineering: engenharia de software de baixa latência e tolerância zero a falhas. Problema típico: dependência de plataformas genéricas no-code/SaaS rígidas que não atendem às especificidades do negócio e criam custos ocultos. Entrega: aplicações web corporativas de missão crítica, APIs e consoles sob medida. Tecnologias: TypeScript, Next.js, Node.js, PostgreSQL, Fastify, Docker. Aplicável quando as regras de negócio são especializadas ou a performance e concorrência simultânea são vitais.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['software', 'web', 'api', 'backend', 'nextjs', 'fastify', 'postgres'],
  },
  {
    category: 'capabilities',
    title: 'Automação & Workflows (o que inclui)',
    content:
      'Automação & Workflows: orquestração autónoma de fluxos transacionais, substituindo processos manuais por pipelines com validação semântica. Problema típico: centenas de horas desperdiçadas em tarefas redundantes, extração manual de dados e planilhas desconectadas com alto índice de erro. Entrega: workflows automatizados ponta a ponta, pipelines orquestrados via n8n e automação omnicanal (webhooks, email, mensageria). Tecnologias: n8n, webhooks, filas Redis, OCR/parsing de documentos, email transacional.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['automacao', 'workflows', 'n8n', 'integracoes', 'webhooks', 'processos'],
  },
  {
    category: 'capabilities',
    title: 'Sistemas & Infraestrutura (o que inclui)',
    content:
      'Systems & Infrastructure: arquitetura soberana, governança de dados e computação de alta eficiência, com observabilidade ponta a ponta. Problema típico: sistemas instáveis sob picos, custos de cloud inflacionados de forma opaca e ausência de alertas preditivos. Entrega: arquitetura híbrida (nuvem e on-premise), orquestração de containers Linux e telemetria com alertas. Tecnologias: Linux, Docker, Terraform (IaC), Prometheus & Grafana, princípios Zero Trust.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['infraestrutura', 'sistemas', 'docker', 'linux', 'devops', 'observabilidade', 'cloud'],
  },
  {
    category: 'capabilities',
    title: 'Produtos Digitais & MVPs (o que inclui)',
    content:
      'Digital Products & MVPs: validação de produto em ritmo acelerado com solidez estrutural. Problema típico: meses e grandes investimentos em funcionalidades sem validação real de clientes pagantes. Entrega: MVPs construídos sobre código de padrão de produção, prontos para receber tráfego e testar tração sem contrair débito técnico intransponível. Tecnologias: Next.js, Supabase (auth e dados), gateways de pagamento, Tailwind, Vercel.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['mvp', 'produto', 'startup', 'founders', 'validacao'],
  },
  {
    category: 'capabilities',
    title: 'Consultoria Técnica & Discovery (o que inclui)',
    content:
      'Technical Consulting & Discovery: auditoria técnica de precisão e planeamento estratégico de arquitetura, diagnosticando gargalos ocultos antes da contratação errada. Problema típico: empresas que sabem que têm ineficiências mas ficam paralisadas sem saber qual tecnologia ou arquitetura adotar. Entregáveis: sessões de discovery técnico, auditoria de código legado, matriz de viabilidade económica e blueprints de arquitetura. Aplicável antes de investimentos pesados, migrações complexas ou modernizações legadas que não podem falhar.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['consultoria', 'discovery', 'auditoria', 'arquitetura', 'blueprint'],
  },

  // ── Methodology / process ──────────────────────────────────────────────
  {
    category: 'methodology',
    title: 'Ciclo de entrega em 6 etapas',
    content:
      'Cada linha de código é antecedida por diagnóstico analítico claro. O ciclo de entrega tem seis etapas: (01) Descoberta — mapeamento detalhado dos fluxos e gargalos prioritários; (02) Diagnóstico — identificação precisa de pontos de falha e desperdício; (03) Arquitetura — desenho de dados, segurança e seleção técnica de IA; (04) Construção — desenvolvimento modular com testes e validações rigorosas; (05) Deploy — implementação em ambiente isolado sem indisponibilidade; (06) Evolução — monitorização ativa, refinamento contínuo e suporte direto.',
    sourceUrl: SITE,
    tags: ['metodologia', 'processo', 'etapas', 'como trabalhamos', 'entrega'],
  },
  {
    category: 'process',
    title: 'Como funciona o Binary Diagnostic',
    content:
      'O Binary Diagnostic funciona em quatro passos: (01) o cliente descreve o problema em linguagem natural, sem preparação técnica; (02) a IA conduz a entrevista e extrai os factos operacionais; (03) o sistema gera um diagnóstico técnico estruturado com solução recomendada, complexidade e próximos passos; (04) a equipa de engenharia analisa o caso e entra em contacto. O diagnóstico é gratuito e sem compromisso.',
    sourceUrl: `${SITE}/diagnostic`,
    tags: ['diagnostico', 'binary diagnostic', 'como funciona', 'entrevista', 'gratuito'],
  },
  {
    category: 'process',
    title: 'O que é entregue após o diagnóstico',
    content:
      'O diagnóstico produz uma análise técnica preliminar com base nas informações fornecidas. É um instrumento de apoio à decisão, não uma proposta comercial vinculativa nem uma garantia de resultado. A análise gerada por IA é revista pela equipa de engenharia antes de qualquer contrato ou implementação. Recomendações finais de arquitetura, escopo e investimento são formalizadas em documento próprio, mediante acordo.',
    sourceUrl: `${SITE}/termos`,
    tags: ['diagnostico', 'entregavel', 'proposta', 'analise', 'equipa'],
  },
  {
    category: 'process',
    title: 'Como iniciar um projeto com a Código Binário',
    content:
      'O ponto de entrada é o diagnóstico técnico em /diagnostic: o cliente descreve o problema, a IA conduz a entrevista, o sistema produz o diagnóstico e, se o cliente deixar os dados de contacto (nome e, opcionalmente, email, telefone e empresa), a equipa de engenharia analisa o caso e entra em contacto para dar seguimento.',
    sourceUrl: `${SITE}/diagnostic`,
    tags: ['comecar', 'iniciar', 'projeto', 'contacto', 'proximo passo'],
  },

  // ── Products ───────────────────────────────────────────────────────────
  {
    category: 'product',
    title: 'Binary Diagnostic (produto em produção)',
    content:
      'O Binary Diagnostic é o motor de diagnóstico guiado por IA da própria Código Binário e está em produção. Resolve o problema de empresas que sabem que têm ineficiências operacionais mas não conseguem traduzir o problema em requisitos técnicos nem escolher a arquitetura certa. É uma entrevista de discovery guiada por IA que extrai factos estruturados da conversa e gera um diagnóstico técnico com solução recomendada, complexidade e próximos passos, persistido em Supabase e convertido em lead. Stack: Next.js, Fastify, Gemini, Groq, Supabase.',
    sourceUrl: `${SITE}/projects`,
    tags: ['binary diagnostic', 'produto', 'plataforma', 'projeto', 'caso'],
  },
  {
    category: 'product',
    title: 'Este website / plataforma (PLATFORM_CORE)',
    content:
      'O próprio website e a API que o alimentam são um sistema construído pela Código Binário, em produção: um monorepo (pnpm + Turborepo) com Next.js na Vercel, API Fastify no Render e modelos TypeScript partilhados entre as pontas, com CORS restrito e variáveis de ambiente segregadas.',
    sourceUrl: `${SITE}/projects`,
    tags: ['website', 'plataforma', 'monorepo', 'infraestrutura', 'projeto'],
  },

  // ── Technology ─────────────────────────────────────────────────────────
  {
    category: 'technology',
    title: 'Stack tecnológica da Código Binário',
    content:
      'Frontend: Next.js 14, React 18, Tailwind CSS, TypeScript. Backend: Fastify 5, Node.js, TypeScript. Dados: PostgreSQL / Supabase, com busca full-text e pgvector para pesquisa semântica. IA: LLMs (Gemini como provedor principal, com Groq, NVIDIA, Anthropic e OpenAI como alternativas na cadeia de fallback), RAG, embeddings, agentes. Infraestrutura: Linux, Docker, Vercel, Render, n8n, filas e webhooks, Prometheus & Grafana.',
    sourceUrl: `${SITE}/solutions`,
    tags: ['tecnologias', 'stack', 'linguagens', 'frameworks', 'ferramentas', 'ia'],
  },

  // ── Team ───────────────────────────────────────────────────────────────
  {
    category: 'team',
    title: 'Equipa de engenharia',
    content:
      'A Código Binário conta com três engenheiros dedicados: Elisio Nascimento (BD Developer — foco em Backend, Bases de Dados e APIs), Mendes Bessa (AI & Systems Developer — foco em AI Engineering, Automação e Infraestrutura) e Mbumba Guilherme (Frontend Developer — foco em Frontend, UX e Design Systems). O diagnóstico técnico é conduzido pelo "Core Architecture Group".',
    sourceUrl: `${SITE}/developers`,
    tags: ['equipa', 'equipe', 'engenheiros', 'developers', 'quem constroi', 'squad'],
  },

  // ── Commercial boundaries ──────────────────────────────────────────────
  {
    category: 'pricing',
    title: 'Preços: o que é (e não é) divulgado',
    content:
      'A Código Binário não publica tabelas de preços nem orçamentos para projetos: o investimento depende do diagnóstico e é formalizado em documento próprio. O único valor definido é o custo da visita técnica presencial: 25.000 Kz, aplicável apenas quando o diagnóstico conclui que é genuinamente necessária uma deslocação ao local — nunca é aplicado por defeito. Nunca devem ser prometidos preços, descontos, prazos ou garantias de custo para um projeto.',
    sourceUrl: `${SITE}/diagnostic`,
    tags: ['preco', 'precos', 'custo', 'custos', 'orcamento', 'quanto custa', 'visita', 'valor'],
  },
  {
    category: 'policy',
    title: 'Confidencialidade e dados de clientes',
    content:
      'A Código Binário não divulga dados, nomes, métricas ou resultados de clientes. Os sistemas construídos para clientes estão sob NDA e são apresentados apenas como tipo de sistema (problema, solução, stack), sem resultados inventados. O conteúdo das conversas de diagnóstico é armazenado de forma segura em Supabase/PostgreSQL e o acesso administrativo é restrito por chave.',
    sourceUrl: `${SITE}/projects`,
    tags: ['clientes', 'confidencialidade', 'nda', 'privacidade', 'dados', 'portfolio'],
  },
  {
    category: 'policy',
    title: 'Garantias e uso do diagnóstico',
    content:
      'O serviço é fornecido "no estado em que se encontra". A Código Binário não garante que a análise gerada automaticamente esteja livre de imprecisões, pelo que decisões relevantes devem passar pela validação da equipa técnica. Não são oferecidas garantias comerciais nem promessas de resultado.',
    sourceUrl: `${SITE}/termos`,
    tags: ['garantia', 'garantias', 'termos', 'responsabilidade', 'risco'],
  },

  // ── Contact ────────────────────────────────────────────────────────────
  {
    category: 'contact',
    title: 'Contacto oficial',
    content:
      'O contacto oficial é o email contacto@codigobinario.it.ao — canal de engenharia e também de privacidade, esclarecimentos e pedidos sobre dados. O caminho mais direto para iniciar uma conversa técnica é fazer o diagnóstico em /diagnostic.',
    sourceUrl: `${SITE}/privacidade`,
    tags: ['contacto', 'contato', 'email', 'e-mail', 'falar com a equipa'],
  },
  {
    category: 'contact',
    title: 'O que a Código Binário NÃO publica',
    content:
      `A Código Binário não publica nem divulga: morada física, número de telefone, horário de atendimento nem redes sociais. Só existe o contacto por email (${CONTACT}). Qualquer morada, telefone ou horário apresentado como sendo da Código Binário seria inventado.`,
    sourceUrl: SITE,
    tags: ['contacto', 'telefone', 'morada', 'endereco', 'horario', 'localizacao'],
  },
];

/** Stable hash over the fields a client would actually read. */
export function contentHash(entry: SeedEntry): string {
  return createHash('sha256')
    .update(`${entry.category}|${normalize(entry.title)}|${normalize(entry.content)}`)
    .digest('hex');
}
