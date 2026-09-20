# 21 — CRO-audit

Ik loop de winkel af als externe consultant, langs het hele pad:
advertentie → landingspagina → productpagina → winkelwagen → checkout → aankoop.

Zevenentwintig punten. Bij elk staat waar het opgelost is.

## Advertentie → landingspagina

**1. De advertentie belooft iets wat de pagina niet meteen bevestigt**
Iemand klikt op "waarom een loeplamp van € 19 u duizelig maakt" en komt op een
pagina die begint met "Gratis verzending!". Binnen drie seconden weg.
→ *Opgelost:* elke advertentiehoek heeft in `17-meta-ads.md` een eigen
landingsbestemming, inclusief diep­link naar `#waarom-glas`.

**2. Trage eerste weergave op mobiel 4G**
Bij 55+ draaien relatief veel oudere toestellen. Een pagina die drie seconden
wit blijft, verliest een derde van het verkeer.
→ *Opgelost:* eerste productfoto op `eager` met `fetchpriority="high"`, rest
lazy. Vaste beeldverhoudingen, dus geen verspringende pagina. Twee
lettertypefamilies, niet meer. Zo min mogelijk apps (`shopify-theme/INSTALLATIE.md`).

**3. De prijs staat niet in de advertentie**
Wie de prijs pas op de pagina ziet, voelt zich overvallen. Je betaalt dan voor
klikken van mensen die nooit € 80 wilden uitgeven.
→ *Opgelost:* prijs in de knoptekst van de hero en in meerdere
advertentiebeschrijvingen (`18-ad-creatives.md`).

**4. Advertentieverkeer landt op de homepage**
De homepage is een merkpagina, geen verkooppagina.
→ *Opgelost:* al het advertentieverkeer gaat naar
`/products/zichtwerk-daglamp` (`12-site-architectuur.md`).

## Boven de vouw

**5. Niet duidelijk wat het is binnen drie seconden**
→ *Opgelost:* producttitel "Daglamp met geslepen loep" plus subkop met de
doelgroep en het probleem, direct onder elkaar (`14-productpagina.md`).

**6. Verzendkosten onbekend tot de checkout**
Dit is de meest genoemde reden voor afgebroken bestellingen, in élk onderzoek.
→ *Opgelost:* "Gratis verzending" direct onder de prijs, en de € 4,95 is in de
verkoopprijs verwerkt (`09-offer.md`).

**7. Levertijd onbekend**
Bij een onbekende winkel is "wanneer heb ik het" een vertrouwensvraag, geen
planningsvraag.
→ *Opgelost:* eerste vinkje onder de koopknop.

**8. Retourbeleid pas in de voetregel**
→ *Opgelost:* tweede vinkje onder de koopknop, inclusief "het retourlabel zit
al in de doos".

**9. Geen telefoonnummer zichtbaar zonder scrollen**
Bij een doelgroep waarvan 71% bang is voor onlinefraude is dit het duurste
gemis op de hele site.
→ *Opgelost:* aankondigingsbalk bovenaan élke pagina, plus als vierde vinkje
onder de koopknop.

**10. Betaallogo's pas in de checkout**
39% van de senioren beoordeelt de betrouwbaarheid van een winkel mede op de
betaalmethode.
→ *Opgelost:* logo's direct onder de koopknop, iDEAL eerst en het grootst
(`snippets/zw-betaallogos.liquid`).

**11. Nul reviews op de plek waar reviews horen**
Een lege reviewsectie is erger dan geen reviewsectie. Maar reviews verzinnen is
verboden én het is het eerste wat gecontroleerd wordt.
→ *Opgelost:* het blok "We zijn net begonnen" beantwoordt de stilte in plaats
van hem te laten hangen (`sections/reviews-eerlijk.liquid`). Vervangen zodra er
twaalf echte zijn.

## Productpagina

**12. Te kleine letters**
De meest voorkomende en duurste ontwerpfout bij deze doelgroep.
→ *Opgelost:* 19 px bodytekst op de productpagina, niets kleiner dan 15 px op
de hele site, geen grijstint lichter dan `#6B675F` (`assets/zichtwerk.css`).

**13. Knoppen die niet op knoppen lijken**
→ *Opgelost:* 56 px hoog, volle breedte, Werkgroen met wit, 19 px tekst.

**14. Variantkeuze als uitklaplijst**
Een `<select>` verstopt twee van je drie aanbiedingen en werkt slecht met
stijve vingers.
→ *Opgelost:* drie radio's van elk 60 px hoog, altijd alle drie zichtbaar, de
aanbevolen voorgeselecteerd (`sections/main-product-zichtwerk.liquid`).

**15. Onduidelijk wat de duurdere bundel extra biedt**
→ *Opgelost:* elke variant heeft een bijregel met wat erbij zit, plus de
feitelijke vergelijking "los € 109,90" (`09-offer.md`).

**16. Het prijsbezwaar wordt nergens beantwoord**
"Op bol.com kost zoiets de helft" is de gedachte van élke bezoeker. Wie dat
negeert, verliest.
→ *Opgelost:* de sectie `waarom-glas` staat precies op de plek waar dat bezwaar
opkomt.

**17. Verwachtingen over vergroting kloppen niet**
De grootste bron van retouren in deze categorie.
→ *Opgelost:* vergroting uitgelegd in de FAQ, in `waarom-glas`, in de
vergelijkingstabel, en in de advertenties zelf. We *verkopen* op 2× in plaats
van het te verzwijgen.

