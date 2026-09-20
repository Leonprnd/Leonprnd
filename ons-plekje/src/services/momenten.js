// De pinpoints op jullie kaart: aanmaken, aanpassen, weggooien en volgen.

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { geefDb } from '../firebase';
import { normaliseerCode } from '../utils/code';

function momentenRef(code) {
  return collection(geefDb(), 'kaarten', normaliseerCode(code), 'momenten');
}

export function momentRef(code, id) {
  return doc(geefDb(), 'kaarten', normaliseerCode(code), 'momenten', id);
}

// Nieuwste bovenaan; de tijdlijn draait dat zelf om waar dat fijner leest.
export function volgMomenten(code, callback, bijFout) {
  const q = query(momentenRef(code), orderBy('datum', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    bijFout,
  );
}

export async function bewaarNieuwMoment(code, moment) {
  const ref = await addDoc(momentenRef(code), {
    titel: moment.titel?.trim() || 'Ons plekje',
    beschrijving: moment.beschrijving?.trim() || '',
    type: moment.type || 'date',
    datum: moment.datum,
    lat: moment.lat,
    lng: moment.lng,
    adres: moment.adres || '',
    fotos: moment.fotos || [],
    doorUid: moment.doorUid,
    doorNaam: moment.doorNaam || '',
    hartjes: {},
    gemaaktOp: serverTimestamp(),
    gewijzigdOp: serverTimestamp(),
  });
  return ref.id;
}

export async function bewerkMoment(code, id, velden) {
  await updateDoc(momentRef(code, id), { ...velden, gewijzigdOp: serverTimestamp() });
}

export async function verwijderMoment(code, moment) {
  // Het plekje verdwijnt hiermee bij jullie allebei. De fotobestanden blijven
  // bij Cloudinary staan; zie de uitleg onderaan services/fotos.js.
  await deleteDoc(momentRef(code, moment.id));
}

// Een hartje geven aan een herinnering van je liefje.
export async function zetHartje(code, id, uid, aan) {
  await updateDoc(momentRef(code, id), {
    [`hartjes.${uid}`]: aan ? true : false,
  });
}

// Handige afgeleiden voor de tijdlijn en de weetjes.
export function sorteerOpDatum(momenten, richting = 'aflopend') {
  const kopie = [...(momenten || [])];
  kopie.sort((a, b) => String(a.datum || '').localeCompare(String(b.datum || '')));
  return richting === 'aflopend' ? kopie.reverse() : kopie;
}

export function telFotos(momenten) {
  return (momenten || []).reduce((som, m) => som + (m.fotos?.length || 0), 0);
}

export function eersteMoment(momenten) {
  return sorteerOpDatum(momenten, 'oplopend')[0] || null;
}
