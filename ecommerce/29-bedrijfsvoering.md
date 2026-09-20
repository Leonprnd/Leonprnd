# 29 — Bedrijfsvoering: geld en retouren

Dit hoofdstuk ontbrak in de eerste versie van dit dossier. De ondernemer in
`28-red-team-review.md` wees er terecht op: het plan was compleet, de
bedrijfsvoering niet.

---

## Deel 1 — Werkkapitaal

### Het probleem in één zin

**Je betaalt Meta en je leverancier vandaag, en Shopify betaalt jou over een
paar dagen uit.** Bij een groeiend advertentiebudget loopt dat gat op.

### Hoe het geld loopt

| Wanneer | Wat | Richting |
|---|---|---|
| Dag 0 | Klant betaalt (iDEAL) | binnen, maar bij Shopify |
| Dag 0 | Je bestelt bij de leverancier | **uit** |
| Dag 0 | Meta schrijft je advertentiekosten af | **uit** |
| Dag 2–5 | Shopify Payments keert uit op je rekening | binnen `[VERIFIEER je eigen uitbetalingstermijn]` |

### Wat je nodig hebt

Gerekend met 300 bestellingen per maand (10 per dag) bij een CAC van € 30:

| Post | Per dag |
|---|---:|
| Advertentiekosten | € 300 |
| Inkoop en verzending (10 × € 33,47) | € 335 |
| **Uitgaand per dag** | **€ 635** |
| Inkomend per dag (10 × € 99,74) | € 997 |

De dagcijfers zijn gezond. Het probleem is de **vertraging**: er staat
voortdurend drie tot vijf dagen omzet bij Shopify.

| | Bedrag |
|---|---:|
| Uitgaand tijdens de wachttijd (5 × € 635) | € 3.175 |
| Refund- en garantiereserve | € 1.000 |
| Veiligheidsmarge (één slechte week) | € 2.000 |
| **Werkkapitaal dat je nodig hebt** | **± € 6.000** |

Bij € 100 advertentiebudget per dag ligt dat rond **€ 2.500**.

### Vier manieren om die druk te verlagen

1. **Vraag Shopify om een snellere uitbetaling.** Sommige accounts kunnen naar
   dagelijkse uitbetaling. Scheelt direct twee dagen omzet.
2. **Zet een zakelijke creditcard op je Meta-account** in plaats van
   automatische incasso. Dan koop je 20 tot 30 dagen betalingstermijn, gratis.
3. **Onderhandel betaaltermijn met je leverancier** zodra je volume hebt.
   Eerste maanden is dat kansloos; vanaf 200 orders per maand kun je het vragen.
4. **Groei niet sneller dan je kas toelaat.** De klassieke manier om aan een
   winstgevend bedrijf failliet te gaan is te hard schalen. Als je CAC goed is
   en je kas niet, is de juiste zet wachten, niet lenen.

### Het alarm

> **Als je het advertentiebudget van morgen alleen kunt betalen met de omzet
> van gisteren, groei je te hard.** Zet het budget dan één stap terug en bouw
> eerst een buffer van twee weken.

---

## Deel 2 — Retouren

### Waarom dit voor een dropshipper anders ligt

Je leverancier zit in Duitsland, Spanje of China. Een klant uit Zwolle stuurt
haar lamp niet naar Valencia — dat kost meer dan het product waard is, en ze
zou het terecht weigeren.

**Je hebt dus een Nederlands retouradres nodig.** Dat is geen detail: zonder
retouradres is je "60 dagen op proef" een belofte die je niet kunt waarmaken.

### Drie opties

| Optie | Kosten | Wanneer |
|---|---|---|
| **Je eigen adres** | € 0 | Tot ± 20 retouren per maand. Prima in het begin. |
| **Fulfilmentpartij in Nederland** | € 2–5 per retour `[VERIFIEER]` | Vanaf ± 30 retouren per maand |
| **Retouren naar de leverancier** | Hoog en traag | Vrijwel nooit de moeite waard |

### Het proces

```
1. Klant meldt herroeping (formulier of telefoon)
   → Bevestig binnen 1 werkdag. Automatisch antwoord telt niet.

2. Pakket komt binnen met het meegeleverde label
   → Registreer: bestelnummer, datum, opgegeven reden

3. Inspectie, 5 minuten per stuk
   → Lens: krassen? (kijk schuin tegen het licht)
   → Arm: blijft hij staan?
   → Lamp: alle standen, flikkertest
   → Compleet: klem, voet, adapter, doekje, handleiding

4. Indeling
   A. Als nieuw, alles compleet     → terug in de verkoop
   B. Gebruikssporen, werkt goed    → verkopen als "tweede kans", 30% korting
   C. Defect                        → garantieclaim bij de leverancier
   D. Beschadigd door de klant      → overleg, meestal alsnog terugbetalen

5. Terugbetaling binnen 14 dagen na de herroeping. Wettelijk verplicht.
   → Hetzelfde betaalmiddel, altijd. Nooit een tegoedbon aanbieden alsof
     dat de enige optie is.

6. Noteer de reden. Elke maand tellen.
```

