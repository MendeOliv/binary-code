import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  shouldSearchKnowledge,
  normalize,
  formatKnowledgeContext,
  EMBEDDING_DIMENSION,
  type CompanyKnowledgeMatch,
} from '../src/lib/company-knowledge';
import { buildDiscoverySystemPrompt, buildDiscoveryUserPrompt } from '../src/services/prompts';
import { COMPANY_KNOWLEDGE_SEED, contentHash } from '../src/services/company-knowledge-seed';

// ── Router: must FIRE on company-directed questions ───────────────────────

test('router fires on the required company questions', () => {
  const mustMatch = [
    'Quem é o Código Binário?',
    'quem são vocês?',
    'O que vocês fazem?',
    'O que é que vocês oferecem?',
    'Quais são os vossos serviços?',
    'Quais áreas de atuação têm?',
    'Quanto custa?',
    'Qual é a vossa stack?',
    'Como funciona o processo de vocês?',
    'Quem constrói os sistemas?',
    'Podem fazer integrações com o nosso ERP?',
    'Têm casos de sucesso?',
    'Qual é o vosso email de contacto?',
    'Onde estão localizados?',
    'Falam sobre vocês',
    'que garantias oferecem?',
    'Usam IA nos projectos?',
  ];
  for (const message of mustMatch) {
    assert.equal(shouldSearchKnowledge(message), true, `expected MATCH for: ${message}`);
  }
});

test('router stays silent on diagnostics about the CLIENT (no false positives)', () => {
  const mustNotMatch = [
    'Preciso de automatizar o processo de vendas da minha empresa',
    'Temos um sistema legado que cai todos os dias',
    'Os nossos dados estão espalhados por várias planilhas',
    'Quero usar IA para analisar os relatórios internos',
    'A equipa de contabilidade perde muito tempo a conciliar faturas',
    'Trabalhamos com 40 funcionários e o ERP está desatualizado',
    'Perdemos clientes por demora na resposta',
    'O nosso processo de aprovação é manual e lento',
    'Preciso de um sistema de gestão de stock',
    'A nossa equipa comercial usa Excel',
  ];
  for (const message of mustNotMatch) {
    assert.equal(shouldSearchKnowledge(message), false, `expected NO MATCH for: ${message}`);
  }
});

test('router ignores empty / degenerate input', () => {
  assert.equal(shouldSearchKnowledge(''), false);
  assert.equal(shouldSearchKnowledge('   '), false);
  assert.equal(shouldSearchKnowledge('oi'), false);
});

// ── Normalization ────────────────────────────────────────────────────────

test('normalize strips accents, punctuation and collapses whitespace', () => {
  assert.equal(normalize('Quem é a Código Binário?!'), 'quem e a codigo binario');
  assert.equal(normalize('  Serviços   &   Soluções '), 'servicos solucoes');
  assert.equal(normalize('CONTACTO: eng@codigobinario.it.ao'), 'contacto eng codigobinario it ao');
});

// ── Context formatting ───────────────────────────────────────────────────

const sampleMatches: CompanyKnowledgeMatch[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    category: 'identity',
    title: 'O que é a Código Binário',
    content: 'Empresa de engenharia.',
    sourceUrl: 'https://codigobinario.it.ao',
    tags: ['empresa'],
    similarity: 0.82,
  },
];

test('formatKnowledgeContext fences the block and cites sources', () => {
  const context = formatKnowledgeContext(sampleMatches);
  assert.ok(context.includes('<company_knowledge>'));
  assert.ok(context.includes('</company_knowledge>'));
  assert.ok(context.includes('O que é a Código Binário'));
  assert.ok(context.includes('(fonte: https://codigobinario.it.ao)'));
});

test('formatKnowledgeContext returns empty string when nothing was retrieved', () => {
  assert.equal(formatKnowledgeContext([]), '');
});

// ── Prompt integration ───────────────────────────────────────────────────

