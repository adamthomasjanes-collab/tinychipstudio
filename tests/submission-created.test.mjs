// Tests for netlify/functions/submission-created.mjs with a mocked Resend API.
// No network, no real email. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliver, idempotencyKey, buildEmail } from '../netlify/functions/submission-created.mjs';

const event = (data = {}, extra = {}) => ({
  body: JSON.stringify({ payload: { id: 'sub_123', form_name: 'project-starter', data: { name: 'Pat', email: 'pat@example.com', message: 'Our site no longer feels like us.', ...data }, ...extra } }),
});
const env = { RESEND_API_KEY: 'test-key' };
const quiet = { log() {}, error() {} };
const noWait = async () => {};

/** A scripted fake fetch: each call takes the next step (status/body, or a thrown error). */
function fakeFetch(steps) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const step = steps[Math.min(calls.length - 1, steps.length - 1)];
    if (step.throw) throw step.throw;
    if (step.hang) {
      return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    }
    return new Response(step.body ?? '{}', { status: step.status });
  };
  impl.calls = calls;
  return impl;
}

test('sends once and reports success', async () => {
  const f = fakeFetch([{ status: 200, body: '{"id":"em_1"}' }]);
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 200);
  assert.equal(r.ok, true);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].body.reply_to, 'pat@example.com');
  assert.match(f.calls[0].init.headers['Idempotency-Key'], /^tcs-project-starter-[0-9a-f]{40}$/);
});

test('provider failure is reported as HTTP 500, not 200', async () => {
  const f = fakeFetch([{ status: 500, body: 'boom' }]);
  const errors = [];
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: { log() {}, error: (m) => errors.push(m) } });
  assert.equal(r.statusCode, 500);
  assert.equal(r.ok, false);
  assert.equal(f.calls.length, 3, 'retries a 5xx up to three attempts');
  assert.match(errors.join('\n'), /EMAIL NOT SENT .*submission sub_123.*safe in Netlify Forms/);
});

test('temporary failure then success: retried with the same idempotency key', async () => {
  const f = fakeFetch([{ status: 503 }, { throw: new TypeError('fetch failed') }, { status: 200, body: '{"id":"em_2"}' }]);
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 200);
  assert.equal(r.attempts, 3);
  const keys = new Set(f.calls.map((c) => c.init.headers['Idempotency-Key']));
  assert.equal(keys.size, 1, 'every attempt reuses one key, so Resend never sends twice');
});

test('rate limit (429) and concurrent-key conflicts (409) are retried', async () => {
  const f = fakeFetch([{ status: 429 }, { status: 409, body: '{"name":"concurrent_idempotent_requests"}' }, { status: 200 }]);
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: quiet });
  assert.equal(r.ok, true);
  assert.equal(f.calls.length, 3);
});

test('permanent errors (e.g. 422) are not retried but still reported as failures', async () => {
  const f = fakeFetch([{ status: 422, body: '{"message":"invalid from"}' }]);
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 500);
  assert.equal(f.calls.length, 1);
  assert.match(r.error, /422.*not retryable/);
});

test('a stalled provider times out per attempt and fails within the time budget', async () => {
  const f = fakeFetch([{ hang: true }]);
  const t0 = Date.now();
  const r = await deliver(event(), { fetchImpl: f, env, wait: noWait, log: quiet });
  const ms = Date.now() - t0;
  assert.equal(r.statusCode, 500);
  assert.match(r.error, /timed out/);
  assert.ok(ms < 9000, `finished in ${ms} ms, inside Netlify's 10 s limit`);
});

test('missing API key is a reported failure, without calling the provider', async () => {
  const f = fakeFetch([{ status: 200 }]);
  const r = await deliver(event(), { fetchImpl: f, env: {}, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 500);
  assert.equal(f.calls.length, 0);
});

test('honeypot submissions are skipped quietly', async () => {
  const f = fakeFetch([{ status: 200 }]);
  const r = await deliver(event({ 'bot-field': 'spam' }), { fetchImpl: f, env, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 200);
  assert.equal(f.calls.length, 0);
});

test('idempotency key: same content → same key; Netlify request details and ref ignored; edits → new key', () => {
  const a = idempotencyKey('project-starter', { name: 'Pat', message: 'Hi there', ip: '1.1.1.1', ref: 'AAA' });
  const b = idempotencyKey('project-starter', { message: 'Hi there ', name: 'Pat', ip: '2.2.2.2', user_agent: 'x', ref: 'BBB' });
  const c = idempotencyKey('project-starter', { name: 'Pat', message: 'Hi there, edited' });
  const d = idempotencyKey('scorecard-plan', { name: 'Pat', message: 'Hi there' });
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.notEqual(a, d);
  assert.ok(a.length <= 256);
});

test('email escapes HTML and puts the reference in the subject', () => {
  const e = buildEmail('project-starter', { name: '<b>Pat</b>', email: 'nope', ref: 'K3X9QZ' }, 'inbox@example.com');
  assert.match(e.html, /&lt;b&gt;Pat&lt;\/b&gt;/);
  assert.equal(e.reply_to, undefined, 'invalid reply-to addresses are not used');
  assert.equal(e.subject, 'New project-starter submission · ref K3X9QZ');
});

test('unreadable event body is rejected without retry loops', async () => {
  const r = await deliver({ body: 'not json' }, { fetchImpl: fakeFetch([{ status: 200 }]), env, wait: noWait, log: quiet });
  assert.equal(r.statusCode, 400);
});
