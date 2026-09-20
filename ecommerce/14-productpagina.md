# 14 — Productpagina

Dit is de pagina waar al het advertentiegeld op landt. Alles wat erop staat is
definitief en kan zo de winkel in.

**URL:** `/products/zichtwerk-daglamp`
**Template:** `shopify-theme/templates/product.json` + de sections eronder

---

## Deel 1 — Boven de vouw

Zeven vragen moeten beantwoord zijn vóórdat iemand hoeft te scrollen. Zo:

```
┌──────────────────────────────────────┐
│           [PRODUCTFOTO 1]            │   ← lamp boven haakwerk, aan
│        ● ○ ○ ○ ○ ○  (6 foto's)       │
├──────────────────────────────────────┤
│ ZICHTWERK                            │
│                                      │
│ Daglamp met geslepen loep            │   ← WAT
│ Voor handwerk, puzzelen en lezen     │   ← VOOR WIE
│                                      │
│ Zodat u 's avonds doorgaat zonder    │   ← WELK PROBLEEM
│ dat uw ogen eraan gaan               │
│                                      │
│ € 79,95                              │   ← WAT KOST HET
│ Gratis verzending                    │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ ○ Enkel              €  79,95   │ │   ← BUNDELKEUZE
│ │ ● Compleet  +lens    €  99,95   │ │
│ │   + beschermhoes                │ │
│ │ ○ Twee lampen        € 139,95   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃      IN DE WINKELWAGEN         ┃  │   ← CTA, 56px hoog
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│  [iDEAL] [VISA] [MC] [PayPal] [Pay] │
│                                      │
│ ✓ Voor 15.00 besteld, meestal 2–4    │   ← WANNEER
│   werkdagen in huis                  │
│ ✓ 60 dagen op proef, retourlabel     │   ← HOE RETOUR
│   zit in de doos                     │
│ ✓ 2 jaar garantie                    │
│ ✓ ☎ [0XX–XXX XXXX] ma–vr 9–17 uur    │   ← WAAROM VERTROUWEN
└──────────────────────────────────────┘
```

### De exacte teksten

**Merkregel (klein, boven de titel):**
> ZICHTWERK

**Producttitel (H1):**
> # Daglamp met geslepen loep

**Subkop:**
> Voor handwerk, puzzelen en lezen — zodat u 's avonds doorgaat zonder dat uw
> ogen eraan gaan

**Prijs:**
> **€ 79,95** · Gratis verzending

*Geen doorgestreepte prijs. Zie `09-offer.md` en `24-juridisch.md` — bij
lancering is een van-prijs niet toegestaan.*

**Beoordeling:** staat bij lancering uit. Zodra er twaalf echte reviews zijn,
verschijnt hier het gemiddelde met het aantal.

**Variantkiezer** — drie radioknoppen, elk minimaal 60 px hoog, "Compleet"
voorgeselecteerd:

| | Label | Bijregel | Prijs |
|---|---|---|---|
| ○ | Enkel | De Daglamp | € 79,95 |
| ● | **Compleet** — onze aanbeveling | \+ reservelens en beschermhoes · *los € 109,90* | € 99,95 |
| ○ | Twee lampen | Voor twee kamers, of een cadeau · *los € 159,90* | € 139,95 |

**Knop:**
> `IN DE WINKELWAGEN`

Werkgroen, volle breedte, 56 px hoog, 19 px tekst. Op mobiel blijft hij plakken
zodra hij uit beeld scrollt (`snippets/sticky-cart.liquid`).

**Betaallogo's direct onder de knop.** iDEAL eerst en het grootst. Uit het
klantonderzoek: 39% van de senioren beoordeelt de betrouwbaarheid van een
webshop mede op de betaalmethode, en een derde heeft weleens een aankoop
afgebroken omdat de juiste methode ontbrak.

**De vier vinkjes** — dit is het belangrijkste blok op de pagina na de knop:

> ✓ **Voor 15.00 uur besteld, meestal binnen 2 tot 4 werkdagen in huis**
> ✓ **60 dagen op proef** — het retourlabel zit al in de doos, wij betalen de retourzending
> ✓ **2 jaar garantie**
> ✓ **☎ [0XX – XXX XXXX]** — maandag t/m vrijdag 9.00–17.00 uur, u krijgt iemand in Nederland

---

## Deel 2 — Onder de vouw

### 2.1 De demonstratie

**Kop:** ## Hetzelfde haakwerk, dezelfde avond

Schuifvergelijking (zie `13-homepage.md`, sectie 7). Dit blok komt direct onder
de vouw omdat de bezoeker die net op een advertentie klikte nog niet gelooft
wat hij daar zag.

