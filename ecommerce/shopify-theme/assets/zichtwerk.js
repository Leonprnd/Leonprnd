/* ==========================================================================
   BESTAND     : zichtwerk.js
   LOCATIE     : Shopify-thema → Assets → zichtwerk.js
   INSTALLATIE : in layout/theme.liquid, vlak voor </body>:
                   <script src="{{ 'zichtwerk.js' | asset_url }}" defer></script>
   AFHANKELIJK : niets. Geen jQuery, geen bibliotheken.
   --------------------------------------------------------------------------
   Vier kleine dingen. Alles werkt ook als dit bestand niet laadt:
     1. Voor/na-schuifvergelijking  (valt terug op de "na"-foto)
     2. Plakkende koopknop op mobiel (valt terug op de gewone knop)
     3. Bundelkiezer die prijs en variant bijwerkt (valt terug op een <select>)
     4. FAQ-accordeon die er maar een tegelijk open laat
   ========================================================================== */

(function () {
  "use strict";

  var euro = new Intl.NumberFormat("nl-NL", {
    style: "currency", currency: "EUR"
  });

  function centenNaarEuro(centen) {
    return euro.format(Number(centen) / 100);
  }

  /* ----------------------------------------------------------------------
     1. Voor/na-schuifvergelijking
     ---------------------------------------------------------------------- */

  function initVergelijkers() {
    document.querySelectorAll("[data-zw-vergelijk]").forEach(function (root) {
      var na     = root.querySelector("[data-zw-vergelijk-na]");
      var greep  = root.querySelector("[data-zw-vergelijk-greep]");
      var invoer = root.querySelector("[data-zw-vergelijk-invoer]");
      if (!na || !greep || !invoer) return;

      function zet(waarde) {
        var pct = Math.min(100, Math.max(0, Number(waarde)));
        na.style.width = pct + "%";
        greep.style.left = pct + "%";
      }

      invoer.addEventListener("input", function () { zet(this.value); });
      zet(invoer.value || 50);

      // Slepen met muis of vinger voelt natuurlijker dan de range-slider,
      // maar de range blijft eronder liggen zodat toetsenbord blijft werken.
      var sleept = false;

      function uitPositie(clientX) {
        var r = root.getBoundingClientRect();
        if (!r.width) return;
        var pct = ((clientX - r.left) / r.width) * 100;
        invoer.value = Math.round(pct);
        zet(pct);
      }

      root.addEventListener("pointerdown", function (e) {
        sleept = true;
        root.setPointerCapture(e.pointerId);
        uitPositie(e.clientX);
      });
      root.addEventListener("pointermove", function (e) {
        if (sleept) uitPositie(e.clientX);
      });
      ["pointerup", "pointercancel"].forEach(function (evt) {
        root.addEventListener(evt, function (e) {
          sleept = false;
          if (root.hasPointerCapture && root.hasPointerCapture(e.pointerId)) {
            root.releasePointerCapture(e.pointerId);
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     2. Plakkende koopknop op mobiel
     Verschijnt zodra de echte koopknop uit beeld is gescrold.
     ---------------------------------------------------------------------- */

  function initPlakknop() {
    var plak = document.querySelector("[data-zw-plak]");
    var anker = document.querySelector("[data-zw-plak-anker]");
    if (!plak || !anker || !("IntersectionObserver" in window)) return;

    var waarnemer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        plak.classList.toggle("is-zichtbaar", !entry.isIntersecting);
      });
    }, { rootMargin: "0px 0px -80px 0px" });

    waarnemer.observe(anker);

    // De plakknop dient alleen om terug te springen naar het echte formulier;
    // hij verzendt niet zelf. Een tweede koopformulier op de pagina geeft
    // dubbele add-to-cart-events in de Pixel en dat vervuilt je data.
    var knop = plak.querySelector("[data-zw-plak-knop]");
    if (knop) {
      knop.addEventListener("click", function (e) {
        e.preventDefault();
        anker.scrollIntoView({ behavior: "smooth", block: "center" });
        var eerste = anker.querySelector("button, input, select");
        if (eerste) window.setTimeout(function () { eerste.focus(); }, 420);
      });
    }
  }

  /* ----------------------------------------------------------------------
     3. Bundelkiezer
     Zet de gekozen variant-id in het formulier en werkt alle prijzen bij.
     ---------------------------------------------------------------------- */

  function initBundels() {
    document.querySelectorAll("[data-zw-bundels]").forEach(function (groep) {
      var formId  = groep.getAttribute("data-zw-bundels");
      var form    = document.getElementById(formId);
      if (!form) return;

      // De radio's heten zelf name="id" en staan in het formulier, dus het
      // kiezen van een bundel werkt ook als dit bestand nooit laadt. Alleen
      // wanneer een thema een verborgen veld of <select> gebruikt, zetten we
      // die hier bij. Nooit de radio's zelf overschrijven.
      var veld = form.querySelector('input[type="hidden"][name="id"], select[name="id"]');

      var prijsvelden = document.querySelectorAll("[data-zw-prijs]");

      function kies(radio) {
        if (!radio) return;
        if (veld) veld.value = radio.value;

        var centen = radio.getAttribute("data-prijs");
        if (centen) {
          prijsvelden.forEach(function (el) {
            el.textContent = centenNaarEuro(centen);
          });
        }
        var beschikbaar = radio.getAttribute("data-beschikbaar") !== "false";
        form.querySelectorAll('[type="submit"]').forEach(function (knop) {
          knop.disabled = !beschikbaar;
          knop.textContent = beschikbaar ? "In de winkelwagen" : "Tijdelijk uitverkocht";
        });
      }

      groep.addEventListener("change", function (e) {
        if (e.target && e.target.matches('input[type="radio"]')) kies(e.target);
      });

      kies(groep.querySelector('input[type="radio"]:checked'));
    });
  }

  /* ----------------------------------------------------------------------
     4. FAQ — maar een tegelijk open
     Scheelt scrollen op mobiel, wat bij lange antwoorden echt uitmaakt.
     ---------------------------------------------------------------------- */

  function initFaq() {
    document.querySelectorAll("[data-zw-faq]").forEach(function (groep) {
      var items = groep.querySelectorAll("details");
      items.forEach(function (item) {
        item.addEventListener("toggle", function () {
          if (!item.open) return;
          items.forEach(function (ander) {
            if (ander !== item) ander.open = false;
          });
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */

  function start() {
    initVergelijkers();
    initPlakknop();
    initBundels();
    initFaq();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // Shopify laadt sections opnieuw in de theme-editor. Zonder dit werkt
  // de voorbeeldweergave niet meer zodra je iets aanpast.
  document.addEventListener("shopify:section:load", start);
})();
