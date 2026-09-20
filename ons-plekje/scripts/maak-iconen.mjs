// Tekent het app-icoon: een kaartspeld met een hartje erin, op een zacht
// roze verloop. Alles wordt hier uitgerekend en als PNG weggeschreven, zodat
// er geen tekenprogramma nodig is.
//
//   node scripts/maak-iconen.mjs
//
// Wil je een ander icoon? Vervang gewoon de bestanden in assets/.

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(HIER, '..', 'assets');

// --- PNG schrijven ----------------------------------------------------------

const CRC_TABEL = (() => {
  const tabel = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabel[n] = c;
  }
  return tabel;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABEL[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const lengte = Buffer.alloc(4);
  lengte.writeUInt32BE(data.length);
  const lijf = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(lijf));
  return Buffer.concat([lengte, lijf, crc]);
}

function schrijfPng(pad, breedte, hoogte, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(breedte, 0);
  ihdr.writeUInt32BE(hoogte, 4);
  ihdr[8] = 8; // 8 bits per kleur
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Elke regel krijgt een filterbyte 0 ("geen filter") ervoor.
  const rauw = Buffer.alloc(hoogte * (breedte * 4 + 1));
  for (let y = 0; y < hoogte; y += 1) {
    const van = y * breedte * 4;
    const naar = y * (breedte * 4 + 1);
    rauw[naar] = 0;
    rgba.copy(rauw, naar + 1, van, van + breedte * 4);
  }

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rauw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  mkdirSync(dirname(pad), { recursive: true });
  writeFileSync(pad, png);
  return png.length;
}

// --- Vormen -----------------------------------------------------------------
// Alles rekent in een vierkantje van -1 tot 1, met de speld in het midden.