### De reden is belangrijker dan de retour

Vijftien retouren per maand kosten je geld. Vijftien retouren met dezelfde
reden kosten je je bedrijf.

| Reden | Wat je eraan doet |
|---|---|
| "Vergroting viel tegen" | Productcopy aanpassen. De advertentie belooft te veel |
| "Kleiner dan gedacht" | Maatfoto prominenter (shot 8 uit `15-fotografie.md`) |
| "Arm zakt weg" | **Leverancier. Dit is een productfout, geen klantprobleem** |
| "Licht te fel / te koud" | Uitleg over de standen in de verzendmail |
| "Toch niet nodig" | Normaal. Hier hoef je niets aan te doen |
| "Kwam beschadigd aan" | Verpakking van de leverancier controleren |

> **Twee keer dezelfde productklacht is een leverancierskwestie, geen
> toeval.** Neem dan contact op met je leverancier vóórdat je nog honderd
> stuks verkoopt.

### Wat een retour werkelijk kost

| Post | Bedrag |
|---|---:|
| Heenzending (al betaald) | € 5,40 |
| Retourzending (jij betaalt) | € 7,00 `[VERIFIEER]` |
| Betaalkosten (vaak niet terugbetaald) | € 0,79 |
| **Als het product opnieuw verkocht kan worden** | **€ 13,19** |
| Inkoop verloren (als het níet opnieuw verkoopbaar is) | + € 28,07 |
| **Worst case** | **€ 41,26** |

In `08-unit-economics.md` staat een reserve van 5% van de netto-omzet: € 4,12
per bestelling. Dat dekt bij een retourpercentage van 5% zelfs het slechtste
geval (0,05 × € 41,26 = € 2,06). **Het model is op dit punt dus aan de
voorzichtige kant**, en dat mag zo blijven.

**Waar het wél fout gaat:** boven de 12% retouren, of als je geen retouradres
hebt en elke retour een totaal verlies is. Reken zelf: bij 15% retourpercentage
zonder herverkoop kost dat € 6,19 per bestelling — dan zakt je
contributiemarge van € 42,85 naar € 40,78 en, belangrijker, heb je een
productprobleem dat je moet oplossen in plaats van doorrekenen.

### Chargebacks

Zeldzamer dan retouren, maar duurder: je verliest het bedrag, het product én je
betaalt een behandelvergoeding. Bij een onbekende webwinkel is de meest
voorkomende oorzaak niet fraude maar **onzekerheid**: iemand die niets hoort en
denkt dat ze opgelicht is.

Daar is de flow in `20-email-flows.md` op gebouwd: orderbevestiging,
verzendmail met track-en-tracecode, en een nazorgmail twee dagen na levering.
Iemand die een mail van je krijgt, belt haar bank niet.

**Als er toch een chargeback komt:** verzamel meteen de orderbevestiging, het
bezorgbewijs met handtekening of scan, en alle e-mailcontact. Reageer binnen de
termijn van je betaalprovider.

---

## Deel 3 — Je tijd

De ondernemer in `28` had gelijk: dit is een fulltime baan. Een eerlijke
inschatting voor de eerste drie maanden:

| Taak | Uur per week |
|---|---:|
| Creatives maken en monteren | 8–12 |
| Advertenties beheren | 3–5 |
| Klantenservice (telefoon en e-mail) | 5–10 |
| Bestellingen en retouren verwerken | 3–6 |
| Winkel verbeteren, sessieopnames | 3–5 |
| Administratie en boekhouding | 2–3 |
| **Totaal** | **24–41 uur** |

**Als je die tijd niet hebt,** verlaag dan het advertentiebudget in plaats van
de kwaliteit. Een winkel op € 50 per dag die goed bediend wordt, verdient meer
dan een winkel op € 200 per dag waar de telefoon niet wordt opgenomen — zeker
bij een doelgroep die belt voordat ze bestelt.

**Wat je als eerste uitbesteedt** zodra het kan: het monteren van video's. Dat
is het meeste werk met de minste strategische waarde.

**Wat je nooit uitbesteedt in het eerste jaar:** de telefoon. Die gesprekken
zijn je beste marktonderzoek, en bij deze doelgroep is de stem aan de lijn het
halve product.
