// Controleert of de drie talen dezelfde sleutels hebben. Zonder deze test valt
// een vergeten vertaling pas op als er in de app ineens "undefined" staat.

import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync } from 'node:fs';

const map = new URL('../src/taal/', import.meta.url);
const codes = readdirSync(map)
  .filter((naam) => /^[a-z]{2}\.js$/.test(naam))
  .map((naam) => naam.replace('.js', ''));

const woordenboeken = {};
for (const code of codes) {
  woordenboeken[code] = (await import(new URL(`${code}.js`, map))).default;
}

// De "vorm" van een woordenboek: elk pad met het soort waarde erachter.
function vorm(object, pad = '') {
  const uit = [];
  for (const sleutel of Object.keys(object).sort()) {
    const waarde = object[sleutel];
    const volledig = pad ? `${pad}.${sleutel}` : sleutel;
    if (Array.isArray(waarde)) uit.push(`${volledig}:array[${waarde.length}]`);
    else if (waarde && typeof waarde === 'object') uit.push(...vorm(waarde, volledig));
    else uit.push(`${volledig}:${typeof waarde}`);
  }
  return uit;
}

test('er zijn minstens drie talen', () => {
  assert.ok(codes.length >= 3, `gevonden: ${codes.join(', ')}`);
});

const maat = vorm(woordenboeken.nl);

for (const code of codes) {
  test(`${code} heeft dezelfde sleutels als nl`, () => {
    const deze = vorm(woordenboeken[code]);
    const mist = maat.filter((sleutel) => !deze.includes(sleutel));
    const teveel = deze.filter((sleutel) => !maat.includes(sleutel));
    assert.deepEqual(mist, [], `ontbreekt in ${code}`);
    assert.deepEqual(teveel, [], `staat te veel in ${code}`);
  });
}

test('geen enkele tekst is leeg', () => {
  for (const code of codes) {
    const leeg = [];
    (function loop(object, pad = '') {
      for (const [sleutel, waarde] of Object.entries(object)) {
        const volledig = pad ? `${pad}.${sleutel}` : sleutel;
        if (typeof waarde === 'string' && waarde.trim() === '') leeg.push(volledig);
        else if (Array.isArray(waarde)) {
          waarde.forEach((x, i) => {
            if (typeof x === 'string' && x.trim() === '') leeg.push(`${volledig}[${i}]`);
          });
        } else if (waarde && typeof waarde === 'object') loop(waarde, volledig);
      }
    })(woordenboeken[code]);
    assert.deepEqual(leeg, [], `lege teksten in ${code}`);
  }
});

test('elke functie levert een niet-lege tekst op', () => {
  for (const code of codes) {
    (function loop(object, pad = '') {
      for (const [sleutel, waarde] of Object.entries(object)) {
        const volledig = pad ? `${pad}.${sleutel}` : sleutel;
        if (typeof waarde === 'function') {
          const uit = waarde(2, 'iets');
          assert.equal(typeof uit, 'string', `${code}.${volledig} geeft geen tekst`);
          assert.ok(uit.trim().length > 0, `${code}.${volledig} geeft lege tekst`);
        } else if (waarde && typeof waarde === 'object' && !Array.isArray(waarde)) {
          loop(waarde, volledig);
        }
      }
    })(woordenboeken[code]);
  }
});
