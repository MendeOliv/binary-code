import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEV_WEB_ORIGINS, OFFICIAL_WEB_ORIGINS, resolveAllowedOrigins } from '../src/lib/cors';

test('CORS — production defaults to the official origin only', () => {
  const origins = resolveAllowedOrigins({ NODE_ENV: 'production' } as NodeJS.ProcessEnv);
  assert.deepEqual(origins, ['https://codigobinario.it.ao']);
  assert.equal(origins.includes('*'), false, 'never a wildcard');
  assert.equal(origins.some((o) => o.includes('localhost')), false, 'never localhost in production');
});

test('CORS — development defaults to the local dev servers', () => {
  const origins = resolveAllowedOrigins({ NODE_ENV: 'development' } as NodeJS.ProcessEnv);
  assert.deepEqual(origins, DEV_WEB_ORIGINS);
});

test('CORS — explicit CORS_ORIGINS wins and is trimmed', () => {
  const origins = resolveAllowedOrigins({
    NODE_ENV: 'production',
    CORS_ORIGINS: ' https://codigobinario.it.ao , https://staging.example.com ',
  } as NodeJS.ProcessEnv);
  assert.deepEqual(origins, ['https://codigobinario.it.ao', 'https://staging.example.com']);
});

test('CORS — a wildcard is never honoured (falls back to env defaults)', () => {
  const prod = resolveAllowedOrigins({ NODE_ENV: 'production', CORS_ORIGINS: '*' } as NodeJS.ProcessEnv);
  assert.deepEqual(prod, OFFICIAL_WEB_ORIGINS);

  const dev = resolveAllowedOrigins({ NODE_ENV: 'development', CORS_ORIGINS: '*' } as NodeJS.ProcessEnv);
  assert.deepEqual(dev, DEV_WEB_ORIGINS);
});

test('CORS — wildcard mixed with real origins keeps only the real origins', () => {
  const origins = resolveAllowedOrigins({
    NODE_ENV: 'production',
    CORS_ORIGINS: '*,https://codigobinario.it.ao',
  } as NodeJS.ProcessEnv);
  assert.deepEqual(origins, ['https://codigobinario.it.ao']);
});

test('CORS — empty/blank CORS_ORIGINS falls back to env defaults', () => {
  assert.deepEqual(
    resolveAllowedOrigins({ NODE_ENV: 'production', CORS_ORIGINS: ' , ' } as NodeJS.ProcessEnv),
    OFFICIAL_WEB_ORIGINS
  );
});
