// Startgegevens: een realistische onderdelenlijst zodat het programma
// meteen bruikbaar is. Pas aan of verwijder via het scherm "Onderdelen".

const day = 24 * 60 * 60 * 1000;
const ago = (days) => new Date(Date.now() - days * day).toISOString();

export function seedDatabase() {
  const parts = [
    part('SCH-1101', 'Potscharnier 110° opdek', 'Scharnieren', {
      stock: 246, minStock: 120, orderQty: 200, supplier: 'Van Dijk Beslag',
      location: 'A1-01', photo: '/img/parts/scharnier-opdek.svg',
      notes: 'Standaard scharnier voor opdek deuren, softclose.',
    }),
    part('SCH-1102', 'Potscharnier 165° binnenliggend', 'Scharnieren', {
      stock: 38, minStock: 40, orderQty: 100, supplier: 'Van Dijk Beslag',
      location: 'A1-02', photo: '/img/parts/scharnier-165.svg',
      notes: 'Voor hoekkasten en deuren die ver open moeten.',
    }),
    part('SCH-1150', 'Montageplaat kruis 0 mm', 'Scharnieren', {
      stock: 410, minStock: 150, orderQty: 300, supplier: 'Van Dijk Beslag',
      location: 'A1-03', photo: '/img/parts/montageplaat.svg',
    }),
    part('GEL-2201', 'Ladegeleider softclose 450 mm', 'Geleiders', {
      stock: 24, minStock: 20, orderQty: 40, unit: 'set', supplier: 'Hettich NL',
      location: 'B2-01', photo: '/img/parts/ladegeleider.svg',
      notes: 'Set = links + rechts.',
    }),
    part('GEL-2210', 'Push-to-open geleider 500 mm', 'Geleiders', {
      stock: 6, minStock: 10, orderQty: 20, unit: 'set', supplier: 'Hettich NL',
      location: 'B2-02', photo: '/img/parts/push-to-open.svg',
    }),
    part('PLK-3301', 'Plankdrager verstelbaar 5 mm', 'Planksteunen', {
      stock: 820, minStock: 300, orderQty: 500, supplier: 'Beslagcentrum',
      location: 'B3-04', photo: '/img/parts/plankdrager.svg',
    }),
    part('SCR-4401', 'Spaanplaatschroef 4,0 x 30 mm', 'Schroeven', {
      stock: 14, minStock: 6, orderQty: 12, unit: 'doos', supplier: 'Bouwmaat',
      location: 'C1-01', photo: '/img/parts/schroef.svg',
      notes: 'Doos van 200 stuks.',
    }),
    part('SCR-4410', 'Systeemschroef 6,3 x 13 mm', 'Schroeven', {
      stock: 9, minStock: 8, orderQty: 10, unit: 'doos', supplier: 'Bouwmaat',
      location: 'C1-02', photo: '/img/parts/systeemschroef.svg',
    }),
    part('GRP-5501', 'Greep RVS 128 mm', 'Grepen', {
      stock: 72, minStock: 30, orderQty: 50, supplier: 'Beslagcentrum',
      location: 'C2-01', photo: '/img/parts/greep.svg',
    }),
    part('GRP-5510', 'Knop zwart mat 30 mm', 'Grepen', {
      stock: 18, minStock: 25, orderQty: 50, supplier: 'Beslagcentrum',
      location: 'C2-02', photo: '/img/parts/knop.svg',
    }),
    part('VBD-6601', 'Houten deuvel 8 x 30 mm', 'Verbindingen', {
      stock: 1400, minStock: 400, orderQty: 1000, supplier: 'Bouwmaat',
      location: 'C3-01', photo: '/img/parts/deuvel.svg',
    }),
    part('VBD-6610', 'Excenter verbinder 15 mm', 'Verbindingen', {
      stock: 260, minStock: 200, orderQty: 300, supplier: 'Beslagcentrum',
      location: 'C3-02', photo: '/img/parts/excenter.svg',
    }),
    part('OPH-7701', 'Kastophangbeugel verstelbaar', 'Ophangen', {
      stock: 48, minStock: 30, orderQty: 50, supplier: 'Van Dijk Beslag',
      location: 'D1-01', photo: '/img/parts/ophangbeugel.svg',
    }),
    part('OPH-7710', 'Kastpoot 100 mm verstelbaar', 'Ophangen', {
      stock: 96, minStock: 60, orderQty: 100, supplier: 'Van Dijk Beslag',
      location: 'D1-02', photo: '/img/parts/kastpoot.svg',
    }),
    part('SLT-8801', 'Magneetsluiting wit', 'Sluitingen', {
      stock: 0, minStock: 20, orderQty: 50, supplier: 'Beslagcentrum',
      location: 'D2-01', photo: '/img/parts/magneetsluiting.svg',
      notes: 'Alleen nog voor oude series.',
    }),
  ];

  const byNumber = Object.fromEntries(parts.map((p) => [p.number, p.id]));

  const picklists = [
    {
      id: 'kl_51436',
      cabinetNumber: '51436',
      title: 'Keukenkast onderbouw 600 mm',
      note: 'Twee deuren, één vaste plank.',
      status: 'open',
      createdBy: 'Roy',
      createdAt: ago(0),
      startedBy: null,
      startedAt: null,
      completedBy: null,
      completedAt: null,
      lines: [
        line(byNumber['SCH-1101'], 4),
        line(byNumber['SCH-1150'], 4),
        line(byNumber['PLK-3301'], 4),
        line(byNumber['GRP-5501'], 2),
        line(byNumber['OPH-7710'], 4),
        line(byNumber['SCR-4401'], 1),
      ],
    },
    {
      id: 'kl_51431',
      cabinetNumber: '51431',
      title: 'Ladekast 3 laden',
      note: '',
      status: 'incomplete',
      createdBy: 'Roy',
      createdAt: ago(1),
      startedBy: 'Dean',
      startedAt: ago(1),
      completedBy: 'Dean',
      completedAt: ago(1),
      lines: [
        { ...line(byNumber['GEL-2201'], 3), pickedQty: 3, picked: true },
        { ...line(byNumber['GRP-5510'], 3), pickedQty: 1, picked: true, missingQty: 2 },
        { ...line(byNumber['SCR-4410'], 1), pickedQty: 1, picked: true },
        { ...line(byNumber['VBD-6610'], 12), pickedQty: 12, picked: true },
      ],
    },
    {
      id: 'kl_51428',
      cabinetNumber: '51428',
      title: 'Bovenkast 800 mm met glasdeur',
      note: '',
      status: 'done',
      createdBy: 'Roy',
      createdAt: ago(3),
      startedBy: 'Dean',
      startedAt: ago(2),
      completedBy: 'Dean',
      completedAt: ago(2),
      lines: [
        { ...line(byNumber['SCH-1102'], 2), pickedQty: 2, picked: true },
        { ...line(byNumber['SCH-1150'], 2), pickedQty: 2, picked: true },
        { ...line(byNumber['OPH-7701'], 2), pickedQty: 2, picked: true },
        { ...line(byNumber['PLK-3301'], 4), pickedQty: 4, picked: true },
      ],
    },
  ];

  const orders = [
    {
      id: 'bs_1001',
      partId: byNumber['SCH-1102'],
      qty: 100,
      supplier: 'Van Dijk Beslag',
      status: 'open',
      note: 'Verwacht komende week.',
      orderedBy: 'Roy',
      createdAt: ago(2),
      receivedAt: null,
      receivedQty: 0,
    },
  ];

  const activity = [
    event('picklist', 'Kastlijst 51428 compleet gepakt door Dean', ago(2)),
    event('shortage', 'Tekort gemeld op kastlijst 51431: 2 x Knop zwart mat 30 mm', ago(1)),
    event('order', '100 x Potscharnier 165° binnenliggend besteld bij Van Dijk Beslag', ago(2)),
    event('picklist', 'Kastlijst 51436 aangemaakt door Roy', ago(0)),
  ];

  return { version: 1, parts, picklists, orders, activity };
}

function part(number, name, category, extra = {}) {
  return {
    id: `on_${number.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    number,
    name,
    category,
    unit: 'stuks',
    stock: 0,
    minStock: 0,
    orderQty: 0,
    supplier: '',
    location: '',
    photo: '',
    notes: '',
    createdAt: ago(30),
    ...extra,
  };
}

function line(partId, qty) {
  return { partId, qty, pickedQty: 0, missingQty: 0, missingHandled: false, picked: false };
}

function event(type, text, at) {
  return { id: `ev_${Math.random().toString(36).slice(2, 10)}`, type, text, at, user: '' };
}
