# 25 — Pre-launch checklist

Dit is de audit vóór de eerste euro advertentiebudget. Werk hem van boven naar
beneden af. **Een niet-afgevinkt vakje in blok 1 of 2 betekent: niet lanceren.**

---

## Blok 1 — Product en leverancier (STOPPER)

- [ ] Monster besteld bij minimaal twee leveranciers
- [ ] Monster in handen gehad en de tien harde eisen uit `07-sourcing.md`
      afgelopen
- [ ] **Ruitjespapiertest gedaan** — lijnen blijven recht tot aan de rand
- [ ] **Flikkertest gedaan** — telefoon op 60 fps, geen banen in beeld
- [ ] Armtest gedaan — horizontaal uitgezet, na 30 minuten niet gezakt
- [ ] CE-markering op product én adapter
- [ ] **EU-conformiteitsverklaring als pdf ontvangen**
- [ ] EU-stekker, 230 V
- [ ] Klem én voet meegeleverd
- [ ] Iemand van 60+ heeft hem een avond gebruikt en verteld wat er niet klopte
- [ ] Inkoopprijs bevestigd en binnen de bandbreedte € 17–26
- [ ] Verzendkosten naar NL bevestigd
- [ ] Levertijd bevestigd, vanuit een EU-magazijn
- [ ] Voorraad gecontroleerd — genoeg voor minimaal 100 bestellingen
- [ ] **Back-upleverancier écht geregeld**, niet alleen genoteerd:
      account aangemaakt, monster besteld én goedgekeurd, levertijd bevestigd,
      prijs bekend. Een naam in een tabel helpt je niet op 2 december.

## Blok 2 — Juridisch (STOPPER)

- [ ] KVK-inschrijving rond, nummer bekend
- [ ] Btw-nummer bekend
- [ ] Zakelijke bankrekening op de bedrijfsnaam
- [ ] **GPSR-gegevens op de productpagina**: fabrikant, EU-verantwoordelijke,
      typenummer, veiligheidswaarschuwingen in het Nederlands
- [ ] **Herroepingsknop live** op `/pages/herroeping`, formulier getest
- [ ] Link naar herroeping in de footer én in de orderbevestiging
- [ ] WEEE-registratie aangevraagd
- [ ] Bedrijfsgegevens volledig in de footer, leesbaar
- [ ] Algemene voorwaarden, privacybeleid, cookiebeleid live
- [ ] Cookiebanner met een even zichtbare weigerknop
- [ ] **Geen doorgestreepte prijzen op de hele site**
- [ ] Geen afteltimers, geen voorraadmeldingen, geen verzonnen reviews
- [ ] Geen keurmerklogo's waar je geen lid van bent
- [ ] Geen gezondheidsclaims in de teksten of de advertenties
- [ ] Juridische toets uitgevoerd (`24-juridisch.md`, blok H)

## Blok 3 — De winkel

**Alle links**
- [ ] Elke link in de header werkt
- [ ] Elke link in de footer werkt
- [ ] Elke knop op de homepage gaat naar de productpagina
- [ ] Telefoonnummer is klikbaar op mobiel (`tel:`)
- [ ] E-mailadres is klikbaar
- [ ] Geen 404's (`/admin/online-store/preferences` → broken links)

**Teksten**
- [ ] Spelling gecontroleerd — laat iemand anders meelezen
- [ ] Geen `[...]`-plaatshouders meer op de site
- [ ] Geen Lorem Ipsum
- [ ] Geen Engelse standaardteksten van het thema (winkelwagen, checkout,
      foutmeldingen, e-mails)
