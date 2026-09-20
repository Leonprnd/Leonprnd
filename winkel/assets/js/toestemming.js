/* ==========================================================================
   Bijtijds — cookietoestemming
   --------------------------------------------------------------------------
   De Meta Pixel mag in Nederland pas geladen worden nadat de bezoeker
   toestemming heeft gegeven. Dat is geen formaliteit: de Autoriteit
   Persoonsgegevens eist dat weigeren net zo makkelijk is als accepteren, dus
   staan beide knoppen hier even groot en even opvallend naast elkaar. Een
   balk met een grote groene "Accepteren" en een grijs linkje "instellingen"
   voldoet niet en is een boete waard.

   Zolang er geen pixel-id is ingevuld, laadt er sowieso niets en blijft de
   balk weg -- geen toestemming vragen voor iets wat je niet doet.
   ========================================================================== */

(function () {
  'use strict';

  var SLEUTEL = 'bijtijds.toestemming';
  var GELDIG_DAGEN = 180;

  var script = document.currentScript;
  var pixelId = (script && script.getAttribute('data-meta-pixel') || '').trim();
  var heeftPixel = /^\d{6,}$/.test(pixelId);

  function lees() {
    try {
      var rauw = window.localStorage.getItem(SLEUTEL);
      if (!rauw) { return null; }
      var keuze = JSON.parse(rauw);
      var leeftijd = (Date.now() - keuze.op) / 86400000;
      return leeftijd > GELDIG_DAGEN ? null : keuze;
    } catch (e) {
      return null;
    }
  }

  function bewaar(meten) {
    try {
      window.localStorage.setItem(SLEUTEL, JSON.stringify({ meten: meten, op: Date.now() }));
    } catch (e) { /* dan vragen we het volgend bezoek opnieuw */ }
  }

  /* De pixel wordt pas hier ingeladen, nooit eerder. */
  function laadPixel() {
    if (!heeftPixel || window.fbq) { return; }
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    document.dispatchEvent(new CustomEvent('toestemming:meten'));
  }

  function verwijderBalk() {
    var balk = document.getElementById('toestemmingsbalk');
    if (balk) { balk.remove(); }
  }

  function toonBalk() {
    if (document.getElementById('toestemmingsbalk')) { return; }

    var balk = document.createElement('div');
    balk.id = 'toestemmingsbalk';
    balk.setAttribute('role', 'dialog');
    balk.setAttribute('aria-label', 'Cookies');
    balk.setAttribute('aria-modal', 'false');
    balk.innerHTML =
      '<div class="toestemming__binnen">' +
        '<div class="toestemming__tekst">' +
          '<strong>Mogen wij meten welke advertenties werken?</strong>' +
          '<p>Daarvoor plaatsen wij een meetpixel van Meta. Zegt u nee, dan werkt de ' +
          'winkel precies hetzelfde. Wat de winkel zelf nodig heeft, staat er altijd. ' +
          '<a href="cookiebeleid.html">Lees ons cookiebeleid</a>.</p>' +
        '</div>' +
        '<div class="toestemming__knoppen">' +
          '<button type="button" class="knop knop--rand" data-nee>Nee, liever niet</button>' +
          '<button type="button" class="knop knop--merk" data-ja>Ja, dat mag</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(balk);

    balk.querySelector('[data-ja]').addEventListener('click', function () {
      bewaar(true); verwijderBalk(); laadPixel();
    });
    balk.querySelector('[data-nee]').addEventListener('click', function () {
      bewaar(false); verwijderBalk();
    });

    window.requestAnimationFrame(function () { balk.classList.add('toestemming--aan'); });
  }

  function start() {
    // Knop op de cookiepagina waarmee de keuze opnieuw gemaakt kan worden.
    var opnieuw = document.querySelector('[data-toestemming-opnieuw]');
    if (opnieuw) {
      opnieuw.addEventListener('click', function () {
        try { window.localStorage.removeItem(SLEUTEL); } catch (e) { /* niets */ }
        verwijderBalk();
        toonBalk();
      });
    }

    if (!heeftPixel) { return; }

    var keuze = lees();
    if (keuze === null) { toonBalk(); }
    else if (keuze.meten) { laadPixel(); }
  }

  /* Kleine hulpfunctie voor de rest van de winkel: een gebeurtenis alleen
     doorsturen als er toestemming is. Gebruikt in draaiboek/05-facebook-ads.md. */
  window.bijtijdsMeet = function (naam, gegevens) {
    if (window.fbq) { window.fbq('track', naam, gegevens || {}); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
