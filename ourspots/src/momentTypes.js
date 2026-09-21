// De soorten herinneringen die je op de kaart kunt zetten.
//
// Hier staat alleen wat taalonafhankelijk is: het icoon, de kleur, en of het
// een mijlpaal is. De namen staan in src/taal/, zodat ze meevertalen.
//
// "bijzonder: true" geeft de pin op de kaart een roze randje met een hartje
// ernaast — bedoeld voor de momenten die je maar één keer hebt.

export const momentTypes = [
  // --- De mijlpalen ---
  { id: 'eerste-ontmoeting', icoon: '👀', kleur: '#B583E8', bijzonder: true },
  { id: 'eerste-date', icoon: '🌹', kleur: '#FF5D8F', bijzonder: true },
  { id: 'eerste-kus', icoon: '💋', kleur: '#E23E6B', bijzonder: true },
  { id: 'samen', icoon: '💞', kleur: '#D64FA0', bijzonder: true },
  { id: 'ik-hou-van-jou', icoon: '💗', kleur: '#F0629B', bijzonder: true },
  { id: 'eerste-feestje', icoon: '🪩', kleur: '#8E7CE8', bijzonder: true },
  { id: 'eerste-logeren', icoon: '🌙', kleur: '#6C63B5', bijzonder: true },
  { id: 'jubileum', icoon: '🎉', kleur: '#F2569B', bijzonder: true },

  // --- Gewone momenten ---
  { id: 'date', icoon: '💘', kleur: '#FF7EA8' },
  { id: 'eten', icoon: '🍝', kleur: '#F08A5D' },
  { id: 'drinken', icoon: '🧋', kleur: '#C08457' },
  { id: 'film', icoon: '🎬', kleur: '#7F7FD5' },
  { id: 'wandeling', icoon: '🌳', kleur: '#6FBF8B' },
  { id: 'strand', icoon: '🏖️', kleur: '#43B2C9' },
  { id: 'zonsondergang', icoon: '🌅', kleur: '#FF9A5B' },
  { id: 'reis', icoon: '✈️', kleur: '#4FA3D9' },
  { id: 'feest', icoon: '🎊', kleur: '#C9A7EB' },
  { id: 'concert', icoon: '🎶', kleur: '#E36BAE' },
  { id: 'verjaardag', icoon: '🎂', kleur: '#FFB347' },
  { id: 'anders', icoon: '📍', kleur: '#FF6F91' },
];

const perId = new Map(momentTypes.map((t) => [t.id, t]));

export const standaardType = perId.get('date');

export function typeVan(id) {
  return perId.get(id) || standaardType;
}

// De mijlpalen staan bovenaan in de kiezer, daarna de rest.
export const bijzondereTypes = momentTypes.filter((t) => t.bijzonder);
export const gewoneTypes = momentTypes.filter((t) => !t.bijzonder);
