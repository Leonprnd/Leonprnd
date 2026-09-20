# Juridisch, KVK en btw

Dit is geen juridisch advies. Het is een lijst van wat je moet regelen, in de
volgorde waarin het praktisch is.

## Wat je moet regelen voor je eerste euro omzet

### 1. KVK-inschrijving — verplicht

Zodra je structureel en met winstoogmerk verkoopt, moet je ingeschreven staan.
Ook als je het naast een baan of studie doet, en ook als je nog niets verdient.

- **Eenmanszaak** is voor starters de eenvoudigste vorm
- Eenmalig **€ 75**
- Je krijgt je KVK-nummer direct mee
- Je btw-identificatienummer krijg je binnen twee weken van de Belastingdienst

Niet inschrijven is geen grijs gebied: je bent dan in overtreding, je mag geen
geldige facturen sturen en je klanten hebben minder rechten. Bij een doelgroep
van 70-plussers is dat het laatste waar je aan wilt beginnen.

### 2. Zakelijke bankrekening

Niet wettelijk verplicht bij een eenmanszaak, wel nodig voor Mollie en voor je
eigen boekhouding. Reken op € 5 tot € 15 per maand.

### 3. Btw

- Je rekent **21%** over deze producten
- Aangifte meestal per kwartaal
- Btw op je inkoop en advertentiekosten kun je terugvragen
- **Meta factureert met btw-verlegging** (Ierland): je geeft het zelf aan én
  trekt het in dezelfde aangifte af, per saldo nul. Wel invullen.
- Verkoop je voor meer dan **€ 10.000 per jaar** aan consumenten in andere
  EU-landen, dan moet je je registreren voor de **OSS-regeling**. Dan doe je
  één aangifte voor al je EU-verkopen. Verkoop je alleen aan Nederland en een
  beetje aan België, dan speelt dit voorlopig niet.

Overweeg de **kleineondernemersregeling (KOR)** niet: je mag dan geen btw
terugvragen op je inkoop en advertentiekosten, en juist daar zit je geld.

### 4. Invoer

Importeer je zelf uit China, dan ben je **importeur**. Dat betekent:

- Invoerrechten (ongeveer 2,7% over de goederenwaarde voor deze productgroep)
  en 21% invoer-btw. De btw krijg je terug, de invoerrechten niet.
- **Sinds 1 juli 2026 geldt er geen vrijstelling meer voor zendingen tot € 150.**
  Dat raakt pakketje-voor-pakketje dropshipping rechtstreeks uit China direct in
  de marge. Zie [inkoop](02-inkoop-en-leveranciers.md).
- Je bent **aansprakelijk voor de productveiligheid**. Vraag CE- en
  RoHS-verklaringen op en bewaar ze.

## Wat er op je website moet staan

De informatieplicht uit artikel 6:230m BW. Dit staat er allemaal al in, maar de
gegevens moeten nog ingevuld:

- [x] Bedrijfsnaam, vestigingsadres, KVK-nummer, btw-nummer — in de voettekst
- [x] Telefoonnummer en e-mailadres
- [x] Prijzen inclusief btw, met bezorgkosten apart genoemd
- [x] Levertijd
- [x] Herroepingsrecht met modelformulier
- [x] Algemene voorwaarden vóór het afrekenen te lezen
- [x] Privacybeleid en cookiebeleid
- [x] Link naar het Europese ODR-platform

Invullen doe je op één plek: **`winkel/bedrijf.json`**. De bouwer waarschuwt bij
elke build welke velden nog openstaan.

## Waar je op moet letten bij deze doelgroep

Het consumentenrecht geldt altijd even hard, maar bij oudere kopers is het
risico op klachten en op een ACM-melding groter. Drie dingen die serieus fout
kunnen gaan:

**Nepbeoordelingen.** Sinds de Omnibus-richtlijn verboden. De ACM handhaaft
actief; boetes kunnen oplopen tot € 900.000 of 1% van de jaaromzet. Er staan
daarom geen verzonnen beoordelingen op de site en dat moet zo blijven tot je
echte hebt.

**Misleidende schaarste.** "Nog 3 op voorraad" terwijl dat niet zo is, of een
aftelklok die bij het verversen opnieuw begint, is een oneerlijke
handelspraktijk (artikel 6:193g BW).

**Van-prijzen.** Een doorgestreepte prijs moet de laagste prijs van de
afgelopen 30 dagen zijn. Je kunt dus niet openen met "van € 199,95 voor
€ 99,95" als je nooit € 199,95 hebt gevraagd.

**Medische claims.** Zeg niet dat het product fouten voorkomt, de gezondheid
verbetert of medicijngebruik veiliger maakt. Dan wordt het product een medisch
hulpmiddel met alles erop en eraan. De teksten op de site zijn daar al op
geschreven; houd dat zo.

## Herroeping: wat het je kost

Je klant mag binnen **14 dagen** zonder reden terugsturen. De winkel biedt er
**30** — dat mag, en het verhoogt je conversie meer dan het je aan retouren
kost.

- De klant betaalt de retourzending, **mits je dat vooraf duidelijk vermeldt.**
  Dat staat op de retourpagina. Vermeld je het niet, dan draai jij ervoor op.
- Jij betaalt de oorspronkelijke bezorgkosten terug.
- Terugbetalen binnen **14 dagen** na de melding.
- De klant mag het product uitproberen zoals in een winkel. Waardevermindering
  die verder gaat, mag je verrekenen.

## Een verstandige volgorde

1. KVK inschrijven (€ 75, één uur)
2. Zakelijke rekening openen
3. Btw-nummer afwachten
4. `winkel/bedrijf.json` invullen
5. Algemene voorwaarden laten nakijken — een modelreglement van
   Thuiswinkel.org of WebwinkelKeur is goedkoper dan een advocaat
6. Mollie aanvragen (kan pas met KVK en rekening)
7. Pas dán adverteren
