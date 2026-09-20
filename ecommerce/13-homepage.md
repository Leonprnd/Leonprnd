# 13 — Homepage

Alle teksten hieronder zijn definitief en kunnen zo de winkel in. Waar een
gegeven nog ontbreekt staat `[...]` — dat zijn uitsluitend bedrijfsgegevens die
jij hebt en ik niet.

De technische uitvoering staat in `shopify-theme/sections/`. Per sectie noem ik
het bestand.

---

## 1. Aankondigingsbalk
`sections/announcement-bar.liquid`

Roteert niet. Eén boodschap, altijd dezelfde. Roterende balken worden niet
gelezen.

> **☎ [0XX – XXX XXXX] · maandag t/m vrijdag 9.00–17.00 uur**

Op desktop breder:

> **Gratis verzending · 60 dagen retour · ☎ [0XX – XXX XXXX], ma–vr 9.00–17.00 uur**

---

## 2. Header
`sections/header.liquid`

Zie `12-site-architectuur.md`. Logo gecentreerd op mobiel, links op desktop.
Winkelwagen altijd met het woord "Winkelwagen" erbij.

---

## 3. Hero
`sections/hero.liquid`

**Beeld:** een vrouw van eind zestig aan de eettafel, haakwerk in handen, de
Daglamp erboven. Het is buiten donker — je ziet het raam. Haar werk ligt in een
heldere lichtplas. Ze kijkt naar haar handen, niet in de camera. *(Shot 5 in
`15-fotografie.md`.)*

**H1:**
> ## 's Avonds haken zonder dat uw ogen eraan gaan

**Subkop:**
> De Zichtwerk Daglamp geeft uw werk hetzelfde licht als de middagzon bij het
> raam, en vergroot precies genoeg om uw steken weer te zien. Geslepen glas,
> geen plastic.

**Knop:**
> `Bekijk de Daglamp — € 79,95`

**Onder de knop, klein maar leesbaar (15 px):**
> Gratis verzending · 60 dagen op proef · Voor 15.00 uur besteld, meestal binnen
> 2–4 werkdagen in huis

