export type AcademyCategory = 'Trading e mercados' | 'Inteligência artificial' | 'Desenvolvimento e automação';

export interface AcademyCourse {
  id: string;
  title: string;
  category: AcademyCategory;
  description: string;
  eyebrow: string;
  modules: string[];
  pdf: string;
  duration: string;
  modality: string;
  price: string;
}

export const ACADEMY_COURSES: AcademyCourse[] = [
  { id: 'forex-trading', title: 'Forex Trading', category: 'Trading e mercados', eyebrow: 'TRADING MANUAL • MERCADO CAMBIAL', description: 'Aprenda a interpretar o mercado cambial, planear operações e proteger o capital com regras claras.', modules: ['Fundamentos do Forex', 'Leitura de gráficos', 'Plano de operação', 'Gestão de risco e disciplina'], pdf: '/academy-pdfs/CB_Academy_Forex_Trading_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'crypto-trading', title: 'Crypto Trading', category: 'Trading e mercados', eyebrow: 'ATIVOS DIGITAIS • ANÁLISE E GESTÃO DE RISCO', description: 'Compreenda o mercado cripto, analise oportunidades e aprenda a gerir riscos antes de negociar ativos digitais.', modules: ['Fundamentos do mercado cripto', 'Análise técnica', 'Gestão de risco', 'Segurança e custódia', 'Psicologia do trading'], pdf: '/academy-pdfs/CB_Academy_Crypto_Trading_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'engenharia-de-ia', title: 'Engenharia de IA', category: 'Inteligência artificial', eyebrow: 'APLICAÇÕES • MODELOS • INTEGRAÇÃO', description: 'Transforme um problema concreto numa aplicação funcional com inteligência artificial, avaliando opções cloud e locais.', modules: ['Fundamentos aplicados', 'Integração técnica', 'Qualidade e segurança', 'Cloud e execução local', 'Implementação e teste'], pdf: '/academy-pdfs/CB_Academy_Engenharia_de_IA_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'engenharia-de-prompting', title: 'Engenharia de Prompting', category: 'Inteligência artificial', eyebrow: 'INSTRUÇÕES • CONTEXTO • AVALIAÇÃO', description: 'Aprenda a orientar modelos de IA com instruções claras, contexto relevante, critérios de qualidade e testes sistemáticos.', modules: ['Estrutura de um bom prompt', 'Técnicas de orientação', 'Avaliação e iteração', 'Fluxos de trabalho', 'Biblioteca reutilizável'], pdf: '/academy-pdfs/CB_Academy_Engenharia_de_Prompting_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'vibe-coding', title: 'Vibe Coding', category: 'Desenvolvimento e automação', eyebrow: 'DESENVOLVIMENTO ASSISTIDO POR IA', description: 'Use ferramentas de IA para acelerar o desenvolvimento sem abdicar de compreender, testar e manter o código produzido.', modules: ['Definir o produto', 'Desenvolvimento assistido', 'Debugging e testes', 'Versionamento e qualidade', 'Execução e publicação'], pdf: '/academy-pdfs/CB_Academy_Vibe_Coding_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'automacao', title: 'Automação', category: 'Desenvolvimento e automação', eyebrow: 'WORKFLOWS • INTEGRAÇÕES • PROCESSOS', description: 'Conceba e implemente automações que ligam ferramentas e reduzem tarefas manuais de forma controlada.', modules: ['Mapear o processo', 'Construir workflows', 'Integrações', 'Resiliência e monitorização', 'Operação responsável'], pdf: '/academy-pdfs/CB_Academy_Automacao_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'bot-trading', title: 'Bot Trading', category: 'Trading e mercados', eyebrow: 'MQL5 • MT5 • TESTES E RISCO', description: 'Aprenda a transformar regras explícitas de trading num robô, testar o seu comportamento e interpretar os resultados sem confundir backtest com garantia.', modules: ['Regras da estratégia', 'Estrutura MQL5', 'Gestão de risco e execução', 'Backtesting', 'Avaliação'], pdf: '/academy-pdfs/CB_Academy_Bot_Trading_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
  { id: 'sistemas-de-ia', title: 'Sistemas de IA', category: 'Inteligência artificial', eyebrow: 'AGENTES • MEMÓRIA • FERRAMENTAS', description: 'Projete um assistente de IA que coordena ferramentas, usa memória de forma controlada e executa tarefas dentro de limites definidos.', modules: ['Arquitetura do sistema', 'Ferramentas e execução', 'Memória e contexto', 'Segurança e fiabilidade', 'Testes e monitorização'], pdf: '/academy-pdfs/CB_Academy_Sistemas_de_IA_v2.pdf', duration: '1, 3 ou 5 dias', modality: 'Híbrida e individual', price: 'A partir de 10.000 Kz' },
];

export const ACADEMY_CATEGORIES = ['Todas', 'Trading e mercados', 'Inteligência artificial', 'Desenvolvimento e automação'] as const;
