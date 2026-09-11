import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SlidingWindowLimiter } from '../src/lib/rate-limit';

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

test('rate limiter — maxRequests <= 0 disables limiting', () => {
  const limiter = new SlidingWindowLimiter(60, 0);
  assert.equal(limiter.allow(fakeRequest('10.0.0.1')), true);
});