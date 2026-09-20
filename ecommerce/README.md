# Zichtwerk — complete e-commerce build

Een volledig uitgewerkt Shopify-dropshippingbedrijf voor de Nederlandse markt.
Doelgroep ± 55–75 jaar, verkeer via Meta/Facebook Ads.

**Het product:** een daglichtlamp met geslepen glazen loep, voor handwerk,
puzzelen en lezen. € 79,95.

> **Lees eerst `00-VERANTWOORDING.md`.** Daarin staat precies wat ik wél en
> niet heb kunnen verifiëren. Dat bepaalt hoe je elk cijfer hier moet lezen.

## Leeswijzer

| # | Bestand | Wat erin staat |
|---|---|---|
| 00 | `00-VERANTWOORDING.md` | Wat is geverifieerd, wat niet, en wat jij moet nachecken |
| 01 | `01-executive-summary.md` | De hele business op twee pagina's |
| 02 | `02-productresearch.md` | 18 kandidaat-producten, elk beoordeeld |
| 03 | `03-productvergelijking.md` | Scoretabel op 28 criteria + waarom de nummers 2 t/m 5 afvallen |
| 04 | `04-gekozen-product.md` | **DIT PRODUCT GAAN WE VERKOPEN** + onderbouwing |
| 05 | `05-concurrentieanalyse.md` | Wie er al zit, hoe ze verkopen, waar het gat zit |
| 06 | `06-customer-avatar.md` | Wie koopt dit, en wat houdt haar tegen |
| 07 | `07-sourcing.md` | Leveranciers, inkoopeisen, zoek- en verificatieprotocol |
| 08 | `08-unit-economics.md` | Kostprijs → break-even CPA/ROAS → winst per CAC-scenario |
| 09 | `09-offer.md` | Prijsladder, bundels, order bump, upsell |
| 10 | `10-brand-identity.md` | Naam, payoff, positionering, kleur, typografie, logo, tone of voice |
| 11 | `11-domein-en-naamcheck.md` | Domeinopties + checkprotocol (KVK, BOIP, EUIPO, SIDN) |
| 12 | `12-site-architectuur.md` | Sitemap, navigatie, URL-structuur, verkeersstromen |
| 13 | `13-homepage.md` | Volledige homepage-copy, sectie voor sectie |
| 14 | `14-productpagina.md` | Volledige productpagina-copy incl. FAQ, specs, instructies |
| 15 | `15-fotografie.md` | Shotlist van 12 beelden + productie-instructies |
| 16 | `16-image-prompts.md` | Kant-en-klare prompts per beeld |
| 17 | `17-meta-ads.md` | Accountstructuur, targeting, budget, testritme, Q4-kalender |
| 18 | `18-ad-creatives.md` | 16 advertentieconcepten met volledige scripts |
| 19 | `19-ugc-scripts.md` | 6 UGC-structuren + makersbriefing |
| 20 | `20-email-flows.md` | 9 flows, 18 complete e-mails |
| 21 | `21-cro-audit.md` | 27 conversieproblemen + oplossing, incl. checkout-instellingen |
| 22 | `22-ab-testplan.md` | 90-dagen testroadmap, geprioriteerd op impact × zekerheid ÷ inspanning |
| 23 | `23-analytics.md` | Pixel, CAPI, GA4, Clarity, UTM's, KPI-definities |
| 24 | `24-juridisch.md` | NL/EU-checklist incl. herroepingsknop, GPSR, WEEE, Omnibus |
| 25 | `25-prelaunch-checklist.md` | Audit vóór de eerste euro advertentiebudget |
| 26 | `26-actieplan-30-dagen.md` | Dag voor dag |
| 27 | `27-groeiplan-90-dagen.md` | Van test naar schaal |
| 28 | `28-red-team-review.md` | Drie critici slopen de winkel, daarna de correcties |
| 29 | `29-bedrijfsvoering.md` | Werkkapitaal, retourafhandeling, tijdsbesteding |

## Code

### `shopify-theme/`

Drop-in sections voor Shopify (bovenop Dawn), niet een compleet eigen thema —
zie `shopify-theme/INSTALLATIE.md` voor de reden en de installatievolgorde.
Elk bestand heeft bovenin een kop met **BESTAND / LOCATIE / INSTALLATIE**.

- `assets/zichtwerk.css` — ontwerpsysteem. Niets kleiner dan 15 px, geen
  grijstint lichter dan 5,4:1, knoppen 56 px.
- `assets/zichtwerk.js` — voor/na-schuifbalk, plakkende koopknop, bundelkiezer,
  FAQ. Alles werkt ook als dit bestand nooit laadt.
- `sections/` — 13 sections, waaronder de wettelijk verplichte
  `herroepingsknop.liquid` en `product-compliance.liquid` (GPSR).
- `snippets/` — pictogrammen, betaallogo's, plakkende koopknop.
- `templates/` — homepage, productpagina, herroepingspagina.

### `tools/`

- `unit-economics.html` — rekenmodel. Vul je eigen geverifieerde inkoopprijs en
  verzendkosten in en zie direct je break-even CPA en ROAS, je winst per
  CAC-scenario, en welke conversieratio je nodig hebt.

## Waar te beginnen

1. `00-VERANTWOORDING.md` — zodat je weet wat de cijfers waard zijn
2. `01-executive-summary.md` — de hele business in vijf minuten
3. `26-actieplan-30-dagen.md` — en dan aan het werk
