# 24 — Juridische checklist

> **Ik ben geen jurist en dit is geen juridisch advies.** Dit is een werklijst
> van wat je moet regelen, gebaseerd op openbare bronnen van de ACM, de NVWA en
> de KVK. Laat het vóór lancering eenmalig toetsen door iemand die
> gespecialiseerd is in e-commerce en productcompliance. Reken op een paar
> honderd euro. Dat is goedkoper dan één handhavingstraject.
>
> Waar ik onzeker ben over de actuele stand, staat `[VERIFIEER]`.

---

## A. De vier dingen die de meeste dropshipwinkels fout doen

Begin hier. Dit zijn de punten met het grootste risico, en ze ontbreken bijna
altijd.

### A1. De herroepingsknop — verplicht sinds 19 juni 2026

Webshops moeten een herroepingsknop hebben in hun online omgeving, waarmee een
consument de koop eenvoudig digitaal kan ontbinden
([ACM](https://www.acm.nl/nl/publicaties/acm-roept-online-retailers-op-zich-voor-te-bereiden-op-herroepingsknop)).

**Eisen:**
- Geen onnodige drempels
- Alleen gegevens vragen die nodig zijn om de herroeping te verwerken
- Inloggen mag worden aangeboden; **een account verplichten mag niet**
- De knop moet eenvoudig vindbaar zijn

**Sanctie bij ontbreken:** de wettelijke bedenktijd kan oplopen tot **maximaal
een jaar**, en de ACM kan handhaven en boetes opleggen.

→ *Geregeld in:* `shopify-theme/sections/herroepingsknop.liquid`, met de pagina
`/pages/herroeping` en een link in de footer én in de orderbevestigingsmail.

**Checklist:**
- [ ] Pagina live en vindbaar zonder zoeken
- [ ] Formulier werkt en de melding komt echt binnen
- [ ] Geen account nodig
- [ ] Alleen naam, e-mail en bestelnummer gevraagd
- [ ] Link in de footer én in de orderbevestiging

### A2. GPSR — productveiligheid

Verordening (EU) 2023/988, van toepassing sinds 13 december 2024
([NVWA](https://www.nvwa.nl/onderwerpen/productveiligheid/gpsr-productveiligheidsverordening/over-de-gpsr)).

Elk product dat buiten de EU is gemaakt moet een **verantwoordelijke persoon in
de EU** hebben. Koop je rechtstreeks in bij een fabrikant buiten de EU — zoals
bij dropshipping uit China — dan ben jij als importeur die verantwoordelijke
persoon.

**Op élke productpagina moet staan:**
- [ ] Naam en contactgegevens van de fabrikant of de EU-verantwoordelijke
- [ ] Productidentificatie: type-, serie- of batchnummer
- [ ] Veiligheidswaarschuwingen **in het Nederlands**

→ *Geregeld in:* `shopify-theme/sections/product-compliance.liquid`

**Dit bepaalt je leverancierskeuze.** Zie `07-sourcing.md`: koop bij voorkeur
bij een EU-partij die de importeursrol al vervult, anders ligt de volledige
productaansprakelijkheid bij jou.

### A3. CE, RoHS en WEEE — je verkoopt een elektrisch apparaat

- [ ] **EU-conformiteitsverklaring** (Declaration of Conformity) als pdf van de
      leverancier. Geen document = niet inkopen. Een CE-logo op de doos zonder
      onderliggend document is waardeloos.
- [ ] **CE-markering** fysiek op het product én op de adapter
- [ ] **RoHS**-conformiteit (beperking gevaarlijke stoffen)
- [ ] **WEEE-registratie** bij het Nationaal (W)EEE Register en aansluiting bij
      een inzamelsysteem. Reken op enkele honderden euro's per jaar.
      `[VERIFIEER actuele tarieven]`
- [ ] **WEEE-symbool** (doorgekruiste afvalbak) op product en verpakking
- [ ] **Batterijenbesluit** — alleen als het model een accu heeft. Kies bij
      voorkeur een model op netstroom; dat scheelt registratie, een
      UN38.3-testrapport en verzendbeperkingen.

### A4. Geen doorgestreepte prijzen bij lancering

Sinds de Omnibus-richtlijn moet een "van"-prijs bij een prijsverlaging **de
laagste prijs zijn die je in de voorgaande 30 dagen hanteerde.**

Een nieuwe winkel heeft die prijsgeschiedenis niet. Een doorgestreepte
€ 129,95 naast € 79,95 op dag één is dus geen marketing maar een overtreding.

- [ ] Geen doorgestreepte prijzen tot je 30 dagen prijsgeschiedenis hebt
- [ ] Bundelvoordeel wél tonen als feitelijke vergelijking met de som van de
      losse prijzen ("Los € 109,90 — u bespaart € 9,95"). Dat is toegestaan
      zolang het klopt.

---

## B. Bedrijfsgegevens en informatieplicht

Sinds 1 januari 2006 moeten Nederlandse ondernemingen hun KVK-nummer vermelden
op de website, in de webshop én in e-mailberichten.

De ACM stelt expliciet dat je gegevens op de website zetten maar wegstoppen in
het kleine lettertje onder "algemene voorwaarden" **niet voldoende** is
([ACM](https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/bedrijfsgegevens-vermelden)).

**In de footer van elke pagina:**
- [ ] Handelsnaam zoals ingeschreven bij de KVK
- [ ] Volledig vestigingsadres (geen postbus)
- [ ] KVK-nummer
- [ ] Btw-identificatienummer
- [ ] E-mailadres
- [ ] Telefoonnummer met openingstijden
- [ ] Leesbaar: minimaal 15 px, kleur niet lichter dan `#6B675F`

Dit is niet alleen een verplichting. Volgens het klantonderzoek in `06` is dit
precies waar een twijfelende koper naartoe scrollt voordat ze bestelt.

---

## C. Consumentenrecht

### C1. Herroepingsrecht
- [ ] 14 dagen wettelijke bedenktijd, ingaand op de dag na ontvangst
- [ ] Duidelijk vermeld vóór de aankoop, niet alleen in de voorwaarden
- [ ] Modelformulier voor herroeping beschikbaar
- [ ] Terugbetaling binnen 14 dagen na de herroeping
- [ ] Je mag wachten met terugbetalen tot je het product terug hebt of bewijs
      van verzending
- [ ] **Wij bieden 60 dagen.** Zeg er dan duidelijk bij dat dit méér is dan de
      wettelijke 14 dagen, zodat er geen verwarring ontstaat over welk recht
      waar geldt.

### C2. Wettelijke garantie en conformiteit
- [ ] Het product moet doen wat de consument er redelijkerwijs van mag
      verwachten. Bij een lamp van € 79,95 is dat meer dan één jaar.
- [ ] **Formuleer je "2 jaar garantie" nooit alsof het een gunst is die de
      wettelijke rechten vervangt.** Een commerciële garantie komt bovenop het
      wettelijke recht, nooit in plaats daarvan.
- [ ] In je voorwaarden: "Naast deze garantie heeft u altijd uw wettelijke
      rechten."

### C3. Prijzen
- [ ] Alle prijzen inclusief btw
- [ ] Verzendkosten vóór het afrekenen bekend (bij ons: in de prijs verwerkt)
- [ ] Geen kosten die pas in de laatste stap verschijnen

### C4. Levering
- [ ] Standaard uiterlijk binnen 30 dagen, tenzij anders overeengekomen
- [ ] Bij vertraging: de klant informeren en een nieuwe termijn geven
- [ ] Het risico van beschadiging tijdens verzending ligt bij jou tot de
      levering

---

## D. Privacy en cookies

### D1. AVG
- [ ] Privacyverklaring in begrijpelijk Nederlands
- [ ] Per verwerking: welk gegeven, waarvoor, op welke grondslag, hoe lang
- [ ] Verwerkersovereenkomsten met Shopify, je e-mailtool, je fulfilmentpartij
- [ ] Doorgifte buiten de EU benoemd (Shopify en Meta verwerken deels in de VS)
- [ ] Hoe iemand zijn gegevens kan inzien, corrigeren of laten verwijderen
- [ ] Bewaartermijnen: orders 7 jaar (fiscale bewaarplicht), nieuwsbrieflijst
      tot afmelding
- [ ] Meldprocedure voor datalekken

### D2. Cookies
Onder de Telecommunicatiewet mag je **niet-functionele cookies pas plaatsen na
toestemming.** De Meta Pixel, GA4 en Clarity vallen daar allemaal onder.

- [ ] Cookiebanner met een gelijkwaardige weigerknop — "Alles accepteren" en
      "Weigeren" even zichtbaar en even makkelijk
- [ ] Geen tracking vóór toestemming
- [ ] Toestemming intrekbaar, en die mogelijkheid vindbaar
- [ ] Cookiebeleid met een lijst van welke cookies je plaatst en waarvoor
- [ ] **Banner in minimaal 15 px** — een onleesbare banner is geen geldige
      toestemming

> **Praktisch gevolg voor je cijfers:** een deel van je bezoekers weigert. Dat
> is precies waarom de Conversions API in `23-analytics.md` geen luxe is. Let
> op: CAPI vervangt de toestemming niet — als iemand weigert, mag je ook via
> CAPI niet zomaar gegevens doorsturen.

### D3. E-mailmarketing
- [ ] Toestemming, of een bestaande klantrelatie
- [ ] Werkende afmeldlink in élke commerciële e-mail
- [ ] Bedrijfsnaam, adres en KVK-nummer in élke e-mail
- [ ] Geen `noreply@`-afzender

---

## E. Reclame en claims

### E1. Wat je niet mag beweren
- [ ] **Geen gezondheids- of medische claims.** "Goed voor uw ogen", "helpt bij
      maculadegeneratie", "voorkomt oogklachten" — allemaal niet. Het mag niet
      en het hoeft niet: onze hele positionering gaat over licht en werk, niet
      over ogen.
- [ ] Geen misleidende voor-en-na beelden. De voor/na in de winkel gaat over
      het *werkstuk* bij verschillend licht, niet over een persoon.
- [ ] Elke productclaim moet aantoonbaar zijn. "Geslepen glas" moet geslepen
      glas zijn. "Flikkervrij" moet je kunnen laten zien.
- [ ] De claim "beide foto's zijn zonder bewerking gemaakt" (`13-homepage.md`,
      sectie 7) moet letterlijk waar zijn. Is dat niet zo, haal hem weg.

### E2. Reviews
- [ ] **Geen verzonnen reviews.** Dit is expliciet verboden onder de Wet
      oneerlijke handelspraktijken.
- [ ] Vermeld hoe je controleert of een review van een echte koper komt
- [ ] Geen negatieve reviews wegfilteren
- [ ] Geen beloning in ruil voor een positieve review. Wel toegestaan: een
      vergoeding voor iemands tijd, ongeacht wat ze zeggen (zie `19-ugc-scripts.md`)

### E3. Schaarste en urgentie
- [ ] Geen verzonnen afteltimers
- [ ] Geen verzonnen voorraadmeldingen
- [ ] Geen "X mensen kijken hier nu"

### E4. Keurmerken
- [ ] **Alleen tonen waar je daadwerkelijk lid van bent.** Een Thuiswinkel
      Waarborg- of WebwinkelKeur-logo zonder lidmaatschap is merkinbreuk én een
      misleidende handelspraktijk.
- [ ] Overweeg wél echt lidmaatschap: 46% van de senioren kijkt naar een
      keurmerk bij het beoordelen van betrouwbaarheid. Dat is een van de
      hoogste vertrouwensscores in het hele onderzoek — hier zit dus echte
      conversiewinst. `[VERIFIEER kosten en voorwaarden bij Thuiswinkel.org en
      WebwinkelKeur]`

---

## F. Fiscaal en administratief

- [ ] Inschrijving KVK
- [ ] Btw-nummer, btw-aangifte per kwartaal
- [ ] Zakelijke bankrekening op de bedrijfsnaam
- [ ] Administratie 7 jaar bewaren
- [ ] Bij verkoop aan andere EU-landen: de **OSS-regeling** zodra je boven de
      drempel van € 10.000 per jaar aan grensoverschrijdende verkopen komt
- [ ] Bij invoer van buiten de EU: invoer-btw en invoerrechten. Lampen vallen
      onder GN-hoofdstuk 9405. `[VERIFIEER exacte GN-code en tarief bij de Douane]`
- [ ] Verpakkingsafval: melding bij het Afvalfonds Verpakkingen wordt pas
      verplicht boven een drempel. `[VERIFIEER de actuele drempel]`

---

## G. Documenten die op de site moeten staan

| Pagina | Moet bevatten |
|---|---|
| **Algemene voorwaarden** | Identiteit, prijzen, betaling, levering, herroepingsrecht, garantie, aansprakelijkheid, klachtenprocedure, toepasselijk recht |
| **Privacybeleid** | Zie D1 |
| **Cookiebeleid** | Zie D2 |
| **Verzending** | Termijnen, kosten, vervoerder, wat bij vertraging |
| **Retourneren** | Procedure in gewone taal, termijn, kosten, terugbetaaltermijn, modelformulier |
| **Garantie** | Commerciële garantie én verwijzing naar de wettelijke rechten |
| **Contact** | Adres, KVK, btw, telefoon, e-mail, openingstijden |
| **Herroepen** | Zie A1 |

> **Gebruik geen gratis gekopieerde algemene voorwaarden.** Ze zijn vaak
> verouderd, ze kunnen bedingen bevatten die vernietigbaar zijn, en ze sluiten
> zelden aan op wat jij daadwerkelijk verkoopt. Laat ze opstellen of toetsen.
> `[VERIFIEER of een verwijzing naar het Europese ODR-platform nog verplicht is
> — de regels daarover zijn recent gewijzigd]`

---

## H. Wanneer je zeker een jurist nodig hebt

| Situatie | Waarom |
|---|---|
| **Vóór je eerste bestelling** | Eenmalige toets op GPSR, CE, WEEE en je voorwaarden. Dit is de belangrijkste van de lijst. |
| Merkregistratie | Zie `11-domein-en-naamcheck.md` |
| Als de NVWA of ACM contact opneemt | Nooit zelf beantwoorden |
| Bij een letsel- of schadeclaim | Productaansprakelijkheid |
| Bij verkoop naar Duitsland of België | Ander recht, andere plichten (Duitsland heeft een eigen Abmahnung-cultuur) |

## Prioriteit als je tijd of geld kort hebt

1. **GPSR-gegevens op de productpagina** (A2) — zonder dit verkoop je illegaal
2. **Herroepingsknop** (A1) — sinds juni 2026 verplicht, hoge sanctie
3. **Bedrijfsgegevens in de footer** (B) — vijf minuten werk
4. **Geen doorgestreepte prijzen** (A4) — nul minuten werk, alleen nalaten
5. **CE-verklaring bij de leverancier opvragen** (A3) — bepaalt of je überhaupt
   mag inkopen
6. **Cookiebanner met echte weigerknop** (D2)
7. De rest

Door naar `25-prelaunch-checklist.md`.
