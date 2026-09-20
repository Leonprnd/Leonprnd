# 00 — Verantwoording: wat is geverifieerd en wat niet

Je stelde één regel bovenaan: **verzin niets.** Geen links, prijzen, levertijden,
reviews of onderzoeksresultaten. Dus begin ik met wat ik in deze omgeving
technisch wél en niet kon.

## Wat werkte

**Websearch.** Ik kon zoeken en kreeg titels, URL's en een samenvatting van de
zoekresultaten terug. Alles wat in dit dossier als "bron" staat, is een URL die
een echte zoekindex teruggaf — geen door mij verzonnen adres.

## Wat niet werkte

**Pagina's openen.** Elke poging om een webpagina op te halen werd geblokkeerd
door de netwerkproxy van deze sessie (`EGRESS_BLOCKED`, HTTP 403 = beleidsblokkade
van de organisatie). Dat gold voor álle sites die ik nodig had:

| Site | Waarvoor ik hem nodig had | Status |
|---|---|---|
| bol.com | concurrentieprijzen, reviews | geblokkeerd |
| amazon.nl | concurrentieprijzen, reviews | geblokkeerd |
| aliexpress.com / nl.aliexpress.com | inkoopprijs, orders, reviews | geblokkeerd |
| cjdropshipping.com | inkoopprijs, EU-voorraad, levertijd | geblokkeerd |
| temu.com, coolblue.nl, action.com | prijsvergelijking | geblokkeerd |
| facebook.com (Ad Library) | advertenties van concurrenten | geblokkeerd |
| shopify.dev, help.shopify.com | documentatie | geblokkeerd |
| acm.nl, kvk.nl, thuiswinkel.org | juridische bronteksten | geblokkeerd |

Ook via de commandoregel (`curl`) is al het externe verkeer dicht.

## Wat dat betekent voor dit dossier

Ik heb **geen enkele prijs, voorraad, levertijd, reviewscore of leverancierspagina
met eigen ogen kunnen bevestigen.** Daarom:

1. **Geen verzonnen productlinks.** In `07-sourcing.md` staan geen "directe
   productlinks" die ik niet heb gezien. In plaats daarvan staan daar de exacte
   zoekopdrachten, filters en beoordelingscriteria, plus een invulsjabloon. Dat
   is 20 minuten werk voor jou en het levert echte data op in plaats van
   plausibel ogende fictie.
2. **Elk niet-geverifieerd getal is gemarkeerd** met `[VERIFIEER]`. Dat zijn
   onderbouwde aannames uit marktkennis — bruikbaar om mee te rekenen, niet om
   op te vertrouwen.
3. **Geen reviews, geen klantaantallen, geen keurmerklogo's** in de teksten.
   Overal waar een echte winkel social proof zou tonen, staat een blok dat pas
   aangezet wordt als je echte reviews hébt. De winkel is zo gebouwd dat hij
   ook zónder reviews overtuigt — zie `21-cro-audit.md`, punt 11.
4. **Het "DIT PRODUCT GAAN WE VERKOPEN"-blok** in `04-gekozen-product.md` heeft
   twee kolommen: mijn aanname en een lege kolom die jij invult na verificatie.
   De winkel, de advertenties en de e-mails zijn volledig rond dat product
   gebouwd, dus als de inkoopprijs binnen de bandbreedte valt die ik aangeef,
   kun je meteen door.

## Wat ik wél hard heb

Deze feiten komen uit zoekresultaten en zijn in het dossier steeds van een bron
voorzien:

- Facebook telde in juni 2026 ± 13,0 miljoen gebruikers in Nederland (73,9% van
  de bevolking); bij 65-plus zijn er ± 721.400 meer vrouwen dan mannen.
  → napoleoncat.com
- Ruim 70% van alle online betalingen in Nederland loopt via iDEAL. Onder
  senioren steeg iDEAL-gebruik van 80% (2018) naar 94% (2020).
  → betaalvereniging.nl, anbo.nl
- Een derde van de senioren heeft weleens een online aankoop afgebroken om de
  aangeboden betaalmethode. → anbo.nl
- Ruim 40% van de senioren die online winkelt vindt het lastig te zien of een
  webwinkel veilig is; bijna 80% koopt wél online. → seniorweb.nl, emerce.nl
- Waar senioren op letten voor vertrouwen: slotje (57%), https (54%), keurmerk
  (46%), betaalmethode (39%). → accessibility.nl
- Q4 is ± 34% van de jaaromzet in Nederlandse e-commerce; Sinterklaas geeft
  +25–30% t.o.v. een normale week; gemiddeld aankoopbedrag Q4 2025 € 113,25.
  → searchlab.nl, spotler.com, logistiek.nl
- **Sinds 19 juni 2026 is de herroepingsknop wettelijk verplicht** voor
  webshops die aan Nederlandse consumenten verkopen. Ontbreekt die, dan kan de
  bedenktijd oplopen tot een jaar en kan de ACM handhaven. → acm.nl
- Dropshipping-marges bij vidaXL/DropshippingXL liggen rond 20–35% — te dun om
  Meta Ads mee te betalen. CJ Dropshipping levert 3–7 dagen vanuit EU-magazijnen;
  BigBuy 3–7 dagen vanuit Spanje, verzendkosten € 5–15.
  → dropshipadvies.nl, woosa.com

## Hoe je dit dossier gebruikt

Werk `26-actieplan-30-dagen.md` van boven naar beneden af. Dag 1 tot en met 3
zijn verificatiedagen: daar vul je de `[VERIFIEER]`-velden in. Pas daarna zet je
advertentiebudget aan.