### 2.2 Waarom een loeplamp van € 19 u duizelig maakt

Volledige tekst in `13-homepage.md`, sectie 8. Neem hem hier letterlijk over —
dit is de sectie die het meeste verkoopwerk doet.

### 2.3 Wat u ervan merkt

De vier voordelenblokken uit `13-homepage.md`, sectie 6.

### 2.4 Zo stelt u hem in

Drie stappen met tekening. Zie `13-homepage.md`, sectie 9.

### 2.5 Waar mensen hem voor gebruiken

De zes kaarten uit `13-homepage.md`, sectie 10.

### 2.6 Wat u krijgt

**Kop:** ## Wat er in de doos zit

Bij een foto van alle onderdelen naast elkaar (shot 10 in `15-fotografie.md`):

- De Daglamp met geslepen glazen lens van 110 mm
- Tafelklem, geschikt voor bladen tot 60 mm
- Losse voet, voor als u hem liever verplaatst
- Adapter met 2 meter snoer
- Lensdoekje
- Nederlandse handleiding op groot lettertype
- **Voorgedrukt retourlabel** — voor het geval dat

Bij "Compleet" komen daar een reservelens en een beschermhoes bij.

### 2.7 Gebruiksaanwijzing

**Kop:** ## Hoe u hem gebruikt

> **Afstand.** De lens werkt het beste op ongeveer 15 tot 20 centimeter van uw
> werk. Te dichtbij en het beeld wordt onscherp; te ver en u verliest de
> vergroting. Schuif hem een paar keer heen en weer tot het scherp staat — dat
> punt is voor iedereen net iets anders.
>
> **Standen.** Eén keer drukken is de laagste stand. Die is voor de avond
> voldoende. De felste stand is bedoeld voor donker garen en echt priegelwerk.
>
> **Schoonmaken.** Alleen met het meegeleverde doekje of een microvezeldoek.
> Keukenpapier krast, ook al lijkt het zacht. Gebruik geen glasreiniger op de
> coating.
>
> **Brandgevaar.** Leg de lamp niet met de lens omhoog in direct zonlicht. Een
> lens bundelt licht, ook zonlicht. Klap hem dicht of draai hem weg als u hem
> niet gebruikt — daar is de beschermhoes voor.

*Die laatste waarschuwing is geen kleine lettertjes maar een echte
veiligheidsinstructie die onder de GPSR in het Nederlands op de productpagina
moet staan.*

### 2.8 Vergelijkingstabel

Zie `13-homepage.md`, sectie 11.

### 2.9 Specificaties

Zie `13-homepage.md`, sectie 12, inclusief het GPSR-blok met fabrikant,
EU-verantwoordelijke en typenummer.

---

## Deel 3 — Veelgestelde vragen, volledig

`sections/faq.liquid`. Eerste twee open, rest dichtgeklapt.

**1. Hoe sterk vergroot de lamp precies?**
> De grote lens vergroot twee keer. In het midden zit een klein venster dat vier
> keer vergroot, voor als u echt iets kleins moet zien.
>
> Twee keer klinkt weinig naast lampen die tien of twintig keer beloven, maar
> dat is precies de bedoeling. Bij tien keer vergroting ziet u een gebied ter
> grootte van een postzegel en past uw hand er niet meer onder. Bij twee keer
> ziet u uw werk én uw handen, en kunt u gewoon doorwerken. Voor handwerk,
> puzzelen en lezen is dat de juiste sterkte.

**2. Is hij geschikt voor donker garen?**
> Ja, daar is de lichtkleur op gekozen. De lamp geeft daglicht van 4500 kelvin,
> ongeveer dezelfde kleur als een heldere middag bij het raam. Daardoor blijven
> donkerblauw, zwart en donkergroen uit elkaar te houden — bij geel lamplicht
> lopen die kleuren in elkaar over.
>
> Zet hem voor donker garen op de felste stand.

**3. Hoe lang duurt de levering?**
> Bestelt u op een werkdag vóór 15.00 uur, dan gaat uw bestelling dezelfde dag
> de deur uit. Daarna duurt het meestal 2 tot 4 werkdagen voordat het pakket bij
> u is. U krijgt een e-mail met een track-en-tracecode zodra het onderweg is.
>
> In drukke weken, zoals begin december, kan het een dag langer duren.

**4. En als hij me niet bevalt?**
> Dan stuurt u hem terug. U heeft 60 dagen de tijd, en het retourlabel zit al in
> de doos — u hoeft niets te printen. Plak het label erop, breng het pakket naar
> een PostNL-punt, en u krijgt uw geld binnen 5 werkdagen terug op dezelfde
> rekening. De retourzending kost u niets.
>
> Wettelijk heeft u 14 dagen bedenktijd. Wij maken er 60 van, omdat we liever
> hebben dat u hem een paar weken echt uitprobeert.

