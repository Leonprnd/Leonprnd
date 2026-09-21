// Live locatie delen, en het adres bij een pinpoint opzoeken.

import * as Location from 'expo-location';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { geefDb } from '../firebase';
import { normaliseerCode } from '../utils/code';
import { plekOpPunt } from './zoeken';

const MINSTENS_ELKE_MS = 20000; // niet vaker dan elke 20 seconden schrijven
const MINSTENS_ELKE_M = 40; // of als je meer dan 40 meter bent verplaatst

function locatieRef(code, uid) {
  return doc(geefDb(), 'kaarten', normaliseerCode(code), 'locaties', uid);
}

export async function vraagToestemming() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function heeftToestemming() {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}

export async function huidigePositie() {
  const positie = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    lat: positie.coords.latitude,
    lng: positie.coords.longitude,
    nauwkeurigheid: positie.coords.accuracy,
  };
}

export async function schrijfLocatie(code, uid, positie) {
  await setDoc(
    locatieRef(code, uid),
    {
      lat: positie.lat,
      lng: positie.lng,
      nauwkeurigheid: positie.nauwkeurigheid ?? null,
      bijgewerktOp: serverTimestamp(),
      deelt: true,
    },
    { merge: true },
  );
}

// Stoppen met delen: we halen de plek weg zodat je liefje geen oude stip ziet.
export async function stopMetDelen(code, uid) {
  await setDoc(
    locatieRef(code, uid),
    { deelt: false, lat: null, lng: null, bijgewerktOp: serverTimestamp() },
    { merge: true },
  );
}

export function volgLocatieVan(code, uid, callback, bijFout) {
  return onSnapshot(
    locatieRef(code, uid),
    (snap) => callback(snap.exists() ? snap.data() : null),
    bijFout,
  );
}

// Blijft je positie volgen zolang de app open is, en schrijft 'm met mate weg.
export async function startDelen(code, uid, bijEigenPositie) {
  const mag = await heeftToestemming();
  if (!mag) return null;

  let laatstGeschrevenOp = 0;
  let laatstePositie = null;

  const abonnement = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      distanceInterval: 15,
    },
    async (positie) => {
      const nu = {
        lat: positie.coords.latitude,
        lng: positie.coords.longitude,
        nauwkeurigheid: positie.coords.accuracy,
      };
      if (bijEigenPositie) bijEigenPositie(nu);

      const verstreken = Date.now() - laatstGeschrevenOp;
      const verplaatst = laatstePositie ? ruweAfstand(laatstePositie, nu) : Infinity;
      if (verstreken < MINSTENS_ELKE_MS && verplaatst < MINSTENS_ELKE_M) return;

      laatstGeschrevenOp = Date.now();
      laatstePositie = nu;
      try {
        await schrijfLocatie(code, uid, nu);
      } catch {
        // Even geen internet; de volgende keer lukt het wel.
      }
    },
  );

  return abonnement;
}

// Kleine versie van de haversine, genoeg om te zien of je bent verplaatst.
function ruweAfstand(a, b) {
  const dLat = (b.lat - a.lat) * 111320;
  const dLng = (b.lng - a.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// --- Adres zoeken bij een pinpoint -----------------------------------------

export async function zoekAdres(lat, lng) {
  try {
    const plekken = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    const plek = plekken?.[0];
    if (!plek) return { titel: '', adres: '' };

    const straat = [plek.street, plek.streetNumber].filter(Boolean).join(' ');
    const plaats = plek.city || plek.subregion || plek.region || '';

    // Als Google een naam van de plek kent (café, park, school) is dat de
    // mooiste titel; anders de straat, anders de plaats.
    const titel = plek.name && plek.name !== straat ? plek.name : straat || plaats;
    const adres = [straat, plaats].filter(Boolean).join(', ');

    if (titel || plaats) return { titel: titel || plaats, adres };
  } catch {
    // expo-location kan dit op het web helemaal niet, en op een telefoon lukt
    // het ook niet altijd. Dan vragen we het aan OpenStreetMap.
  }

  const plek = await plekOpPunt(lat, lng);
  if (!plek) return { titel: '', adres: '' };
  return { titel: plek.titel, adres: plek.ondertitel || '' };
}