test('interview system prompt carries the permanent knowledge rule; diagnosis prompt does not', () => {
  const system = buildDiscoverySystemPrompt();
  assert.ok(system.includes('CONHECIMENTO SOBRE A CÓDIGO BINÁRIO'));
  assert.ok(system.includes('NUNCA inventes'));
  // The original diagnostic consultant instructions must survive.
  assert.ok(system.includes('diagnostic consultant'));
});

test('buildDiscoveryUserPrompt omits the knowledge block by default (backwards compatible)', () => {
  const prompt = buildDiscoveryUserPrompt('Preciso de automatizar vendas', [], {});
  assert.ok(!prompt.includes('<company_knowledge>'));
});

test('buildDiscoveryUserPrompt includes the knowledge block when supplied', () => {
  const knowledge = formatKnowledgeContext(sampleMatches);
  const prompt = buildDiscoveryUserPrompt('Quem são vocês?', [], {}, knowledge);
  assert.ok(prompt.includes('<company_knowledge>'));
  // It must land BEFORE the client message so it reads as reference data.
  assert.ok(prompt.indexOf('<company_knowledge>') < prompt.indexOf('CLIENTE ACABA DE DIZER'));
});

// ── Seed data integrity (guards §18: never invent facts) ─────────────────

test('seed entries are well-formed and uniquely hashed', () => {
  assert.ok(COMPANY_KNOWLEDGE_SEED.length >= 15, 'expected a substantive knowledge base');

  const hashes = new Set<string>();
  for (const entry of COMPANY_KNOWLEDGE_SEED) {
    assert.ok(entry.category.length > 0, 'category required');
    assert.ok(entry.title.length > 0, 'title required');
    assert.ok(entry.content.length >= 60, `content too short for "${entry.title}"`);
    assert.ok(entry.sourceUrl.startsWith('https://codigobinario.it.ao'), `bad source for "${entry.title}"`);
    assert.ok(Array.isArray(entry.tags));
    hashes.add(contentHash(entry));
  }
  assert.equal(hashes.size, COMPANY_KNOWLEDGE_SEED.length, 'duplicate entries detected');
});

test('seed never publishes an address, phone or WhatsApp number', () => {
  // The company publishes none of these; any entry asserting one would be an
  // invented fact. The dedicated "what we do NOT publish" entry is allowed to
  // name them as absent.
  const forbidden = /\b(\+\d{2,}|rua\b|avenida\b|bairro\b|\bwhatsapp\s*[:=]?\s*\+?\d)/i;
  for (const entry of COMPANY_KNOWLEDGE_SEED) {
    if (entry.title.includes('NÃO publica')) continue;
    assert.ok(!forbidden.test(entry.content), `possible invented contact detail in "${entry.title}"`);
  }
});

test('seed never references the retired address or the retired .io domain', () => {
  // contacto@codigobinario.it.ao replaced eng@ (verified Resend sender), and
  // codigobinario.io is retired. A stale fact here would be served by the RAG
  // layer as if it were current.
  for (const entry of COMPANY_KNOWLEDGE_SEED) {
    // The entry that DOCUMENTS the retirement is allowed to name the old domain;
    // nothing else may.
    const documentsRetirement = entry.title.includes('domínio oficial');
    assert.ok(!entry.content.includes('eng@codigobinario'), `retired address in "${entry.title}"`);
    assert.ok(!entry.sourceUrl.includes('codigobinario.io'), `retired .io source in "${entry.title}"`);
    if (!documentsRetirement) {
      assert.ok(!entry.content.includes('codigobinario.io'), `retired .io domain in "${entry.title}"`);
    }
  }
});

test('the official contact address is the one published on the site', () => {
  const contactEntry = COMPANY_KNOWLEDGE_SEED.find((e) => e.title === 'Contacto oficial');
  assert.ok(contactEntry, 'expected a "Contacto oficial" entry');
  assert.ok(contactEntry!.content.includes('contacto@codigobinario.it.ao'));
});

test('embedding dimension matches the schema and the RPC signature', () => {
  assert.equal(EMBEDDING_DIMENSION, 1536);
});
