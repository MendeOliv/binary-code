import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SlidingWindowLimiter, resolveMaxRequests } from '../src/lib/rate-limit';

function fakeRequest(ip: string): any {
  return { ip, headers: {}, raw: { url: '/api/discovery/chat', method: 'POST' } };
}

test('rate limiter — allows up to limit then blocks', () => {
  const limiter = new SlidingWindowLimiter(60, 3);
  const req = fakeRequest('10.0.0.1');
  assert.equal(limiter.allow(req), true);
  assert.equal(limiter.allow(req), true);
  assert.equal(limiter.allow(req), true);
  assert.equal(limiter.allow(req), false, '4th request within window blocked');
  assert.equal(limiter.allow(req), false);
});

test('rate limiter — per-IP isolation', () => {
  const limiter = new SlidingWindowLimiter(60, 2);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.2')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.2')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.2')), false, 'second IP blocked after its own limit');
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true, 'first IP still under limit');
});

test('rate limiter — reset allows again', () => {
  const limiter = new SlidingWindowLimiter(60, 1);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), false);
  limiter.reset();
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
});

test('rate limiter — window expiry allows again', () => {
  const limiter = new SlidingWindowLimiter(0.05, 2); // 50ms window
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), false);
  return new Promise((resolve) => {
    setTimeout(() => {
      const next = limiter.allow(fakeRequest('10.0.0.1'));
      assert.equal(next, true, 'after window expiry, request allowed');
      resolve();
    }, 70);
  });
});

test('rate limiter — respects RATE_LIMIT_DISABLED=1', () => {
  process.env.RATE_LIMIT_DISABLED = '1';
  try {
    const limiter = new SlidingWindowLimiter(60, 1);
    assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
    assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true, 'always allowed when disabled');
  } finally {
    delete process.env.RATE_LIMIT_DISABLED;
  }
});

test('rate limiter — invalid/zero/negative RATE_LIMIT_MAX_REQUESTS falls back to the default, never unlimited', () => {
  assert.equal(resolveMaxRequests(undefined), 20, 'unset → default');
  assert.equal(resolveMaxRequests(''), 20, 'empty → default');
  assert.equal(resolveMaxRequests('0'), 20, '0 must disable nothing — it falls back to the default');
  assert.equal(resolveMaxRequests('-5'), 20, 'negative → default, never unlimited');
  assert.equal(resolveMaxRequests('abc'), 20, 'NaN → default');
  assert.equal(resolveMaxRequests('Infinity'), 20, 'Infinity → default');
  assert.equal(resolveMaxRequests('50'), 50, 'valid positive value is honoured');
  assert.equal(resolveMaxRequests('7.9'), 7, 'fractional values are floored to whole requests');

  // Behavioural check through the limiter itself: max=0 must behave like the
  // default (20), NOT like an unlimited limiter.
  const zeroConfigured = new SlidingWindowLimiter(60, resolveMaxRequests('0'));
  for (let i = 0; i < 20; i += 1) {
    assert.equal(zeroConfigured.allow(fakeRequest('10.9.9.9')), true, `request ${i + 1} allowed under default limit`);
  }
  assert.equal(zeroConfigured.allow(fakeRequest('10.9.9.9')), false, 'request 21 blocked — limiter is active, not disabled');
});

test('rate limiter — RATE_LIMIT_DISABLED=1 is ignored in production', () => {
  const prevDisabled = process.env.RATE_LIMIT_DISABLED;
  const prevNodeEnv = process.env.NODE_ENV;
  process.env.RATE_LIMIT_DISABLED = '1';
  process.env.NODE_ENV = 'production';
  try {
    const limiter = new SlidingWindowLimiter(60, 1);
    assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
    assert.equal(
      limiter.allow(fakeRequest('10.0.0.1')),
      false,
      'limiting must stay enforced in production'
    );
  } finally {
    if (prevDisabled === undefined) delete process.env.RATE_LIMIT_DISABLED;
    else process.env.RATE_LIMIT_DISABLED = prevDisabled;
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
  }
});

test('rate limiter — a manually constructed limiter with maxRequests <= 0 fails CLOSED', () => {
  // Fail-safe: an unconfigured/invalid limit must never yield an unlimited
  // limiter. Direct construction bypasses resolveMaxRequests, so the guard in
  // allow() blocks instead of allowing everything.
  const limiter = new SlidingWindowLimiter(60, 0);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), false);
});