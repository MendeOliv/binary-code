import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSessionSecret,
  hashSessionSecret,
  verifySessionSecret,
} from '../src/lib/session-secret';

// ── CB-SEC-C: session ownership secret ────────────────────────────────────

test('generateSessionSecret — high entropy, unique, URL-safe', () => {
  const a = generateSessionSecret();
  const b = generateSessionSecret();
  assert.notEqual(a, b, 'two secrets must differ');
  assert.ok(a.length >= 40, 'at least ~256 bits of base64url entropy');
  assert.match(a, /^[A-Za-z0-9_-]+$/, 'URL-safe charset (no padding)');
  // Reject the degenerate outcomes a weak generator could produce.
  assert.throws(() => assert.equal(a, ''));
});

test('hashSessionSecret — deterministic SHA-256 hex, never the raw value', () => {
  const secret = generateSessionSecret();
  const h1 = hashSessionSecret(secret);
  const h2 = hashSessionSecret(secret);
  assert.equal(h1, h2, 'deterministic');
  assert.match(h1, /^[0-9a-f]{64}$/, 'lowercase hex digest');
  assert.ok(!h1.includes(secret), 'the hash must not contain the secret');
  assert.notEqual(h1, secret);
});

test('verifySessionSecret — correct secret passes', () => {
  const secret = generateSessionSecret();
  const stored = hashSessionSecret(secret);
  assert.equal(verifySessionSecret(secret, stored), true);
});

test('verifySessionSecret — wrong / missing / legacy all fail closed', () => {
  const secret = generateSessionSecret();
  const stored = hashSessionSecret(secret);

  assert.equal(verifySessionSecret('wrong-secret', stored), false, 'wrong secret denied');
  assert.equal(verifySessionSecret('', stored), false, 'empty secret denied');
  assert.equal(verifySessionSecret(undefined, stored), false, 'absent secret denied');
  assert.equal(verifySessionSecret(null, stored), false, 'null secret denied');
  assert.equal(verifySessionSecret(secret, null), false, 'legacy session (no stored hash) denied');
  assert.equal(verifySessionSecret(secret, ''), false, 'blank stored hash denied');
  assert.equal(verifySessionSecret(secret, 'not-hex'), false, 'malformed stored hash denied');
});

test('verifySessionSecret — a valid UUID-shaped value is not a secret', () => {
  // Knowing a sessionId (a UUID) must never be sufficient: treating it as the
  // secret must fail against a real stored hash.
  const secret = generateSessionSecret();
  const stored = hashSessionSecret(secret);
  const uuid = 'a2c1e6b8-9d4f-4f1a-9c0e-6b7a8f9d1e2a';
  assert.equal(verifySessionSecret(uuid, stored), false);
});
