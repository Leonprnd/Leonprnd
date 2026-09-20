# Installatie van het Zichtwerk-thema

## Wat dit is, en wat het niet is

Dit zijn **losse sections die je bovenop een bestaand Shopify-thema zet** — niet
een compleet eigen thema.

Dat is een bewuste keuze. Een volledig zelfgebouwd thema betekent dat je zelf
verantwoordelijk wordt voor winkelwagen, checkout-integratie, accountpagina's,
zoekresultaten en elke toekomstige Shopify-update. Daar gaat maanden in zitten
en het levert geen euro extra omzet op.

**Zet deze sections op Dawn** (het gratis standaardthema van Shopify). Dawn
regelt de saaie helft: winkelwagen, formulieren, prestaties, toegankelijkheid,
updates. Deze bestanden regelen de helft waar het geld zit: de landingspagina,
het koopblok, het bewijs en de compliance.

## Volgorde

### 1. Thema klaarzetten (10 min)

1. **Online Store → Themes → Add theme → Dawn** (nieuwste versie)
2. **Actions → Edit code**

### 2. Basisbestanden (10 min)

| Waar | Wat | Bestand hier |
|---|---|---|
| Assets → Add a new asset → Create blank file | `zichtwerk.css` | `assets/zichtwerk.css` |
| Assets → Add a new asset → Create blank file | `zichtwerk.js` | `assets/zichtwerk.js` |

Plak de inhoud erin en sla op.

Open dan **Layout → theme.liquid** en voeg toe:

Vlak vóór `</head>`:
```liquid
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&family=Source+Serif+4:wght@600&display=swap">
{{ 'zichtwerk.css' | asset_url | stylesheet_tag }}
```

Vlak vóór `</body>`:
```liquid
<script src="{{ 'zichtwerk.js' | asset_url }}" defer></script>
```

### 3. Snippets (5 min)

Snippets → Add a new snippet, drie keer:

- `zw-icon` → inhoud uit `snippets/zw-icon.liquid`
- `zw-betaallogos` → uit `snippets/zw-betaallogos.liquid`
- `zw-sticky-cart` → uit `snippets/zw-sticky-cart.liquid`

**Let op de naam:** Shopify voegt zelf `.liquid` toe. Typ dus `zw-icon`, niet
`zw-icon.liquid`.

### 4. Sections (15 min)

Sections → Add a new section, voor elk bestand in `sections/`:

| Bestand | Waarvoor |
|---|---|
| `announcement-bar.liquid` | Telefoonnummer bovenaan |
| `hero.liquid` | Bovenste blok homepage |
| `probleem.liquid` | Herkenning, drie punten |
| `voordelen.liquid` | Vier uitkomsten |
| `demonstratie.liquid` | Voor/na-schuifvergelijking |
| `waarom-glas.liquid` | De verkopende uitlegsectie |
| `vergelijking.liquid` | Tabel met alternatieven |
| `reviews-eerlijk.liquid` | Zolang je geen echte reviews hebt |
| `faq.liquid` | Veelgestelde vragen + structured data |
| `garantie.liquid` | Vertrouwensblok |
| `main-product-zichtwerk.liquid` | Het koopblok |
| `product-compliance.liquid` | GPSR-gegevens, wettelijk verplicht |
| `herroepingsknop.liquid` | Herroepingsknop, wettelijk verplicht |

### 5. Product aanmaken (15 min)

**Products → Add product**

- Titel: `Daglamp met geslepen loep`
- Beschrijving: leeg laten. Alle tekst staat in de sections.
- **Variants** — precies deze drie, met deze exacte titels:

| Variant | Prijs | Voorraad |
|---|---|---|
| `Enkel` | 79,95 | volgen uit |
| `Compleet` | 99,95 | volgen uit |
| `Duo` | 139,95 | volgen uit |

> De variant moet **letterlijk** `Compleet` heten, want die naam staat in de
> instelling "aanbevolen variant" van het koopblok.

- Theme template: kies `product.zichtwerk`

### 6. Templates (5 min)

Templates → Add a new template, of vervang de bestaande:

- `product.zichtwerk.json` (nieuw, als JSON-template)
- `index.json` (vervangt de bestaande homepage)
- `page.herroeping.json` (nieuw)

### 7. Pagina's aanmaken (10 min)

**Online Store → Pages → Add page**, voor elk:

| Titel | Handle | Template |
|---|---|---|
| Bestelling herroepen | `herroeping` | `page.herroeping` |
| Over ons | `over-ons` | standaard |
| Contact | `contact` | `page.contact` |
| Veelgestelde vragen | `veelgestelde-vragen` | standaard |
| Verzending | `verzending` | standaard |
| Retourneren | `retourneren` | standaard |
| Garantie | `garantie` | standaard |
| Bestelling volgen | `bestelling-volgen` | standaard |

Teksten voor deze pagina's: zie `../24-juridisch.md`.

### 8. Menu's (5 min)

**Online Store → Navigation**

*Hoofdmenu:* De Daglamp · Veelgestelde vragen · Verzending en retour · Contact · Over ons

*Footermenu:* zie `../12-site-architectuur.md`

**Zet in het footermenu een link "Bestelling herroepen" naar `/pages/herroeping`.**
Die knop moet eenvoudig vindbaar zijn — dat is de kern van de wettelijke eis.

### 9. Metafields (optioneel, 10 min)

Voor de bijregels onder de bundelkeuze en de GPSR-gegevens per product:

**Settings → Custom data → Variants → Add definition**
- Namespace en key: `zichtwerk.bijregel`, type: *Single line text*

**Settings → Custom data → Products → Add definition**
- `zichtwerk.fabrikant`, `zichtwerk.fabrikant_adres`,
  `zichtwerk.eu_verantwoordelijke`, `zichtwerk.eu_adres`,
  `zichtwerk.typenummer` — alle type *Single line text*

Zonder metafields werkt alles ook; dan gebruikt de section de waardes uit de
theme-editor.

## Controle na installatie

- [ ] Homepage laadt, alle secties staan in de juiste volgorde
- [ ] Telefoonnummer staat bovenaan en is aanklikbaar op mobiel
- [ ] Productpagina: drie bundels, "Compleet" voorgeselecteerd
- [ ] Bundel wisselen verandert de prijs
- [ ] **JavaScript uitzetten → bestellen werkt nog steeds** (de radio's zijn
      echte formuliervelden)
- [ ] Plakkende koopknop verschijnt op mobiel na scrollen
- [ ] Voor/na-schuifbalk werkt met vinger én met pijltjestoetsen
- [ ] FAQ: er staat er maar één tegelijk open
- [ ] `/pages/herroeping` laadt en het formulier verstuurt
- [ ] GPSR-blok staat op de productpagina en is ingevuld
- [ ] Betaallogo's tonen alleen methodes die je echt aanbiedt
- [ ] Niets op de site is kleiner dan 15 px
- [ ] Alle knoppen zijn minimaal 56 px hoog

## Snelheid

Deze sections voegen ± 16 kB CSS en ± 5 kB JS toe, ongecomprimeerd. Dat is
verwaarloosbaar. Wat je snelheid wél sloopt:

1. **Apps.** Elke app injecteert scripts. Installeer er zo min mogelijk.
2. **Ongecomprimeerde foto's.** Zie `../15-fotografie.md` voor de eisen.
3. **Meerdere lettertypefamilies.** Er staan er hier twee. Houd het daarbij.
