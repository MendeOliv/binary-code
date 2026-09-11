/**
 * Official Código Binário team roster.
 *
 * Photos live in apps/web/public/images/developers/ (real photographs, committed).
 * Social links include ONLY the channels provided by each developer — nothing invented.
 */

export interface Developer {
  slug: string;
  name: string;
  role: string; // Cargo oficial
  credential: string; // "Engenheiro Informático"
  shortRole: string; // Card label
  shortBio: string;
  bio: string;
  focusTags: string[]; // Card footer tags
  photo: string; // /images/developers/... (real photo)
  photoAlt: string;
  node: string; // Node identifier used across 2.1 pages
  cluster: string;
  systemsRole: string;
  metadata: { label: string; value: string; note: string }[];
  domains: { icon: string; title: string; description: string; focus: string }[];
  stacks: { icon: string; title: string; note: string }[];
  socials: { label: string; href: string; icon: string }[];
  cta: string; // Perfil CTA copy
  areas: string[];
}

export const developers: Developer[] = [
  {
    slug: 'elisio-nascimento',
    name: 'Elisio Nascimento',
    role: 'BD Developer',
    credential: 'Engenheiro Informático',
    shortRole: 'BD Developer · Engenharia de Backend',
    shortBio:
      'Especialista em bases de dados, APIs e backend de alta concorrência para operações críticas.',
    bio: 'Especialista na construção de infraestruturas resilientes, modelagem de bases de dados de alta concorrência e serviços de backend de alta eficiência para suportar operações corporativas críticas e contínuas.',
    focusTags: ['Backend', 'Bases de Dados', 'APIs'],
    photo: '/images/developers/elisio-nascimento.jpeg',
    photoAlt: 'Elisio Nascimento — BD Developer e Engenheiro Informático na Código Binário',
    node: 'CB-DEV-01',
    cluster: 'BACKEND & DATABASE RESILIENCE',
    systemsRole: 'CORE ARCHITECT // DATABASE & RUNTIME',
    metadata: [
      { label: '// NODE IDENTIFIER', value: 'CB-DEV-01', note: 'Core Database Routing Engine' },
      { label: '// FORMAÇÃO ACADÊMICA', value: 'Engenharia Informática', note: 'Fundamentos algorítmicos e sistemas concorrentes' },
      { label: '// FOCO PRINCIPAL', value: 'Data Modeling & APIs', note: 'Arquitetura de backend tolerante a falhas' },
      { label: '// ATUAÇÃO NA EQUIPE', value: 'BD Developer', note: 'Backend, bases de dados e integrações' },
    ],
    domains: [
      {
        icon: 'dns',
        title: 'Backend & Microsserviços',
        description:
          'Arquitetura modular de serviços desacoplados para sustentação de regras de negócio complexas com comunicação assíncrona orientada a eventos.',
        focus: '// FOCUS: ISOLATION & SCALE',
      },
      {
        icon: 'table_chart',
        title: 'Bases de Dados Relacionais & NoSQL',
        description:
          'Modelagem relacional estrita, PostgreSQL avançado, Redis e estratégias de consistência sob alto volume.',
        focus: '// FOCUS: STRICT DATA MODELING',
      },
      {
        icon: 'memory',
        title: 'Sistemas Concorrentes',
        description:
          'Tratamento de concorrência e thread safety, prevenindo deadlocks e garantindo integridade transacional sob carga massiva.',
        focus: '// FOCUS: THREAD SAFETY',
      },
      {
        icon: 'sync_alt',
        title: 'APIs & Integrações',
        description:
          'Desenvolvimento de endpoints de latência mínima, contratos rígidos e integração confiável entre sistemas.',
        focus: '// FOCUS: LOW-LATENCY PROTOCOLS',
      },
      {
        icon: 'verified_user',
        title: 'Transações ACID & Cache',
        description:
          'Garantia de atomicidade e durabilidade de dados, associada a camadas de cache estrategicamente invalidadas.',
        focus: '// FOCUS: ZERO DATA LOSS POLICIES',
      },
      {
        icon: 'speed',
        title: 'Otimização & Particionamento',
        description:
          'Análise de planos de execução de queries, indexação especializada e particionamento de tabelas.',
        focus: '// FOCUS: QUERY TUNING & SHARDING',
      },
    ],
    stacks: [
      { icon: 'storage', title: 'PostgreSQL', note: 'Relational Modeling · Clustering' },
      { icon: 'terminal', title: 'Node.js Runtime', note: 'High-Concurrency Services' },
      { icon: 'bolt', title: 'Redis & Memory Caching', note: 'Sub-Millisecond KV Store' },
      { icon: 'cable', title: 'RESTful APIs', note: 'HTTP/2 · Contracts' },
      { icon: 'deployed_code', title: 'Docker & Containers', note: 'Multi-Stage Builds' },
      { icon: 'tune', title: 'Linux Tuning', note: 'Kernel & Network Optimization' },
    ],
    socials: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/elisio-nascimento-6a294424a/',
        icon: 'account_circle',
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/elisio_nascimento0/',
        icon: 'photo_camera',
      },
    ],
    cta: 'Precisa de infraestrutura de dados ou backend escalável para sustentar sua aplicação?',
    areas: ['Backend', 'Bases de dados', 'APIs', 'Sistemas', 'Engenharia de software', 'Arquitetura backend'],
  },
  {
    slug: 'mendes-bessa',
    name: 'Mendes Bessa',
    role: 'AI & Systems Developer',
    credential: 'Engenheiro Informático',
    shortRole: 'AI & Systems Developer · Automação',
    shortBio:
      'Focado em agentes inteligentes, automação de workflows e sistemas determinísticos de alta velocidade.',
    bio: 'Engenheiro focado em transformar problemas abstratos em sistemas determinísticos, agentes autônomos e pipelines de alta velocidade e automação integrada. Constrói a ponte entre a inteligência computacional e a infraestrutura corporativa resiliente.',
    focusTags: ['AI Engineering', 'Automação', 'Infraestrutura'],
    photo: '/images/developers/mendes-bessa.jpeg',
    photoAlt: 'Mendes Bessa — AI & Systems Developer e Engenheiro Informático na Código Binário',
    node: 'CB-DEV-02',
    cluster: 'AI & CORE ARCHITECTURE',
    systemsRole: 'SYSTEMS ARCHITECT • SOVEREIGN CORE',
    metadata: [
      { label: '// IDENTIFICADOR DE NÓ', value: 'CB-DEV-02', note: 'Nó Central de Engenharia de Automação' },
      { label: '// FORMAÇÃO ACADÊMICA', value: 'Engenharia Informática', note: 'Foco em computação e algoritmos' },
      { label: '// VETOR ESTRATÉGICO', value: 'AI & Automação', note: 'Pipelines de decisão e agentes inteligentes' },
      { label: '// ATUAÇÃO NA EQUIPE', value: 'AI & Systems Developer', note: 'IA aplicada, sistemas e integrações' },
    ],
    domains: [
      {
        icon: 'neurology',
        title: 'Inteligência Artificial & LLMs',
        description:
          'Arquiteturas RAG, embeddings semânticos, agentes e orquestração de modelos com raciocínio determinístico.',
        focus: '// FOCUS: RAG · AGENTS',
      },
      {
        icon: 'account_tree',
        title: 'Automação de Workflows Complexos',
        description:
          'Integração extensiva via n8n, mensageria, webhooks assíncronos e pontes resilientes com sistemas legados.',
        focus: '// FOCUS: n8n · WEBHOOKS',
      },
      {
        icon: 'terminal',
        title: 'Software Engineering de Precisão',
        description:
          'Construção em Python, C++ e MQL5 — backends de baixa latência e tratamento estrito de dados operacionais.',
        focus: '// FOCUS: PYTHON · C++ · MQL5',
      },
      {
        icon: 'dns',
        title: 'Infraestrutura & Linux',
        description:
          'Implantação e gestão de ambientes Linux, conteinerização com Docker e orquestração de serviços de inferência.',
        focus: '// FOCUS: DOCKER · LINUX',
      },
      {
        icon: 'psychology_alt',
        title: 'Prompt Engineering & Cognição',
        description:
          'Design estruturado de prompts de sistema com esquemas restritivos, prevenção de alucinações e encadeamento lógico.',
        focus: '// FOCUS: STRUCTURED OUTPUT',
      },
      {
        icon: 'rocket_launch',
        title: 'Produtos Digitais & MVPs',
        description:
          'Prototipação rápida de sistemas de alto impacto e transformação de teses técnicas em plataformas funcionais.',
        focus: '// FOCUS: RAPID PROTOTYPING',
      },
    ],
    stacks: [
      { icon: 'code_blocks', title: 'Python Engine', note: 'FastAPI, LangChain, Pydantic, AsyncIO' },
      { icon: 'precision_manufacturing', title: 'C++ & MQL5', note: 'Sistemas algorítmicos e execução determinística' },
      { icon: 'sync_alt', title: 'n8n & Workflows', note: 'Automações autônomas e pipelines multietapa' },
      { icon: 'smart_toy', title: 'LLMs & SLMs', note: 'Gemini, Llama, Mistral e inferência local' },
      { icon: 'deployed_code', title: 'Docker & Linux', note: 'Orquestração de containers e CI/CD' },
      { icon: 'api', title: 'APIs & Integrações', note: 'Webhooks, mensageria e pontes legadas' },
    ],
    socials: [
      { label: 'GitHub', href: 'https://github.com/MendeOliv', icon: 'code' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/f%C3%A1bio-bessa-de-oliveira-aa8956388/',
        icon: 'badge',
      },
      { label: 'Instagram', href: 'https://www.instagram.com/oliver_fbo7/', icon: 'alternate_email' },
    ],
    cta: 'Deseja discutir a viabilidade de IA e automação para o seu projeto diretamente com Mendes Bessa?',
    areas: [
      'AI Engineering',
      'Inteligência Artificial',
      'Sistemas inteligentes',
      'Automação',
      'Software engineering',
      'Python',
      'C++',
      'MQL5',
      'APIs',
      'Integrações',
      'n8n',
      'Linux',
      'Docker',
      'Infraestrutura',
      'Arquitetura de sistemas',
      'Prompt engineering',
      'Produtos digitais',
    ],
  },
  {
    slug: 'mbumba-guilherme',
    name: 'Mbumba Guilherme',
    role: 'Frontend Developer',
    credential: 'Engenheiro Informático',
    shortRole: 'Frontend Developer · Interfaces Web',
    shortBio:
      'Engenheiro focado em interfaces precisas, acessíveis e orientadas a desempenho.',
    bio: 'Engenheiro focado na materialização de interfaces precisas, acessíveis e orientadas a desempenho, traduzindo regras de negócio complexas e telemetria de sistemas em produtos digitais de uso intuitivo e imediato.',
    focusTags: ['Frontend', 'UX', 'Design Systems'],
    photo: '/images/developers/mbumba-guilherme.jpeg',
    photoAlt: 'Mbumba Guilherme — Frontend Developer e Engenheiro Informático na Código Binário',
    node: 'CB-DEV-03',
    cluster: 'FRONTEND & UX INTERFACES',
    systemsRole: 'CORE FRONTEND ENGINEER',
    metadata: [
      { label: '// NODE IDENTIFIER', value: 'CB-DEV-03', note: 'Registro Primário de Nó de Engenharia' },
      { label: '// FORMAÇÃO ACADÊMICA', value: 'Engenharia Informática', note: 'Base analítica em computação distribuída' },
      { label: '// FOCO PRINCIPAL', value: 'Interfaces & UX', note: 'Integração frontend/backend e produtos digitais' },
      { label: '// ATUAÇÃO NA EQUIPE', value: 'Frontend Developer', note: 'Interfaces web e sistemas web' },
    ],
    domains: [
      {
        icon: 'web',
        title: 'Interfaces Web de Precisão',
        description:
          'Construção de interfaces corporativas com foco em clareza, consistência visual e fidelidade ao design system.',
        focus: '// FOCUS: PIXEL-PRECISE UI',
      },
      {
        icon: 'accessibility_new',
        title: 'UX & Acessibilidade',
        description:
          'Experiências navegáveis por teclado, com contraste calibrado, hierarquia clara e semântica correta.',
        focus: '// FOCUS: A11Y & SEMANTICS',
      },
      {
        icon: 'speed',
        title: 'Performance de Frontend',
        description:
          'Otimização de carregamento, imagens responsivas e redução de JavaScript desnecessário em cada página.',
        focus: '// FOCUS: CORE WEB VITALS',
      },
      {
        icon: 'sync_alt',
        title: 'Integração Frontend/Backend',
        description:
          'Consumo resiliente de APIs, estados de carregamento e sincronização de dados em tempo real.',
        focus: '// FOCUS: API-FIRST UI',
      },
      {
        icon: 'layers',
        title: 'Sistemas Web & Produtos Digitais',
        description:
          'Plataformas web completas, ferramentas internas e produtos digitais de ponta a ponta.',
        focus: '// FOCUS: END-TO-END PRODUCT',
      },
      {
        icon: 'design_services',
        title: 'Design Systems',
        description:
          'Componentização reutilizável e documentação visual que mantém o produto coeso à medida que escala.',
        focus: '// FOCUS: COMPONENT LIBRARIES',
      },
    ],
    stacks: [
      { icon: 'code', title: 'TypeScript', note: 'Frontend tipado de ponta a ponta' },
      { icon: 'web', title: 'React & Next.js', note: 'Renderização híbrida e rotas' },
      { icon: 'format_paint', title: 'Tailwind CSS', note: 'Design system utilitário' },
      { icon: 'accessibility_new', title: 'A11y & Semântica', note: 'ARIA, foco e teclado' },
      { icon: 'cable', title: 'APIs & Estado', note: 'Consumo resiliente de dados' },
      { icon: 'devices', title: 'Responsive Design', note: 'Mobile, tablet e desktop' },
    ],
    socials: [],
    cta: 'Precisa de uma interface web sólida, acessível e de alta performance para o seu produto?',
    areas: ['Frontend', 'Interfaces web', 'UX', 'Sistemas web', 'Integração frontend/backend', 'Produtos digitais'],
  },
];

export function getDeveloperBySlug(slug: string | undefined): Developer | undefined {
  return developers.find((d) => d.slug === slug);
}
