// Welke taal spreekt de app?
//
// Bij de eerste start kijken we naar de taal van de telefoon; staat die niet
// in de lijst, dan wordt het Engels. Daarna bepaalt je eigen keuze het, en die
// wordt bewaard bij je profiel.

import * as Localization from 'expo-localization';
import nl from './nl';
import en from './en';
import es from './es';

export const woordenboeken = { nl, en, es };

export const talen = Object.entries(woordenboeken).map(([code, woorden]) => ({
  code,
  naam: woorden.naam,
  vlag: woorden.vlag,
}));

export const standaardTaal = 'en';

export function taalVanTelefoon() {
  try {
    const voorkeuren = Localization.getLocales();
    for (const voorkeur of voorkeuren) {
      const code = String(voorkeur.languageCode || '').toLowerCase();
      if (woordenboeken[code]) return code;
    }
  } catch {
    // Lukt het uitlezen niet, dan pakken we gewoon de standaard.
  }
  return standaardTaal;
}

export function woordenVan(taal) {
  return woordenboeken[taal] || woordenboeken[standaardTaal];
}

// --- De taal die nu geldt ---------------------------------------------------
//
// Hulpjes als datum.js en afstand.js hebben de woorden ook nodig, maar die
// zijn geen React-componenten en kunnen dus niet bij de context. In plaats van
// overal een woordenboek door te geven, houden we hier bij welke taal geldt.
// AppProvider zet hem zodra je hem wijzigt, nog vóór er opnieuw getekend wordt.

let actief = woordenVan(taalVanTelefoon());

export function zetActieveTaal(taal) {
  actief = woordenVan(taal);
}

export function woorden() {
  return actief;
}
