// Test de zoekdienst zonder internet: we zetten fetch even opzij en geven de
// antwoorden die Photon en Nominatim echt teruggeven. Zo controleren we het
// stuk waar een fout stil blijft — het uitpakken van hun antwoorden, en de
// keuze wie er aan de beurt is.

import test from 'node:test';
import assert from 'node:assert/strict';

const { zoekPlekken, plekOpPunt } = await import('../src/services/zoeken.js');

// Photon geeft coördinaten als [lengte, breedte] — omgedraaid dus. Precies
// het soort ding dat je pas merkt als je pin in zee staat.
const PHOTON_ANTWOORD = {
  features: [
    {
      geometry: { type: 'Point', coordinates: [5.0432, 51.6503] },
      properties: {
        osm_id: 1234,
        osm_type: 'W',
        name: 'Efteling',
        city: 'Kaatsheuvel',
        country: 'Nederland',
      },
    },
    {
      geometry: { type: 'Point', coordinates: [4.8952, 52.3702] },
      properties: {
        osm_id: 99,
        osm_type: 'N',
        street: 'Dam',
        housenumber: '1',
        city: 'Amsterdam',
        country: 'Nederland',
      },
    },
  ],
};

const NOMINATIM_ANTWOORD = [
  {
    osm_id: 555,
    osm_type: 'way',
    lat: '52.0705',
    lon: '4.3007',
    name: 'Binnenhof',
    display_name: 'Binnenhof, Den Haag, Zuid-Holland, Nederland',
  },
];

function zetFetchOp(afhandelen) {
  const echt = globalThis.fetch;
  globalThis.fetch = async (adres) => afhandelen(String(adres));
  return () => {
    globalThis.fetch = echt;
  };
}

const goed = (gegevens) => ({ ok: true, status: 200, json: async () => gegevens });
const stuk = { ok: false, status: 503, json: async () => ({}) };

test('leest Photon uit, met breedte en lengte de goede kant op', async () => {
  const terug = zetFetchOp(() => goed(PHOTON_ANTWOORD));
  try {
    const gevonden = await zoekPlekken('efteling', { lat: 52, lng: 5 });
    assert.equal(gevonden.length, 2);
    assert.equal(gevonden[0].titel, 'Efteling');
    assert.ok(Math.abs(gevonden[0].lat - 51.6503) < 1e-6, 'breedte hoort 51.65 te zijn');
    assert.ok(Math.abs(gevonden[0].lng - 5.0432) < 1e-6, 'lengte hoort 5.04 te zijn');
    assert.match(gevonden[0].ondertitel, /Kaatsheuvel/);
  } finally {
    terug();
  }
});

test('valt op een adres terug op straat en huisnummer als naam', async () => {
  const terug = zetFetchOp(() => goed(PHOTON_ANTWOORD));
  try {
    const gevonden = await zoekPlekken('dam', { lat: 52, lng: 5 });
    assert.equal(gevonden[1].titel, 'Dam 1');
  } finally {
    terug();
  }
});

test('geeft de plekken bij je in de buurt mee aan de zoeker', async () => {
  let gevraagd = '';
  const terug = zetFetchOp((adres) => {
    gevraagd = adres;
    return goed(PHOTON_ANTWOORD);
  });
  try {
    await zoekPlekken('station', { lat: 52.09, lng: 5.12 });
    assert.match(gevraagd, /lat=52\.09/);
    assert.match(gevraagd, /lon=5\.12/);
  } finally {
    terug();
  }
});

test('ligt Photon eruit, dan neemt Nominatim het over', async () => {
  const bezocht = [];
  const terug = zetFetchOp((adres) => {
    bezocht.push(adres);
    if (adres.includes('photon')) return stuk;
    return goed(NOMINATIM_ANTWOORD);
  });
  try {
    const gevonden = await zoekPlekken('binnenhof', null);
    assert.equal(gevonden.length, 1);
    assert.equal(gevonden[0].titel, 'Binnenhof');
    assert.equal(gevonden[0].lat, 52.0705);
    assert.equal(gevonden[0].lng, 4.3007);
    assert.match(gevonden[0].ondertitel, /Den Haag/);
    assert.ok(bezocht.some((a) => a.includes('photon')), 'Photon eerst');
    assert.ok(bezocht.some((a) => a.includes('nominatim')), 'daarna Nominatim');
  } finally {
    terug();
  }
});

test('korte invoer vraagt niets aan niemand', async () => {
  let aantal = 0;
  const terug = zetFetchOp(() => {
    aantal += 1;
    return goed(PHOTON_ANTWOORD);
  });
  try {
    assert.deepEqual(await zoekPlekken('ef', { lat: 52, lng: 5 }), []);
    assert.deepEqual(await zoekPlekken('  ', { lat: 52, lng: 5 }), []);
    assert.equal(aantal, 0);
  } finally {
    terug();
  }
});

test('vindt de naam van een plek waar je lang op drukt', async () => {
  const terug = zetFetchOp((adres) => {
    assert.match(adres, /reverse/);
    return goed(PHOTON_ANTWOORD);
  });
  try {
    const plek = await plekOpPunt(51.6503, 5.0432);
    assert.equal(plek.titel, 'Efteling');
  } finally {
    terug();
  }
});

test('een punt zonder geldige coördinaten vraagt niets', async () => {
  let aantal = 0;
  const terug = zetFetchOp(() => {
    aantal += 1;
    return goed(PHOTON_ANTWOORD);
  });
  try {
    assert.equal(await plekOpPunt(NaN, 5), null);
    assert.equal(aantal, 0);
  } finally {
    terug();
  }
});
