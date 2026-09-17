// Bouwt de website in docs/ uit de bron in site/.
//
// site/index.html is één pagina zonder omhulling: zo kan hij ook binnen
// Claude gepubliceerd worden. Voor de gewone website zetten we er hier een
// complete HTML-pagina omheen en kopiëren we de tekeningen erbij.

import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BRON = path.join(ROOT, 'site');
const DOEL = path.join(ROOT, 'docs');

const pagina = await readFile(path.join(BRON, 'index.html'), 'utf8');

// De bronpagina begint met titel, lettertype en stijl; daarna volgt de
// inhoud. Op die grens splitsen we, zodat alles in de juiste helft belandt.
const grens = pagina.indexOf('<header');
const kop = pagina.slice(0, grens).trimEnd();
const lijf = pagina.slice(grens).trimEnd();

const document = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Voorraad, kastlijsten en bestellijst voor de meubelonderdelen van PUUUR.">
<link rel="icon" href="img/favicon.svg">
<style>
  :root {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  body { margin: 0; font: 14px system-ui, sans-serif; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
${kop}
</head>
<body>
${lijf}
</body>
</html>
`;

await mkdir(path.join(DOEL, 'img'), { recursive: true });
await writeFile(path.join(DOEL, 'index.html'), document);
for (const bestand of await readdir(path.join(ROOT, 'public', 'img', 'parts'))) {
  if (bestand.endsWith('.svg')) {
    await cp(path.join(ROOT, 'public', 'img', 'parts', bestand), path.join(DOEL, 'img', bestand));
  }
}
await cp(path.join(ROOT, 'public', 'img', 'favicon.svg'), path.join(DOEL, 'img', 'favicon.svg'));
await writeFile(path.join(DOEL, '.nojekyll'), '');
console.log('docs/ bijgewerkt');
