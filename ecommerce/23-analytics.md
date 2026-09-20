# 23 — Analytics

## Wat je installeert

| # | Wat | Waarom | Prioriteit |
|---|---|---|---|
| 1 | **Meta Pixel** | Basis voor optimalisatie en retargeting | Vóór lancering |
| 2 | **Conversions API (CAPI)** | Browserbeperkingen en cookiekeuzes laten een deel van je conversies wegvallen. Zonder CAPI optimaliseert Meta op onvolledige data | Vóór lancering |
| 3 | **GA4** | Onafhankelijke waarheid naast Meta. Meta rapporteert zijn eigen bijdrage structureel te rooskleurig | Vóór lancering |
| 4 | **Microsoft Clarity** | Gratis sessieopnames en heatmaps. Voor deze doelgroep goud waard | Week 1 |
| 5 | **Shopify Analytics** | Staat er al. Dit is je omzetwaarheid | — |
| 6 | **Een spreadsheet** | Zie hieronder. Je belangrijkste rapportage | Week 1 |

## 1 en 2 — Meta Pixel en CAPI

**Installatie:** via het Facebook & Instagram-kanaal in Shopify. Dat regelt
Pixel én CAPI in één keer, zonder code. Doe het niet handmatig als je het ook
via het kanaal kunt — de kans op dubbele events is groot.

**Vóór lancering afvinken:**
- [ ] Domein geverifieerd in Business Manager
- [ ] Aggregated Event Measurement ingericht, **Purchase op prioriteit 1**
- [ ] Testaankoop gedaan, Purchase komt binnen **mét waarde en valuta**
- [ ] Events Manager toont "Goed" voor eventkwaliteit, niet "Matig"
- [ ] Geen dubbele events (Pixel én CAPI zonder deduplicatie op `event_id`)

**De events die ertoe doen:**

| Event | Wanneer | Waarvoor |
|---|---|---|
| `PageView` | elke pagina | basis |
| `ViewContent` | productpagina | retargeting |
| `AddToCart` | in de winkelwagen | tussenmeting |
| `InitiateCheckout` | checkout gestart | tussenmeting |
| `Purchase` | bedankpagina | **waar alles op draait** |

> De plakkende koopknop verzendt met opzet niet zelf (zie
> `snippets/zw-sticky-cart.liquid`). Twee koopformulieren op één pagina geven
> dubbele `AddToCart`-events, en dan klopt je hele trechter niet meer.

## 3 — GA4

**Waarom naast Meta.** Meta schrijft zichzelf conversies toe die ook zonder de
advertentie waren gebeurd. GA4 hanteert een ander model. Waar beide het over
eens zijn, is waarschijnlijk waar.

**Instellen:** via het Google & YouTube-kanaal in Shopify. Zet enhanced
ecommerce aan. Markeer `purchase` als sleutelgebeurtenis.

## 4 — Microsoft Clarity

Gratis, en bij deze doelgroep het nuttigste instrument dat je hebt. Je ziet
letterlijk waar iemand van 66 vastloopt: waar ze twijfelt, waar ze doodloopt op
een element dat niet klikbaar is, waar ze drie keer probeert een uitklapkop te
openen.

**Wat je er wekelijks mee doet:**
1. Bekijk vijf opnames van mobiele bezoekers die de winkelwagen niet haalden.
2. Kijk naar *rage clicks* — herhaald klikken op iets dat niet reageert. Bij
   deze doelgroep bijna altijd een te klein aanraakdoel.
3. Kijk naar de scrolldiepte-heatmap. Waar houdt 50% op? Die sectie is te lang
   of te saai.

**Let op:** Clarity legt sessies vast. Noem het in je privacyverklaring en zet
het achter je cookietoestemming.

## 5 — UTM-structuur

Consequent, of het is waardeloos.

```
utm_source   = facebook
utm_medium   = paid
utm_campaign = {{campaign.name}}
utm_content  = {{adset.name}}
utm_term     = {{ad.name}}
```

Vul deze in op advertentieniveau in Meta met de dynamische variabelen, dan
hoef je het nooit handmatig te doen.

