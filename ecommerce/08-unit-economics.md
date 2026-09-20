# 08 — Unit economics

> Alles hieronder rekent met **21% btw in de prijs**, zoals verplicht bij
> verkoop aan Nederlandse consumenten. Marge wordt berekend over de nettoomzet,
> niet over het bedrag dat de klant betaalt. Dat klinkt vanzelfsprekend, maar
> het is de fout die de meeste dropshippers hun eerste jaar kost: ze rekenen
> zich 21% rijker dan ze zijn.
>
> Alle inkoopcijfers zijn `[VERIFIEER]`. Vul je eigen getallen in via
> `tools/unit-economics.html` — dat rekent alles direct opnieuw door.

## 1. Kostprijs per bestelling — enkel product

Verkoopprijs **€ 79,95** incl. 21% btw

| Regel | Bedrag | Toelichting |
|---|---:|---|
| Brutoprijs (wat de klant betaalt) | € 79,95 | |
| — af te dragen btw (21%) | − € 13,88 | 79,95 − (79,95 ÷ 1,21) |
| **Netto-omzet** | **€ 66,07** | hierover reken je je marge |
| — Inkoopprijs | − € 21,50 | `[VERIFIEER]` bandbreedte € 17–26 |
| — Verzending naar klant | − € 4,95 | EU-magazijn → NL `[VERIFIEER]` |
| — Betaalkosten | − € 0,69 | gemengd, zie 1a |
| — Refund- en defectreserve (5%) | − € 3,30 | 5% van netto-omzet |
| — Retourafhandeling + verpakking | − € 1,10 | retourlabel, insert, doos |
| **Totale variabele kosten** | **€ 31,54** | |
| **Contributiemarge vóór advertenties** | **€ 34,53** | 52,3% van netto-omzet |

### 1a. Hoe die € 0,69 betaalkosten is opgebouwd

