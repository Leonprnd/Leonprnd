import test from 'node:test';
import assert from 'node:assert/strict';
import { enrichParts, orderAdvice, partStatus, reservedByPart, shortagesByPart, suggestedOrderQty } from '../src/derive.js';

const db = () => ({
  parts: [
    { id: 'p1', number: 'SCH-1', name: 'Scharnier', stock: 100, minStock: 40, orderQty: 100 },
    { id: 'p2', number: 'GRP-1', name: 'Greep', stock: 5, minStock: 10, orderQty: 20 },
    { id: 'p3', number: 'SLT-1', name: 'Sluiting', stock: 0, minStock: 5, orderQty: 25 },
  ],
  picklists: [
    { id: 'l1', status: 'open', cabinetNumber: '51436', lines: [{ partId: 'p1', qty: 30, pickedQty: 0, missingQty: 0 }] },
    { id: 'l2', status: 'busy', cabinetNumber: '51437', lines: [{ partId: 'p1', qty: 10, pickedQty: 4, missingQty: 0 }] },
    { id: 'l3', status: 'incomplete', cabinetNumber: '51431', lines: [{ partId: 'p2', qty: 6, pickedQty: 4, missingQty: 2, missingHandled: false }] },
    { id: 'l4', status: 'done', cabinetNumber: '51428', lines: [{ partId: 'p2', qty: 2, pickedQty: 2, missingQty: 0 }] },
  ],
  orders: [
    { id: 'o1', partId: 'p3', qty: 25, status: 'open' },
    { id: 'o2', partId: 'p1', qty: 50, status: 'received' },
  ],
  activity: [],
});

test('open kastlijsten houden voorraad bezet', () => {
  const reserved = reservedByPart(db().picklists);
  assert.equal(reserved.get('p1'), 36); // 30 open + 6 nog te pakken
  assert.equal(reserved.get('p2'), undefined); // afgeronde lijsten reserveren niets
});

test('gemelde tekorten worden per onderdeel opgeteld', () => {
  const shortages = shortagesByPart(db().picklists);
  assert.equal(shortages.get('p2').qty, 2);
  assert.equal(shortages.get('p2').lists[0].cabinetNumber, '51431');
});

test('afgehandelde tekorten tellen niet meer mee', () => {
  const data = db();
  data.picklists[2].lines[0].missingHandled = true;
  assert.equal(shortagesByPart(data.picklists).size, 0);
});

test('status volgt de vrije voorraad', () => {
  assert.equal(partStatus({ available: 64, minStock: 40, onOrder: 0 }), 'ok');
  assert.equal(partStatus({ available: 30, minStock: 40, onOrder: 0 }), 'order');
  assert.equal(partStatus({ available: 30, minStock: 40, onOrder: 100 }), 'ordered');
  assert.equal(partStatus({ available: 0, minStock: 5, onOrder: 25 }), 'out');
});

test('onderdelen krijgen reservering, vrije voorraad en status', () => {
  const [scharnier, greep, sluiting] = enrichParts(db());
  assert.equal(scharnier.reserved, 36);
  assert.equal(scharnier.available, 64);
  assert.equal(scharnier.status, 'ok');
  assert.equal(greep.shortage, 2);
  assert.equal(greep.status, 'order');
  assert.equal(sluiting.onOrder, 25);
  assert.equal(sluiting.status, 'out');
});

test('besteladvies vult aan tot boven het bestelpunt', () => {
  const advies = suggestedOrderQty({ minStock: 10, orderQty: 20 }, { available: 5, shortage: 2, onOrder: 0 });
  assert.equal(advies, 20); // standaard bestelhoeveelheid is hier hoger dan het tekort
  const groot = suggestedOrderQty({ minStock: 100, orderQty: 20 }, { available: 10, shortage: 5, onOrder: 0 });
  assert.equal(groot, 195);
});

test('besteladvies zet het dringendste bovenaan', () => {
  const advies = orderAdvice(enrichParts(db()));
  assert.deepEqual(advies.map((part) => part.number), ['SLT-1', 'GRP-1']);
});
