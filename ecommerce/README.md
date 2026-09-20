# Zichtwerk — complete e-commerce build

Volledig uitgewerkt Shopify-dropshippingbedrijf voor de Nederlandse markt,
doelgroep ± 55–75 jaar, verkeer via Meta/Facebook Ads.

> **Lees eerst `00-VERANTWOORDING.md`.** Daarin staat precies wat ik wél en niet
> heb kunnen verifiëren. Dat bepaalt hoe je de cijfers in dit dossier moet lezen.

## Leeswijzer

| # | Bestand | Wat erin staat |
|---|---------|----------------|
| 00 | `00-VERANTWOORDING.md` | Wat is geverifieerd, wat niet, en wat jij moet nachecken |
| 01 | `01-executive-summary.md` | De hele business op 2 pagina's |
| 02 | `02-productresearch.md` | 18 kandidaat-producten, elk op 28 criteria |
| 03 | `03-productvergelijking.md` | Scoretabel + waarom de nummers 2 t/m 5 afvallen |
| 04 | `04-gekozen-product.md` | **DIT PRODUCT GAAN WE VERKOPEN** + onderbouwing |
| 05 | `05-concurrentieanalyse.md` | Wie er al zit, hoe ze verkopen, waar het gat zit |
| 06 | `06-customer-avatar.md` | Wie koopt dit, wat houdt haar tegen |
| 07 | `07-sourcing.md` | Leveranciers + exact zoek- en verificatieprotocol |
| 08 | `08-unit-economics.md` | Kostprijs → break-even CPA/ROAS → winst per CAC-scenario |
| 09 | `09-offer.md` | Prijsladder, bundels, bump, upsell |
| 10 | `10-brand-identity.md` | Naam, payoff, positionering, kleur, type, logo, tone of voice |
| 11 | `11-domein-en-naamcheck.md` | Domeinopties + juridisch checkprotocol (KVK/BOIP/EUIPO/SIDN) |
| 12 | `12-site-architectuur.md` | Sitemap, navigatie, URL-structuur |
| 13 | `13-homepage.md` | Volledige homepage-copy, sectie voor sectie |
| 14 | `14-productpagina.md` | Volledige PDP-copy incl. FAQ, specs, instructies |
| 15 | `15-fotografie.md` | Shotlist van 12 beelden + productie-instructies |
| 16 | `16-image-prompts.md` | Kant-en-klare prompts per beeld |
| 17 | `17-meta-ads.md` | Accountstructuur, targeting, budget, testritme |
| 18 | `18-ad-creatives.md` | 16 advertentieconcepten met volledige scripts |
| 19 | `19-ugc-scripts.md` | 6 UGC-scripts + briefing voor makers |
| 20 | `20-email-flows.md` | 9 flows, volledige e-mails |
| 21 | `21-cro-audit.md` | 27 conversieproblemen + oplossing |
| 22 | `22-ab-testplan.md` | 90-dagen testroadmap, geprioriteerd |
| 23 | `23-analytics.md` | Pixel, CAPI, GA4, Clarity, UTM's, KPI-definities |
| 24 | `24-juridisch.md` | NL/EU-checklist incl. herroepingsknop + GPSR |
| 25 | `25-prelaunch-checklist.md` | Audit vóór de eerste euro advertentiebudget |
| 26 | `26-actieplan-30-dagen.md` | Dag voor dag |
| 27 | `27-groeiplan-90-dagen.md` | Van test naar schaal |
| 28 | `28-red-team-review.md` | Drie critici slopen de winkel, daarna de fixes |

## Code

- `shopify-theme/` — werkende Liquid-sections, snippets, CSS en JS.
  Elk bestand heeft bovenin een kop met **BESTAND / LOCATIE / INSTALLATIE**.
  Zie `shopify-theme/INSTALLATIE.md` voor de volgorde.
- `tools/unit-economics.html` — rekenmachine. Vul je eigen geverifieerde
  inkoopprijs en verzendkosten in en zie direct je break-even CPA en ROAS.
