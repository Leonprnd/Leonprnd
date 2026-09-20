// De verbinding met Cloudinary, waar de foto's komen te staan.
//
// Uploaden gaat "unsigned": de app stuurt de foto rechtstreeks naar
// Cloudinary met een upload-preset, zonder geheime sleutel. Dat kan veilig
// omdat er in een telefoon-app nooit een geheim te bewaren valt — wat in de
// app staat, kan iemand eruit halen. De preset zelf beperkt wat er mag
// (alleen afbeeldingen, maximaal een paar MB).
//
// De foto's komen in een map met jullie koppelcode erin, en de adressen
// staan alleen in jullie eigen kaart in Firestore. Wie het adres niet heeft,
// vindt de foto niet: de mapnaam en bestandsnaam zijn niet te raden.

export const cloudNaam = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryIsIngesteld = Boolean(cloudNaam && uploadPreset);

export const uploadAdres = `https://api.cloudinary.com/v1_1/${cloudNaam}/image/upload`;

// --- Formaten ---------------------------------------------------------------
//
// Cloudinary maakt van elke foto ter plekke de maat die je vraagt. Zo haalt
// een klein stapeltje op de kaart geen foto van 1400 pixels binnen, en dat
// scheelt flink in laadtijd en dataverbruik.
//
// q_auto kiest zelf de beste compressie, f_auto het beste bestandsformaat
// (webp op Android, heic/webp op iOS).

export const MINI = 'c_fill,w_320,h_320,q_auto,f_auto';
export const STAPEL = 'c_limit,w_900,q_auto,f_auto';
export const GROOT = 'c_limit,w_1600,q_auto,f_auto';

// Plakt een formaat in het adres van de foto.
export function fotoUrl(url, formaat) {
  if (!url || !formaat) return url;
  const merk = '/image/upload/';
  const plek = url.indexOf(merk);
  if (plek === -1) return url; // geen Cloudinary-adres: laten zoals het is
  return `${url.slice(0, plek + merk.length)}${formaat}/${url.slice(plek + merk.length)}`;
}

// Cloudinary-fouten zijn in het Engels en niet altijd duidelijk; dit maakt
// er iets van waar je wat mee kunt.
export function leesFout(tekst, status) {
  let bericht = '';
  try {
    bericht = JSON.parse(tekst)?.error?.message || '';
  } catch {
    bericht = tekst || '';
  }

  const klein = bericht.toLowerCase();

  if (klein.includes('upload preset not found')) {
    return 'Cloudinary kent deze upload-preset niet. Check EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in je .env — let op hoofdletters.';
  }
  if (klein.includes('unsigned') || klein.includes('whitelisted')) {
    return 'De upload-preset staat nog op "Signed". Zet hem in Cloudinary op "Unsigned" (Settings > Upload > Upload presets).';
  }
  if (klein.includes('cloud_name') || status === 404) {
    return 'Cloudinary kent deze cloud name niet. Check EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME in je .env.';
  }
  if (klein.includes('file size') || status === 413) {
    return 'De foto is te groot voor je upload-preset. Verhoog de maximale bestandsgrootte in Cloudinary.';
  }

  return bericht || `Uploaden lukte niet (foutcode ${status}).`;
}
