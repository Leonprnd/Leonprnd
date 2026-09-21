// De geluiden van de app.
//
// Korte tonen bij wat je doet: opslaan, bladeren, een plek zetten. Meer niet
// — achtergrondgeluid heeft de app bewust niet. Uit te zetten in het
// Wij-scherm.
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

// Hoe hard elk geluidje mag zijn. Subtiel is het uitgangspunt.
const sterkte = {
  tik: 0.25,
  pin: 0.4,
  bewaard: 0.5,
  blader: 0.3,
  samen: 0.6,
};

let ingesteld = false;
const spelers = {};
let effectenAan = true;

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

// Alles opruimen; bij het afsluiten van de app.
export function ruimOp() {
  Object.values(spelers).forEach((s) => {
    try {
      s.remove();
    } catch {
      // Al weg.
    }
  });
  Object.keys(spelers).forEach((naam) => delete spelers[naam]);
}
