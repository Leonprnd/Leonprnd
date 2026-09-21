// Test de beveiligingsregels tegen de echte Firestore-emulator.
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { readFileSync } from 'node:fs';

const omgeving = await initializeTestEnvironment({
  projectId: 'ourspots-test',
  firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
});

const CODE = 'PQPKCJ';
let goed = 0, stuk = 0;

async function test(naam, fn) {
  try { await fn(); console.log('  ok    ' + naam); goed += 1; }
  catch (e) { console.log('  STUK  ' + naam + '\n        ' + String(e.message).split('\n')[0]); stuk += 1; }
}

// Hulpjes
const leon = () => omgeving.authenticatedContext('leon').firestore();
const sanne = () => omgeving.authenticatedContext('sanne').firestore();
const vreemde = () => omgeving.authenticatedContext('vreemde').firestore();
const uitgelogd = () => omgeving.unauthenticatedContext().firestore();
const kaart = (db, code = CODE) => doc(db, 'kaarten', code);

async function zetKaartKlaar(leden) {
  await omgeving.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), 'kaarten', CODE), {
      code: CODE,
      gemaaktDoor: leden[0],
      ledenIds: leden,
      leden: Object.fromEntries(leden.map((id) => [id, { naam: id }])),
      samenSinds: null,
    });
  });
}

console.log('\n--- Een kaart maken ---');
await omgeving.clearFirestore();

await test('vrije code opvragen mag (DIT GING MIS)', () =>
  assertSucceeds(getDoc(kaart(leon()))));

await test('uitgelogd mag niks opvragen', () =>
  assertFails(getDoc(kaart(uitgelogd()))));

await test('kaart aanmaken met jezelf erop mag', () =>
  assertSucceeds(setDoc(kaart(leon()), {
    code: CODE, gemaaktDoor: 'leon', ledenIds: ['leon'],
    leden: { leon: { naam: 'Leon' } }, samenSinds: null,
  })));

await omgeving.clearFirestore();
await test('kaart aanmaken met een ander erop mag NIET', () =>
  assertFails(setDoc(kaart(leon()), {
    code: CODE, gemaaktDoor: 'leon', ledenIds: ['sanne'],
    leden: { sanne: { naam: 'Sanne' } }, samenSinds: null,
  })));

console.log('\n--- Meedoen met een code ---');
await omgeving.clearFirestore();
await zetKaartKlaar(['leon']);

await test('kaart met ruimte is leesbaar voor je liefje', () =>
  assertSucceeds(getDoc(kaart(sanne()))));

await test('je liefje kan zichzelf erbij zetten', () =>
  assertSucceeds(updateDoc(kaart(sanne()), {
    ledenIds: ['leon', 'sanne'], 'leden.sanne': { naam: 'Sanne' },
  })));

await omgeving.clearFirestore();
await zetKaartKlaar(['leon']);
await test('maar niet door de maker eraf te gooien', () =>
  assertFails(updateDoc(kaart(sanne()), {
    ledenIds: ['sanne'], 'leden.sanne': { naam: 'Sanne' },
  })));

console.log('\n--- Een volle kaart is dicht ---');
await omgeving.clearFirestore();
await zetKaartKlaar(['leon', 'sanne']);

await test('een derde kan de kaart niet lezen', () =>
  assertFails(getDoc(kaart(vreemde()))));

await test('een derde kan zich er niet bij zetten', () =>
  assertFails(updateDoc(kaart(vreemde()), { ledenIds: ['leon', 'sanne', 'vreemde'] })));

await test('de twee leden kunnen hem wel lezen', async () => {
  await assertSucceeds(getDoc(kaart(leon())));
  await assertSucceeds(getDoc(kaart(sanne())));
});

await test('niemand kan de kaart weggooien', () =>
  assertFails(deleteDoc(kaart(leon()))));

console.log('\n--- Herinneringen ---');
const momenten = (db) => collection(db, 'kaarten', CODE, 'momenten');

await test('een lid kan een plekje toevoegen', () =>
  assertSucceeds(addDoc(momenten(leon()), { titel: 'Het park', datum: '2026-04-20' })));

await test('allebei kunnen ze de plekjes lezen', () =>
  assertSucceeds(getDocs(momenten(sanne()))));

await test('een derde kan er niet bij', () =>
  assertFails(getDocs(momenten(vreemde()))));

await test('een derde kan er niets bij zetten', () =>
  assertFails(addDoc(momenten(vreemde()), { titel: 'Stiekem' })));

console.log('\n--- Live locatie ---');
const locatie = (db, wie) => doc(db, 'kaarten', CODE, 'locaties', wie);

await test('je schrijft je eigen locatie', () =>
  assertSucceeds(setDoc(locatie(leon(), 'leon'), { lat: 52.1, lng: 5.2, deelt: true })));

await test('je liefje kan die lezen', () =>
  assertSucceeds(getDoc(locatie(sanne(), 'leon'))));

await test('maar niet die van jou overschrijven', () =>
  assertFails(setDoc(locatie(sanne(), 'leon'), { lat: 0, lng: 0, deelt: true })));

await test('een derde ziet niets', () =>
  assertFails(getDoc(locatie(vreemde(), 'leon'))));

console.log('\n--- Niet door alle kaarten bladeren ---');
await test('de hele lijst kaarten opvragen mag niet', () =>
  assertFails(getDocs(collection(leon(), 'kaarten'))));

await omgeving.cleanup();
console.log(`\n${goed} geslaagd, ${stuk} mislukt.`);
process.exit(stuk ? 1 : 0);
