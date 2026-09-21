// Een plek opzoeken op naam: "Efteling", "Grote Markt Haarlem", "Rivierenlaan
// 12 Utrecht".
//
// Waarom niet expo-location? Die heeft er wel een functie voor, maar die werkt
// op het web helemaal niet — en de webversie is juist waar jullie de app
// gebruiken. Daarom praten we hier rechtstreeks met twee zoekers van
// OpenStreetMap. Allebei gratis, allebei zonder sleutel of account.
//
//   Photon (photon.komoot.io) is gebouwd voor zoeken terwijl je typt en is
//   daarom de eerste keuze.
//
//   Nominatim (nominatim.openstreetmap.org) is de officiële zoeker van
//   OpenStreetMap en springt in als Photon niets geeft. Die vraagt wél om
//   rust: hun spelregels staan geen zoekopdracht per toetsaanslag toe. Vandaar
//   dat we hem hoogstens één keer per seconde aanspreken, en alleen als
//   Photon het laat afweten.

const PHOTON = 'https://photon.komoot.io/api';
const PHOTON_TERUG = 'https://photon.komoot.io/reverse';
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_TERUG = 'https://nominatim.openstreetmap.org/reverse';

const MAX_RESULTATEN = 6;
const GEDULD = 6000;

// Nominatim wil weten wie er aanklopt. Op een telefoon moeten we dat zelf
// zeggen; een browser stuurt zijn eigen herkomst al mee en laat deze kop niet
// zetten — die gooit hem er stilletjes uit. Meesturen kan dus altijd.
const KOPPEN = { 'User-Agent': 'OurSpots (hobbyapp voor twee)' };

let laatsteNominatim = 0;

async function haalOp(adres, sein) {
  const stoppen = new AbortController();
  const klok = setTimeout(() => stoppen.abort(), GEDULD);

  // Zowel onze eigen tijdslimiet als een nieuwere zoekopdracht mogen afbreken.
  const stop = () => stoppen.abort();
  sein?.addEventListener('abort', stop);

  try {
    const antwoord = await fetch(adres, { signal: stoppen.signal, headers: KOPPEN });
    if (!antwoord.ok) throw new Error(`zoeker gaf ${antwoord.status}`);
    return await antwoord.json();
  } finally {
    clearTimeout(klok);
    sein?.removeEventListener('abort', stop);
  }
}

// --- Photon -----------------------------------------------------------------

function uitPhoton(gegevens) {
  return (gegevens?.features || [])
    .map((plek) => {
      const punt = plek.geometry?.coordinates;
      if (!punt || punt.length < 2) return null;
      const e = plek.properties || {};

      const straat = [e.street, e.housenumber].filter(Boolean).join(' ');
      const plaats = e.city || e.town || e.village || e.county || '';
      const titel = e.name || straat || plaats || e.country || '';
      if (!titel) return null;

      return {
        id: `photon-${e.osm_type || ''}${e.osm_id || ''}-${punt[0]},${punt[1]}`,
        titel,
        ondertitel: [straat && straat !== titel ? straat : '', plaats, e.country]
          .filter(Boolean)
          .join(', '),
        lat: punt[1],
        lng: punt[0],
      };
    })
    .filter(Boolean);
}

// --- Nominatim --------------------------------------------------------------

function uitNominatim(gegevens) {
  return (gegevens || [])
    .map((plek) => {
      const lat = Number(plek.lat);
      const lng = Number(plek.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      // display_name is één lange regel: "Efteling, Europalaan, Kaatsheuvel,
      // …". Het eerste stuk is de naam, de rest is waar het ligt.
      const delen = String(plek.display_name || '').split(',').map((d) => d.trim());
      const titel = plek.name || delen[0] || '';
      if (!titel) return null;

      return {
        id: `nominatim-${plek.osm_type || ''}${plek.osm_id || lat},${lng}`,
        titel,
        ondertitel: delen.slice(1, 4).join(', '),
        lat,
        lng,
      };
    })
    .filter(Boolean);
}

// --- Zoeken -----------------------------------------------------------------

// `bij` is waar je nu op de kaart kijkt. Zoekers geven dan eerst de plekken bij
// jou in de buurt, en dat scheelt schrollen: "station" moet jouw station
// bovenaan zetten, niet een station in Peru.
export async function zoekPlekken(tekst, bij, sein) {
  const vraag = String(tekst || '').trim();
  if (vraag.length < 3) return [];

  const buurt =
    bij && Number.isFinite(bij.lat) && Number.isFinite(bij.lng) ? bij : null;

  try {
    const adres =
      `${PHOTON}?q=${encodeURIComponent(vraag)}&limit=${MAX_RESULTATEN}` +
      (buurt ? `&lat=${buurt.lat}&lon=${buurt.lng}` : '');
    const gevonden = uitPhoton(await haalOp(adres, sein));
    if (gevonden.length) return gevonden;
  } catch (fout) {
    if (fout?.name === 'AbortError') throw fout;
    // Photon doet het even niet; dan proberen we de ander.
  }

  // Nominatim alleen als het moet, en niet vaker dan één keer per seconde.
  const nu = Date.now();
  if (nu - laatsteNominatim < 1100) return [];
  laatsteNominatim = nu;

  const adres =
    `${NOMINATIM}?format=jsonv2&addressdetails=0&limit=${MAX_RESULTATEN}` +
    `&q=${encodeURIComponent(vraag)}`;
  return uitNominatim(await haalOp(adres, sein));
}

// --- En andersom: welke plek is dit? ---------------------------------------

// Druk je lang op de kaart, dan willen we weten hoe die plek heet. expo-location
// kan dat op een telefoon, maar op het web helemaal niet — daar bleef de titel
// dus altijd leeg. Deze zoekers kunnen het overal.
export async function plekOpPunt(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  try {
    const gevonden = uitPhoton(await haalOp(`${PHOTON_TERUG}?lat=${lat}&lon=${lng}`));
    if (gevonden.length) return gevonden[0];
  } catch {
    // Dan de ander.
  }

  const nu = Date.now();
  if (nu - laatsteNominatim < 1100) return null;
  laatsteNominatim = nu;

  try {
    const gegevens = await haalOp(
      `${NOMINATIM_TERUG}?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`,
    );
    // De omgekeerde zoeker geeft één plek terug, geen lijst.
    return uitNominatim([gegevens])[0] || null;
  } catch {
    return null;
  }
}
