// De koppelcode die je aan je liefje geeft.
//
// Uit het alfabet zijn juist de tekens weggelaten die je door elkaar haalt:
// B/8, I/1, L/1, O/0, S/5, Z/2. Wat overblijft is 25 tekens die je niet kunt
// verwarren, dus overtypen gaat altijd goed en we hoeven achteraf niets recht
// te zetten. 25^6 is ruim 244 miljoen codes; bij het aanmaken kijken we
// bovendien of de code nog vrij is.

const ALFABET = 'ACDEFGHJKMNPQRTUVWXY34679';
const LENGTE = 6;

export function maakCode() {
  let uit = '';
  for (let i = 0; i < LENGTE; i += 1) {
    uit += ALFABET[Math.floor(Math.random() * ALFABET.length)];
  }
  return uit;
}

// Alles wat iemand intypt terugbrengen naar de kale code: hoofdletters, en
// streepjes of spaties eruit.
export function normaliseerCode(invoer) {
  if (!invoer) return '';
  return String(invoer)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, LENGTE);
}

export function isVolledigeCode(code) {
  return normaliseerCode(code).length === LENGTE;
}

// Tekens die niet in het alfabet zitten, heeft iemand verkeerd overgenomen.
export function bevatOnmogelijkTeken(code) {
  const kaal = normaliseerCode(code);
  return kaal.split('').some((teken) => !ALFABET.includes(teken));
}

// Voor op het scherm: ABC-123 leest prettiger dan ABC123.
export function toonCode(code) {
  const kaal = normaliseerCode(code);
  if (kaal.length <= 3) return kaal;
  return `${kaal.slice(0, 3)}-${kaal.slice(3)}`;
}

export const codeLengte = LENGTE;
export const codeAlfabet = ALFABET;