- [ ] Merknaam overal hetzelfde geschreven
- [ ] **De "over ons"-pagina heeft een gezicht en een naam**, geen foto van
      dozen. Werk je vanuit huis, zeg dat dan gewoon ("wij werken vanuit huis
      in [plaats]") — dat wekt meer vertrouwen dan een adres dat iemand
      natrekt en niet kan plaatsen.
- [ ] Bij het inschrijfformulier staat: "Wij gebruiken uw e-mailadres alleen
      om u zelf te mailen. We verkopen of delen het niet, en u kunt zich met
      één klik afmelden." 

**Prijzen en varianten**
- [ ] Drie varianten: Enkel € 79,95, Compleet € 99,95, Duo € 139,95
- [ ] Variant heet letterlijk `Compleet` (de instelling verwijst ernaar)
- [ ] Compleet is voorgeselecteerd
- [ ] Prijzen kloppen in de winkelwagen en in de checkout
- [ ] Bundelvoordeel klopt rekenkundig
- [ ] Voorraad ingesteld, "doorverkopen bij nul" uit

**Beelden**
- [ ] Alle twaalf shots uit `15-fotografie.md` gemaakt of bewust overgeslagen
- [ ] Elke afbeelding heeft een echte alt-tekst
- [ ] Alle beelden onder 200 kB
- [ ] De voor/na-foto's zijn écht zo gemaakt als de site beweert
- [ ] Geen AI-beeld waarop het product herkenbaar staat

## Blok 4 — Techniek

**Mobiel** *(waar 70% van je aandacht heen moet)*
- [ ] Getest op een échte telefoon, niet alleen in de ontwikkelaarsweergave
- [ ] Getest op een klein scherm (iPhone SE of vergelijkbaar)
- [ ] Geen horizontaal scrollen op welke pagina dan ook
- [ ] Alle knoppen minimaal 56 px hoog
- [ ] Alle tekst minimaal 15 px, bodytekst 18–19 px
- [ ] Plakkende koopknop verschijnt en springt naar het formulier
- [ ] Voor/na-schuifbalk werkt met de vinger
- [ ] FAQ opent bij aantikken, één tegelijk
- [ ] Menu opent en sluit
- [ ] Formulieren roepen het juiste toetsenbord op (e-mail, telefoon)

**Desktop en tablet**
- [ ] Getest in Chrome, Safari en Firefox
- [ ] Getest op een tablet, staand en liggend
- [ ] Niets overlapt bij 125% en 150% browserzoom — **deze doelgroep zoomt
      vaak in**

**Snelheid**
- [ ] PageSpeed Insights op mobiel: score 60+, LCP onder 2,5 s
- [ ] Geen verspringende pagina tijdens het laden (CLS onder 0,1)
- [ ] Niet meer dan vijf apps geïnstalleerd

**Zonder JavaScript**
- [ ] Schakel JS uit en bestel: het moet nog steeds werken

## Blok 5 — Bestellen en betalen

- [ ] **Testbestelling gedaan met een echte iDEAL-betaling** (niet alleen de
      testmodus)
- [ ] iDEAL staat eerst in de checkout
- [ ] Creditcard, PayPal, Apple Pay en Google Pay werken
- [ ] Gastcheckout aan
- [ ] Geen onverwachte kosten op het laatste scherm
- [ ] Betaallogo's tonen alleen methodes die je echt aanbiedt
- [ ] Orderbevestiging komt binnen, in het Nederlands, met bestelnummer
- [ ] Factuur klopt: bedrijfsgegevens, btw gespecificeerd
- [ ] Verzendmail met track-en-tracecode komt binnen
- [ ] Testbestelling geretourneerd: de hele retourroute doorlopen
- [ ] Terugbetaling kwam aan

## Blok 6 — Meten

- [ ] Meta Pixel actief, gecontroleerd met de Pixel Helper
- [ ] **Conversions API actief**
- [ ] Domein geverifieerd in Business Manager
- [ ] Aggregated Event Measurement ingericht, Purchase op prioriteit 1
- [ ] Purchase-event komt binnen mét waarde en valuta
- [ ] Geen dubbele events
- [ ] GA4 actief, `purchase` gemarkeerd als sleutelgebeurtenis
- [ ] Microsoft Clarity actief
- [ ] UTM's staan klaar in de advertenties
- [ ] Wekelijkse spreadsheet aangemaakt (`23-analytics.md`)

## Blok 7 — Klantenservice

- [ ] Telefoonnummer werkt en wordt opgenomen tijdens de genoemde tijden
- [ ] Voicemail ingesproken in het Nederlands, met een terugbelbelofte
- [ ] `info@`-adres werkt en wordt gelezen
- [ ] Antwoorden op automatische e-mails komen érgens aan
- [ ] Antwoordsjablonen klaar voor de tien meest verwachte vragen
- [ ] Je weet wat je doet als iemand belt die niet uit de instelling komt

## Blok 8 — Advertenties

- [ ] Minimaal zes creatives klaar (`18-ad-creatives.md`)
- [ ] Elke advertentie is nagelezen op gezondheidsclaims
- [ ] Elke advertentie spreekt over de situatie, niet over de persoon
- [ ] Ondertitels ingebrand, minimaal 42 px
- [ ] Elke advertentie landt op de juiste pagina
- [ ] **Advertentie en landingspagina zeggen hetzelfde** — lees ze achter
      elkaar door
- [ ] Facebookpagina heeft een profielfoto, omslag en een paar berichten
- [ ] Betaalmethode in het advertentieaccount ingesteld, plus een back-upkaart

## Blok 9 — De laatste controle

- [ ] **Bestel zelf als klant, op je telefoon, alsof je het niet kent.**
      Van advertentie tot bevestigingsmail.
- [ ] **Laat iemand van 60+ hetzelfde doen terwijl je meekijkt.** Zeg niets.
      Schrijf op waar ze aarzelt. Dit is de waardevolste 20 minuten van je hele
      voorbereiding.
- [ ] Los op wat daaruit kwam
- [ ] Doe het nog een keer
