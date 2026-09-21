// Datums netjes opgeschreven, zonder extra bibliotheken. De namen van
// maanden en dagen komen uit de taal die op dat moment geldt.

import { woorden } from '../taal';

const DAG_MS = 24 * 60 * 60 * 1000;

// We bewaren datums als "2026-04-20" zodat ze overal hetzelfde blijven.
export function naarDatumSleutel(datum) {
  const d = naarDate(datum);
  if (!d) return null;
  const maand = String(d.getMonth() + 1).padStart(2, '0');
  const dag = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${maand}-${dag}`;
}

export function naarDate(waarde) {
  if (!waarde) return null;
  if (waarde instanceof Date) return Number.isNaN(waarde.getTime()) ? null : waarde;
  if (typeof waarde === 'number') return new Date(waarde);
  if (typeof waarde?.toDate === 'function') return waarde.toDate(); // Firestore-timestamp
  if (typeof waarde === 'string') {
    const delen = waarde.split('-').map(Number);
    if (delen.length === 3 && delen.every((n) => Number.isFinite(n))) {
      return new Date(delen[0], delen[1] - 1, delen[2]);
    }
    const d = new Date(waarde);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function langeDatum(waarde) {
  const d = naarDate(waarde);
  if (!d) return '';
  return `${d.getDate()} ${woorden().datum.maanden[d.getMonth()]} ${d.getFullYear()}`;
}

export function korteDatum(waarde) {
  const d = naarDate(waarde);
  if (!d) return '';
  return `${d.getDate()} ${woorden().datum.maandenKort[d.getMonth()]} ${d.getFullYear()}`;
}

export function datumMetDag(waarde) {
  const d = naarDate(waarde);
  if (!d) return '';
  const w = woorden().datum;
  return `${w.dagen[d.getDay()]} ${d.getDate()} ${w.maanden[d.getMonth()]} ${d.getFullYear()}`;
}

export function maandJaar(waarde) {
  const d = naarDate(waarde);
  if (!d) return '';
  return `${woorden().datum.maanden[d.getMonth()]} ${d.getFullYear()}`;
}

export function vandaagSleutel() {
  return naarDatumSleutel(new Date());
}

// Aantal hele dagen tussen een datum en vandaag.
export function dagenSinds(waarde) {
  const d = naarDate(waarde);
  if (!d) return null;
  const begin = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const nu = new Date();
  const vandaag = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate()).getTime();
  return Math.round((vandaag - begin) / DAG_MS);
}

// "net nu", "3 min geleden", "gisteren" — voor de live locatie.
export function geledenKort(waarde) {
  const d = naarDate(waarde);
  if (!d) return '';
  const w = woorden().tijd;
  const seconden = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (seconden < 45) return w.netNu;
  const minuten = Math.round(seconden / 60);
  if (minuten < 60) return w.minGeleden(minuten);
  const uren = Math.round(minuten / 60);
  if (uren < 24) return w.uurGeleden(uren);
  const dagen = Math.round(uren / 24);
  if (dagen === 1) return w.gisteren;
  if (dagen < 7) return w.dagenGeleden(dagen);
  return korteDatum(d);
}

// Volgende maandviering of jubileum, voor het "Wij"-scherm.
export function volgendeMijlpaal(samenSinds) {
  const start = naarDate(samenSinds);
  if (!start) return null;
  const dagen = dagenSinds(start);
  if (dagen == null) return null;

  const rondeDagen = [30, 50, 100, 150, 200, 250, 300, 365, 500, 730, 1000, 1095, 1460, 1825];
  const volgende = rondeDagen.find((n) => n > dagen);

  // Ook de eerstvolgende maandverjaardag meenemen.
  const nu = new Date();
  let maandDatum = new Date(nu.getFullYear(), nu.getMonth(), start.getDate());
  if (maandDatum.getTime() <= nu.setHours(0, 0, 0, 0)) {
    maandDatum = new Date(maandDatum.getFullYear(), maandDatum.getMonth() + 1, start.getDate());
  }
  const dagenTotMaand = Math.round((maandDatum.getTime() - new Date().setHours(0, 0, 0, 0)) / DAG_MS);

  const w = woorden();
  const opties = [];
  if (volgende) {
    opties.push({
      soort: 'dagen',
      over: volgende - dagen,
      tekst: `${volgende} ${w.wij.dagenSamen}`,
      datum: new Date(start.getTime() + volgende * DAG_MS),
    });
  }
  opties.push({
    soort: 'maand',
    over: dagenTotMaand,
    tekst: `${dagen + dagenTotMaand} ${w.wij.dagenSamen}`,
    datum: maandDatum,
  });

  opties.sort((a, b) => a.over - b.over);
  return opties[0] || null;
}
