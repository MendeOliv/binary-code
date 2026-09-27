/**
 * Company Knowledge — PURE contract & logic.
 *
 * This module has ZERO imports on purpose: no database, no network, no env.
 * That keeps the router and the prompt formatting unit-testable in isolation
 * (the retrieval I/O lives in services/knowledge-base.ts).
 */

/** A semantically-retrieved company knowledge chunk (company_knowledge row). */
export interface CompanyKnowledgeMatch {
  id: string;
  category: string;
  title: string;
  content: string;
  sourceUrl: string | null;
  tags: string[];
  similarity: number;
}

/** Why retrieval did or did not produce context. Logged, never sent to the client. */
export type KnowledgeReason =
  | 'not_company_question'
  | 'no_matches'
  | 'embedding_failed'
  | 'disabled'
  | 'ok'
  | 'cached';

export interface KnowledgeContextResult {
  /** Formatted block to append to the prompt; '' when nothing was retrieved. */
  context: string;
  /** Retrieved chunks, for observability/logging. */
  matches: CompanyKnowledgeMatch[];
  reason: KnowledgeReason;
  query: string;
}

/** Must match company_knowledge.embedding VECTOR(1536) and the RPC signature. */
export const EMBEDDING_DIMENSION = 1536;

/** Similarity floor for a chunk to be considered relevant. */
export const DEFAULT_MATCH_THRESHOLD = 0.3;

/** How many chunks to inject into the prompt. */
export const DEFAULT_MATCH_COUNT = 4;

/**
 * Normalizes text for matching: lowercase, strip accents, drop punctuation,
 * collapse whitespace. Deterministic and dependency-free (no locale surprises).
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Company-directed question patterns.
 *
 * Every pattern is intentionally anchored on an explicit reference to the
 * company ("vocês", "a vossa", the brand) or on a question whose object can
 * only be Código Binário. This is what keeps the diagnostic interview clean:
 * a client describing their OWN process, data, systems or team must NOT trigger
 * company-knowledge retrieval.
 */
const COMPANY_QUESTION_PATTERNS: RegExp[] = [
  // Brand / product references — always about us.
  /\bcodigo\s*binario\b/,
  /\bbinary\s*diagnostic\b/,

  // "about you" interrogatives
  /\bquem\s+(e|sao)\s+(voces|vcs|a\s+vossa|o\s+codigo|essa\s+empresa|esta\s+empresa|a\s+empresa)\b/,
  /\bquem\s+esta\s+(por\s+tras|atras)\b/,
  /\bsobre\s+(voces|vcs|a\s+vossa\s+empresa|a\s+empresa|o\s+codigo)\b/,
  /\bfalem\s+(me\s+)?(sobre|mais)\s+(voces|vcs|a\s+vossa)\b/,

  // what the company does / offers
  /\bo\s+que\s+(e\s+que\s+)?(voces|vcs)\s+(fazem|oferecem|constroem|faz|oferece|constroi|vendem|entregam)\b/,
  /\bquais?\s+(sao\s+)?(os\s+|as\s+)?(vossos?|vossas?)\s+\w+/,
  /\b(vossos?|vossas?)\s+(servicos?|solucoes?|produtos?|areas?|pilares?|capacidades?|especialidades?|tecnologias?|equipa|equipe|precos?|custos?|projetos?|clientes?|casos?)\b/,
  /\ba\s+vossa\s+(empresa|equipa|equipe|atuacao|experiencia|metodologia|abordagem|stack|oferta)\b/,
  /\b(voces|vcs)\s+(fazem|oferecem|constroem|trabalham|atuam|entregam|desenvolvem|vendem|cobram|aceitam)\b/,

  // services / capabilities enquiries
  /\bo\s+que\s+(voces|vcs)\s+pode(m)?\s+(fazer|construir|desenvolver|ajudar)\b/,
  /\b(conseguem|podem|sabem)\s+(fazer|construir|desenvolver|implementar|integrar)\b/,
  /\bquais?\s+(servicos?|solucoes?|areas?|pilares?|capacidades?|especialidades?)\b/,
  /\bque\s+(servicos?|solucoes?|areas?|pilares?)\s+(oferecem|tem|prestam)\b/,
  /\bareas?\s+de\s+(atuacao|engenharia|trabalho)\b/,

  // method / process of the COMPANY (not the client's process)
  /\b(metodologia|metodo\s+de\s+trabalho|como\s+(voces|vcs)\s+trabalham|fases\s+de\s+entrega|ciclo\s+de\s+entrega)\b/,
  /\bcomo\s+(funciona|funcionam)\s+(o\s+)?(processo|diagnostico|servico|trabalho\s+de\s+voces)\b/,

  // commercial boundaries / pricing
  /\bquanto\s+(custa|cobram|e\s+que\s+custa)\b/,
  /\b(precos?|custos?|orcamento|tabela\s+de\s+precos|valor\s+da\s+visita|visita\s+tecnica)\b/,

  // team
  /\b(quem\s+(constroi|desenvolve|esta\s+por\s+tras)|vossa\s+equipa|vossa\s+equipe|quantos\s+(engenheiros|developers|devs))\b/,
  /\b(engenheiros?|developers?|devs)\s+(da|do)\s+(codigo|equipa)\b/,

  // technology / stack of the company
  /\bque\s+(tecnologias?|linguagens?|frameworks?|ferramentas?|stack)\s+(usam|utilizam|dominam|trabalham)\b/,
  /\b(vossa|sua)\s+stack\b/,
  /\busam\s+(ia|inteligencia\s+artificial|rag|llm|gpt|gemini)\b/,

  // portfolio / trust / legal
  /\b(portfolio|casos?\s+de\s+sucesso|projetos?\s+realizados?|experiencia\s+de\s+voces|clientes?\s+de\s+voces)\b/,
  /\b(garantias?|confidencialidade|nda|termos\s+de\s+uso|politica\s+de\s+privacidade|protecao\s+de\s+dados)\b/,

  // contact
  /\b(contacto|contato|email|e mail|telefone|morada|endereco|localizacao|onde\s+(ficam|estao|se\s+localizam)|horario\s+de\s+atendimento)\b/,
];

/**
 * Deterministic router: should this message trigger company-knowledge retrieval?
 *
 * Conservative by design — a false negative only means the model answers
 * without stored knowledge, while a false positive would inject marketing
 * context into a client's technical interview.
 */
export function shouldSearchKnowledge(message: string): boolean {
  if (!message || message.trim().length < 3) return false;
  const normalized = normalize(message);
  return COMPANY_QUESTION_PATTERNS.some((re) => re.test(normalized));
}

/**
 * Formats retrieved chunks into the prompt block. Kept compact (the context
 * window is shared with the conversation) and explicitly sourced.
 */
export function formatKnowledgeContext(matches: CompanyKnowledgeMatch[]): string {
  if (matches.length === 0) return '';
  const blocks = matches.map((m) => {
    const source = m.sourceUrl ? `\n(fonte: ${m.sourceUrl})` : '';
    return `[${m.category}] ${m.title}\n${m.content}${source}`;
  });
  return `<company_knowledge>\nFACTOS VERIFICADOS SOBRE A CÓDIGO BINÁRIO (fonte interna oficial):\n\n${blocks.join('\n\n')}\n</company_knowledge>`;
}