Ruim 70% van de Nederlandse online betalingen loopt via iDEAL, en onder
senioren ligt dat nog hoger ([betaalvereniging.nl](https://www.betaalvereniging.nl/actueel/achtergrondinformatie/infographics/),
[anbo.nl](https://www.anbo.nl/nieuws/online-betaalmiddelen-voor-senioren-een-probleem)).
iDEAL heeft een vast tarief per transactie in plaats van een percentage — dat is
gunstig bij een orderwaarde van € 80.

| Methode | Aandeel `[VERIFIEER]` | Tarief `[VERIFIEER]` | Kosten op € 79,95 |
|---|---:|---|---:|
| iDEAL | 75% | ± € 0,29 vast | € 0,29 |
| Creditcard | 20% | ± 1,8% + € 0,25 | € 1,69 |
| PayPal | 5% | ± 2,9% + € 0,35 | € 2,67 |
| **Gewogen gemiddeld** | | | **€ 0,69** |

**Dit is een echt strategisch voordeel.** Een concurrent die vooral op
creditcard draait betaalt drie keer zoveel per transactie. Zorg dus dat iDEAL
de eerste, grootste en meest voor de hand liggende knop is.

## 2. Break-even

| | |
|---|---:|
| **Break-even CPA** (max. advertentiekosten per bestelling) | **€ 34,53** |
| **Break-even ROAS** (79,95 ÷ 34,53) | **2,32** |

Onder ROAS 2,32 verlies je geld op elke bestelling. Dat getal moet je uit je
hoofd kennen.

## 3. Winst per CAC-scenario — enkel product

| CAC | Winst per bestelling | ROAS | Bij 200 orders/mnd | Bij 500 orders/mnd |
|---:|---:|---:|---:|---:|
| € 15 | € 19,53 | 5,33 | € 3.906 | € 9.765 |
| € 20 | € 14,53 | 4,00 | € 2.906 | € 7.265 |
| € 25 | € 9,53 | 3,20 | € 1.906 | € 4.765 |
| € 30 | € 4,53 | 2,67 | € 906 | € 2.265 |
| € 35 | − € 0,47 | 2,28 | − € 94 | − € 235 |
| € 40 | − € 5,47 | 2,00 | − € 1.094 | − € 2.735 |

*(vóór vaste kosten — zie punt 6)*

Kijk naar die tabel en het probleem springt eruit: **tussen CAC € 30 en € 35
ligt de rand van de afgrond.** Eén product van € 79,95 verkopen geeft te weinig
speelruimte. Daarom is de aanbieding in `09-offer.md` geen verkooptruc maar een
noodzaak.

## 4. Met de volledige aanbieding erbij

Zodra je bundels, een order bump en een post-purchase upsell aanzet, verschuift
alles. Aannames over afname `[VERIFIEER — meet dit na 100 orders]`:

| Variant | Prijs | Aandeel | Inkoop |
|---|---:|---:|---:|
| Enkel Daglamp | € 79,95 | 62% | € 21,50 |
| Compleet pakket (+ reservelens + hoes) | € 99,95 | 25% | € 27,50 |
| Duo (2 lampen) | € 139,95 | 13% | € 43,00 |
| Order bump: lensdoek + beschermhoes | € 9,95 | 22% afname | € 2,50 |
| Upsell na aankoop: tweede lamp | € 59,95 | 8% afname | € 21,50 |

**Gemiddelde orderwaarde: € 99,74**

| Regel | Bedrag |
|---|---:|
| Brutoomzet per order | € 99,74 |
| — btw 21% | − € 17,31 |
| **Netto-omzet** | **€ 82,43** |
| — Inkoop (gewogen) | − € 28,07 |
| — Verzending (gewogen, duo in één pakket) | − € 5,40 |
| — Betaalkosten | − € 0,79 |
| — Refund-/defectreserve 5% | − € 4,12 |
| — Retour + verpakking | − € 1,20 |
| **Totale variabele kosten** | **€ 39,58** |
| **Contributiemarge vóór advertenties** | **€ 42,85** |

> Het rekenmodel in `tools/unit-economics.html` komt met dezelfde invoer op
> € 42,95 uit. Dat dubbeltje verschil zit in de post "retour + verpakking", die
> in de tabel hierboven € 1,20 is voor een zwaardere bundelorder en in het
> rekenmodel standaard op € 1,10 staat. Pas die invoer aan als je het gelijk
> wilt trekken.

| | Enkel | Met aanbieding | Verschil |
|---|---:|---:|---:|
| Gem. orderwaarde | € 79,95 | € 99,74 | +25% |
| Contributiemarge | € 34,53 | € 42,85 | **+24%** |
| Break-even CPA | € 34,53 | **€ 42,85** | +€ 8,32 |
| Break-even ROAS | 2,32 | 2,33 | gelijk |

Let op wat hier gebeurt. De break-even ROAS blijft vrijwel gelijk — je
marge*percentage* verandert nauwelijks. Maar je **maximale bod per klant stijgt
met € 8,32**. In een veiling waarin iedereen om dezelfde 64-jarige vecht, is
dat het verschil tussen meebieden en afhaken.

## 5. Winst per CAC-scenario — met aanbieding

| CAC | Winst/order | ROAS | 200 orders | 500 orders | 1.000 orders |
|---:|---:|---:|---:|---:|---:|
| € 15 | € 27,85 | 6,65 | € 5.570 | € 13.925 | € 27.850 |
| € 20 | € 22,85 | 4,99 | € 4.570 | € 11.425 | € 22.850 |
| € 25 | € 17,85 | 3,99 | € 3.570 | € 8.925 | € 17.850 |
| € 30 | € 12,85 | 3,32 | € 2.570 | € 6.425 | € 12.850 |
| € 35 | € 7,85 | 2,85 | € 1.570 | € 3.925 | € 7.850 |
| € 40 | € 2,85 | 2,49 | € 570 | € 1.425 | € 2.850 |

## 6. Vaste kosten per maand

| Post | Bedrag `[VERIFIEER]` |
|---|---:|
| Shopify Basic | € 27–32 |
| Klaviyo (e-mail, tot ± 500 contacten) | € 0–30 |
| Reviews-app | € 0–15 |
| Domein (per maand) | € 1 |
| WEEE-registratie en -afdracht | € 25–50 |
| Boekhouding | € 50–100 |
| Zakelijk telefoonnummer | € 10–20 |
| **Totaal** | **± € 150–250** |

Eenmalig vooraf: juridische toets € 300–800, monsters ± € 100, fotografie
(zie `15-fotografie.md`).

Bij een marge van € 42,85 per order dek je je vaste kosten met **vijf
bestellingen per maand**. Vaste kosten zijn je probleem niet. CAC is je probleem.

## 7. De eerlijke realitycheck

Dit is het deel dat de meeste plannen overslaan.

Je break-even CPA is € 42,85. Of je die haalt, hangt af van twee getallen die je
niet volledig in de hand hebt: je kosten per klik en je conversieratio.

**Benodigde conversieratio om break-even te draaien:**

| CPC | Break-even CR | CR nodig voor € 30 CPA (goede winst) |
|---:|---:|---:|
| € 0,50 | 1,17% | 1,67% |
| € 0,60 | 1,40% | 2,00% |
| € 0,80 | 1,87% | 2,67% |
| € 1,00 | 2,33% | 3,33% |
| € 1,20 | 2,80% | 4,00% |

**Wat dit betekent.** Je bedrijf werkt als je CPC onder ± € 0,80 blijft én je
conversieratio boven ± 2,5% komt. Zit je op € 1,20 per klik en 1,5% conversie,
dan verlies je geld en helpt geen enkele optimalisatie aan de advertentiekant je
daar nog uit.

Goed nieuws: allebei die getallen zijn haalbaar in deze situatie.
- **CPC:** de doelgroep 55–75 in Nederland is relatief goedkoop bereikbaar.
  Facebook is bij 55-plus verreweg het populairste platform en er wordt door
  adverteerders veel minder om deze groep gevochten dan om 25–45.
- **CR:** 2,5%+ is realistisch op een pagina die precies één ding verkoopt, aan
  bezoekers met een concreet probleem, met iDEAL en een sterk retourbeleid.
  Daar is de hele winkel in `13` en `14` op ontworpen.

**Wat je in week één moet meten:** CPC en conversieratio. Niet ROAS. ROAS is een
uitkomst; die twee zijn de knoppen.

## 8. Als je tóch rechtstreeks uit China importeert

Alleen relevant als je Route C uit `07-sourcing.md` overweegt. Dan komt erbij:

- **Invoer-btw 21%** over douanewaarde + vracht + verzekering (terug te vorderen
  als je btw-plichtig bent, maar het kost je liquiditeit)
- **Invoerrechten**: lampen vallen onder GN-hoofdstuk 9405, tarief globaal
  2,7–4,7% `[VERIFIEER bij de Douane voor de exacte GN-code]`
- **Inklaringskosten**: ± € 10–25 per zending
- **Jouw importeursaansprakelijkheid** onder GPSR — zie `07-sourcing.md`

Reken in dat geval op € 3–6 extra per stuk en een langere doorlooptijd.

## 9. De drie getallen die je uit je hoofd moet kennen

1. **€ 42,85** — hierboven betaal je te veel voor een klant
2. **2,33** — hieronder is je ROAS verliesgevend
3. **€ 0,80** — hierboven wordt je CPC een probleem dat je niet wegoptimaliseert

Door naar `09-offer.md`.
