import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DiscoveryOrchestrator } from '../src/services/discovery-orchestrator';

// ── CB-SEC-E: cost-abuse bounds on the provider context ───────────────────

const orchestrator = new DiscoveryOrchestrator();

function msg(i: number, size = 10) {
  return { role: i % 2 === 0 ? 'user' : 'assistant', content: 'x'.repeat(size) };
}

test('boundHistory — caps the number of messages sent to the provider', () => {
  const history = Array.from({ length: 100 }, (_, i) => msg(i));
  const bounded = orchestrator.boundHistory(history);
  assert.ok(bounded.length <= 20, `expected <=20 messages, got ${bounded.length}`);
  // Keeps the MOST RECENT messages, in chronological order.
  assert.deepEqual(bounded, history.slice(-20));
});

test('boundHistory — caps total characters regardless of message count', () => {
  // 20 messages x 2000 chars = 40000 chars, well over the 12000 budget.
  const history = Array.from({ length: 20 }, (_, i) => msg(i, 2000));
  const bounded = orchestrator.boundHistory(history);
  const total = bounded.reduce((n, m) => n + m.content.length, 0);
  assert.ok(total <= 12000, `expected <=12000 chars, got ${total}`);
  assert.ok(bounded.length < 20, 'fewer messages kept to respect the char budget');
});

test('boundHistory — a single oversized message is still returned (never empty)', () => {
  const huge = { role: 'user', content: 'y'.repeat(50000) };
  const bounded = orchestrator.boundHistory([huge]);
  assert.equal(bounded.length, 1, 'the newest message is always included (bounded upstream by input validation)');
});

test('boundHistory — small histories pass through unchanged', () => {
  const history = [msg(0), msg(1), msg(2)];
  assert.deepEqual(orchestrator.boundHistory(history), history);
});
