// Maakt de geluidjes van de app als WAV-bestanden.
//
//   node scripts/maak-geluiden.mjs
//
// Alles wordt hier uitgerekend; er zijn geen opnames of bibliotheken nodig.
// De korte tonen zijn zachte sinussen met een nette in- en uitloop, zodat je
// geen klik hoort. De vogels zijn nagebootst: een vogelroep is in de kern een
// toon die snel in hoogte op en neer gaat, en dat is goed na te maken.
//
// Wil je liever echte opnames? Vervang gewoon de bestanden in assets/geluid/.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const UIT = join(HIER, '..', 'assets', 'geluid');

const TEMPO = 22050; // monsters per seconde; genoeg voor deze geluiden

// --- WAV wegschrijven -------------------------------------------------------

function schrijfWav(pad, monsters) {
  const aantal = monsters.length;
  const buffer = Buffer.alloc(44 + aantal * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + aantal * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(TEMPO, 24);
  buffer.writeUInt32LE(TEMPO * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(aantal * 2, 40);

  for (let i = 0; i < aantal; i += 1) {
    const waarde = Math.max(-1, Math.min(1, monsters[i]));
    buffer.writeInt16LE(Math.round(waarde * 32767), 44 + i * 2);
  }

  mkdirSync(dirname(pad), { recursive: true });
  writeFileSync(pad, buffer);
  return buffer.length;
}

const leeg = (seconden) => new Float32Array(Math.round(seconden * TEMPO));

// --- Bouwstenen -------------------------------------------------------------

// Een toon met een zachte aanzet en uitloop.
function toon(monsters, beginSec, duur, hertz, sterkte = 0.3, eindHertz = null) {
  const begin = Math.round(beginSec * TEMPO);
  const lengte = Math.round(duur * TEMPO);

  for (let i = 0; i < lengte; i += 1) {
    const plek = begin + i;
    if (plek >= monsters.length) break;

    const deel = i / lengte;
    // Snel aan, langzaam uit: dat klinkt als aanslaan in plaats van aanzetten.
    const omhulsel = Math.min(1, deel * 28) * Math.pow(1 - deel, 2.2);
    const frequentie = eindHertz ? hertz + (eindHertz - hertz) * deel : hertz;

    monsters[plek] += Math.sin((2 * Math.PI * frequentie * i) / TEMPO) * sterkte * omhulsel;
  }
}

// Een vogelroep: een toon die in een paar honderdste seconden op en neer
// glijdt, met een zweempje boventoon erbij.
function roep(monsters, beginSec, opties = {}) {
  const {
    duur = 0.09,
    laag = 2400,
    hoog = 3900,
    sterkte = 0.16,
    vorm = 'op-neer',
  } = opties;

  const begin = Math.round(beginSec * TEMPO);
  const lengte = Math.round(duur * TEMPO);
  let fase = 0;

  for (let i = 0; i < lengte; i += 1) {
    const plek = begin + i;
    if (plek >= monsters.length) break;

    const deel = i / lengte;
    let frequentie;
    if (vorm === 'op') frequentie = laag + (hoog - laag) * deel;
    else if (vorm === 'neer') frequentie = hoog - (hoog - laag) * deel;
    else frequentie = laag + (hoog - laag) * Math.sin(Math.PI * deel);

    fase += (2 * Math.PI * frequentie) / TEMPO;

    // Bol omhulsel: een vogel begint en eindigt niet abrupt.
    const omhulsel = Math.sin(Math.PI * deel) ** 1.4;
    monsters[plek] +=
      (Math.sin(fase) * 0.85 + Math.sin(fase * 2) * 0.15) * sterkte * omhulsel;
  }
}

function normaliseer(monsters, doel = 0.85) {
  let hoogste = 0;
  for (const waarde of monsters) hoogste = Math.max(hoogste, Math.abs(waarde));
  if (hoogste === 0) return monsters;
  const factor = doel / hoogste;
  for (let i = 0; i < monsters.length; i += 1) monsters[i] *= factor;
  return monsters;
}

// --- De geluidjes -----------------------------------------------------------

function tik() {
  const m = leeg(0.12);
  toon(m, 0, 0.09, 1320, 0.22);
  return normaliseer(m, 0.5);
}

function pin() {
  // Twee noten omhoog: "gezet".
  const m = leeg(0.34);
  toon(m, 0, 0.13, 880, 0.3);
  toon(m, 0.09, 0.22, 1318.5, 0.3);
  return normaliseer(m, 0.7);
}

function bewaard() {
  // Een klein drieklankje: iets is af.
  const m = leeg(0.62);
  toon(m, 0, 0.18, 659.3, 0.28);
  toon(m, 0.11, 0.2, 830.6, 0.28);
  toon(m, 0.22, 0.38, 987.8, 0.3);
  return normaliseer(m, 0.75);
}

function blader() {
  // Zacht papierachtig tikje voor het doorbladeren van foto's.
  const m = leeg(0.16);
  toon(m, 0, 0.11, 520, 0.16, 380);
  return normaliseer(m, 0.42);
}

function samen() {
  // Iets langer en warmer: jullie zijn gekoppeld.
  const m = leeg(1.1);
  const noten = [523.3, 659.3, 784, 1046.5];
  noten.forEach((hertz, i) => toon(m, i * 0.12, 0.6, hertz, 0.26));
  toon(m, 0.5, 0.55, 1318.5, 0.2);
  return normaliseer(m, 0.8);
}

// Een rustige achtergrond van twintig seconden die naadloos rond loopt.
function vogels() {
  const duur = 20;
  const m = leeg(duur);

  // Heel zacht ruisbed, als wind door bladeren. Laagdoorlaat door het
  // gemiddelde met het vorige monster te nemen.
  let vorige = 0;
  for (let i = 0; i < m.length; i += 1) {
    const ruis = (Math.random() * 2 - 1) * 0.06;
    vorige = vorige * 0.93 + ruis * 0.07;
    m[i] += vorige;
  }

  // Een paar soorten vogels door elkaar, op willekeurige momenten.
  const soorten = [
    { duur: 0.07, laag: 2600, hoog: 4200, vorm: 'op-neer', sterkte: 0.15 },
    { duur: 0.11, laag: 1900, hoog: 3100, vorm: 'neer', sterkte: 0.12 },
    { duur: 0.05, laag: 3400, hoog: 4800, vorm: 'op', sterkte: 0.1 },
    { duur: 0.15, laag: 2200, hoog: 2900, vorm: 'op-neer', sterkte: 0.09 },
  ];

  let wanneer = 0.4;
  while (wanneer < duur - 0.6) {
    const soort = soorten[Math.floor(Math.random() * soorten.length)];

    // Vogels roepen vaak twee of drie keer kort achter elkaar.
    const herhalingen = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < herhalingen; i += 1) {
      roep(m, wanneer + i * (soort.duur + 0.05 + Math.random() * 0.06), soort);
    }

    wanneer += 0.7 + Math.random() * 2.2;
  }

  // De laatste halve seconde overvloeien in de eerste, zodat de lus niet hapert.
  const overgang = Math.round(0.5 * TEMPO);
  for (let i = 0; i < overgang; i += 1) {
    const deel = i / overgang;
    const eind = m.length - overgang + i;
    m[i] = m[i] * deel + m[eind] * (1 - deel);
  }
  return normaliseer(m.slice(0, m.length - overgang), 0.55);
}

// --- Wegschrijven -----------------------------------------------------------

const bestanden = [
  ['tik.wav', tik()],
  ['pin.wav', pin()],
  ['bewaard.wav', bewaard()],
  ['blader.wav', blader()],
  ['samen.wav', samen()],
  ['vogels.wav', vogels()],
];

for (const [naam, monsters] of bestanden) {
  const bytes = schrijfWav(join(UIT, naam), monsters);
  const seconden = (monsters.length / TEMPO).toFixed(2);
  console.log(`${naam.padEnd(14)} ${seconden.padStart(5)}s  ${(bytes / 1024).toFixed(0).padStart(5)} kB`);
}

console.log('\nKlaar. De geluiden staan in assets/geluid/.');
