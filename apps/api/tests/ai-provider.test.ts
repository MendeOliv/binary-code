import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AIProviderService,
  classifyAIError,
  AIServiceError,
} from '../src/services/ai-provider';

const provider = new AIProviderService();

test('buildFallbackChain — canonical order Gemini → Groq → NVIDIA → Anthropic → OpenAI', () => {
  const previousPrimary = process.env.PRIMARY_PROVIDER;
  const previousFallback = process.env.FALLBACK_PROVIDER;
  delete process.env.PRIMARY_PROVIDER;
  delete process.env.FALLBACK_PROVIDER;

  try {
    const chain = provider.buildFallbackChain();
    assert.deepEqual(chain, ['gemini', 'groq', 'nvidia', 'anthropic', 'openai']);
  } finally {
    if (previousPrimary) process.env.PRIMARY_PROVIDER = previousPrimary;
    else delete process.env.PRIMARY_PROVIDER;
    if (previousFallback) process.env.FALLBACK_PROVIDER = previousFallback;
    else delete process.env.FALLBACK_PROVIDER;
  }
});

test('buildFallbackChain — dedupes primary when already in canonical order', () => {
  const previous = process.env.PRIMARY_PROVIDER;
  process.env.PRIMARY_PROVIDER = 'gemini';
  try {
    const chain = provider.buildFallbackChain();
    assert.equal(chain[0], 'gemini');
    // Ensure no duplicates.
    assert.equal(new Set(chain).size, chain.length);
  } finally {
    if (previous) process.env.PRIMARY_PROVIDER = previous;
    else delete process.env.PRIMARY_PROVIDER;
  }
});

test('buildFallbackChain — excludeProviders removes providers for JSON retry', () => {
  process.env.FALLBACK_PROVIDER = 'groq';
  try {
    const chain = provider.buildFallbackChain(['gemini']);
    assert.ok(!chain.includes('gemini'));
    assert.equal(chain[0], 'groq');
  } finally {
    delete process.env.FALLBACK_PROVIDER;
  }
});

test('classifyAIError — distinguishes timeout / rate limit / auth / 404', () => {
  assert.equal(
    classifyAIError({ name: 'TimeoutError', message: 'timeout' }, 'gemini').type,
    'timeout'
  );
  assert.equal(classifyAIError({ status: 429, message: 'rate limit' }, 'groq').type, 'rate_limit');
  assert.equal(classifyAIError({ status: 401, message: 'invalid api key' }, 'nvidia').type, 'auth_error');
  assert.equal(classifyAIError({ status: 404, message: 'model not found' }, 'anthropic').type, 'unavailable');
  assert.equal(classifyAIError({ status: 502 }, 'openai').type, 'unavailable');
  assert.equal(classifyAIError({ code: 'ECONNREFUSED' }, 'gemini').type, 'unavailable');
});

test('classifyAIError — preserves an already-classified AIServiceError', () => {
  const err = new AIServiceError('rate_limit', 'x');
  assert.equal(classifyAIError(err, 'gemini').type, 'rate_limit');
});

test('getLastProviderUsed — null before any call', () => {
  assert.equal(provider.getLastProviderUsed(), null);
});