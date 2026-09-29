import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireAdminKey } from '../src/lib/auth';

// ── CB-SEC-D: admin key hardening (fail closed, no leakage) ───────────────

function mockReply() {
  const reply: any = {
    statusCode: 0,
    payload: undefined as any,
    code(c: number) {
      reply.statusCode = c;
      return reply;
    },
    send(p: any) {
      reply.payload = p;
      return reply;
    },
  };
  return reply;
}

function req(headers: Record<string, string | string[] | undefined>): any {
  return { headers };
}

function withKey(key: string | undefined, fn: () => Promise<void>) {
  const prev = process.env.ADMIN_API_KEY;
  if (key === undefined) delete process.env.ADMIN_API_KEY;
  else process.env.ADMIN_API_KEY = key;
  return fn().finally(() => {
    if (prev === undefined) delete process.env.ADMIN_API_KEY;
    else process.env.ADMIN_API_KEY = prev;
  });
}

test('ADMIN_API_KEY absent → fail closed with 503 (never open)', async () => {
  await withKey(undefined, async () => {
    const r = mockReply();
    const out = await requireAdminKey(req({}), r);
    assert.ok(out, 'blocks');
    assert.equal(out!.statusCode, 503);
  });
});

test('ADMIN_API_KEY present, no credential → 401', async () => {
  await withKey('s3cr3t', async () => {
    const out = await requireAdminKey(req({}), mockReply());
    assert.equal(out!.statusCode, 401);
  });
});

test('empty / whitespace / malformed credentials → 401', async () => {
  await withKey('s3cr3t', async () => {
    assert.equal((await requireAdminKey(req({ 'x-admin-key': '' }), mockReply()))!.statusCode, 401);
    assert.equal((await requireAdminKey(req({ 'x-admin-key': '   ' }), mockReply()))!.statusCode, 401);
    assert.equal((await requireAdminKey(req({ authorization: 'Bearer ' }), mockReply()))!.statusCode, 401);
    assert.equal((await requireAdminKey(req({ authorization: 'Basic s3cr3t' }), mockReply()))!.statusCode, 401);
    assert.equal((await requireAdminKey(req({ 'x-admin-key': 'wrong' }), mockReply()))!.statusCode, 401);
    assert.equal((await requireAdminKey(req({ 'x-admin-key': 's3cr3t ' }), mockReply()))!.statusCode, 401, 'no trimming of the secret');
  });
});

test('valid credential via header or bearer → allowed', async () => {
  await withKey('s3cr3t', async () => {
    assert.equal(await requireAdminKey(req({ 'x-admin-key': 's3cr3t' }), mockReply()), undefined);
    assert.equal(await requireAdminKey(req({ authorization: 'Bearer s3cr3t' }), mockReply()), undefined);
    assert.equal(await requireAdminKey(req({ authorization: 'bearer s3cr3t' }), mockReply()), undefined, 'case-insensitive scheme');
  });
});

test('array header value is handled without crashing and still validated', async () => {
  await withKey('s3cr3t', async () => {
    // A duplicated header arrives as an array; only a matching first value passes.
    assert.equal(await requireAdminKey(req({ 'x-admin-key': ['s3cr3t'] }), mockReply()), undefined);
    assert.equal((await requireAdminKey(req({ 'x-admin-key': ['wrong', 's3cr3t'] }), mockReply()))!.statusCode, 401);
  });
});

test('error responses never echo the secret or internals', async () => {
  await withKey('super-secret-value', async () => {
    const r = mockReply();
    await requireAdminKey(req({ 'x-admin-key': 'wrong' }), r);
    const body = JSON.stringify(r.payload);
    assert.ok(!body.includes('super-secret-value'), 'secret never echoed');
    assert.ok(!/stack|at Object|node_modules/i.test(body), 'no stack trace leaked');
    assert.deepEqual(Object.keys(r.payload), ['error']);
  });
});