function inCirkel(x, y, cx, cy, r) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function inDriehoek(px, py, a, b, c) {
  const teken = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const d1 = teken([px, py], a, b);
  const d2 = teken([px, py], b, c);
  const d3 = teken([px, py], c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

// De speld: een bol met een puntje eronder.
function inSpeld(x, y, schaal = 1) {
  const sx = x / schaal;
  const sy = y / schaal;
  if (inCirkel(sx, sy, 0, -0.35, 0.62)) return true;
  return inDriehoek(sx, sy, [-0.52, 0.0], [0.52, 0.0], [0, 1.15]);
}

// Het hartje: de klassieke formule (x² + y² - 1)³ - x²y³ ≤ 0.
function inHart(x, y, cx, cy, grootte) {
  const hx = (x - cx) / grootte;
  const hy = -(y - cy) / grootte; // op het scherm loopt y naar beneden
  const t = hx * hx + hy * hy - 1;
  return t * t * t - hx * hx * hy * hy * hy <= 0;
}

// Vierpuntige fonkeling (een astroïde).
function inFonkeling(x, y, cx, cy, grootte) {
  const fx = Math.abs((x - cx) / grootte);
  const fy = Math.abs((y - cy) / grootte);
  if (fx > 1 || fy > 1) return false;
  return Math.cbrt(fx * fx) + Math.cbrt(fy * fy) <= 1;
}

// --- Kleuren ----------------------------------------------------------------

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const ACHTER_VAN = hex('#FFF3F7');
const ACHTER_TOT = hex('#FFB6CE');
const HART_VAN = hex('#FF8FAB');
const HART_TOT = hex('#E04E74');
const WIT = [255, 255, 255];

function meng(a, b, t) {
  const k = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

// --- Tekenen ----------------------------------------------------------------

// Geeft de kleur en dekking van één monsterpunt terug.
function monster(x, ruweY, opties) {
  // x, y lopen van -1 tot 1.
  const { metAchtergrond, speldSchaal, omgekeerd } = opties;

  // De speld loopt van -0.60 tot +0.71 hoog; zonder deze correctie hangt hij
  // net iets te laag in het vierkant.
  const y = ruweY + 0.055 * speldSchaal;

  // Fonkelingen naast de speld.
  const fonkelingen = [
    { cx: 0.62 * speldSchaal, cy: -0.72 * speldSchaal, r: 0.15 * speldSchaal },
    { cx: -0.66 * speldSchaal, cy: -0.3 * speldSchaal, r: 0.1 * speldSchaal },
    { cx: 0.5 * speldSchaal, cy: 0.5 * speldSchaal, r: 0.085 * speldSchaal },
  ];

  const inSpeldVorm = inSpeld(x, y, speldSchaal);

  if (inSpeldVorm) {
    // Het hartje zit in de bol van de speld. Zonder achtergrond draaien we de
    // kleuren om: een roze speld met een wit hart, want een witte speld valt
    // weg tegen het lichte vlak waar Android en het startscherm hem op zetten.
    const hartMidden = -0.35 * speldSchaal;
    const t = (y - hartMidden + 0.4 * speldSchaal) / (0.8 * speldSchaal);

    if (inHart(x, y, 0, hartMidden, 0.38 * speldSchaal)) {
      return { kleur: omgekeerd ? WIT : meng(HART_VAN, HART_TOT, t), alfa: 1 };
    }
    return { kleur: omgekeerd ? meng(HART_VAN, HART_TOT, t) : WIT, alfa: 1 };
  }

  for (const f of fonkelingen) {
    if (inFonkeling(x, y, f.cx, f.cy, f.r)) {
      return { kleur: omgekeerd ? hex('#FF8FAB') : WIT, alfa: 1 };
    }
  }

  if (!metAchtergrond) return { kleur: [0, 0, 0], alfa: 0 };

  // Achtergrond: verloop van linksboven naar rechtsonder, met een lichte gloed.
  const t = (x + y + 2) / 4;
  const basis = meng(ACHTER_VAN, ACHTER_TOT, t);
  const afstandTotMidden = Math.sqrt(x * x + y * y);
  const gloed = Math.max(0, 1 - afstandTotMidden / 1.5) * 0.16;
  return { kleur: meng(basis, WIT, gloed), alfa: 1 };
}

function teken(pad, maat, opties) {
  const extra = opties.supersample || 3;
  const rgba = Buffer.alloc(maat * maat * 4);

  for (let py = 0; py < maat; py += 1) {
    for (let px = 0; px < maat; px += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < extra; sy += 1) {
        for (let sx = 0; sx < extra; sx += 1) {
          const x = ((px + (sx + 0.5) / extra) / maat) * 2 - 1;
          const y = ((py + (sy + 0.5) / extra) / maat) * 2 - 1;
          const m = monster(x, y, opties);
          r += m.kleur[0] * m.alfa;
          g += m.kleur[1] * m.alfa;
          b += m.kleur[2] * m.alfa;
          a += m.alfa;
        }
      }

      const n = extra * extra;
      const i = (py * maat + px) * 4;
      // Kleuren zijn al met hun dekking vermenigvuldigd; weer terugdelen zodat
      // doorzichtige randen niet zwart worden.
      rgba[i] = a > 0 ? Math.round(r / a) : 0;
      rgba[i + 1] = a > 0 ? Math.round(g / a) : 0;
      rgba[i + 2] = a > 0 ? Math.round(b / a) : 0;
      rgba[i + 3] = Math.round((a / n) * 255);
    }
  }

  const bytes = schrijfPng(pad, maat, maat, rgba);
  console.log(`${pad.replace(/.*assets\//, 'assets/').padEnd(26)} ${maat}x${maat}  ${(bytes / 1024).toFixed(1)} kB`);
}

// --- En dan de bestanden ----------------------------------------------------

teken(join(ASSETS, 'icon.png'), 1024, { metAchtergrond: true, speldSchaal: 0.62 });

// Android knipt het icoon rond of vierkant; de speld moet dus binnen de
// veilige cirkel in het midden blijven (ongeveer twee derde van het vlak).
teken(join(ASSETS, 'adaptive-icon.png'), 1024, {
  metAchtergrond: false,
  omgekeerd: true,
  speldSchaal: 0.42,
});

teken(join(ASSETS, 'splash-icon.png'), 512, {
  metAchtergrond: false,
  omgekeerd: true,
  speldSchaal: 0.7,
  supersample: 4,
});
teken(join(ASSETS, 'favicon.png'), 96, { metAchtergrond: true, speldSchaal: 0.66, supersample: 6 });

console.log('\nKlaar. De iconen staan in assets/.');
