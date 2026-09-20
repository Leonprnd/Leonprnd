# 17 — Meta Ads-strategie

## De twee getallen waar alles om draait

Uit `08-unit-economics.md`:

| | |
|---|---:|
| Break-even CPA | **€ 42,85** |
| Doel-CPA (gezonde marge) | **€ 30,00** |
| Break-even ROAS | **2,32** |
| Doel-ROAS | **3,30** |
| Maximale CPC bij 2,5% conversie | **€ 0,75** |

Alles hieronder dient één doel: bestellingen kopen onder de € 30 en zo veel
mogelijk daarvan.

## Waarom deze doelgroep gunstig is

- Facebook had in juni 2026 ± 13,0 miljoen Nederlandse gebruikers, 73,9% van de
  bevolking ([napoleoncat](https://stats.napoleoncat.com/facebook-users-in-netherlands/)).
- Bij 55-plus is Facebook verreweg het populairste platform — anders dan bij
  25-minners, die je daar nauwelijks nog bereikt.
- In de groep 65-plus zijn er ± 721.400 méér vrouwen dan mannen. Dat is precies
  de groep die haakt, breit, borduurt en puzzelt.
- **Er wordt veel minder om deze groep gevochten** dan om 25–45. Dat drukt je
  CPM, en CPM is de helft van je CPC.

## Vóór je één euro uitgeeft

| # | Wat | Waarom het niet mag ontbreken |
|---|---|---|
| 1 | Business Manager met eigen domein | Persoonlijke accounts worden vaker geblokkeerd |
| 2 | **Domeinverificatie** | Zonder dit kun je je eigen events niet prioriteren |
| 3 | Meta Pixel **én** Conversions API | Zie `23-analytics.md`. Alleen de pixel is sinds de browserbeperkingen niet meer genoeg |
| 4 | Aggregated Event Measurement ingericht | Purchase op prioriteit 1 |
| 5 | Betaalmethode + back-upkaart | Een geweigerde betaling zet je campagne stil op het slechtste moment |
| 6 | Bedrijfspagina met inhoud | Een lege pagina waar bezoekers op klikken kost vertrouwen |
| 7 | Testaankoop gedaan | Controleer dat Purchase mét waarde binnenkomt |

## Campagnestructuur

### Fase 1 — Creative testen (week 1–2), € 50/dag

Bij deze doelgroep wint de creative, niet de targeting. Test dus creatives,
niet doelgroepen.

```
CAMPAGNE: [TEST] Creatives — Aankoop
└── Advertentieset: NL · 55–75 · alle geslachten · breed (geen interesses)
    Budget: € 50/dag op setniveau
    Plaatsingen: Advantage+ (automatisch)
    Optimalisatie: Aankoop
    └── 4 advertenties, elk één concept uit 18-ad-creatives.md
```

> **Vier, niet zes.** Op € 50 per dag is zes advertenties € 8 per advertentie
> per dag. Meta concentreert het budget binnen een dag op één of twee
> advertenties; de rest krijgt nooit genoeg vertoningen om iets te bewijzen.
> Je denkt dan dat je zes dingen test, maar je test er twee en je gooit vier
> creatives weg op ruis. Bij € 100 per dag mag je naar zes.
>
> Ook met vier zal Meta ongelijk verdelen. Krijgt een advertentie na twee
> dagen minder dan 500 vertoningen, dan heeft hij geen eerlijke kans gehad —
> zet hem opnieuw in bij de volgende ronde in plaats van hem af te schrijven.

**Waarom breed en niet op interesses.** Met één advertentieset en zes advertenties
houd je alle budget bij elkaar, zodat het algoritme sneller leert. Interesses
opsplitsen versnippert je budget over zes sets die geen van alle genoeg data
krijgen.

**Waarom 55–75 en niet breder.** Je zou Meta zelf de leeftijd kunnen laten
kiezen. Doe dat niet in week 1: je wilt weten wat wérkt bij jouw doelgroep
voordat je het algoritme loslaat. Vanaf fase 3 mag de ondergrens naar 45.

**Beoordelen na 3 dagen of 1.500 vertoningen per advertentie:**

| Signaal | Drempel | Actie |
|---|---|---|
| Hook rate (3 sec / vertoningen) | < 20% | uitzetten |
| CTR (link) | < 0,8% | uitzetten |
| CPC | > € 1,20 | uitzetten |
| Kosten zonder aankoop | > € 60 | uitzetten |
| CPA | < € 35 | doorschalen |

### Fase 2 — Winnaars schalen (week 3–6), € 100–200/dag

```
CAMPAGNE: [SCALE] Aankoop — CBO
├── Set A: breed NL 55–75            60% van budget
├── Set B: interesses (zie hieronder) 20%
└── Set C: lookalike 1% kopers        20%   ← pas vanaf ± 100 aankopen
    Per set: de 2–3 winnende creatives + 1 nieuwe test
```

**Interesses die de moeite waard zijn om te proberen** (elk apart, niet
gestapeld):

| Interesse | Waarom |
|---|---|
| Haken / Crochet | Kerndoelgroep |
| Breien / Knitting | Kerndoelgroep |
| Borduren, kruissteek | Kerndoelgroep |
| Legpuzzels | Tweede doelgroep |
| Modelbouw, vliegvissen | Wim uit `06`, kleiner maar koopkrachtig |
| Libelle, Margriet, MAX | Mediagedrag van de doelgroep |

### Fase 3 — Q4-uitbreiding (vanaf ± 15 november)

Extra campagne voor de cadeaukoper (Marijke, 47, uit `06-customer-avatar.md`):

```
CAMPAGNE: [Q4] Cadeau — Aankoop
└── Set: NL · 35–60 · breed
    Creatives: concepten 9 en 14 uit 18-ad-creatives.md
    Landing: /products/zichtwerk-daglamp?variant=compleet
```

Dit is een andere koper met een ander bezwaar ("weet ik wel zeker dat ze dit
leuk vindt?") en dus een andere advertentie. Meng die niet met je hoofdcampagne.

### Retargeting (vanaf week 2, € 15–25/dag)

```
CAMPAGNE: [RT] Aankoop
├── Set 1: winkelwagen 7 dagen, aankoop uitgesloten  → concept 11 (bezwaar)
└── Set 2: paginabezoek 14 dagen, wagen uitgesloten  → concept 5 (uitleg)
```

Houd retargeting klein. Bij een publiek van deze omvang is de kans op
advertentiemoeheid groot, en een 64-jarige die dezelfde advertentie voor de
twaalfde keer ziet, wordt niet enthousiaster.

## Budgetopbouw

| Week | Dagbudget | Focus | Wat je wilt zien |
|---|---:|---|---|
| 1 | € 50 | 6 creatives testen | 2 met CTR > 1% |
| 2 | € 50 | 6 nieuwe creatives | eerste aankopen, CPA < € 45 |
| 3 | € 100 | winnaars + retargeting | CPA < € 40 |
| 4 | € 150 | schalen | CPA < € 35 |
| 5–6 | € 200 | schalen + lookalike | CPA < € 32 |
| 7+ | € 250–400 | Q4-piek | CPA < € 30, MER > 3,0 |

**Schaalregel:** verhoog het budget met maximaal 20–30% per keer en niet vaker
dan om de twee dagen. Een sprong van € 100 naar € 300 gooit de advertentieset
terug in de leerfase en je CPA schiet omhoog.

**Stopregel:** drie dagen achter elkaar CPA boven € 45 → terug naar het vorige
budget en nieuwe creatives inzetten. Niet doorduwen.

## Creative-ritme

Dit is de belangrijkste operationele gewoonte van het hele plan.

> **Elke week drie nieuwe creatives inzetten. Elke week.**

Creative-uitputting is bij een relatief kleine doelgroep je grootste vijand. Het
Nederlandse bereik van 55–75 met hobby-interesse is een paar honderdduizend
mensen, niet miljoenen. Een winnende advertentie is bij dat volume binnen drie
tot vier weken opgebrand.

Uit `18-ad-creatives.md` heb je zestien concepten. Dat is vijf weken. Daarna
maak je varianten: nieuwe hook op hetzelfde script, ander openingsbeeld, andere
eerste drie seconden.

## Hoe je de advertentie op de pagina laat aansluiten

De meest voorkomende manier om geld te verbranden is een advertentie die iets
belooft wat de landingspagina niet meteen bevestigt. Iemand die op "waarom een
loeplamp van € 19 u duizelig maakt" klikt en op een pagina komt die begint met
"Gratis verzending!", is binnen drie seconden weg.

| Advertentiehoek | Landt op | Eerste wat ze ziet |
|---|---|---|
| Probleem → oplossing | `/products/zichtwerk-daglamp` | Koop­blok met subkop over 's avonds doorgaan |
| Educatief (glas) | `…#waarom-glas` | De uitlegsectie zelf |
| Cadeau | `…?variant=compleet` | Compleet-bundel voorgeselecteerd |
| Demonstratie | `/products/zichtwerk-daglamp` | Voor/na-schuifbalk direct onder de vouw |

## Wat je niet doet

| Niet | Waarom |
|---|---|
| Leeftijd 18–65+ laten staan | Je betaalt voor vertoningen bij 22-jarigen |
| Instagram-only plaatsingen | Deze doelgroep zit op Facebook |
| Reels als hoofdplaatsing | Feed en Stories converteren hier beter |
| Meer dan 6 advertenties per set | Budget versnippert, leerfase duurt eeuwig |
| Dagelijks bijsturen | Onder de 50 conversies per week is dagelijkse ruis geen signaal |
| Dynamic Creative in week 1 | Je leert niet wélk element won |
| Claims over ogen of gezondheid | Meta keurt af, en het mag niet |
| Voor-en-na beelden van mensen | Meta's beleid is hier streng. Voor/na van het *werk* mag wel |

## Advertentiebeleid: waar je op moet letten

Meta keurt advertenties af die impliceren dat iemand een persoonlijk kenmerk
heeft — daaronder valt ook gezondheid en leeftijd. Praktisch:

| ✗ Afgekeurd | ✓ Goedgekeurd |
|---|---|
| "Ziet u slecht?" | "Als het licht 's avonds tekortschiet" |
| "Voor ouderen met slechte ogen" | "Voor wie fijn werk doet" |
| "Last van uw ogen?" | "Uw haakwerk in helder licht" |
| "Wordt u ook ouder?" | "Zo blijft haken 's avonds leuk" |

De regel: **spreek over de situatie, niet over de persoon.**

## Q4-kalender

| Datum | Wat |
|---|---|
| **nu – 15 okt** | Creative testen op € 50/dag. Winnaars vinden vóór de CPM's stijgen. |
| **15 okt – 1 nov** | Schalen naar € 150. CPM's zijn nog laag. |
| **1 nov** | Cadeaucampagne live. Levertijd prominent op de site. |
| **20–30 nov** | Black Friday. CPM's piek. **Geen korting geven** — verhoog in plaats daarvan het budget op de cadeauhoek. Zie hieronder. |
| **1–3 dec** | Laatste besteldagen voor Sinterklaas. Zet een duidelijke besteldeadline op de site. |
| **4–5 dec** | Budget terug. Sinterklaas is voorbij, kerst nog niet begonnen. |
| **6–19 dec** | Kerstcadeau. Deadline communiceren. |
| **20 dec – 5 jan** | Budget laag. Slechte periode. |
| **6 jan+** | CPM's storten in. **Je goedkoopste verkeer van het jaar.** Budget omhoog. |

### Reken vanaf half november met duurdere klikken

De CPA-doelen hierboven gelden voor oktober. In de tweede helft van november
stijgen de CPM's fors doordat elke adverteerder tegelijk budget bijzet. Ga uit
van **40 tot 60% hogere CPM's** dan in oktober, en dus een evenredig hogere CPC.

Wat dat betekent:

| | Oktober | Tweede helft november |
|---|---:|---:|
| CPM (indicatief) | € 10 | € 14–16 |
| CPC bij CTR 1,2% | € 0,83 | € 1,17–1,33 |
| CPA bij CR 2,5% | € 33 | € 47–53 |

Bij € 47 CPA zit je bóven je break-even van € 42,85. Twee gevolgen:

1. **Je winnaars moeten in oktober gevonden zijn.** In november is leren te
   duur. Wie in november nog creatives zit te testen, betaalt lesgeld tegen
   feestdagentarief.
2. **In november compenseer je met AOV, niet met volume.** De cadeaukoper
   kiest vaker de duurdere variant. Stuur dat verkeer daarom naar
   `?variant=compleet` en meet op contributiemarge per bestelling, niet op CPA.

**Waarom geen Black Friday-korting.** Drie redenen: je marge kan het niet
hebben (zie `08`), deze doelgroep is minder kortingsgedreven dan 25–40, en je
mag bij een winkel zonder prijsgeschiedenis geen doorgestreepte van-prijs tonen
(`24-juridisch.md`). Wat je wél doet: meer budget, en de cadeau-boodschap naar
voren.

## Wekelijks ritme

**Maandag, 20 minuten**
1. Kijk naar de week, niet naar gisteren.
2. Zet advertenties uit die de drempels uit fase 1 niet halen.
3. Zet drie nieuwe creatives in (bij een budget onder € 100/dag: twee).
4. Budget aanpassen: maximaal +30%, alleen bij CPA onder doel.

**Donderdag, 10 minuten**
1. Controleer of de Pixel en CAPI nog events doorgeven.
2. Kijk de commentaren op advertenties door. **Daar staat je beste
   marktonderzoek.** Elke vraag die twee keer voorkomt, hoort in de FAQ.

**Nooit:** meerdere keren per dag verversen. Dat is geen management, dat is
onrust, en het leidt tot ingrepen op ruis.

Door naar `18-ad-creatives.md`.
