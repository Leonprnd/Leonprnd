// Bouwt de webshop in docs/winkel/ uit de bron in winkel/.
//
// De bestaande werkplaats-app blijft ongemoeid: die schrijft docs/index.html
// en docs/img/, wij schrijven uitsluitend in docs/winkel/.
//
// Elke pagina in winkel/paginas/ begint met een blokje instellingen tussen
// <!--# en #-->. De rest van het bestand is de inhoud, die in het sjabloon
// wordt gezet. Zo staat de kop- en voetbalk op één plek in plaats van
// vijftien keer overgetypt.

import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BRON = path.join(ROOT, 'winkel');
const DOEL = path.join(ROOT, 'docs', 'winkel');

const bedrijf = JSON.parse(await readFile(path.join(BRON, 'bedrijf.json'), 'utf8'));
const sjabloon = await readFile(path.join(BRON, 'sjabloon.html'), 'utf8');

/** Leest het instellingenblok bovenaan een pagina. */
function splits(tekst) {
  const match = tekst.match(/^\s*<!--#([\s\S]*?)#-->\s*/);
  if (!match) {
    return { instellingen: {}, inhoud: tekst };
  }
  const instellingen = {};
  for (const regel of match[1].split('\n')) {
    const scheiding = regel.indexOf(':');
    if (scheiding === -1) continue;
    const sleutel = regel.slice(0, scheiding).trim();
    if (!sleutel) continue;
    instellingen[sleutel] = regel.slice(scheiding + 1).trim();
  }
  return { instellingen, inhoud: tekst.slice(match[0].length) };
}

/** Vervangt {{sleutel}} en {{bedrijf.sleutel}}. */
function vul(tekst, waarden) {
  return tekst.replace(/\{\{([a-zA-Z0-9_.-]+)\}\}/g, (heel, sleutel) => {
    if (sleutel.startsWith('bedrijf.')) {
      const veld = sleutel.slice(8);
      return veld in bedrijf ? String(bedrijf[veld]) : heel;
    }
    return sleutel in waarden ? String(waarden[sleutel]) : '';
  });
}

await rm(DOEL, { recursive: true, force: true });
await mkdir(DOEL, { recursive: true });

const bestanden = (await readdir(path.join(BRON, 'paginas')))
  .filter((n) => n.endsWith('.html'))
  .sort();

const jaar = new Date().getFullYear();
const zichtbaar = [];

for (const bestand of bestanden) {
  const rauw = await readFile(path.join(BRON, 'paginas', bestand), 'utf8');
  const { instellingen, inhoud } = splits(rauw);
  const naam = bestand.replace(/\.html$/, '');

  // Het huidige menu-item krijgt aria-current, zodat het ook zonder kleur
  // duidelijk is waar je bent.
  const ariaVelden = {};
  for (const item of ['product', 'verhaal', 'veelgestelde-vragen', 'contact']) {
    ariaVelden[`aria.${item}`] = item === naam ? ' aria-current="page"' : '';
  }

  const pagina = vul(sjabloon, {
    titel: instellingen.titel || bedrijf.naam,
    omschrijving: instellingen.omschrijving || bedrijf.leus,
    robots: instellingen.robots || 'index, follow',
    hoofd_extra: instellingen.hoofd_extra || '',
    voet_extra: instellingen.voet_extra || '',
    bestand,
    jaar,
    inhoud: vul(inhoud, { jaar, bestand }),
    ...ariaVelden,
  });

  await writeFile(path.join(DOEL, bestand), pagina);
  if ((instellingen.robots || '').includes('noindex') === false) {
    zichtbaar.push({ bestand, prioriteit: instellingen.prioriteit || '0.6' });
  }
}

await cp(path.join(BRON, 'assets'), path.join(DOEL, 'assets'), { recursive: true });

// De winkelwagentest gaat mee, zodat je na elke wijziging in de browser kunt
// controleren of het rekenwerk nog klopt. Zoekmachines houden we er weg via
// robots.txt hieronder.
await cp(path.join(BRON, 'test-winkelwagen.html'), path.join(DOEL, '_test-winkelwagen.html'));

// Zoekmachines vertellen welke pagina's er zijn.
await writeFile(
  path.join(DOEL, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    zichtbaar
      .map(
        ({ bestand, prioriteit }) =>
          `  <url><loc>${bedrijf.webadres}/${bestand}</loc><priority>${prioriteit}</priority></url>`
      )
      .join('\n') +
    `\n</urlset>\n`
);

await writeFile(
  path.join(DOEL, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /afrekenen.html\nDisallow: /bedankt.html\n` +
    `Disallow: /_test-winkelwagen.html\n\nSitemap: ${bedrijf.webadres}/sitemap.xml\n`
);

console.log(`docs/winkel/: ${bestanden.length} pagina's gebouwd`);

// Waarschuwen voor alles wat nog ingevuld moet worden. Zo kan er geen winkel
// live gaan met "[KVK-NUMMER]" in de voettekst.
const openstaand = Object.entries(bedrijf)
  .filter(([sleutel, waarde]) => !sleutel.startsWith('_') && /\[[A-Z]/.test(String(waarde)))
  .map(([sleutel]) => sleutel);

if (openstaand.length) {
  console.log(
    `\n  Let op — nog invullen in winkel/bedrijf.json voordat je live gaat:\n` +
      openstaand.map((s) => `    - ${s}`).join('\n') +
      `\n  Zie draaiboek/08-juridisch-en-kvk.md.\n`
  );
}
