// Alles rond de kaart en de koppeling tussen jullie twee.
//
// De koppelcode is meteen de naam van het document in Firestore. Zo hoeven we
// niet te zoeken: wie de code heeft, kan de kaart direct openen.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
} from 'firebase/firestore';
import { geefDb } from '../firebase';
import { maakCode, normaliseerCode } from '../utils/code';
import { woorden } from '../taal';

const KAARTEN = 'kaarten';

export function kaartRef(code) {
  return doc(geefDb(), KAARTEN, normaliseerCode(code));
}

export async function haalKaart(code) {
  const kaal = normaliseerCode(code);
  if (!kaal) return null;
  const snap = await getDoc(kaartRef(kaal));
  return snap.exists() ? { code: kaal, ...snap.data() } : null;
}

// Een nieuwe kaart beginnen. We proberen een paar codes tot er één vrij is.
export async function maakKaart({ uid, naam, emoji, kleur }) {
  for (let poging = 0; poging < 8; poging += 1) {
    const code = maakCode();
    const bestaat = await getDoc(kaartRef(code));
    if (bestaat.exists()) continue;

    await setDoc(kaartRef(code), {
      code,
      gemaaktDoor: uid,
      gemaaktOp: serverTimestamp(),
      samenSinds: null,
      leden: {
        [uid]: { naam, emoji, kleur, sindsOp: serverTimestamp() },
      },
      ledenIds: [uid],
    });
    return code;
  }
  throw new Error(woorden().fouten.codeMaken);
}

// Meedoen met de kaart van je liefje.
export async function doeMee({ code, uid, naam, emoji, kleur }) {
  const kaal = normaliseerCode(code);
  const snap = await getDoc(kaartRef(kaal));

  if (!snap.exists()) {
    throw new Error(woorden().fouten.codeOnbekend);
  }

  const data = snap.data();
  const ids = data.ledenIds || [];

  if (ids.includes(uid)) return kaal; // al gekoppeld, gewoon doorlopen

  if (ids.length >= 2) {
    throw new Error(woorden().fouten.kaartVol);
  }

  await updateDoc(kaartRef(kaal), {
    [`leden.${uid}`]: { naam, emoji, kleur, sindsOp: serverTimestamp() },
    ledenIds: [...ids, uid],
  });

  return kaal;
}

export function volgKaart(code, callback, bijFout) {
  return onSnapshot(
    kaartRef(code),
    (snap) => callback(snap.exists() ? { code: normaliseerCode(code), ...snap.data() } : null),
    bijFout,
  );
}

export async function bewaarSamenSinds(code, datumSleutel) {
  await updateDoc(kaartRef(code), { samenSinds: datumSleutel || null });
}

export async function bewerkLid(code, uid, velden) {
  const update = {};
  Object.entries(velden).forEach(([sleutel, waarde]) => {
    update[`leden.${uid}.${sleutel}`] = waarde;
  });
  await updateDoc(kaartRef(code), update);
}

export async function verlaatKaart(code, uid) {
  const snap = await getDoc(kaartRef(code));
  if (!snap.exists()) return;
  const ids = (snap.data().ledenIds || []).filter((id) => id !== uid);
  await updateDoc(kaartRef(code), {
    ledenIds: ids,
    [`leden.${uid}`]: deleteField(),
  });
}

// Handig overal: wie is je partner op deze kaart?
export function partnerVan(kaart, uid) {
  if (!kaart?.leden) return null;
  const id = (kaart.ledenIds || []).find((x) => x !== uid);
  if (!id) return null;
  return { uid: id, ...kaart.leden[id] };
}

export function ikVan(kaart, uid) {
  if (!kaart?.leden?.[uid]) return null;
  return { uid, ...kaart.leden[uid] };
}

// Sta jij op deze kaart? Dat is genoeg om hem te mogen gebruiken — ook als je
// liefje de code nog niet heeft. Zo kun je de kaart eerst in je eentje vullen
// en hem pas weggeven als je er klaar voor bent.
export function benLidVan(kaart, uid) {
  return Boolean(uid) && (kaart?.ledenIds || []).includes(uid);
}

// Staan jullie er allebei op?
export function isGekoppeld(kaart) {
  return (kaart?.ledenIds || []).length >= 2;
}
