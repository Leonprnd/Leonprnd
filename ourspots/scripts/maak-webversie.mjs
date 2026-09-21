// Maakt van de geëxporteerde webversie iets dat een iPhone als app behandelt.
//
//   npm run build:web
//
// Waarom een nabewerking en geen app/+html.js? Dat sjabloon wordt alleen
// gebruikt bij output: 'static', en daar wordt elke route een los HTML-bestand.
// Dat botst met onze dynamische route /moment/<id>: bij verversen krijg je dan
// een 404. Met output: 'single' is er één index.html die alles afhandelt, en
// die passen we hier aan.
//
// Draai dit dus altijd ná `npx expo export --platform web`.

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const WORTEL = join(HIER, '..');
const UIT = process.argv[2] || join(WORTEL, 'dist');

const indexPad = join(UIT, 'index.html');
if (!existsSync(indexPad)) {
  console.error(`Geen index.html in ${UIT}. Draai eerst:`);
  console.error('  npx expo export --platform web');
  process.exit(1);
}

// --- Het icoon voor op het beginscherm --------------------------------------

const icoonBron = join(WORTEL, 'assets', 'icon.png');
const icoonDoel = join(UIT, 'icon.png');
if (existsSync(icoonBron) && !existsSync(icoonDoel)) copyFileSync(icoonBron, icoonDoel);

// --- De koptekst ------------------------------------------------------------

const extra = `
    <!-- Hieronder staat wat een iPhone nodig heeft om "Zet op beginscherm"
         als een app te behandelen in plaats van als bladwijzer. -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="OurSpots" />
    <link rel="apple-touch-icon" href="/icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="description" content="Een kaart van jullie samen: de plekken waar jullie waren, met foto's en verhalen." />
    <style>
      /* Geen blauwe vlek bij het aantikken, en niet meeveren aan de randen. */
      * { -webkit-tap-highlight-color: transparent; }
      html, body { background-color: #FFF1F5; overscroll-behavior: none; }
    </style>
`;

let html = readFileSync(indexPad, 'utf8');

if (html.includes('apple-mobile-web-app-capable')) {
  console.log('index.html was al bijgewerkt.');
} else {
  // De viewport van Expo laat de randen van een iPhone ongebruikt; met
  // viewport-fit=cover loopt de app door tot achter de notch.
  html = html.replace(
    /<meta name="viewport"[^>]*>/,
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />',
  );
  html = html.replace('<html lang="en">', '<html lang="nl">');
  html = html.replace('</head>', `${extra}  </head>`);
  writeFileSync(indexPad, html);
  console.log('index.html bijgewerkt voor het beginscherm.');
}

// --- Het manifest -----------------------------------------------------------
// Android en Chrome kijken hiernaar om de app te kunnen installeren.

const manifest = {
  name: 'OurSpots',
  short_name: 'OurSpots',
  description: 'Een kaart van jullie samen.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#FFF1F5',
  theme_color: '#FF6F91',
  icons: [
    { src: '/icon.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
    { src: '/icon.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
  ],
};
writeFileSync(join(UIT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('manifest.json geschreven.');

// --- Zodat verversen op een subpagina geen 404 geeft ------------------------

const vercel = { rewrites: [{ source: '/(.*)', destination: '/index.html' }] };
writeFileSync(join(UIT, 'vercel.json'), `${JSON.stringify(vercel, null, 2)}\n`);
writeFileSync(join(UIT, '_redirects'), '/*    /index.html   200\n');
console.log('vercel.json en _redirects geschreven (voor Vercel en Netlify).');

console.log(`\nKlaar. De webversie staat in ${UIT}.`);
