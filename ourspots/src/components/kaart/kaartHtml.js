// De kaartpagina die in de WebView (telefoon) en in een iframe (web) draait.
//
// Waarom geen Google Maps? Die geeft alleen een werkende sleutel als er een
// betaalrekening aan je project hangt, en daar moet je 18 voor zijn. Dit heeft
// dat niet nodig: geen sleutel, geen account, niets.
//
// Waarom MapLibre en niet meer Leaflet? Leaflet tekende de gewone
// OpenStreetMap-plaatjes, en die staan bomvol: elk gebouw, elke straatnaam,
// elke winkel. Dat maakte de kaart druk en rommelig. MapLibre tekent de kaart
// zelf uit vectorgegevens, en met de stijl "positron" van OpenFreeMap levert
// dat een rustige, lege kaart op. OpenFreeMap vraagt geen sleutel en geen
// registratie.
//
// Positron is alleen grijs — het is letterlijk een grijstintenkaart. Rustig
// maar kil, en daar is niets romantisch aan. Daarom kleuren we hem na het
// laden om: grijs wordt warme grond, water wordt zacht blauw, parken krijgen
// net genoeg groen terug, en de letters krijgen de inktkleur van de app. Wit
// blijft wit, want het verschil tussen witte wegen en warme grond is precies
// wat de kaart leesbaar houdt. Zie verwarmKleur().
//
// Gaat OpenFreeMap onverhoopt plat, dan valt de kaart terug op de gewone
// OpenStreetMap-plaatjes, flink ontkleurd zodat het nog steeds rustig oogt. Je
// ziet dan een minder mooie kaart, maar nooit een lege.
//
// Praten met de app gaat twee kanten op, en op twee manieren:
//   app  -> kaart : injectJavaScript, of een postMessage met {soort:'opdracht'}
//   kaart -> app  : window.ReactNativeWebView.postMessage, of window.parent

// MapLibre rekent zoomniveaus met tegels van 512 pixels, Leaflet en Google met
// 256. Daardoor zit er precies één niveau verschil tussen: wat in de app zoom
// 16 heet, is voor MapLibre 15. De app hoeft daar niets van te weten; alles
// wat binnenkomt gaat eerst door glZoom().
const ZOOMVERSCHIL = 1;

const MAPLIBRE = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist';
const POSITRON = 'https://tiles.openfreemap.org/styles/positron';

