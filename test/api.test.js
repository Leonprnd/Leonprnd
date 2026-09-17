import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createStore } from '../src/store.js';
import { createServer } from '../src/http.js';

async function startServer() {
  const dir = await mkdtemp(path.join(tmpdir(), 'onderdelen-'));
  const store = await createStore(dir);
  const server = createServer(store);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  const call = async (pathname, options = {}) => {
    const response = await fetch(base + pathname, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    return { status: response.status, body: await response.json() };
  };

  return {
    call,
    base,
    async stop() {
      await new Promise((resolve) => server.close(resolve));
      await rm(dir, { recursive: true, force: true });
    },
  };
}

test('de volledige werkwijze van Roy en Dean', async (t) => {
  const app = await startServer();
  t.after(() => app.stop());

  const start = await app.call('/api/state');
  assert.equal(start.status, 200);
  assert.ok(start.body.parts.length > 0, 'er staan onderdelen klaar');

  // Roy voegt een nieuw onderdeel toe.
  const nieuw = await app.call('/api/parts', {
    method: 'POST',
    body: { number: 'TST-001', name: 'Testscharnier', category: 'Scharnieren', stock: 10, minStock: 4, orderQty: 20, user: 'Roy' },
  });
  assert.equal(nieuw.status, 200);
  const partId = nieuw.body.id;

  // Hetzelfde nummer mag niet twee keer.
  const dubbel = await app.call('/api/parts', { method: 'POST', body: { number: 'TST-001', name: 'Nog een' } });
  assert.equal(dubbel.status, 400);

  // Roy maakt een kastlijst met kastnummer 51436.
  const lijst = await app.call('/api/picklists', {
    method: 'POST',
    body: { cabinetNumber: '51436', title: 'Testkast', lines: [{ partId, qty: 6 }], user: 'Roy' },
  });
  assert.equal(lijst.status, 200);
  const listId = lijst.body.id;

  // De open lijst reserveert voorraad.
  let state = (await app.call('/api/state')).body;
  let part = state.parts.find((p) => p.id === partId);
  assert.equal(part.reserved, 6);
  assert.equal(part.available, 4);
  assert.equal(part.status, 'order', 'onder het bestelpunt dus bestellen');

  // Dean begint met pakken en slaat tussendoor op.
  assert.equal((await app.call(`/api/picklists/${listId}/start`, { method: 'POST', body: { user: 'Dean' } })).status, 200);
  await app.call(`/api/picklists/${listId}/progress`, { method: 'POST', body: { lines: [{ partId, pickedQty: 4 }], user: 'Dean' } });

  // Dean rondt af en meldt dat er twee missen.
  const klaar = await app.call(`/api/picklists/${listId}/complete`, {
    method: 'POST',
    body: { complete: false, lines: [{ partId, pickedQty: 4 }], user: 'Dean' },
  });
  assert.equal(klaar.status, 200);
  assert.equal(klaar.body.status, 'incomplete');

  state = (await app.call('/api/state')).body;
  part = state.parts.find((p) => p.id === partId);
  assert.equal(part.stock, 6, 'vier stuks zijn van de voorraad af');
  assert.equal(part.reserved, 0, 'de lijst is afgerond dus niets meer gereserveerd');
  assert.equal(part.shortage, 2, 'Roy ziet het tekort van twee stuks');
  assert.ok(part.suggestedOrderQty >= 20);

  // Roy bestelt en de status wordt "besteld".
  const bestelling = await app.call('/api/orders', { method: 'POST', body: { partId, qty: 20, user: 'Roy' } });
  assert.equal(bestelling.status, 200);
  state = (await app.call('/api/state')).body;
  part = state.parts.find((p) => p.id === partId);
  assert.equal(part.onOrder, 20);

  // De bestelling komt binnen: voorraad omhoog, tekort afgehandeld.
  assert.equal((await app.call(`/api/orders/${bestelling.body.id}/receive`, { method: 'POST', body: { qty: 20 } })).status, 200);
  state = (await app.call('/api/state')).body;
  part = state.parts.find((p) => p.id === partId);
  assert.equal(part.stock, 26);
  assert.equal(part.shortage, 0);
  assert.equal(part.status, 'ok');
});

test('een afgeronde kastlijst kan niet opnieuw gepakt worden', async (t) => {
  const app = await startServer();
  t.after(() => app.stop());

  const state = (await app.call('/api/state')).body;
  const partId = state.parts[0].id;
  const lijst = (await app.call('/api/picklists', {
    method: 'POST',
    body: { cabinetNumber: '99999', lines: [{ partId, qty: 1 }] },
  })).body;

  await app.call(`/api/picklists/${lijst.id}/complete`, { method: 'POST', body: { complete: true, lines: [] } });
  const nogmaals = await app.call(`/api/picklists/${lijst.id}/complete`, { method: 'POST', body: { complete: true, lines: [] } });
  assert.equal(nogmaals.status, 400);
});

test('een kastlijst zonder onderdelen of kastnummer wordt geweigerd', async (t) => {
  const app = await startServer();
  t.after(() => app.stop());

  assert.equal((await app.call('/api/picklists', { method: 'POST', body: { cabinetNumber: '', lines: [] } })).status, 400);
  assert.equal((await app.call('/api/picklists', { method: 'POST', body: { cabinetNumber: '12345', lines: [] } })).status, 400);
});

test('de schermen worden uitgeleverd', async (t) => {
  const app = await startServer();
  t.after(() => app.stop());
  const page = await fetch(`${app.base}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Onderdelenbeheer/);
});