**Naamgeving — houd je hieraan:**

| Niveau | Patroon | Voorbeeld |
|---|---|---|
| Campagne | `[DOEL]-[fase]-[maand]` | `AANKOOP-scale-okt` |
| Advertentieset | `[land]-[leeftijd]-[targeting]` | `NL-55-75-breed` |
| Advertentie | `[nr]-[type]-[hoek]-[versie]` | `02-video-demo-v1` |

Over drie maanden wil je kunnen zien welke *hoek* werkte, niet welke
"Kopie van Ad Set 3 - final2" het deed.

## 6 — Het wekelijkse overzicht

Bouw dit in een spreadsheet. Vijf minuten per week, en het is je belangrijkste
rapportage — belangrijker dan welk dashboard ook, omdat het je dwingt naar de
gehele week te kijken in plaats van naar gisteren.

| Kolom | Bron |
|---|---|
| Week | |
| Advertentiebudget | Meta |
| Vertoningen | Meta |
| CPM | Meta |
| Kliks (link) | Meta |
| CTR | Meta |
| CPC | Meta |
| Paginaweergaven | GA4 |
| Winkelwagens | Shopify |
| Bestellingen | **Shopify** (niet Meta) |
| Omzet | **Shopify** |
| AOV | berekend |
| Conversieratio | berekend |
| CAC | budget ÷ bestellingen |
| **MER** | omzet ÷ budget |
| Contributiemarge | zie `08-unit-economics.md` |
| Retouren | Shopify |

## KPI-definities en streefwaarden

| KPI | Formule | Doel | Alarm |
|---|---|---:|---:|
| **CPM** | kosten ÷ vertoningen × 1000 | € 6–14 | > € 20 |
| **CTR (link)** | linkkliks ÷ vertoningen | > 1,0% | < 0,7% |
| **CPC** | kosten ÷ linkkliks | < € 0,80 | > € 1,20 |
| **Hook rate** | 3-sec weergaven ÷ vertoningen | > 25% | < 18% |
| **Landingsratio** | paginaweergaven ÷ linkkliks | > 85% | < 75% |
| **Winkelwagenratio** | AddToCart ÷ paginaweergaven | > 7% | < 4% |
| **Checkoutratio** | InitiateCheckout ÷ AddToCart | > 65% | < 50% |
| **Conversieratio** | bestellingen ÷ sessies | > 2,5% | < 1,5% |
| **AOV** | omzet ÷ bestellingen | > € 95 | < € 82 |
| **CAC** | budget ÷ bestellingen | < € 30 | > € 42,85 |
| **MER** | totale omzet ÷ totaal budget | > 3,3 | < 2,4 |
| **Contributiemarge** | zie `08` | > € 12/order | < € 0 |
| **Retourpercentage** | retouren ÷ bestellingen | < 6% | > 12% |
| **Chargebacks** | chargebacks ÷ bestellingen | < 0,3% | > 0,8% |

## Welke drie getallen je dagelijks bekijkt

Niet meer dan drie, anders ga je sturen op ruis.

1. **Bestellingen** (Shopify)
2. **Advertentiebudget** (Meta)
3. **MER** = 1 ÷ 2

Blijft MER boven 3,3, dan gaat het goed. Zakt hij drie dagen onder 2,4, dan
grijp je in. Alles daartussen is ruis.

## Waar je op moet letten bij de cijfers

**Meta's aankoopcijfer klopt niet met Shopify.** Dat is normaal. Meta rekent
view-through en cross-device mee. **Shopify is je waarheid voor omzet; Meta is
je stuurinformatie voor optimalisatie.** Gebruik nooit Meta's ROAS voor je
winstberekening.

**Onder de 50 conversies per week is je data ruis.** Een dag met drie
bestellingen zegt niets. Kijk naar rollende zeven dagen.

**Retouren komen later binnen dan omzet.** Een week die € 4.000 lijkt op te
leveren, is na retouren € 3.700. Reken je niet rijk in week 1.

Door naar `24-juridisch.md`.