**5. Kan ik bellen als ik er niet uitkom?**
> Ja. [0XX – XXX XXXX], maandag tot en met vrijdag van 9.00 tot 17.00 uur. U
> krijgt iemand in Nederland aan de lijn, geen keuzemenu.
>
> Liever mailen? info@zichtwerk.nl. We antwoorden op werkdagen binnen 24 uur.

**6. Heb ik er een speciale lamp of peertje voor nodig?**
> Nee. De lamp zit erin en gaat ongeveer 30.000 branduren mee. Als u hem elke
> avond drie uur gebruikt, is dat ruim 25 jaar. U hoeft nooit iets te vervangen.

**7. Kan ik hem ook zonder klem gebruiken?**
> Ja. Er zit een losse voet bij. Die gebruikt u als u geen tafelrand heeft om
> aan te klemmen, of als u de lamp graag verplaatst. De klem is steviger; de
> voet is handiger.
>
> De klem past op bladen tot 6 centimeter dik. Dat is dikker dan de meeste
> eettafels.

**8. Hoeveel stroom verbruikt hij?**
> Weinig. Het is ledverlichting, dus ongeveer evenveel als een spaarlamp. Bij
> dagelijks gebruik van drie uur kost hij u een paar euro per jaar.

**9. Wordt hij warm?**
> Nauwelijks. Led geeft vrijwel geen warmte af, dus u kunt hem urenlang aan
> laten staan zonder dat de kap heet wordt. Dat scheelt ook voor uw handen als
> u er dicht onder werkt.

**10. Is dit hetzelfde als die lampen van twintig euro?**
> Nee, en het belangrijkste verschil ziet u niet op een foto: onze lens is
> geslepen glas, geen gegoten glas of plastic.
>
> Een gegoten lens vertekent aan de randen. Tien minuten merkt u er niets van,
> een uur later heeft u hoofdpijn. Wilt u dit zelf nagaan bij een lamp die u al
> heeft: leg er ruitjespapier onder en beweeg uw hoofd. Buigen de lijnen mee,
> dan is het gegoten glas.

**11. Kan ik met iDEAL betalen?**
> Ja, en dat is de eerste optie bij het afrekenen. Daarnaast kunt u betalen met
> creditcard, PayPal, Apple Pay of Google Pay.

**12. Krijg ik een factuur?**
> Ja, die zit bij de orderbevestiging in uw mail. Heeft u hem liever op papier,
> bel of mail ons dan even, dan sturen we hem mee in de doos.

---

## Deel 4 — Onderaan de pagina

### Garantie- en vertrouwensblok
Zie `13-homepage.md`, sectie 16.

### Laatste zetje

Vlak boven de footer, gecentreerd, op een Linnen achtergrond:

> ## Nog twijfel?
>
> Bel ons gewoon even: **[0XX – XXX XXXX]**. Dan kijken we samen of deze lamp is
> wat u zoekt. Is dat niet zo, dan zeggen we dat ook.
>
> `IN DE WINKELWAGEN — € 99,95`

---

## Wat er bewust níet op staat

| Niet | Waarom |
|---|---|
| Afteltimer | Nep. Deze doelgroep prikt erdoorheen of raakt in de war. Beide kosten de verkoop. |
| "Nog 4 op voorraad" | Verzonnen schaarste. |
| Doorgestreepte van-prijs | Juridisch niet toegestaan zonder prijsgeschiedenis (Omnibus). |
| "X mensen bekijken dit nu" | Niet waar, en het maakt een voorzichtige koper zenuwachtig. |
| Verzonnen reviews | Verboden, en het eerste wat gecontroleerd wordt. |
| Pop-up met kortingscode | Onderbreekt precies op het verkeerde moment. |
| Chatbubbel met "Hoi! 👋" | Leest als nep. Een telefoonnummer werkt hier beter. |
| Medische claims | "Helpt bij maculadegeneratie" of "goed voor uw ogen" mag niet en hoeft niet. |

## Leesbaarheidsregels voor deze pagina

- Bodytekst **19 px** mobiel, 20 px desktop, regelafstand 1,6
- Regellengte maximaal 70 tekens
- Niets in een grijstint lichter dan `#6B675F`
- Alle knoppen minimaal 56 px hoog met 19 px tekst
- Uitklapkoppen minimaal 56 px hoog en over de volle breedte aanklikbaar
- Foto's met `loading="lazy"` behalve de eerste, en met echte alt-teksten
- Geen tekst ín afbeeldingen — die kan niet vergroot worden door de browser

Door naar `15-fotografie.md`.