**18. Koopknop uit beeld na scrollen op mobiel**
→ *Opgelost:* plakkende balk die verschijnt zodra het formulier uit beeld is
(`snippets/zw-sticky-cart.liquid`). Hij verzendt niet zelf, maar springt terug
naar het echte formulier — twee formulieren geven dubbele Pixel-events.

**19. FAQ die niet opent, of te klein om aan te tikken**
→ *Opgelost:* uitklapkoppen 56 px hoog, over de volle breedte klikbaar, eerste
twee standaard open (`sections/faq.liquid`).

**20. Geen afmetingen, dus verkeerde verwachting over formaat**
→ *Opgelost:* maatfoto (shot 8) plus specificatietabel met armlengte,
lensdiameter, klemopening en snoerlengte.

## Winkelwagen en checkout

**21. Verplicht een account aanmaken**
Bij deze doelgroep een directe uitstapreden, en bij de herroepingsknop is het
wettelijk niet eens toegestaan.
→ *Opgelost:* gastcheckout aan (`shopify-theme/INSTALLATIE.md`).

**22. iDEAL ontbreekt of staat onderaan**
Ruim 70% van alle Nederlandse online betalingen loopt via iDEAL; onder senioren
steeg het gebruik naar 94%. Een derde van de senioren heeft weleens een aankoop
afgebroken om de aangeboden betaalmethode.
→ *Opgelost:* iDEAL eerst, overal.

**23. Onverwachte kosten op het laatste scherm**
→ *Opgelost:* verzending zit in de prijs, er komt niets bij.

**24. Te veel velden in de checkout**
→ *Opgelost:* Shopify-standaardcheckout, telefoonnummer optioneel,
bedrijfsnaamveld uit, geen enquête, geen kortingscodeveld dat mensen aanzet tot
weggaan om een code te zoeken.

**25. Geen weg terug bij twijfel in de checkout**
→ *Opgelost:* telefoonnummer in de checkout-koptekst (Shopify-instelling), plus
de e-mail uit flow 3 met de mogelijkheid om telefonisch te bestellen.

## Na de aankoop

**26. Stilte tussen bestelling en levering**
Bij een onbekende winkel is dat precies het moment waarop iemand denkt "heb ik
nou opgelicht gekregen" en de bank belt.
→ *Opgelost:* drie e-mails in flow 4 (`20-email-flows.md`), waaronder een
nazorgmail twee dagen na levering. Die vangt problemen af vóórdat ze retouren
of chargebacks worden.

**27. Product verkeerd gebruikt, dus teleurstelling**
Iemand die de lens op 40 cm houdt, denkt dat de lamp niet deugt.
→ *Opgelost:* instelinstructies in de verzendmail, insert in de doos, en flow 5
op dag 7.

---

## Wat dit oplevert

| Fase | Zonder deze maatregelen | Met | Waarom |
|---|---:|---:|---|
| Klik → paginaweergave | 75% | 88% | Snellere eerste weergave, kloppende boodschap |
| Pagina → winkelwagen | 5% | 9% | Bezwaren beantwoord waar ze opkomen |
| Winkelwagen → checkout | 55% | 70% | Geen verrassingen, gastcheckout |
| Checkout → aankoop | 65% | 80% | iDEAL vooraan, geen extra kosten |
| **Totaal** | **1,34%** | **4,43%** | |

> Deze percentages zijn inschattingen op basis van vuistregels, geen meting.
> Behandel ze als richting, niet als belofte. Wat telt is dat elk punt
> hierboven een echte drempel wegneemt.

## Wat ik als eerste zou aanpakken als de tijd kort is

1. **iDEAL zichtbaar vóór de checkout** (punt 10 en 22) — grootste effect per
   minuut werk
2. **Telefoonnummer bovenaan** (punt 9)
3. **Gratis verzending en levertijd boven de vouw** (punt 6 en 7)
4. **Lettergrootte omhoog** (punt 12)
5. **De sectie waarom-glas** (punt 16) — dit is je enige antwoord op "het kan
   goedkoper"

## Checkout en betalen — instellingen

Dit hoort bij fase 13 van je briefing en staat hier omdat het CRO is.

| Instelling | Waarde | Waarom |
|---|---|---|
| Gastcheckout | Aan | Verplicht account = uitstapreden |
| iDEAL | Aan, eerste positie | Zie punt 22 |
| Creditcard (Visa, Mastercard) | Aan | Tweede keuze |
| PayPal | Aan | Vertrouwensanker voor twijfelaars |
| Apple Pay / Google Pay | Aan | Vooral voor de cadeaukoper (35–60) |
| Klarna, achteraf betalen | **Uit** | Past niet bij deze doelgroep en bij een order van € 80 kost het meer dan het oplevert |
| Telefoonnummer bij afrekenen | Optioneel | Verplicht = drempel |
| Bedrijfsnaamveld | Uit | Irrelevant |
| Tip- of fooiveld | Uit | Voelt bij deze doelgroep ongepast |
| Kortingscodeveld | Zichtbaar laten | Verstoppen kan niet in Shopify; zorg dat het klein is |
| Adresvalidatie postcode | Aan | Voorkomt bezorgfouten |
| Bevestigingspagina | Met levertijd en telefoonnummer | Rust na de aankoop |

Door naar `22-ab-testplan.md`.