export const kaartHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="${MAPLIBRE}/maplibre-gl.css" />
<style>
  html, body, #kaart { margin: 0; padding: 0; height: 100%; width: 100%; }
  body {
    background: #FFF8F3; overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none; user-select: none;
  }

  /* Alles wat op de kaart ligt houden we in één laag bij elkaar. Zo kan een
     pin nooit over de herkomstvermelding heen gaan staan, hoe hoog we hem
     hieronder ook zetten. */
  .maplibregl-canvas-container { isolation: isolate; }

  /* De herkomstvermelding blijft staan — dat hoort bij OpenStreetMap-gegevens
     — maar ingeklapt tot één klein rondje in de hoek, in plaats van een regel
     tekst dwars over de kaart. */
  .maplibregl-ctrl-attrib.maplibregl-compact {
    background: rgba(255,255,255,0.78);
    min-height: 22px; border-radius: 11px;
  }
  .maplibregl-ctrl-attrib-button { opacity: 0.4; }
  .maplibregl-ctrl-attrib a { color: #9A7A86; }

  /* --- De pin van een herinnering --- */
  .pin { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
  .pin-bol {
    width: 46px; height: 46px; border-radius: 50%;
    border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; line-height: 1;
    box-shadow: 0 4px 8px rgba(122,58,80,0.35);
    position: relative;
    transition: transform .18s ease;
    overflow: visible;
    box-sizing: border-box;
  }
  .pin-foto {
    width: 100%; height: 100%; border-radius: 50%;
    object-fit: cover; display: block;
  }
  .pin-hoekje {
    position: absolute; bottom: -2px; left: -4px;
    width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; line-height: 1;
  }
  .pin-bijzonder { border-color: #F3B03C; border-width: 3.5px; }
  .pin-gekozen .pin-bol { transform: scale(1.22) translateY(-5px); }
  .pin-ster { position: absolute; top: -10px; right: -8px; font-size: 15px; }
  .pin-badge {
    position: absolute; bottom: -4px; right: -7px;
    min-width: 19px; height: 19px; padding: 0 4px;
    border-radius: 10px; background: #fff; border: 1.5px solid #FFE3EC;
    color: #E04E74; font: 700 10.5px system-ui, sans-serif;
    display: flex; align-items: center; justify-content: center;
  }
  .pin-punt {
    width: 0; height: 0; margin-top: -2px;
    border-left: 7px solid transparent; border-right: 7px solid transparent;
    border-top: 11px solid currentColor;
  }

  /* --- De stip van je partner ---
     Het bolletje is precies zo groot als het vak eromheen, zodat het midden
     van het bolletje ook echt op de plek staat waar je partner is. De naam
     hangt er los onder en telt dus niet mee. */
  .lief { position: relative; width: 44px; height: 44px; }
  .lief-ring {
    position: absolute; inset: 0; border-radius: 50%;
    animation: klop 1.6s ease-out infinite;
  }
  @keyframes klop {
    0%   { transform: scale(0.7); opacity: .45; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  .lief-bol {
    position: absolute; inset: 0; border-radius: 50%;
    background: #fff; border: 3px solid;
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; line-height: 1;
    box-shadow: 0 4px 8px rgba(122,58,80,0.3);
    box-sizing: border-box;
  }
  .lief-naam {
    position: absolute; top: 49px; left: 50%; transform: translateX(-50%);
    padding: 3px 9px; border-radius: 999px;
    color: #fff; font: 700 11.5px system-ui, sans-serif;
    max-width: 104px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* --- Waar jij bent --- */
  .ik-bol {
    width: 18px; height: 18px; border-radius: 50%;
    background: #4FA3D9; border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    box-sizing: border-box;
  }

  #stuk {
    position: absolute; inset: 0; display: none; z-index: 9;
    align-items: center; justify-content: center; text-align: center;
    padding: 24px; background: #FFF1F5;
    font: 500 15px/1.5 system-ui, sans-serif; color: #9A7A86;
  }
</style>
</head>
<body>
<div id="kaart"></div>
<div id="stuk">De kaart kon niet laden.<br />Check je internetverbinding.</div>

<script src="${MAPLIBRE}/maplibre-gl.js"></script>
<script>
(function () {
  function naarApp(bericht) {
    var tekst = JSON.stringify(bericht);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(tekst);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(tekst, '*');
    }
  }

  function kapot() {
    document.getElementById('stuk').style.display = 'flex';
    naarApp({ soort: 'stuk' });
  }

  if (typeof maplibregl === 'undefined') {
    kapot();
    return;
  }

  // De reservekaart: de gewone OpenStreetMap-plaatjes, flink getemperd en met
  // de warme ondergrond er doorheen, zodat ook dit geen grijze bak wordt.
  var RESERVE = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        maxzoom: 19,
        attribution: '&copy; OpenStreetMap',
      },
    },
    layers: [
      { id: 'papier', type: 'background', paint: { 'background-color': '#FBF1E8' } },
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        paint: { 'raster-saturation': -0.55, 'raster-contrast': -0.1, 'raster-opacity': 0.82 },
      },
    ],
  };

  // Van een zoomniveau zoals de app het bedoelt naar een zoomniveau zoals
  // MapLibre het telt; zie de opmerking bij ZOOMVERSCHIL.
  function glZoom(zoom) {
    return Math.max(0, zoom - ${ZOOMVERSCHIL});
  }

  var kaart;
  try {
    kaart = new maplibregl.Map({
      container: 'kaart',
      style: '${POSITRON}',
      center: [5.2913, 52.1326],
      zoom: glZoom(7),
      maxZoom: 19,
      attributionControl: { compact: true },
      // Draaien en kantelen kan de kaart alleen maar scheef zetten; je wilt
      // hier gewoon noorden boven.
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      keyboard: false,
    });
  } catch (fout) {
    kapot();
    return;
  }

  kaart.touchZoomRotate.disableRotation();

  var kaartVak = kaart.getContainer();

  // MapLibre klapt de herkomstvermelding pas in zodra je de kaart aanraakt; tot
  // dan staat de hele regel tekst open in beeld. Wij willen meteen alleen het
  // rondje zien. Eén keer weghalen is genoeg: MapLibre zet hem alleen open als
  // de vermelding nog niet ingeklapt wás.
  function klapHerkomstIn() {
    var vermelding = kaartVak.querySelector('.maplibregl-ctrl-attrib');
    if (vermelding) vermelding.classList.remove('maplibregl-compact-show');
  }
  kaart.on('styledata', klapHerkomstIn);

  // --- Positron warm maken -------------------------------------------------

  // Kleuren lezen laten we de browser doen: die kent elke schrijfwijze die in
  // een stijl kan staan, en wij hoeven er geen te missen.
  var meetvlak = document.createElement('canvas').getContext('2d');

  function leesKleur(kleur) {
    meetvlak.fillStyle = '#000000';
    meetvlak.fillStyle = kleur;
    var zwart = meetvlak.fillStyle;
    meetvlak.fillStyle = '#ffffff';
    meetvlak.fillStyle = kleur;
    // Een waarde die de browser niet snapt laat de vorige staan; dan verschilt
    // de uitkomst en weten we dat het geen kleur was.
    if (meetvlak.fillStyle !== zwart) return null;

    var uit = meetvlak.fillStyle;
    if (uit.charAt(0) === '#') {
      return [
        parseInt(uit.substr(1, 2), 16),
        parseInt(uit.substr(3, 2), 16),
        parseInt(uit.substr(5, 2), 16),
        1,
      ];
    }
    var delen = uit.replace(/[^0-9.,-]/g, '').split(',');
    return [+delen[0], +delen[1], +delen[2], delen.length > 3 ? +delen[3] : 1];
  }

  function naarHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var hoog = Math.max(r, g, b);
    var laag = Math.min(r, g, b);
    var licht = (hoog + laag) / 2;
    if (hoog === laag) return [0, 0, licht];
    var verschil = hoog - laag;
    var kleurkracht = licht > 0.5
      ? verschil / (2 - hoog - laag)
      : verschil / (hoog + laag);
    var tint;
    if (hoog === r) tint = (g - b) / verschil + (g < b ? 6 : 0);
    else if (hoog === g) tint = (b - r) / verschil + 2;
    else tint = (r - g) / verschil + 4;
    return [tint * 60, kleurkracht, licht];
  }

  function uitHsl(tint, kleurkracht, licht, doorzicht) {
    tint = ((tint % 360) + 360) % 360 / 360;
    var a = kleurkracht * Math.min(licht, 1 - licht);
    function kanaal(n) {
      var k = (n + tint * 12) % 12;
      return Math.round(255 * (licht - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
    }
    var r = kanaal(0), g = kanaal(8), b = kanaal(4);
    if (doorzicht < 1) return 'rgba(' + r + ',' + g + ',' + b + ',' + doorzicht + ')';
    return '#' + [r, g, b].map(function (v) {
      return ('0' + v.toString(16)).slice(-2);
    }).join('');
  }

  function verwarmKleur(kleur) {
    // Alleen echte kleurwaarden; namen als 'linear' of 'case' uit een
    // expressie laten we met rust.
    if (!/^(#|rgba?\\(|hsla?\\()/i.test(kleur)) return null;
    var rgb = leesKleur(kleur);
    if (!rgb) return null;

    var hsl = naarHsl(rgb[0], rgb[1], rgb[2]);
    var tint = hsl[0], kracht = hsl[1], licht = hsl[2];
    var doorzicht = rgb[3];

    // Zuiver wit blijft wit: het verschil tussen witte wegen en warme grond is
    // precies wat de kaart leesbaar houdt.
    if (licht >= 0.99) return null;

    // Water krijgt zijn blauw stevig terug. De kleur op de kaart moet van de
    // grond komen, niet van een warm waas eroverheen — dat maakt alles alleen
    // maar sepia.
    if (kracht > 0.03 && tint >= 170 && tint < 265) {
      return uitHsl(200, Math.max(kracht, 0.48), Math.min(0.9, licht + 0.02), doorzicht);
    }
    // Parken en bos zijn in positron vrijwel grijs; die worden weer groen.
    if (kracht > 0.03 && tint >= 80 && tint < 170) {
      return uitHsl(104, Math.max(kracht, 0.36), Math.min(0.93, licht), doorzicht);
    }
    // Al duidelijk gekleurd: afblijven.
    if (kracht >= 0.18) return null;

    // En de rest is grijs. Die houden we bijna neutraal — net een zweem warmte,
    // zodat water en groen het werk doen — en donker grijs wordt de inktkleur
    // van de app.
    if (licht > 0.9) return uitHsl(32, 0.22, Math.min(0.98, licht + 0.005), doorzicht);
    if (licht > 0.6) return uitHsl(32, 0.18, licht, doorzicht);
    if (licht > 0.32) return uitHsl(345, 0.16, licht, doorzicht);
    return uitHsl(340, 0.2, licht, doorzicht);
  }

  // Een verfwaarde kan een kleur zijn, maar ook een expressie of een oude
  // stops-functie met kleuren erin. We lopen er dus doorheen. Niets veranderd
  // geeft null terug, zodat we die eigenschap gewoon laten staan.
  function verwarmWaarde(waarde) {
    if (typeof waarde === 'string') return verwarmKleur(waarde);

    if (Array.isArray(waarde)) {
      var anders = false;
      var lijst = waarde.map(function (deel) {
        var nieuw = verwarmWaarde(deel);
        if (nieuw === null) return deel;
        anders = true;
        return nieuw;
      });
      return anders ? lijst : null;
    }

    if (waarde && typeof waarde === 'object') {
      var gewijzigd = false;
      var uit = {};
      Object.keys(waarde).forEach(function (sleutel) {
        var nieuw = verwarmWaarde(waarde[sleutel]);
        if (nieuw === null) { uit[sleutel] = waarde[sleutel]; return; }
        gewijzigd = true;
        uit[sleutel] = nieuw;
      });
      return gewijzigd ? uit : null;
    }

    return null;
  }

  function verwarmKaart() {
    var stijl;
    try {
      stijl = kaart.getStyle();
    } catch (fout) {
      return;
    }
    if (!stijl || !stijl.layers) return;

    stijl.layers.forEach(function (laag) {
      if (!laag.paint) return;
      Object.keys(laag.paint).forEach(function (naam) {
        if (!/color$/i.test(naam)) return;
        var nieuw = verwarmWaarde(laag.paint[naam]);
        if (nieuw === null) return;
        try {
          kaart.setPaintProperty(laag.id, naam, nieuw);
        } catch (fout) {
          // Eén laag die niet wil is geen reden om de rest te laten staan.
        }
      });
    });
  }

  // --- Terugvallen als de mooie kaart niet komt ----------------------------

  var geladen = false;
  var teruggevallen = false;

  function valTerug() {
    if (teruggevallen || geladen) return;
    teruggevallen = true;
    try {
      kaart.setStyle(RESERVE);
      // Eén keer, niet bij elke stijlgebeurtenis: anders warmt hij zichzelf
      // eindeloos verder op.
      kaart.once('styledata', verwarmKaart);
    } catch (fout) {
      kapot();
    }
  }

  var wachtTimer = setTimeout(valTerug, 9000);

  kaart.on('load', function () {
    geladen = true;
    clearTimeout(wachtTimer);
    klapHerkomstIn();
    verwarmKaart();
  });

  // Een losse tegel die niet komt is geen ramp — dan mist er even een stukje
  // kaart, en op een telefoon met wisselend bereik gebeurt dat zo. Alleen een
  // stijl die niet komt is een reden om terug te vallen. Die twee zijn uit
  // elkaar te houden: een tegelfout draagt de bron en de tegel bij zich, een
  // stijlfout niet.
  kaart.on('error', function (gebeurtenis) {
    if (geladen) return;
    if (gebeurtenis && (gebeurtenis.sourceId || gebeurtenis.tile)) return;
    valTerug();
  });

  // --- Tekenen -------------------------------------------------------------

  var pinMarkeringen = [];
  var liefMarkering = null;
  var ikMarkering = null;
  var gekozenId = null;
  var momenten = [];

  function veilig(tekst) {
    return String(tekst == null ? '' : tekst).replace(/[&<>"']/g, function (teken) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[teken];
    });
  }

  function pinHtml(moment) {
    var gekozen = moment.id === gekozenId;
    var ster = moment.bijzonder ? '<span class="pin-ster">\\u2728</span>' : '';
    var badge = moment.fotos > 1 ? '<span class="pin-badge">' + moment.fotos + '</span>' : '';

    // Is er een foto, dan is die veel herkenbaarder dan een icoontje. Het
    // icoon verhuist dan naar een hoekje, zodat je nog ziet wat voor moment
    // het is.
    var binnen;
    if (moment.foto) {
      binnen =
        '<img class="pin-foto" src="' + veilig(moment.foto) + '" alt="" />' +
        '<span class="pin-hoekje" style="background:' + veilig(moment.kleur) + '">' +
          veilig(moment.icoon) +
        '</span>';
    } else {
      binnen = veilig(moment.icoon);
    }

    return (
      '<div class="pin' + (gekozen ? ' pin-gekozen' : '') + '" style="color:' + veilig(moment.kleur) + '">' +
        '<div class="pin-bol' + (moment.bijzonder ? ' pin-bijzonder' : '') + '" style="background:' + veilig(moment.kleur) + '">' +
          binnen + ster + badge +
        '</div>' +
        '<div class="pin-punt"></div>' +
      '</div>'
    );
  }

  function tekenPinnen() {
    pinMarkeringen.forEach(function (markering) { markering.remove(); });
    pinMarkeringen = [];

    momenten.forEach(function (moment) {
      var element = document.createElement('div');
      element.innerHTML = pinHtml(moment);
      // Een gekozen pin groeit, en mag dan niet half achter zijn buren
      // verdwijnen.
      element.style.zIndex = moment.id === gekozenId ? '4' : '2';

      // Zonder dit telt een tik op de pin óók als een tik op de kaart, en dan
      // kiezen en ontkiezen we hem in één beweging.
      element.addEventListener('click', function (gebeurtenis) {
        gebeurtenis.stopPropagation();
        naarApp({ soort: 'moment', id: moment.id });
      });

      pinMarkeringen.push(
        new maplibregl.Marker({ element: element, anchor: 'bottom' })
          .setLngLat([moment.lng, moment.lat])
          .addTo(kaart),
      );
    });
  }

  // --- Wat de app ons kan vragen -------------------------------------------

  window.onsPlekje = {
    zetMomenten: function (lijst) {
      momenten = lijst || [];
      tekenPinnen();
    },

    zetGekozen: function (id) {
      gekozenId = id;
      tekenPinnen();
    },

    zetLief: function (gegevens) {
      if (liefMarkering) { liefMarkering.remove(); liefMarkering = null; }
      if (!gegevens) return;

      var element = document.createElement('div');
      element.style.zIndex = '5';
      element.innerHTML =
        '<div class="lief">' +
          '<div class="lief-ring" style="background:' + veilig(gegevens.kleur) + '"></div>' +
          '<div class="lief-bol" style="border-color:' + veilig(gegevens.kleur) + '">' + veilig(gegevens.emoji) + '</div>' +
          (gegevens.naam ? '<div class="lief-naam" style="background:' + veilig(gegevens.kleur) + '">' + veilig(gegevens.naam) + '</div>' : '') +
        '</div>';

      liefMarkering = new maplibregl.Marker({ element: element, anchor: 'center' })
        .setLngLat([gegevens.lng, gegevens.lat])
        .addTo(kaart);
    },

    zetIk: function (positie) {
      if (ikMarkering) { ikMarkering.remove(); ikMarkering = null; }
      if (!positie) return;

      var element = document.createElement('div');
      element.style.zIndex = '3';
      element.innerHTML = '<div class="ik-bol"></div>';

      ikMarkering = new maplibregl.Marker({ element: element, anchor: 'center' })
        .setLngLat([positie.lng, positie.lat])
        .addTo(kaart);
    },

    gaNaar: function (lat, lng, zoom) {
      kaart.flyTo({
        center: [lng, lat],
        zoom: zoom ? glZoom(zoom) : kaart.getZoom(),
        duration: 650,
        essential: true,
      });
    },

    pasAan: function (punten, marges) {
      if (!punten || !punten.length) return;

      if (punten.length === 1) {
        kaart.flyTo({
          center: [punten[0].lng, punten[0].lat],
          zoom: glZoom(14),
          duration: 650,
          essential: true,
        });
        return;
      }

      // Meer marge vragen dan er scherm is laat MapLibre struikelen, dus
      // houden we altijd een strook in het midden over.
      function pas(waarde, maximaal) {
        return Math.max(0, Math.min(waarde, Math.floor(maximaal * 0.35)));
      }

      var grenzen = new maplibregl.LngLatBounds();
      punten.forEach(function (punt) { grenzen.extend([punt.lng, punt.lat]); });

      kaart.fitBounds(grenzen, {
        padding: {
          top: pas(marges && marges.boven ? marges.boven : 150, kaartVak.clientHeight),
          bottom: pas(marges && marges.onder ? marges.onder : 240, kaartVak.clientHeight),
          left: pas(40, kaartVak.clientWidth),
          right: pas(40, kaartVak.clientWidth),
        },
        maxZoom: glZoom(16),
        duration: 750,
        essential: true,
      });
    },
  };

  // --- Wat wij aan de app doorgeven ----------------------------------------

  kaart.on('moveend', function () {
    var midden = kaart.getCenter();
    naarApp({ soort: 'midden', lat: midden.lat, lng: midden.lng });
  });

  // Lang indrukken om een plek toe te voegen.
  //
  // Leaflet deed dit zelf, MapLibre niet: dat vertrouwt op het contextmenu van
  // de browser, en dat komt op een telefoon niet betrouwbaar. Daarom tellen we
  // hier zelf af. Schuif je tijdens het aftellen, dan was het pannen en geen
  // lange druk.
  var VASTHOUDEN = 520;
  var SCHUIFGRENS = 12;
  var drukTimer = null;
  var drukVanaf = null;
  var negeerKlikTot = 0;
  var negeerMenuTot = 0;

  function stopAftellen() {
    if (drukTimer) { clearTimeout(drukTimer); drukTimer = null; }
    drukVanaf = null;
  }

  function opPin(doel) {
    return Boolean(doel && doel.closest && doel.closest('.maplibregl-marker'));
  }

  function begintDruk(x, y, doel) {
    if (opPin(doel)) return;
    stopAftellen();
    drukVanaf = { x: x, y: y };
    drukTimer = setTimeout(function () {
      drukTimer = null;
      var rand = kaartVak.getBoundingClientRect();
      var plek = kaart.unproject([x - rand.left, y - rand.top]);
      // Het loslaten erna is geen tik op de achtergrond, en op sommige
      // telefoons komt er ook nog een contextmenu achteraan.
      negeerKlikTot = Date.now() + 900;
      negeerMenuTot = Date.now() + 900;
      naarApp({ soort: 'langIngedrukt', lat: plek.lat, lng: plek.lng });
    }, VASTHOUDEN);
  }

  function verschoof(x, y) {
    return (
      !drukVanaf ||
      Math.abs(x - drukVanaf.x) > SCHUIFGRENS ||
      Math.abs(y - drukVanaf.y) > SCHUIFGRENS
    );
  }

  kaartVak.addEventListener('touchstart', function (gebeurtenis) {
    if (gebeurtenis.touches.length !== 1) { stopAftellen(); return; }
    var aanraking = gebeurtenis.touches[0];
    begintDruk(aanraking.clientX, aanraking.clientY, gebeurtenis.target);
  }, { passive: true });

  kaartVak.addEventListener('touchmove', function (gebeurtenis) {
    if (!drukVanaf) return;
    var aanraking = gebeurtenis.touches[0];
    if (!aanraking || verschoof(aanraking.clientX, aanraking.clientY)) stopAftellen();
  }, { passive: true });

  kaartVak.addEventListener('touchend', stopAftellen, { passive: true });
  kaartVak.addEventListener('touchcancel', stopAftellen, { passive: true });

  // Met een muis werkt indrukken en vasthouden net zo, en rechtsklikken ook.
  kaartVak.addEventListener('mousedown', function (gebeurtenis) {
    if (gebeurtenis.button !== 0) return;
    begintDruk(gebeurtenis.clientX, gebeurtenis.clientY, gebeurtenis.target);
  });
  kaartVak.addEventListener('mousemove', function (gebeurtenis) {
    if (!drukVanaf) return;
    if (verschoof(gebeurtenis.clientX, gebeurtenis.clientY)) stopAftellen();
  });
  kaartVak.addEventListener('mouseup', stopAftellen);
  kaartVak.addEventListener('mouseleave', stopAftellen);

  // Beweegt de kaart zelf, dan was het pannen of zoomen, geen lange druk.
  kaart.on('movestart', stopAftellen);
  kaart.on('zoomstart', stopAftellen);

  kaart.on('contextmenu', function (gebeurtenis) {
    if (Date.now() < negeerMenuTot) return;
    stopAftellen();
    negeerKlikTot = Date.now() + 900;
    naarApp({ soort: 'langIngedrukt', lat: gebeurtenis.lngLat.lat, lng: gebeurtenis.lngLat.lng });
  });

  kaart.on('click', function () {
    if (Date.now() < negeerKlikTot) return;
    naarApp({ soort: 'achtergrond' });
  });

  // In een iframe kunnen we geen JavaScript injecteren, dus komen opdrachten
  // daar als bericht binnen. Geen eval: we zoeken de functie op bij naam.
  window.addEventListener('message', function (gebeurtenis) {
    var bericht;
    try {
      bericht = typeof gebeurtenis.data === 'string'
        ? JSON.parse(gebeurtenis.data)
        : gebeurtenis.data;
    } catch (fout) {
      return;
    }
    if (!bericht || bericht.soort !== 'opdracht') return;

    var functie = window.onsPlekje[bericht.functie];
    if (typeof functie === 'function') functie.apply(null, bericht.args || []);
  });

  naarApp({ soort: 'klaar' });
})();
</script>
</body>
</html>`;
