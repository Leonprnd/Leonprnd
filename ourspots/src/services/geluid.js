// De geluiden van de app.
//
// Twee soorten: korte tonen bij wat je doet (opslaan, bladeren, een plek
// zetten), en een rustige vogelachtergrond op de kaart. Allebei apart uit te
// zetten in het Wij-scherm.
//
// De spelers worden één keer gemaakt en daarna hergebruikt; telkens opnieuw
// laden geeft een hoorbare vertraging. Lukt het afspelen niet — een oudere
// telefoon, geen geluid beschikbaar — dan gaat de app gewoon door. Geluid is
// nooit belangrijk genoeg om iets voor te laten mislukken.

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const bestanden = {
  tik: require('../../assets/geluid/tik.wav'),
  pin: require('../../assets/geluid/pin.wav'),
  bewaard: require('../../assets/geluid/bewaard.wav'),
  blader: require('../../assets/geluid/blader.wav'),
  samen: require('../../assets/geluid/samen.wav'),
};

const vogelbestand = require('../../assets/geluid/vogels.wav');

// Hoe hard elk geluidje mag zijn. Subtiel is het uitgangspunt.
const sterkte = {
  tik: 0.25,
  pin: 0.4,
  bewaard: 0.5,
  blader: 0.3,
  samen: 0.6,
};

const VOGELS_STERKTE = 0.22;

let ingesteld = false;
const spelers = {};
let vogels = null;
let effectenAan = true;
let vogelsAan = true;

async function zorgVoorAudiomodus() {
  if (ingesteld) return;
  ingesteld = true;
  try {
    await setAudioModeAsync({
      // Ook geluid als iemand zijn telefoon op stil heeft staan zou opdringerig
      // zijn; dat laten we dus aan de schakelaar op de telefoon.
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    });
  } catch {
    // Niet kunnen instellen is geen reden om het afspelen te laten vallen.
  }
}

function speler(naam) {
  if (spelers[naam]) return spelers[naam];
  try {
    const nieuw = createAudioPlayer(bestanden[naam]);
    nieuw.volume = sterkte[naam] ?? 0.3;
    spelers[naam] = nieuw;
    return nieuw;
  } catch {
    return null;
  }
}

// --- Aan of uit -------------------------------------------------------------

export function zetEffecten(aan) {
  effectenAan = Boolean(aan);
}

export function zetVogels(aan) {
  vogelsAan = Boolean(aan);
  if (!vogelsAan) stopVogels();
}

// --- Korte geluidjes --------------------------------------------------------

export function speel(naam) {
  if (!effectenAan || !bestanden[naam]) return;

  zorgVoorAudiomodus();

  try {
    const s = speler(naam);
    if (!s) return;
    // Terug naar het begin, zodat snel achter elkaar tikken ook echt klinkt.
    s.seekTo(0)?.catch?.(() => {});
    s.play();
  } catch {
    // Geluid is nooit belangrijk genoeg om iets voor te laten mislukken.
  }
}

// --- De vogels op de kaart --------------------------------------------------

export async function startVogels() {
  if (!vogelsAan) return;

  await zorgVoorAudiomodus();

  try {
    if (!vogels) {
      vogels = createAudioPlayer(vogelbestand);
      vogels.loop = true;
      vogels.volume = 0;
    }
    vogels.play();
    vervaag(VOGELS_STERKTE, 900);
  } catch {
    vogels = null;
  }
}

export function stopVogels() {
  if (!vogels) return;
  // Niet abrupt afkappen: dat hoor je meteen.
  vervaag(0, 500, () => {
    try {
      vogels?.pause();
    } catch {
      // Speler is al opgeruimd.
    }
  });
}

let vervaagKlus = null;

function vervaag(naar, milliseconden, klaar) {
  if (vervaagKlus) clearInterval(vervaagKlus);
  if (!vogels) return;

  const van = vogels.volume ?? 0;
  const stappen = Math.max(1, Math.round(milliseconden / 50));
  let stap = 0;

  vervaagKlus = setInterval(() => {
    stap += 1;
    try {
      if (!vogels) throw new Error('weg');
      vogels.volume = van + (naar - van) * (stap / stappen);
    } catch {
      clearInterval(vervaagKlus);
      vervaagKlus = null;
      return;
    }
    if (stap >= stappen) {
      clearInterval(vervaagKlus);
      vervaagKlus = null;
      if (klaar) klaar();
    }
  }, 50);
}

// Alles opruimen; bij het afsluiten van de app.
export function ruimOp() {
  if (vervaagKlus) clearInterval(vervaagKlus);
  vervaagKlus = null;
  Object.values(spelers).forEach((s) => {
    try {
      s.remove();
    } catch {
      // Al weg.
    }
  });
  Object.keys(spelers).forEach((naam) => delete spelers[naam]);
  try {
    vogels?.remove();
  } catch {
    // Al weg.
  }
  vogels = null;
}
