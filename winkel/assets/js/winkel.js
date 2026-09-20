/* ==========================================================================
   Bijtijds — winkellogica
   --------------------------------------------------------------------------
   Eén bestand, geen afhankelijkheden, geen build-stap. De winkelwagen leeft
   in localStorage zodat een bezoeker die morgen terugkomt zijn bestelling nog
   heeft staan -- bij deze doelgroep gebeurt dat vaker dan gemiddeld, want veel
   mensen overleggen eerst met een kind of partner voordat ze afrekenen.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Aanbod ------------------------------------------------------------
     Prijzen staan in hele centen. Rekenen met kommagetallen levert vroeg of
     laat een bestelling van 99,94999 op.                                    */

  var PRODUCTEN = {
    'bijtijds-28': {
      id: 'bijtijds-28',
      naam: 'Bijtijds 28',
      variant: '28 vakjes · 6 alarmen per dag · met slot',
      prijs: 9995,
      beeld: 'assets/img/product-1.svg',
      gewicht: 610
    },
    'bijtijds-7': {
      id: 'bijtijds-7',
      naam: 'Bijtijds 7',
      variant: '7 dagdoosjes · 4 alarmen per dag',
      prijs: 5995,
      beeld: 'assets/img/product-7dagen.svg',
      gewicht: 430
    },
    'doseerring': {
      id: 'doseerring',
      naam: 'Extra doseerring',
      variant: 'Reservering voor de Bijtijds 28',
      prijs: 1495,
      beeld: 'assets/img/product-2.svg',
      gewicht: 180
    }
  };

  var VERZENDKOSTEN = 495;
  var GRATIS_VANAF = 5000;
  var SLEUTEL = 'bijtijds.wagen.v1';

  /* --- Hulpjes ----------------------------------------------------------- */

  function euro(centen) {
    return '€ ' + (centen / 100).toFixed(2).replace('.', ',');
  }

  function $(kiezer, binnen) { return (binnen || document).querySelector(kiezer); }
  function $$(kiezer, binnen) {
    return Array.prototype.slice.call((binnen || document).querySelectorAll(kiezer));
  }

  /* Een gebeurtenis doorgeven aan Meta. bijtijdsMeet bestaat alleen als de
     bezoeker toestemming heeft gegeven en de pixel geladen is; zonder pixel
     gebeurt hier niets. Zo hoeft nergens anders in dit bestand rekening te
     worden gehouden met toestemming. */
  function meet(naam, gegevens) {
    if (typeof window.bijtijdsMeet === 'function') {
      window.bijtijdsMeet(naam, gegevens);
    }
  }

  /* De winkel draait ook in een browser met opslag uit (privémodus, strenge
     instellingen). Dan valt hij terug op geheugen: de wagen werkt binnen het
     bezoek, maar overleeft het sluiten van het tabblad niet. Beter dan een
     pagina die stukloopt op een uitzondering. */
  var geheugen = null;

  function lees() {
    if (geheugen) { return geheugen; }
    try {
      var rauw = window.localStorage.getItem(SLEUTEL);
      var lijst = rauw ? JSON.parse(rauw) : [];
      return Array.isArray(lijst) ? lijst.filter(geldig) : [];
    } catch (e) {
      geheugen = [];
      return geheugen;
    }
  }

  function geldig(regel) {
    return regel && PRODUCTEN[regel.id] && typeof regel.aantal === 'number' && regel.aantal > 0;
  }

  function bewaar(lijst) {
    try {
      window.localStorage.setItem(SLEUTEL, JSON.stringify(lijst));
      geheugen = null;
    } catch (e) {
      geheugen = lijst;
    }
    tekenTeller();
    document.dispatchEvent(new CustomEvent('wagen:gewijzigd'));
  }

  /* --- Winkelwagen ------------------------------------------------------- */

  var wagen = {
    regels: function () {
      return lees().map(function (r) {
        var p = PRODUCTEN[r.id];
        return {
          id: r.id, aantal: r.aantal, naam: p.naam, variant: p.variant,
          prijs: p.prijs, beeld: p.beeld, subtotaal: p.prijs * r.aantal
        };
      });
    },

    voegToe: function (id, aantal) {
      if (!PRODUCTEN[id]) { return; }
      aantal = Math.max(1, Math.min(20, parseInt(aantal, 10) || 1));
      var lijst = lees();
      var bestaand = null;
      for (var i = 0; i < lijst.length; i++) {
        if (lijst[i].id === id) { bestaand = lijst[i]; break; }
      }
      if (bestaand) {
        bestaand.aantal = Math.min(20, bestaand.aantal + aantal);
      } else {
        lijst.push({ id: id, aantal: aantal });
      }
      bewaar(lijst);
    },

    zet: function (id, aantal) {
      aantal = parseInt(aantal, 10) || 0;
      var lijst = lees().filter(function (r) { return r.id !== id; });
      if (aantal > 0) { lijst.push({ id: id, aantal: Math.min(20, aantal) }); }
      bewaar(lijst);
    },

    verwijder: function (id) { wagen.zet(id, 0); },

    leeg: function () { bewaar([]); },

    aantal: function () {
      return lees().reduce(function (som, r) { return som + r.aantal; }, 0);
    },

    subtotaal: function () {
      return lees().reduce(function (som, r) {
        return som + PRODUCTEN[r.id].prijs * r.aantal;
      }, 0);
    },

    verzending: function () {
      var sub = wagen.subtotaal();
      if (sub === 0) { return 0; }
      return sub >= GRATIS_VANAF ? 0 : VERZENDKOSTEN;
    },

    totaal: function () { return wagen.subtotaal() + wagen.verzending(); }
  };

  /* --- Bevestigingsbalkje ------------------------------------------------ */

  var toastKlok = null;

  function toast(bericht, link) {
    var vak = $('#toast');
    if (!vak) { return; }
    vak.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="20 6 9 17 4 12"/></svg><span>' + bericht + '</span>' +
      (link ? ' <a href="' + link + '">Naar de winkelwagen</a>' : '');
    vak.classList.add('toast--aan');
    window.clearTimeout(toastKlok);
    toastKlok = window.setTimeout(function () {
      vak.classList.remove('toast--aan');
    }, 5000);
  }

  function tekenTeller() {
    var n = wagen.aantal();
    $$('[data-wagen-teller]').forEach(function (el) {
      el.textContent = n;
      if (n > 0) { el.removeAttribute('hidden'); } else { el.setAttribute('hidden', ''); }
    });
    $$('[data-wagen-label]').forEach(function (el) {
      el.textContent = n === 1 ? '1 artikel in de winkelwagen'
                               : n + ' artikelen in de winkelwagen';
    });
  }

  /* --- Menu op kleine schermen ------------------------------------------- */

  function menu() {
    var knop = $('[data-menu-knop]');
    var vak = $('[data-mobielmenu]');
    if (!knop || !vak) { return; }
    knop.addEventListener('click', function () {
      var open = knop.getAttribute('aria-expanded') === 'true';
      knop.setAttribute('aria-expanded', String(!open));
      if (open) { vak.setAttribute('hidden', ''); } else { vak.removeAttribute('hidden'); }
    });
  }

  /* --- Productpagina ------------------------------------------------------ */

  function productpagina() {
    var vak = $('[data-product]');
    if (!vak) { return; }

    var prijsEl = $('[data-prijs]');
    var aantalEl = $('[data-aantal]');

    function gekozen() {
      var aan = $('[name="uitvoering"]:checked', vak);
      return aan ? aan.value : 'bijtijds-28';
    }

    function verversPrijs() {
      var p = PRODUCTEN[gekozen()];
      if (prijsEl && p) { prijsEl.textContent = euro(p.prijs); }
      $$('[data-toon-voor]').forEach(function (el) {
        el.hidden = el.getAttribute('data-toon-voor') !== gekozen();
      });
    }

    $$('[name="uitvoering"]', vak).forEach(function (radio) {
      radio.addEventListener('change', verversPrijs);
    });
    verversPrijs();

    // Plus- en minknoppen; het invoerveld blijft gewoon typbaar.
    $$('[data-stap]', vak).forEach(function (knop) {
      knop.addEventListener('click', function () {
        var nu = parseInt(aantalEl.value, 10) || 1;
        var nieuw = Math.max(1, Math.min(20, nu + parseInt(knop.getAttribute('data-stap'), 10)));
        aantalEl.value = nieuw;
      });
    });

    $$('[data-bestel]').forEach(function (knop) {
      knop.addEventListener('click', function () {
        var id = knop.getAttribute('data-bestel') || gekozen();
        var n = knop.hasAttribute('data-vast') ? 1 : (parseInt(aantalEl && aantalEl.value, 10) || 1);
        wagen.voegToe(id, n);
        meet('AddToCart', {
          content_ids: [id], content_type: 'product',
          value: (PRODUCTEN[id].prijs * n) / 100, currency: 'EUR'
        });
        toast(PRODUCTEN[id].naam + ' is toegevoegd.', 'winkelwagen.html');
      });
    });

    galerij();

    meet('ViewContent', {
      content_ids: [gekozen()], content_type: 'product',
      value: PRODUCTEN[gekozen()].prijs / 100, currency: 'EUR'
    });
  }

  function galerij() {
    var hoofd = $('[data-galerij-hoofd]');
    if (!hoofd) { return; }
    $$('[data-galerij-knop]').forEach(function (knop) {
      knop.addEventListener('click', function () {
        var bron = knop.getAttribute('data-bron');
        var tekst = knop.getAttribute('data-alt') || '';
        hoofd.setAttribute('src', bron);
        hoofd.setAttribute('alt', tekst);
        $$('[data-galerij-knop]').forEach(function (k) {
          k.setAttribute('aria-current', String(k === knop));
        });
      });
    });
  }

  /* --- Winkelwagenpagina --------------------------------------------------- */

  function wagenpagina() {
    var vak = $('[data-wagenregels]');
    if (!vak) { return; }

    function teken() {
      var regels = wagen.regels();
      $$('[data-wagen-heeft]').forEach(function (el) { el.hidden = regels.length === 0; });
      $$('[data-wagen-leeg]').forEach(function (el) { el.hidden = regels.length > 0; });

      vak.innerHTML = regels.map(function (r) {
        return '' +
          '<div class="regel">' +
            '<div class="regel__beeld"><img src="' + r.beeld + '" alt="" width="96" height="96"></div>' +
            '<div>' +
              '<div class="regel__naam">' + r.naam + '</div>' +
              '<div class="regel__variant">' + r.variant + '</div>' +
              '<div class="aantal" style="margin-top:12px">' +
                '<button type="button" data-min="' + r.id + '" aria-label="Eén minder ' + r.naam + '">−</button>' +
                '<input type="number" min="1" max="20" value="' + r.aantal + '" data-veld="' + r.id + '" ' +
                  'aria-label="Aantal ' + r.naam + '">' +
                '<button type="button" data-plus="' + r.id + '" aria-label="Eén meer ' + r.naam + '">+</button>' +
              '</div>' +
              '<button type="button" class="regel__weg" data-weg="' + r.id + '">Verwijderen</button>' +
            '</div>' +
            '<div class="regel__prijs">' + euro(r.subtotaal) + '</div>' +
          '</div>';
      }).join('');

      tekenSamenvatting();
    }

    vak.addEventListener('click', function (e) {
      var knop = e.target.closest('button');
      if (!knop) { return; }
      var id;
      if ((id = knop.getAttribute('data-weg'))) { wagen.verwijder(id); }
      else if ((id = knop.getAttribute('data-plus'))) {
        wagen.zet(id, (parseInt($('[data-veld="' + id + '"]').value, 10) || 1) + 1);
      } else if ((id = knop.getAttribute('data-min'))) {
        wagen.zet(id, (parseInt($('[data-veld="' + id + '"]').value, 10) || 1) - 1);
      }
    });

    vak.addEventListener('change', function (e) {
      var id = e.target.getAttribute && e.target.getAttribute('data-veld');
      if (id) { wagen.zet(id, e.target.value); }
    });

    document.addEventListener('wagen:gewijzigd', teken);
    teken();
  }

  function tekenSamenvatting() {
    var sub = wagen.subtotaal(), verz = wagen.verzending();
    $$('[data-subtotaal]').forEach(function (el) { el.textContent = euro(sub); });
    $$('[data-totaal]').forEach(function (el) { el.textContent = euro(wagen.totaal()); });
    $$('[data-verzending]').forEach(function (el) {
      el.innerHTML = verz === 0 ? '<span class="gratis">Gratis</span>' : euro(verz);
    });
    $$('[data-tot-gratis]').forEach(function (el) {
      var tekort = GRATIS_VANAF - sub;
      el.hidden = !(sub > 0 && tekort > 0);
      var bedrag = $('[data-tekort]', el);
      if (bedrag) { bedrag.textContent = euro(tekort); }
    });
    // Het btw-bedrag is informatief: de prijzen zijn inclusief 21%.
    $$('[data-btw]').forEach(function (el) {
      el.textContent = euro(Math.round(wagen.totaal() - wagen.totaal() / 1.21));
    });
  }

  /* --- Afrekenen ----------------------------------------------------------- */

  var REGELS = {
    voornaam:   { test: function (v) { return v.trim().length >= 2; },
                  fout: 'Vul uw voornaam in.' },
    achternaam: { test: function (v) { return v.trim().length >= 2; },
                  fout: 'Vul uw achternaam in.' },
    email:      { test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
                  fout: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.' },
    telefoon:   { test: function (v) { return v.replace(/\D/g, '').length >= 9; },
                  fout: 'Vul uw telefoonnummer in; de bezorger belt u als hij u niet treft.' },
    postcode:   { test: function (v) { return /^\s*[1-9][0-9]{3}\s*[a-z]{2}\s*$/i.test(v); },
                  fout: 'Vul een Nederlandse postcode in, bijvoorbeeld 1012 AB.' },
    huisnummer: { test: function (v) { return v.trim().length >= 1; },
                  fout: 'Vul uw huisnummer in.' },
    straat:     { test: function (v) { return v.trim().length >= 2; },
                  fout: 'Vul uw straatnaam in.' },
    plaats:     { test: function (v) { return v.trim().length >= 2; },
                  fout: 'Vul uw woonplaats in.' }
  };

  function afrekenpagina() {
    var formulier = $('[data-afrekenen]');
    if (!formulier) { return; }

    tekenSamenvatting();
    tekenBestelregels();
    document.addEventListener('wagen:gewijzigd', function () {
      tekenSamenvatting();
      tekenBestelregels();
    });

    if (wagen.aantal() === 0) {
      var waarschuwing = $('[data-wagen-leeg]');
      if (waarschuwing) { waarschuwing.hidden = false; }
      formulier.hidden = true;
      return;
    }

    meet('InitiateCheckout', {
      value: wagen.totaal() / 100, currency: 'EUR', num_items: wagen.aantal()
    });

    // Postcode netjes formatteren terwijl iemand typt: 1012ab wordt 1012 AB.
    var postcode = $('[name="postcode"]', formulier);
    if (postcode) {
      postcode.addEventListener('blur', function () {
        var schoon = postcode.value.replace(/\s+/g, '').toUpperCase();
        if (/^[1-9][0-9]{3}[A-Z]{2}$/.test(schoon)) {
          postcode.value = schoon.slice(0, 4) + ' ' + schoon.slice(4);
        }
      });
    }

    formulier.addEventListener('submit', function (e) {
      e.preventDefault();
      var eersteFout = null;

      Object.keys(REGELS).forEach(function (naam) {
        var veld = $('[name="' + naam + '"]', formulier);
        if (!veld) { return; }
        var ok = REGELS[naam].test(veld.value);
        var foutvak = $('#fout-' + naam);
        veld.setAttribute('aria-invalid', String(!ok));
        if (foutvak) {
          foutvak.textContent = ok ? '' : REGELS[naam].fout;
          foutvak.hidden = ok;
        }
        if (!ok && !eersteFout) { eersteFout = veld; }
      });

      var akkoord = $('[name="voorwaarden"]', formulier);
      var akkoordFout = $('#fout-voorwaarden');
      if (akkoord && !akkoord.checked) {
        if (akkoordFout) {
          akkoordFout.textContent = 'Zet een vinkje om verder te gaan.';
          akkoordFout.hidden = false;
        }
        if (!eersteFout) { eersteFout = akkoord; }
      } else if (akkoordFout) {
        akkoordFout.hidden = true;
      }

      if (eersteFout) {
        eersteFout.focus();
        eersteFout.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      verstuur(formulier);
    });
  }

  function tekenBestelregels() {
    var vak = $('[data-bestelregels]');
    if (!vak) { return; }
    vak.innerHTML = wagen.regels().map(function (r) {
      return '<div class="samenvatting__rij"><dt>' + r.aantal + '× ' + r.naam +
             '</dt><dd>' + euro(r.subtotaal) + '</dd></div>';
    }).join('');
  }

  /* De winkel werkt standaard zonder server: de bestelling wordt opgeslagen en
     de bedankpagina toont hem. Zodra je een betaalkoppeling hebt, zet je op
     de afrekenpagina data-endpoint op de URL van je eigen functie; dan gaat de
     bestelling daarheen en stuurt die je door naar de betaalpagina.
     Zie draaiboek/07-betalen-en-techniek.md. */
  function verstuur(formulier) {
    var knop = $('[data-verzendknop]', formulier);
    var gegevens = {};
    new FormData(formulier).forEach(function (waarde, naam) { gegevens[naam] = waarde; });

    var bestelling = {
      nummer: bestelnummer(),
      gezet: new Date().toISOString(),
      klant: gegevens,
      regels: wagen.regels(),
      subtotaal: wagen.subtotaal(),
      verzending: wagen.verzending(),
      totaal: wagen.totaal()
    };

    try {
      window.sessionStorage.setItem('bijtijds.bestelling', JSON.stringify(bestelling));
    } catch (e) { /* bedankpagina valt dan terug op een algemene tekst */ }

    var endpoint = formulier.getAttribute('data-endpoint');
    if (!endpoint) {
      wagen.leeg();
      window.location.href = 'bedankt.html';
      return;
    }

    knop.setAttribute('aria-disabled', 'true');
    knop.textContent = 'Een moment…';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bestelling)
    }).then(function (antwoord) {
      if (!antwoord.ok) { throw new Error('status ' + antwoord.status); }
      return antwoord.json();
    }).then(function (data) {
      wagen.leeg();
      window.location.href = data.betaalUrl || 'bedankt.html';
    }).catch(function () {
      knop.removeAttribute('aria-disabled');
      knop.textContent = 'Bestelling afronden';
      var melding = $('[data-verzendfout]', formulier);
      if (melding) {
        melding.hidden = false;
        melding.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  }

  function bestelnummer() {
    var d = new Date();
    var dag = String(d.getFullYear()).slice(2) +
              String(d.getMonth() + 1).padStart(2, '0') +
              String(d.getDate()).padStart(2, '0');
    return 'BT-' + dag + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  }

  /* --- Bedankpagina -------------------------------------------------------- */

  function bedankpagina() {
    var vak = $('[data-bevestiging]');
    if (!vak) { return; }
    var rauw;
    try { rauw = window.sessionStorage.getItem('bijtijds.bestelling'); } catch (e) { rauw = null; }
    if (!rauw) { return; }

    try {
      var b = JSON.parse(rauw);
      var nr = $('[data-bestelnummer]');
      if (nr) { nr.textContent = b.nummer; }
      var mail = $('[data-klantmail]');
      if (mail && b.klant && b.klant.email) { mail.textContent = b.klant.email; }
      var lijst = $('[data-bestelde-regels]');
      if (lijst) {
        lijst.innerHTML = b.regels.map(function (r) {
          return '<div class="samenvatting__rij"><dt>' + r.aantal + '× ' + r.naam +
                 '</dt><dd>' + euro(r.subtotaal) + '</dd></div>';
        }).join('') +
        '<div class="samenvatting__rij"><dt>Verzending</dt><dd>' +
        (b.verzending === 0 ? '<span class="gratis">Gratis</span>' : euro(b.verzending)) +
        '</dd></div>';
      }
      var tot = $('[data-besteltotaal]');
      if (tot) { tot.textContent = euro(b.totaal); }
      vak.hidden = false;

      // Alleen de eerste keer tellen: wie deze pagina ververst of terugklikt,
      // mag geen tweede aankoop opleveren in je rapportage.
      var al = 'bijtijds.geteld.' + b.nummer;
      if (!window.sessionStorage.getItem(al)) {
        window.sessionStorage.setItem(al, '1');
        meet('Purchase', {
          value: b.totaal / 100, currency: 'EUR',
          content_ids: b.regels.map(function (r) { return r.id; }),
          content_type: 'product',
          num_items: b.regels.reduce(function (n, r) { return n + r.aantal; }, 0)
        });
      }
    } catch (e) { /* stille val terug op de algemene tekst */ }
  }

  /* --- Start --------------------------------------------------------------- */

  function start() {
    menu();
    tekenTeller();
    productpagina();
    wagenpagina();
    afrekenpagina();
    bedankpagina();
    tekenSamenvatting();

    // Knoppen die overal op de site een product kunnen toevoegen.
    $$('[data-snelbestel]').forEach(function (knop) {
      knop.addEventListener('click', function (e) {
        e.preventDefault();
        var id = knop.getAttribute('data-snelbestel');
        wagen.voegToe(id, 1);
        meet('AddToCart', {
          content_ids: [id], content_type: 'product',
          value: PRODUCTEN[id].prijs / 100, currency: 'EUR'
        });
        toast(PRODUCTEN[id].naam + ' is toegevoegd.', 'winkelwagen.html');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.Bijtijds = { wagen: wagen, producten: PRODUCTEN, euro: euro };
})();
