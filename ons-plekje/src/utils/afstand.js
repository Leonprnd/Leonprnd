// Afstand tussen twee punten op aarde, en hoe je dat lief opschrijft.

const AARDSTRAAL_M = 6371000;

export function afstandInMeter(a, b) {
  if (!a || !b) return null;
  if (![a.lat, a.lng, b.lat, b.lng].every((n) => Number.isFinite(n))) return null;

  const radialen = (graden) => (graden * Math.PI) / 180;
  const dLat = radialen(b.lat - a.lat);
  const dLng = radialen(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radialen(a.lat)) * Math.cos(radialen(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * AARDSTRAAL_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function afstandTekst(meters) {
  if (meters == null) return '';
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  if (meters < 10000) return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
  return `${Math.round(meters / 1000)} km`;
}

// Het zinnetje boven in beeld als jullie allebei je locatie delen.
export function afstandZinnetje(meters, partnerNaam) {
  if (meters == null) return null;
  const naam = partnerNaam || 'jullie';
  if (meters < 120) return 'Jullie zijn samen 🥰';
  if (meters < 1000) return `${afstandTekst(meters)} van elkaar — bijna samen 💗`;
  if (meters < 25000) return `${afstandTekst(meters)} tussen jullie in`;
  if (meters < 500000) return `${afstandTekst(meters)} uit elkaar — denk aan ${naam} 💌`;
  return `${afstandTekst(meters)} uit elkaar 🌍`;
}