**Waarom deze kop.** Hij noemt het moment (' s avonds), de activiteit (haken) en
de pijn (ogen). Geen enkel woord gaat over de lamp. Wie haakt herkent zichzelf
binnen een seconde; wie puzzelt of modelbouwt leest de volgende sectie ook nog.

**Varianten om te testen** (zie `22-ab-testplan.md`, test 2):
- *Uw handwerk ligt weer in daglicht*
- *Het ligt niet aan uw ogen. Het ligt aan uw lamp.*
- *Om acht uur stoppen met haken? Dat hoeft niet.*

---

## 4. Herkenning
`sections/probleem.liquid`

Achtergrond: Linnen. Drie korte blokken naast elkaar op desktop, onder elkaar op
mobiel, elk met een lijnpictogram van 32 px.

**Kop:**
> ## Komt dit u bekend voor?

**Blok 1 — pictogram: klok**
> **U stopt eerder dan u wilt**
> Niet omdat het werk af is, maar omdat uw ogen gaan branden. Rond een uur of
> acht legt u het weg.

**Blok 2 — pictogram: gebogen figuur**
> **U buigt steeds verder voorover**
> Dichter bij het werk, schuin naar het licht toe. De volgende ochtend voelt u
> het in uw nek en schouders.

**Blok 3 — pictogram: uitgehaalde steek**
> **U haalt werk uit dat af was**
> Een steek gemist, een verkeerde kleur, een stukje op de verkeerde plek. Tien
> toeren terug omdat u het niet goed zag.

**Afsluitende regel, gecentreerd, groter (22 px):**
> Dat ligt zelden aan uw ogen. Meestal ligt het aan het licht.

**Waarom dit werkt.** Dit is de enige sectie die over het probleem gaat, en hij
noemt drie concrete gebeurtenissen in plaats van een gevoel. "Tien toeren terug
omdat u het niet goed zag" is de zin waar iemand bij knikt. De afsluiter haalt
de schaamte weg en maakt het een oplosbaar probleem — precies het onderscheid
uit `06-customer-avatar.md`.

---

## 5. De oplossing
`sections/oplossing.liquid`

Beeld links (of boven op mobiel): de lamp aan de eettafel, geklemd aan het blad,
arm naar voren gebogen over een haakwerk.

**Kop:**
> ## Eén lamp, precies boven uw werk

**Tekst:**
> De Zichtwerk Daglamp klemt u aan de tafel of zet u op de meegeleverde voet.
> De arm buigt naar uw werk toe en blijft staan waar u hem laat — hij zakt niet
> weg terwijl u bezig bent.
>
> Het licht is daglicht: 4500 kelvin, dezelfde kleur als een heldere middag bij
> het raam. Daardoor ziet u kleuren zoals ze zijn. Donkerblauw en zwart garen
> zijn weer uit elkaar te houden.
>
> En er zit een loep in. Geen plastic vergrootglaasje, maar een geslepen glazen
> lens van 110 millimeter. Groot genoeg om er met twee handen ónder te werken.

**Knop:**
> `Bekijk de Daglamp`

---

## 6. De belangrijkste voordelen
`sections/voordelen.liquid`

Vier blokken, elk met pictogram, korte kop en twee regels. Geen specificaties in
de kop — alleen uitkomsten.

**Kop:**
> ## Wat u ervan merkt

**1 — pictogram: loep**
> **U ziet uw steken weer**
> Twee keer vergroot, met een klein venster van vier keer voor het echte
> priegelwerk. Genoeg om te helpen, niet zoveel dat u de weg kwijtraakt.

**2 — pictogram: oog**
> **Uw ogen worden minder moe**
> Het licht flikkert niet. Dat ziet u niet, maar uw ogen merken het wel —
> flikkering is de belangrijkste oorzaak van vermoeide ogen bij goedkope lampen.

**3 — pictogram: hand op knop**
> **Eén knop, meer is er niet**
> Indrukken om aan te zetten. Nog eens indrukken voor feller. Geen app, geen
> afstandsbediening, geen handleiding van vier pagina's.

**4 — pictogram: klem**
> **Hij staat waar u hem zet**
> Klem aan de tafel of los op de voet. De arm zakt niet weg, ook niet na een
> paar uur.

---

## 7. Demonstratie
`sections/demonstratie.liquid`

Dit is het hart van de pagina. Een schuifvergelijking: één foto van hetzelfde
haakwerk zonder de lamp, één met. Sleper in het midden. Op mobiel werkt hij met
de vinger.

**Kop:**
> ## Hetzelfde haakwerk, dezelfde avond

**Onder de schuifbalk:**
> Links: een gewone schemerlamp op twee meter afstand. Rechts: de Zichtwerk
> Daglamp. Beide foto's zijn op dezelfde avond gemaakt, met dezelfde instellingen
> op de camera, zonder bewerking.

**Waarom die laatste zin er staat.** Iedere "voor en na" is verdacht, en deze
doelgroep is er extra alert op. Door expliciet te zeggen wat je níet gedaan hebt,
wordt het bewijs in plaats van reclame. **Deze zin mag alleen op de site staan
als hij waar is** — zie de fotografie-instructies in `15-fotografie.md`.

---

## 8. Waarom niet de goedkope
`sections/waarom-glas.liquid`

Deze sectie doet het meeste verkoopwerk en niemand anders in de markt heeft hem.

**Kop:**
> ## Waarom een loeplamp van € 19 u duizelig maakt

**Tekst:**
> Er zijn loeplampen voor twintig euro. Wij hebben er een paar besteld om te
> kijken wat je daarvoor krijgt.
>
> Het verschil zit in de lens. Een goedkope lens is **gegoten**: vloeibaar glas
> of plastic in een mal, en klaar. Dat ziet er prima uit, maar de dikte klopt
> niet overal precies. Aan de randen buigt het beeld op. Kijkt u er tien minuten
> in, dan merkt u er weinig van. Kijkt u er een uur in, dan krijgt u hoofdpijn
> of wordt u misselijk.
>
> Een **geslepen** lens wordt in vorm geschuurd en gepolijst. Dat kost meer en
> het duurt langer, en het is precies de reden dat het beeld tot aan de rand
> recht blijft.
>
> Het tweede verschil is de vergroting. Goedkope lampen adverteren met tien keer
> of zelfs twintig keer. Klinkt goed. In de praktijk ziet u dan een gebied ter
> grootte van een postzegel, en u kunt er niet met uw handen bij. Twee keer is
> voor handwerk precies goed: u ziet uw steken, en u ziet nog steeds waar u mee
> bezig bent.

**Uitklapblok — "Hoe u dit zelf test"** *(standaard dichtgeklapt)*
> Heeft u al een loeplamp? Leg er een vel ruitjespapier onder en beweeg uw hoofd
> heen en weer. Buigen de lijnen aan de rand mee, dan kijkt u door een gegoten
> lens. Blijven ze recht, dan heeft u een goede lamp en heeft u ons niet nodig.

**Waarom dat uitklapblok erin staat.** Het is het sterkste geloofwaardigheids-
signaal op de hele site: een verkoper die u een test geeft waarmee u kunt
vaststellen dat u hem níet nodig heeft. Wie de test doet en zakt, koopt.

---

## 9. Hoe werkt het
`sections/hoe-werkt-het.liquid`

Drie stappen, genummerd, met een eenvoudige tekening bij elke stap.

**Kop:**
> ## Zo staat hij binnen twee minuten klaar

**1.** **Klem of voet.** Draai de klem aan uw tafelblad vast, of zet hem op de
meegeleverde voet als u liever schuift.

**2.** **Stekker in het stopcontact.** Twee meter snoer, dus het stopcontact
achter de bank is ver genoeg.

**3.** **Knop indrukken.** Buig de arm naar uw werk toe. Klaar.

---

## 10. Waar mensen hem voor gebruiken
`sections/gebruikssituaties.liquid`

Zes kaarten met foto's. Dit is de sectie die uw doelgroep verbreedt van "haken"
naar alles waar de advertenties op mikken.

**Kop:**
> ## Niet alleen voor handwerk

| | |
|---|---|
| **Haken en breien** | Donker garen, tellen van steken, patronen op klein formaat |
| **Puzzelen** | 1000 stukjes waarbij lucht en water dezelfde kleur lijken |
| **Lezen** | De bijsluiter, de kleine lettertjes van de verzekering, de krant |
| **Modelbouw en vliegen binden** | Lijm op een onderdeel van drie millimeter |
| **Kruiswoord en sudoku** | 's Avonds, in uw eigen stoel |
| **Klusjes** | Een splinter, een horlogebandje, een schroefje in een bril |

---

## 11. Vergelijking
`sections/vergelijking.liquid`

Eerlijke vergelijking met de echte alternatieven. Noem geen merknamen.

**Kop:**
> ## Zichtwerk naast de alternatieven

| | Gewone schemerlamp | Loeplamp van € 19 | Zichtwerk Daglamp |
|---|---|---|---|
| Licht recht boven uw werk | nee | soms | ja |
| Vergroting | geen | 10× of meer | 2×, met 4× venster |
| Lens | — | gegoten glas of plastic | geslepen glas, 110 mm |
| Beeldveld | — | zeer klein | groot genoeg voor twee handen |
| Flikkervrij | wisselend | meestal niet | ja |
| Blijft staan waar u hem zet | n.v.t. | zakt vaak weg | ja |
| Nederlandse klantenservice | — | nee | ja, telefonisch |
| Retourtermijn | — | 14 dagen | 60 dagen |

**Onder de tabel:**
> Een gewone schemerlamp is prima om de kamer mee te verlichten. Hij is alleen
> niet gemaakt om er ónder te werken.

---

## 12. Productdetails
`sections/specificaties.liquid`

Standaard dichtgeklapt, want de meeste bezoekers hoeven dit niet. Wim (`06`,
tertiaire avatar) wel.

**Kop:**
> ## De details

| | |
|---|---|
| Vergroting | 2× hoofdlens, 4× inzetvenster |
| Lens | Geslepen glas, diameter 110 mm |
| Lichtkleur | 4500 K (daglicht) |
| Standen | 3, dimbaar |
| Levensduur LED | ± 30.000 branduren `[VERIFIEER bij leverancier]` |
| Bevestiging | Tafelklem (tot 60 mm blad) én losse voet |
| Armlengte | ± 40 cm, verstelbaar |
| Snoerlengte | 2 meter |
| Voeding | 230 V netstroom |
| Gewicht | ± 1,1 kg `[VERIFIEER]` |
| In de doos | Lamp, klem, voet, adapter, lensdoekje, Nederlandse handleiding |

> **Fabrikant / EU-verantwoordelijke:** [naam], [adres]. Typenummer: [xxx].
> Deze gegevens zijn verplicht onder de Europese productveiligheidsverordening
> (GPSR) — zie `24-juridisch.md`.

---

## 13. De aanbieding
`sections/bundels.liquid`

Drie kaarten. De middelste is voorgeselecteerd en iets hoger.

**Kop:**
> ## Welke wilt u?

| Enkel | **Compleet** *(onze aanbeveling)* | Twee lampen |
|---|---|---|
| De Daglamp | De Daglamp | Twee Daglampen |
| | \+ reservelens | |
| | \+ beschermhoes | |
| **€ 79,95** | **€ 99,95** | **€ 139,95** |
| | *Los € 109,90 — u bespaart € 9,95* | *Los € 159,90 — u bespaart € 19,95* |
| `Kies deze` | `Kies deze` | `Kies deze` |

**Onder de kaarten:**
> Alle bestellingen: gratis verzending, 60 dagen op proef, 2 jaar garantie.

> **Let op:** zet het label "Meest gekozen" pas op de middelste kaart wanneer
> dat feitelijk klopt. Tot die tijd staat er "Onze aanbeveling" — dat is een
> mening en die mag je hebben.

---

## 14. Ervaringen
`sections/reviews.liquid`

**Deze sectie staat bij lancering uit.**

Je hebt nul klanten, dus je hebt nul reviews. Een verzonnen review is niet
alleen verboden, het is ook het eerste wat een achterdochtige koper van 65
controleert.

In plaats daarvan staat hier tot je eerste echte reviews binnen zijn:

> ## We zijn net begonnen
>
> Zichtwerk bestaat sinds [maand jaar]. We hebben nog geen berg
> klantbeoordelingen om u te laten zien, en we gaan er geen verzinnen.
>
> Wat we wel doen: u krijgt 60 dagen om de lamp te proberen, het retourlabel zit
> al in de doos, en u kunt ons gewoon bellen. Als hij niet is wat u ervan
> verwachtte, stuurt u hem terug en krijgt u uw geld terug. Zo simpel is het.
>
> [naam], [functie]

**Dit is geen zwaktebod maar je sterkste troef.** Eerlijk zeggen dat je nieuw
bent, in een markt vol nepwinkels die doen alsof ze 10.000 klanten hebben, werkt
bij deze doelgroep beter dan welke verzonnen sterrenrij ook. Zie
`21-cro-audit.md`, punt 11.

De reviewsectie gaat aan zodra je er **minimaal twaalf** echte hebt.

---

## 15. Veelgestelde vragen
`sections/faq.liquid`

Acht vragen, uitklapbaar, eerste twee standaard open. Volledige antwoorden in
`14-productpagina.md` — op de homepage staat een verkorte set:

1. Hoe sterk vergroot de lamp precies?
2. Is hij geschikt voor donker garen?
3. Hoe lang duurt de levering?
4. En als hij me niet bevalt?
5. Kan ik bellen als ik er niet uitkom?
6. Heb ik er een speciale lamp voor nodig?
7. Kan ik hem ook zonder klem gebruiken?
8. Hoeveel stroom verbruikt hij?

---

## 16. Vertrouwensblok
`sections/garantie.liquid`

Vlak boven de footer. Vier kolommen met pictogram en tekstlabel.

**Kop:**
> ## Rustig bestellen

**1 — schild**
> **60 dagen op proef**
> Bevalt hij niet, dan stuurt u hem terug. Het retourlabel zit al in de doos en
> wij betalen de retourzending.

**2 — telefoon**
> **Gewoon bellen**
> [0XX – XXX XXXX], maandag t/m vrijdag van 9.00 tot 17.00 uur. U krijgt
> iemand in Nederland aan de lijn.

**3 — doos**
> **Snel in huis**
> Voor 15.00 uur besteld, meestal binnen 2 tot 4 werkdagen bezorgd. U krijgt
> een track-en-tracecode per e-mail.

**4 — iDEAL-logo**
> **Betalen met iDEAL**
> Of met creditcard, PayPal of Apple Pay. Uw betaling loopt via een beveiligde
> verbinding.

---

## 17. Footer
`sections/footer.liquid`

Zie `12-site-architectuur.md` voor de indeling. Bedrijfsgegevens volledig en
leesbaar.

---

## Volgorde-verantwoording

Waarom deze volgorde, en niet de gebruikelijke:

1. **Probleem vóór product.** Bij een doelgroep die zorgvuldig beslist moet je
   eerst laten zien dat je haar situatie kent.
2. **Demonstratie vóór voordelen.** Bewijs overtuigt sneller dan beloften, en
   deze bezoeker is wantrouwend.
3. **De "waarom niet de goedkope"-sectie op plek 8.** Daar zit de bezoeker
   precies op het punt "mooi, maar op bol.com is het de helft". Dat bezwaar
   beantwoord je op de plek waar het opkomt, niet in de FAQ onderaan.
4. **Prijs pas op plek 13.** Niet omdat we hem verstoppen — hij staat al in de
   hero-knop — maar omdat de bundelkeuze pas zin heeft als de waarde vaststaat.
5. **Het eerlijke reviewblok op 14.** Precies waar iemand social proof verwacht
   en het niet vindt. Daar beantwoord je de stilte in plaats van hem te laten
   hangen.
