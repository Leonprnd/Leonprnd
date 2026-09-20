// De soorten herinneringen die je op de kaart kunt zetten. Elk type heeft een
// eigen icoontje en kleur, zodat je in één oogopslag ziet wat er gebeurd is.
//
// "bijzonder: true" geeft de pin op de kaart een gouden randje met een sterretje
// — bedoeld voor de momenten die je maar één keer hebt.

import { kleuren } from './theme';

export const momentTypes = [
  // --- De grote mijlpalen ---
  {
    id: 'eerste-date',
    label: 'Eerste date',
    icoon: '🌹',
    kleur: '#FF5D8F',
    bijzonder: true,
    zinnetje: 'Waar het allemaal begon',
  },
  {
    id: 'eerste-kus',
    label: 'Eerste kus',
    icoon: '💋',
    kleur: '#E23E6B',
    bijzonder: true,
    zinnetje: 'Dat ene moment',
  },
  {
    id: 'samen',
    label: 'Verkering',
    icoon: '💞',
    kleur: '#D64FA0',
    bijzonder: true,
    zinnetje: 'Vanaf hier zijn we wij',
  },
  {
    id: 'ik-hou-van-jou',
    label: 'Ik hou van jou',
    icoon: '💗',
    kleur: '#F0629B',
    bijzonder: true,
    zinnetje: 'De eerste keer gezegd',
  },
  {
    id: 'eerste-ontmoeting',
    label: 'Eerste keer gezien',
    icoon: '👀',
    kleur: '#B583E8',
    bijzonder: true,
    zinnetje: 'Toen wisten we nog niks',
  },
  {
    id: 'jubileum',
    label: 'Jubileum',
    icoon: '🎉',
    kleur: '#F3B03C',
    bijzonder: true,
    zinnetje: 'Weer een rondje samen',
  },

  // --- Gewone lieve dingen ---
  { id: 'date', label: 'Dateje', icoon: '💘', kleur: '#FF7EA8' },
  { id: 'eten', label: 'Samen eten', icoon: '🍝', kleur: '#F08A5D' },
  { id: 'ijsje', label: 'IJsje', icoon: '🍦', kleur: '#8FD3C7' },
  { id: 'koffie', label: 'Drinken', icoon: '🧋', kleur: '#C08457' },
  { id: 'bioscoop', label: 'Film', icoon: '🎬', kleur: '#7F7FD5' },
  { id: 'wandeling', label: 'Wandeling', icoon: '🌳', kleur: '#6FBF8B' },
  { id: 'strand', label: 'Strand', icoon: '🏖️', kleur: '#43B2C9' },
  { id: 'zonsondergang', label: 'Zonsondergang', icoon: '🌅', kleur: '#FF9A5B' },
  { id: 'sterren', label: 'Sterren kijken', icoon: '✨', kleur: '#6C63B5' },
  { id: 'reis', label: 'Reisje', icoon: '✈️', kleur: '#4FA3D9' },
  { id: 'feest', label: 'Feestje', icoon: '🪩', kleur: '#C9A7EB' },
  { id: 'muziek', label: 'Concert', icoon: '🎶', kleur: '#E36BAE' },
  { id: 'kermis', label: 'Kermis', icoon: '🎡', kleur: '#FF6FB5' },
  { id: 'dierentuin', label: 'Dieren', icoon: '🦦', kleur: '#A67C52' },
  { id: 'sport', label: 'Sporten', icoon: '⚽', kleur: '#5BB98C' },
  { id: 'gamen', label: 'Gamen', icoon: '🎮', kleur: '#6B8AFD' },
  { id: 'knuffel', label: 'Knuffelen', icoon: '🧸', kleur: '#E8A0BF' },
  { id: 'logeren', label: 'Logeren', icoon: '🛏️', kleur: '#B08BBB' },
  { id: 'school', label: 'School', icoon: '📚', kleur: '#7DA0CA' },
  { id: 'cadeau', label: 'Cadeau', icoon: '🎁', kleur: '#EF6F8E' },
  { id: 'verjaardag', label: 'Verjaardag', icoon: '🎂', kleur: '#FFB347' },
  { id: 'regen', label: 'In de regen', icoon: '☔', kleur: '#7EA8C4' },
  { id: 'lachen', label: 'Kapot gelachen', icoon: '😂', kleur: '#F6C453' },
  { id: 'goedgemaakt', label: 'Goedgemaakt', icoon: '🩹', kleur: '#9BC4BC' },
  { id: 'gemist', label: 'Afscheid', icoon: '🫂', kleur: '#A79BC4' },
  { id: 'ons-plekje', label: 'Ons plekje', icoon: '📍', kleur: '#FF6F91' },
  { id: 'anders', label: 'Gewoon samen', icoon: '💌', kleur: '#FF8FAB' },
];

const perId = new Map(momentTypes.map((t) => [t.id, t]));

export const standaardType = perId.get('date');

export function typeVan(id) {
  return perId.get(id) || standaardType;
}

// De mijlpalen staan bovenaan in de kiezer, daarna de rest.
export const bijzondereTypes = momentTypes.filter((t) => t.bijzonder);
export const gewoneTypes = momentTypes.filter((t) => !t.bijzonder);

// Kleur voor tekst op een gekleurd vlak.
export function tekstOpKleur() {
  return kleuren.wit;
}
