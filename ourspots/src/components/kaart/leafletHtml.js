// De kaartpagina die in de WebView draait: Leaflet met OpenStreetMap-tegels.
//
// Waarom zo? Google Maps geeft alleen een werkende sleutel als er een
// betaalrekening aan je project hangt. Dit heeft dat niet nodig: geen sleutel,
// geen account, niets. De tegels komen van CARTO ("Positron"), een bijna
// grijze kaart. Juist omdat die zo kleurloos is, kunnen we er met één
// CSS-filter een egaal roze waas overheen leggen zonder dat het water groen
// wordt.
//
// Praten met de app gaat twee kanten op, en op twee manieren, want dezelfde
// pagina draait in een WebView (telefoon) én in een iframe (web):
//   app  -> kaart : injectJavaScript, of een postMessage met {soort:'opdracht'}
//   kaart -> app  : window.ReactNativeWebView.postMessage, of window.parent

export const leafletHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
<style>
  html, body, #kaart { margin: 0; padding: 0; height: 100%; width: 100%; }
  body { background: #FFF7F2; overflow: hidden; -webkit-tap-highlight-color: transparent; }

  /* Het roze jasje over de kaart.
     Dit gaat met een SVG-kleurmatrix en niet met sepia/hue-rotate, en dat is
     geen omweg maar noodzaak: die twee hebben verzadiging nodig om aan te
     draaien, en een lichte kaart heeft die nauwelijks. Het resultaat was
     flets geel in plaats van roze. Een kleurmatrix rekent per kanaal, en kan
     bijna-wit dus wél opschuiven: groen en blauw iets omlaag, rood iets
     omhoog. Wegen blijven licht en water blijft herkenbaar. */
  .leaflet-tile-pane { filter: url(#rozeWaas); }

  .leaflet-control-attribution {
    font-size: 9px;
    background: rgba(255,255,255,0.72);
    color: #9A7A86;
    padding: 1px 5px;
  }
  .leaflet-control-attribution a { color: #B5657E; }

  /* --- De pin van een herinnering --- */
  .pin { display: flex; flex-direction: column; align-items: center; }
  .pin-bol {
    width: 46px; height: 46px; border-radius: 50%;
    border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; line-height: 1;
    box-shadow: 0 4px 8px rgba(122,58,80,0.35);
    position: relative;
    transition: transform .18s ease;
    overflow: visible;
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

  /* --- De stip van je partner --- */
  .lief { display: flex; flex-direction: column; align-items: center; position: relative; }
  .lief-ring {
    position: absolute; top: 0; width: 44px; height: 44px; border-radius: 50%;
    animation: klop 1.6s ease-out infinite;
  }
  @keyframes klop {
    0%   { transform: scale(0.7); opacity: .45; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  .lief-bol {
    width: 44px; height: 44px; border-radius: 50%;
    background: #fff; border: 3px solid;
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; line-height: 1;
    box-shadow: 0 4px 8px rgba(122,58,80,0.3);
  }
  .lief-naam {
    margin-top: 5px; padding: 3px 9px; border-radius: 999px;
    color: #fff; font: 700 11.5px system-ui, sans-serif;
    max-width: 104px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* --- Waar jij bent --- */
  .ik-bol {
    width: 18px; height: 18px; border-radius: 50%;
    background: #4FA3D9; border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }

  #stuk {
    position: absolute; inset: 0; display: none;
    align-items: center; justify-content: center; text-align: center;
    padding: 24px; background: #FFF1F5;
    font: 500 15px/1.5 system-ui, sans-serif; color: #9A7A86;
  }
</style>
</head>
<body>
<!-- De kleurmatrix voor het roze jasje; zie de opmerking bij .leaflet-tile-pane. -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="rozeWaas" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        1.02 0    0    0 0.01
        0    0.90 0    0 0
        0    0    0.93 0 0
        0    0    0    1 0" />
    </filter>
  </defs>
</svg>

<div id="kaart"></div>
<div id="stuk">De kaart kon niet laden.<br />Check je internetverbinding.</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
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

  if (typeof L === 'undefined') {
    document.getElementById('stuk').style.display = 'flex';
    naarApp({ soort: 'stuk' });
    return;
  }

  var kaart = L.map('kaart', {
    zoomControl: false,
    attributionControl: true,
    tap: true,
  }).setView([52.1326, 5.2913], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(kaart);

  var pinLaag = L.layerGroup().addTo(kaart);
  var liefMarkering = null;
  var ikMarkering = null;
  var gekozenId = null;
  var momenten = [];

  // --- Tekenen -------------------------------------------------------------

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
    pinLaag.clearLayers();
    momenten.forEach(function (moment) {
      var markering = L.marker([moment.lat, moment.lng], {
        icon: L.divIcon({
          className: '',
          html: pinHtml(moment),
          iconSize: [46, 60],
          iconAnchor: [23, 58],
        }),
        zIndexOffset: moment.id === gekozenId ? 1000 : 0,
      });
      markering.on('click', function () {
        naarApp({ soort: 'moment', id: moment.id });
      });
      markering.addTo(pinLaag);
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
      if (liefMarkering) { kaart.removeLayer(liefMarkering); liefMarkering = null; }
      if (!gegevens) return;
      liefMarkering = L.marker([gegevens.lat, gegevens.lng], {
        icon: L.divIcon({
          className: '',
          html:
            '<div class="lief">' +
              '<div class="lief-ring" style="background:' + veilig(gegevens.kleur) + '"></div>' +
              '<div class="lief-bol" style="border-color:' + veilig(gegevens.kleur) + '">' + veilig(gegevens.emoji) + '</div>' +
              (gegevens.naam ? '<div class="lief-naam" style="background:' + veilig(gegevens.kleur) + '">' + veilig(gegevens.naam) + '</div>' : '') +
            '</div>',
          iconSize: [110, 96],
          iconAnchor: [55, 48],
        }),
        zIndexOffset: 2000,
      }).addTo(kaart);
    },

    zetIk: function (positie) {
      if (ikMarkering) { kaart.removeLayer(ikMarkering); ikMarkering = null; }
      if (!positie) return;
      ikMarkering = L.marker([positie.lat, positie.lng], {
        icon: L.divIcon({ className: '', html: '<div class="ik-bol"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        zIndexOffset: 500,
      }).addTo(kaart);
    },

    gaNaar: function (lat, lng, zoom) {
      kaart.flyTo([lat, lng], zoom || kaart.getZoom(), { duration: 0.6 });
    },

    pasAan: function (punten, marges) {
      if (!punten || !punten.length) return;
      if (punten.length === 1) {
        kaart.flyTo([punten[0].lat, punten[0].lng], 14, { duration: 0.6 });
        return;
      }
      kaart.flyToBounds(
        punten.map(function (p) { return [p.lat, p.lng]; }),
        { paddingTopLeft: [40, marges && marges.boven ? marges.boven : 150],
          paddingBottomRight: [40, marges && marges.onder ? marges.onder : 240],
          duration: 0.7 }
      );
    },
  };

  // --- Wat wij aan de app doorgeven ----------------------------------------

  kaart.on('moveend', function () {
    var midden = kaart.getCenter();
    naarApp({ soort: 'midden', lat: midden.lat, lng: midden.lng });
  });

  // Leaflet stuurt contextmenu bij lang indrukken op een telefoon.
  kaart.on('contextmenu', function (e) {
    naarApp({ soort: 'langIngedrukt', lat: e.latlng.lat, lng: e.latlng.lng });
  });

  kaart.on('click', function () {
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
