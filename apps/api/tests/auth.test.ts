import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireAdminKey } from '../src/lib/auth';

function mockReply() {
  let lastCode = 0;
  const reply: any = {
    code(c: number) {
      lastCode = c;
      return reply;
    },
    send(payload: any) {
      return { code: lastCode, payload };
    },
  };
  return reply;
}

function requestWith(headers: Record<string, string | string[] | undefined>): any {
  return { headers };
}

test('requireAdminKey — fail-closed 503 when ADMIN_API_KEY unset', async () => {
  const prev = process.env.ADMIN_API_KEY;
  delete process.env.ADMIN_API_KEY;
  try {
    const reply = mockReply();
    const out = await requireAdminKey(requestWith({}), reply);
    assert.ok(out, 'returns a reply (blocks)');
    assert.equal(out.code, 503);
  } finally {
    if (prev) process.env.ADMIN_API_KEY = prev;
    else delete process.env.ADMIN_API_KEY;
  }
});

test('requireAdminKey — rejects wrong key with 401', async () => {
  const prev = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = 'secret-123';
  try {
    const out = await requireAdminKey(requestWith({ 'x-admin-key': 'wrong' }), mockReply());
    assert.ok(out);
    assert.equal(out.code, 401);
    // Bearer with wrong token also rejected
    const out2 = await requireAdminKey(requestWith({ authorization: 'Bearer wrong' }), mockReply());
    assert.equal(out2.code, 401);
  } finally {
    if (prev) process.env.ADMIN_API_KEY = prev;
    else delete process.env.ADMIN_API_KEY;
  }
});

test('requireAdminKey — allows correct key (header or bearer)', async () => {
  const prev = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = 'secret-123';
  try {
    const out1 = await requireAdminKey(requestWith({ 'x-admin-key': 'secret-123' }), mockReply());
    assert.equal(out1, undefined, 'allowed → no reply returned');
    const out2 = await requireAdminKey(requestWith({ authorization: 'Bearer secret-123' }), mockReply());
    assert.equal(out2, undefined);
  } finally {
    if (prev) process.env.ADMIN_API_KEY = prev;
    else delete process.env.ADMIN_API_KEY;
  }
});