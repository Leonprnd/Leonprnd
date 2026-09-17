// Startgegevens: de onderdelenlijst van PUUUR, zoals die op het papieren
// blad staat. De voorraad staat nog op nul: elk onderdeel blijft "nog niet
// geteld" totdat iemand het aantal invult via het scherm "Onderdelen".

const day = 24 * 60 * 60 * 1000;
const ago = (days) => new Date(Date.now() - days * day).toISOString();

export function seedDatabase() {
  const parts = [
    part("doos", "", "Doos t.b.v. onderdelen", "Verpakking", {
      supplier: "Raja",
      location: "",
      photo: "/img/parts/doos.svg",
    }),
    part("puuur-label", "", "PUUUR Label Meubel", "Labels", {
      supplier: "FOCKS",
      location: "11-2",
      photo: "/img/parts/label.svg",
    }),
    part("voetplaat-stelpoot", "", "Voetplaat stelpoot schroef", "Stelpoten", {
      supplier: "Maclean",
      location: "29",
      photo: "/img/parts/kastpoot.svg",
    }),
    part("stelpoot-80", "", "Stelpoot 80mm", "Stelpoten", {
      supplier: "Maclean",
      location: "31",
      photo: "/img/parts/kastpoot.svg",
    }),
    part("axilo-80", "", "AXILO Stelpoot 80mm (70-100mm)", "Stelpoten", {
      supplier: "Hafele",
      location: "32",
      photo: "/img/parts/kastpoot.svg",
    }),
    part("axilo-60", "", "AXILO Stelpoot 60mm (53-70mm)", "Stelpoten", {
      supplier: "Hafele",
      location: "30",
      photo: "/img/parts/kastpoot.svg",
    }),
    part("plintklem", "", "Plintklem drukveer", "Stelpoten", {
      supplier: "Maclean",
      location: "9",
      photo: "/img/parts/plintklem.svg",
    }),
    part("kabeldoorvoerdop-60", "", "Kabeldoorvoerdop 60mm", "Elektra", {
      supplier: "STS Elektra",
      location: "19",
      photo: "/img/parts/kabeldop.svg",
    }),
    part("eurohoek", "", "Eurohoek met afdekkap zwart", "Verbindingen", {
      supplier: "Ostermann",
      location: "23+24",
      photo: "/img/parts/eurohoek.svg",
    }),
    part("tip-on-lang", "", "Tip-on lang", "Openen en sluiten", {
      supplier: "Hoecke",
      location: "18",
      photo: "/img/parts/push-to-open.svg",
    }),
    part("miniwinch", "", "Miniwinch", "Verbindingen", {
      supplier: "Wurth",
      location: "20/21/22",
      photo: "/img/parts/miniwinch.svg",
    }),
    part("kruisplaat-lang", "174H7100E DUEPL", "Kruisplaat lange plug (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "17",
      photo: "/img/parts/montageplaat.svg",
    }),
    part("kruisplaat-kort", "174H710ZE DUEPL", "Kruisplaat korte plug (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "16",
      photo: "/img/parts/montageplaat.svg",
    }),
    part("cliptop-blumotion-hoek", "71B3590 MB", "Clip-top BLUMOTION (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "3",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("cliptop-zelfsluitend-hoek", "71T3590 MB V250 NI", "Clip-top Zelfsluitend (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "4",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("cliptop-nietzelfsluitend-hoek", "70T3590.TLMB V50 NI", "Clip-top Niet-Zelfsluitend (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "1",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("puuur-scharnier-logo", "", "PUUUR Scharnier logo", "Labels", {
      supplier: "Hoecke",
      location: "11-2",
      photo: "/img/parts/label.svg",
    }),
    part("cliptop-blumotion-midden", "71B3690 MB V250 NI", "Clip-top BLUMOTION (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "2",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("cliptop-zelfsluitend-midden", "71T3690 MB V50 NI", "Clip-top Zelfsluitend (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "15",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("cliptop-nietzelfsluitend-midden", "70T3690.TLMB V50 NI", "Clip-top Niet-Zelfsluitend (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "14",
      photo: "/img/parts/scharnier-opdek.svg",
    }),
    part("scharnier-logo-links", "", "Scharnier logo LINKS (middenaanslag)", "Labels", {
      supplier: "Hoecke",
      location: "10",
      photo: "/img/parts/label.svg",
    }),
    part("scharnier-logo-rechts", "", "Scharnier logo RECHTS (middenaanslag)", "Labels", {
      supplier: "Hoecke",
      location: "11",
      photo: "/img/parts/label.svg",
    }),
    part("cliptop-blumotion-155-hoek", "71B7590 MB V125 NI", "Clip-top BLUMOTION 155° (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "25",
      photo: "/img/parts/scharnier-165.svg",
    }),
    part("cliptop-nietzelfsluitend-155-hoek", "70T7590.TLMB V25 NI", "Clip-top Niet-Zelfsluitend 155° (hoekaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "8",
      photo: "/img/parts/scharnier-165.svg",
    }),
    part("cliptop-blumotion-155-midden", "71B7690 MB V25 NI", "Clip-top BLUMOTION 155° (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "27",
      photo: "/img/parts/scharnier-165.svg",
    }),
    part("cliptop-nietzelfsluitend-155-midden", "70T7690.TLMB V25 NI", "Clip-top Niet-Zelfsluitend 155° (middenaanslag)", "Scharnieren", {
      supplier: "Ostermann",
      location: "26",
      photo: "/img/parts/scharnier-165.svg",
    }),
    part("openingsbegrenzer", "", "Openingsbegrenzer", "Scharnieren", {
      supplier: "Ostermann",
      location: "",
      photo: "/img/parts/openingsbegrenzer.svg",
    }),
    part("afstandsbediening", "61500050603", "Afstandsbediening Creditcard", "Verlichting", {
      supplier: "Maclean",
      location: "65",
      photo: "/img/parts/afstandsbediening.svg",
    }),
    part("ontvanger", "", "Ontvanger t.b.v. afstandsbediening", "Verlichting", {
      supplier: "Maclean",
      location: "69",
      photo: "/img/parts/module.svg",
    }),
    part("hue-zigbee", "61500052201", "HUE/ZIGBEE Module", "Verlichting", {
      supplier: "Maclean",
      location: "68",
      photo: "/img/parts/module.svg",
    }),
    part("ir-schakelaar", "21703220103", "IR Schakelaar", "Verlichting", {
      supplier: "Maclean",
      location: "72",
      photo: "/img/parts/module.svg",
    }),
    part("led-spot-ar35", "20202532802", "LED Spot AR35 2,2w ww", "Verlichting", {
      supplier: "Maclean",
      location: "70",
      photo: "/img/parts/led-spot.svg",
    }),
    part("voedingsverlengkabel", "21530062501", "Voedingsverlengkabel 2500mm", "Verlichting", {
      supplier: "Maclean",
      location: "60",
      photo: "/img/parts/kabel.svg",
    }),
    part("led-cob-tape", "", "LED COB tape ww 8w pm1", "Verlichting", {
      supplier: "LED GIGANT",
      location: "74",
      photo: "/img/parts/led-tape.svg",
      unit: "m1",
      notes: "Artikelnummer nog invullen.",
    }),
    part("cob-voedingskabel", "21528308102", "COB Voedingskabel 2500mm", "Verlichting", {
      supplier: "Maclean",
      location: "61",
      photo: "/img/parts/kabel.svg",
    }),
    part("cob-hoekclip", "", "COB Hoekverbindingsclip", "Verlichting", {
      supplier: "Maclean",
      location: "",
      photo: "/img/parts/kabel.svg",
    }),
    part("led-eco-tape", "20202962102", "LED Eco Tape 8w pm1", "Verlichting", {
      supplier: "Maclean",
      location: "",
      photo: "/img/parts/led-tape.svg",
      unit: "m1",
    }),
    part("trafo-15", "20604001101", "Trafo 15Watt", "Verlichting", {
      supplier: "Maclean",
      location: "63",
      photo: "/img/parts/trafo.svg",
    }),
    part("trafo-30", "20604001201", "Trafo 30Watt", "Verlichting", {
      supplier: "Maclean",
      location: "64",
      photo: "/img/parts/trafo.svg",
    }),
    part("trafo-60", "20604003101", "Trafo 60Watt", "Verlichting", {
      supplier: "Maclean",
      location: "66",
      photo: "/img/parts/trafo.svg",
    }),
    part("trafo-100", "20604003301", "Trafo 100Watt", "Verlichting", {
      supplier: "Maclean",
      location: "67",
      photo: "/img/parts/trafo.svg",
    }),
    part("led-fn-tape", "", "LED FN Tape 10W pm1", "Verlichting", {
      supplier: "Maclean",
      location: "",
      photo: "/img/parts/led-tape.svg",
      unit: "m1",
    }),
    part("novapro-scala-afstandhouder", "", "Nova Pro Scala afstandhouder", "Ladesystemen", {
      supplier: "Maclean",
      location: "",
      photo: "/img/parts/ladewand.svg",
    }),
    part("novapro-h63", "", "Nova Pro H63", "Ladesystemen", {
      supplier: "",
      location: "44",
      photo: "/img/parts/ladewand.svg",
      notes: "Lengte per kast opgeven in mm.",
    }),
    part("novapro-h90", "", "Nova Pro H90", "Ladesystemen", {
      supplier: "",
      location: "44",
      photo: "/img/parts/ladewand.svg",
      notes: "Lengte per kast opgeven in mm.",
    }),
    part("novapro-h122", "", "Nova Pro H122", "Ladesystemen", {
      supplier: "",
      location: "44",
      photo: "/img/parts/ladewand.svg",
      notes: "Lengte per kast opgeven in mm.",
    }),
    part("novapro-h186", "", "Nova Pro H186", "Ladesystemen", {
      supplier: "",
      location: "44",
      photo: "/img/parts/ladewand.svg",
      notes: "Lengte per kast opgeven in mm.",
    }),
    part("fronthaak-63", "", "Fronthaak 63mm", "Ladesystemen", {
      supplier: "",
      location: "",
      photo: "/img/parts/fronthaak.svg",
    }),
    part("fronthaak-90-122-186", "", "Fronthaak 90/122/186mm", "Ladesystemen", {
      supplier: "",
      location: "41",
      photo: "/img/parts/fronthaak.svg",
    }),
    part("fronthaak-186", "", "Fronthaak 186mm", "Ladesystemen", {
      supplier: "",
      location: "40",
      photo: "/img/parts/fronthaak.svg",
    }),
    part("tipmatic-push-to-open", "", "Tip-Matic Push-to-open", "Openen en sluiten", {
      supplier: "",
      location: "45",
      photo: "/img/parts/push-to-open.svg",
    }),
    part("novapro-tipmatic-stangsteun", "", "Nova Pro Tip-matic Stangsteun", "Openen en sluiten", {
      supplier: "",
      location: "43-2",
      photo: "/img/parts/stang.svg",
    }),
    part("tipmatic-stang", "", "Tip-Matic Stang", "Openen en sluiten", {
      supplier: "",
      location: "46",
      photo: "/img/parts/stang.svg",
    }),
  ];

  const byId = Object.fromEntries(parts.map((p) => [p.id.replace(/^on_/, ''), p.id]));

  // Kastlijst 14925 Mitchell, met de aantallen van het papieren blad.
  const picklists = [
    {
      id: 'kl_14925',
      cabinetNumber: '14925',
      title: 'Mitchell',
      note: "Lengtes: Nova Pro H90 = 500 mm (was 550), H122 = 600 mm, H186 = 600 mm (nog controleren). PUUUR Label Meubel: nee.",
      status: 'open',
      createdBy: 'Roy',
      createdAt: ago(0),
      startedBy: null,
      startedAt: null,
      completedBy: null,
      completedAt: null,
      lines: [
        line(byId["doos"], 1),
        line(byId["voetplaat-stelpoot"], 11),
        line(byId["axilo-80"], 11),
        line(byId["plintklem"], 6),
        line(byId["kruisplaat-lang"], 4),
        line(byId["kruisplaat-kort"], 2),
        line(byId["cliptop-blumotion-hoek"], 2),
        line(byId["cliptop-zelfsluitend-hoek"], 2),
        line(byId["puuur-scharnier-logo"], 4),
        line(byId["cliptop-blumotion-midden"], 1),
        line(byId["cliptop-zelfsluitend-midden"], 1),
        line(byId["scharnier-logo-rechts"], 2),
        line(byId["novapro-h90"], 4),
        line(byId["novapro-h122"], 2),
        line(byId["novapro-h186"], 2),
        line(byId["fronthaak-90-122-186"], 16),
        line(byId["fronthaak-186"], 4),
      ],
    },
  ];

  const activity = [
    event('picklist', 'Kastlijst 14925 Mitchell aangemaakt (17 onderdelen)', ago(0)),
    event('part', 'Onderdelenlijst van PUUUR ingelezen: 53 onderdelen', ago(0)),
  ];

  return { version: 1, parts, picklists, orders: [], activity };
}

function part(id, number, name, category, extra = {}) {
  return {
    id: 'on_' + id,
    number,
    name,
    category,
    unit: 'stuks',
    stock: 0,
    minStock: 0,
    orderQty: 0,
    geteld: false,
    supplier: '',
    location: '',
    photo: '',
    notes: '',
    createdAt: ago(0),
    ...extra,
  };
}

function line(partId, qty) {
  return { partId, qty, pickedQty: 0, missingQty: 0, missingHandled: false, picked: false };
}

function event(type, text, at) {
  return { id: 'ev_' + Math.random().toString(36).slice(2, 10), type, text, at, user: 'Roy' };
}
