# 20 — E-mailflows

## Uitgangspunten

**Techniek:** Klaviyo of Shopify Email. Klaviyo als je de flows uit dit document
volledig wilt bouwen; Shopify Email als je klein wilt beginnen. Beide werken.

**Toon:** dezelfde als de site. U-vorm, rustig, geen uitroeptekens, geen
kortingsdruk.

**Opmaak — dit wijkt af van wat de meeste e-mailtools voorstellen:**

| Regel | Waarom |
|---|---|
| Tekstmail, geen plaatjes-sjabloon | Laadt altijd, komt beter aan, en leest als een bericht van een mens in plaats van een nieuwsbrief |
| Lettergrootte minimaal 17 px | Zelfde reden als op de site |
| Eén knop per e-mail, minimaal 52 px hoog | Meer keuzes is minder actie |
| Telefoonnummer onder élke e-mail | Het sterkste vertrouwenssignaal dat je hebt |
| Afzender: een persoonsnaam | "[naam] van Zichtwerk", niet "Zichtwerk Team" |
| Antwoorden moet echt kunnen | Geen `noreply@`. Ooit. |

**Wettelijk:** elke commerciële e-mail bevat een werkende afmeldlink, je
bedrijfsnaam, adres en KVK-nummer. Je mag alleen mailen aan mensen die
toestemming gaven of die bij je kochten (klantrelatie). Zie `24-juridisch.md`.

---

# Flow 1 — Welkom

**Trigger:** inschrijving op de lijst (via exit-intent op de winkelwagen of het
voetblok). **Niet** via een pop-up bij binnenkomst — die onderbreekt de
advertentieboodschap op het slechtste moment.

### E-mail 1.1 — direct

**Onderwerp:** Welkom — en meteen het eerlijke antwoord op uw vraag
**Preview:** Welke vergroting u nodig heeft, en waarom tien keer te veel is

```
Beste [voornaam],

Fijn dat u zich heeft aangemeld.

De vraag die we het vaakst krijgen is: hoe sterk moet de vergroting zijn?
Het eerlijke antwoord verrast de meeste mensen: minder sterk dan u denkt.

Goedkope loeplampen adverteren met tien of zelfs twintig keer vergroting.
Dat klinkt beter. In de praktijk ziet u dan een gebied ter grootte van een
postzegel, en past uw hand er niet meer onder. U kunt er dus niet in werken.

Voor handwerk, puzzelen en lezen is twee keer precies goed. U ziet uw steken,
en u ziet nog steeds waar u mee bezig bent. Een klein venster van vier keer in
het midden vangt het echte priegelwerk op.

Het tweede verschil is de lens zelf, en daar kunt u thuis op testen:

    Leg een vel ruitjespapier onder uw loeplamp en beweeg uw hoofd heen en
    weer. Buigen de lijnen aan de rand mee, dan is het een gegoten lens. Dat
    is de reden dat u na een uur hoofdpijn krijgt. Blijven ze recht, dan heeft
    u een goede lamp en heeft u ons niet nodig.

    [ Bekijk de Zichtwerk Daglamp ]

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
Vragen? Bel [0XX - XXX XXXX], ma-vr 9.00-17.00 uur. Of antwoord op deze mail.
[Afmelden]
```

### E-mail 1.2 — na 2 dagen

**Onderwerp:** Waarom wij één product verkopen
**Preview:** Geen assortiment van 400 lampen, en dat is met opzet

```
Beste [voornaam],

Als u onze winkel bekijkt ziet u één product. Dat is geen beginnersfout.

We hebben zes loeplampen besteld voordat we er een kozen. Vier ervan hadden
een gegoten lens waar het beeld aan de randen van boog. Eentje had een
armscharnier dat na een half uur langzaam wegzakte. De zesde deugde.

Die verkopen we.

Wat dat voor u betekent: u hoeft niet te kiezen. Er is geen goedkopere variant
waar u eigenlijk niets aan heeft, en geen duurdere waarvan u zich afvraagt of
u de gewone wel genoeg vindt.

    [ Bekijk de Daglamp ]

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
Bel [0XX - XXX XXXX], ma-vr 9.00-17.00 uur.
[Afmelden]
```

### E-mail 1.3 — na 5 dagen

**Onderwerp:** 60 dagen, en het retourlabel zit al in de doos
**Preview:** Voor als u twijfelt of het wat voor u is

```
Beste [voornaam],

Misschien twijfelt u nog. Dat snappen we: tachtig euro voor een lamp die u
alleen op een foto heeft gezien, bij een winkel waar u nog nooit van hoorde.

Daarom dit.

U krijgt 60 dagen om de lamp te proberen. Wettelijk is dat 14 dagen; wij maken
er 60 van omdat we liever hebben dat u hem een paar weken echt gebruikt.

Bevalt hij niet, dan plakt u het retourlabel dat al in de doos zit op het
pakket en brengt u het naar een PostNL-punt. U hoeft niets te printen en u
hoeft niet eerst te bellen. Binnen vijf werkdagen staat uw geld terug op
dezelfde rekening. De retourzending kost u niets.

Liever eerst even overleggen? Bel [0XX - XXX XXXX]. Dan kijken we samen of
deze lamp is wat u zoekt. Is dat niet zo, dan zeggen we dat ook.

    [ Bekijk de Daglamp ]

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 2 — Winkelwagen verlaten

**Trigger:** product in de winkelwagen, geen checkout gestart, na 4 uur.

### E-mail 2.1 — na 4 uur

**Onderwerp:** Uw winkelwagen staat nog klaar
**Preview:** Geen haast, hij blijft gewoon staan

```
Beste [voornaam],

U had een Zichtwerk Daglamp in uw winkelwagen gelegd. Hij staat er nog.

    [ Verder waar u gebleven was ]

Geen haast: wij houden niets vast met een aftelklok en er is geen aanbieding
die vanavond afloopt. Als u er nog een nachtje over wilt slapen, doet u dat
vooral.

Had u een vraag waar u niet uitkwam? Bel [0XX - XXX XXXX], maandag tot en met
vrijdag van 9 tot 5. Of antwoord gewoon op deze mail.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

### E-mail 2.2 — na 24 uur

**Onderwerp:** De drie vragen die we het vaakst krijgen
**Preview:** Vergroting, levertijd en terugsturen

```
Beste [voornaam],

Misschien houdt iets u tegen. Dit zijn de drie dingen waar mensen meestal over
twijfelen.

**"Is twee keer vergroting wel genoeg?"**
Ja, en dat is met opzet. Bij tien keer ziet u een gebied zo groot als een
postzegel en past uw hand er niet onder. Twee keer laat u uw steken zien én
waar u mee bezig bent. Een venster van vier keer in het midden vangt het
priegelwerk op.

**"Hoe lang duurt de levering?"**
Besteld op een werkdag voor 15.00 uur, dan gaat hij dezelfde dag weg. Meestal
2 tot 4 werkdagen. U krijgt een track-en-tracecode per e-mail.

**"En als hij me niet bevalt?"**
60 dagen om terug te sturen, het retourlabel zit al in de doos, wij betalen de
retourzending. U hoeft niets te printen en geen reden op te geven.

    [ Terug naar uw winkelwagen ]

Staat uw vraag er niet bij? Bel [0XX - XXX XXXX] of antwoord op deze mail.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

### E-mail 2.3 — na 3 dagen

**Onderwerp:** Laatste bericht hierover
**Preview:** Daarna hoort u ons niet meer over deze winkelwagen

```
Beste [voornaam],

Dit is de laatste keer dat we u over deze winkelwagen mailen. We vinden het
zelf ook niet prettig als een winkel blijft doorzeuren.

Als u nog interesse heeft:

    [ Bekijk de Daglamp ]

En als u hem niet nodig heeft: ook prima. Misschien hebben we u wel iets
geleerd over het verschil tussen een gegoten en een geslepen lens. Daar kunt u
elders ook wat aan hebben.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 3 — Checkout verlaten

**Trigger:** checkout gestart, niet afgerond, na 1 uur. Deze mensen zijn veel
dichter bij een aankoop dan de winkelwagenverlaters — mail dus sneller en
korter, en vraag of er iets misging.

### E-mail 3.1 — na 1 uur

**Onderwerp:** Ging er iets mis bij het afrekenen?
**Preview:** Als u ergens vastliep, horen we het graag

```
Beste [voornaam],

U was bijna klaar met bestellen, maar het is niet afgerond. Dat kan aan van
alles liggen — misschien werd u gestoord, misschien liep u ergens vast.

    [ Bestelling afmaken ]

Liep er iets niet goed? Laat het ons weten, dan lossen we het op. U kunt
antwoorden op deze mail of bellen: [0XX - XXX XXXX], ma-vr 9.00-17.00 uur.

Wilt u liever telefonisch bestellen? Dat kan ook. Bel ons en we regelen het
samen.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

> **"Telefonisch bestellen" is geen opsmuk.** Een deel van deze doelgroep haakt
> af op een betaalscherm en belt liever. Eén bestelling per week die je zo
> binnenhaalt, is € 320 per maand.

### E-mail 3.2 — na 20 uur

**Onderwerp:** Uw bestelling staat nog klaar
**Preview:** iDEAL, creditcard, PayPal of Apple Pay

```
Beste [voornaam],

Uw bestelling staat nog voor u klaar.

    [ Afronden ]

U kunt betalen met iDEAL, creditcard, PayPal, Apple Pay of Google Pay. Er
komen geen verzendkosten bij — die zitten al in de prijs, dus u ziet op het
laatste scherm geen verrassingen.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
Bel [0XX - XXX XXXX], ma-vr 9.00-17.00 uur.
[Afmelden]
```

---

# Flow 4 — Na de bestelling

**Trigger:** bestelling geplaatst. Dit is de belangrijkste flow van allemaal:
hier valt de spanning weg bij iemand die net tachtig euro overmaakte naar een
winkel die ze niet kende.

### E-mail 4.1 — direct (orderbevestiging, aanvullend op die van Shopify)

**Onderwerp:** Uw bestelling is binnen — en dit gebeurt er nu
**Preview:** Wat u wanneer kunt verwachten

```
Beste [voornaam],

Bedankt voor uw bestelling. Hij is bij ons binnen.

**Wat er nu gebeurt**

Vandaag (of de eerstvolgende werkdag als u na 15.00 uur bestelde) pakken we
uw lamp in en gaat hij de deur uit.

Zodra het pakket onderweg is, krijgt u van ons een e-mail met een
track-en-tracecode. Daarmee kunt u volgen waar het is.

Meestal is het pakket binnen 2 tot 4 werkdagen bij u.

**Wat u besteld heeft**
[orderoverzicht]

**Uw bestelnummer is [nummer].** Handig om bij de hand te houden als u belt.

Vragen? Bel [0XX - XXX XXXX], maandag tot en met vrijdag van 9 tot 5. U krijgt
iemand in Nederland aan de lijn. Of antwoord op deze mail.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer] · BTW [nummer]
```

### E-mail 4.2 — bij verzending (aanvullende inhoud)

**Onderwerp:** Uw lamp is onderweg — en zo stelt u hem in
**Preview:** Drie stappen, en de twee dingen die mensen het vaakst vragen

```
Beste [voornaam],

Uw pakket is onderweg. Volg het hier: [track-en-tracelink]

Zodat u meteen aan de slag kunt, alvast dit.

**In drie stappen klaar**

1. Draai de klem vast aan uw tafelblad. Past op bladen tot 6 centimeter.
   Liever geen klem? Er zit een losse voet bij.
2. Stekker in het stopcontact. Het snoer is 2 meter.
3. Druk op de knop. Nog een keer drukken maakt hem feller.

**Twee dingen die mensen het vaakst vragen**

*Op welke afstand moet de lens staan?* Ongeveer 15 tot 20 centimeter van uw
werk. Schuif hem een paar keer heen en weer tot het scherp is — dat punt is
voor iedereen net iets anders.

*Hoe maak ik hem schoon?* Alleen met het meegeleverde doekje of een
microvezeldoek. Keukenpapier krast, ook al voelt het zacht.

**Eén waarschuwing:** leg de lamp niet met de lens omhoog in de zon. Een lens
bundelt licht, ook zonlicht.

Komt u er niet uit? Bel gerust: [0XX - XXX XXXX], ma-vr 9.00-17.00 uur.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
```

### E-mail 4.3 — 2 dagen na levering

**Onderwerp:** Is hij goed aangekomen?
**Preview:** En staat hij zoals u wilde?

```
Beste [voornaam],

Uw lamp is een paar dagen geleden bezorgd. Ik wilde even vragen of alles goed
is aangekomen en of het instellen lukte.

Als er iets niet klopt — een onderdeel dat mist, iets dat beschadigd is, of
gewoon iets dat u niet voor elkaar krijgt — laat het weten. Antwoord op deze
mail of bel [0XX - XXX XXXX]. We lossen het op.

En als alles goed is: veel plezier ermee.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
```

> Deze e-mail vangt problemen af voordat ze een retour of, erger, een
> chargeback worden. Eén klant die mailt "er zat geen klem bij" in plaats van
> zijn bank te bellen, verdient deze hele flow terug.

---

# Flow 5 — Productuitleg

**Trigger:** 7 dagen na levering. Doel: het product beter laten gebruiken, want
iemand die het goed gebruikt stuurt niets terug.

### E-mail 5.1

**Onderwerp:** Drie dingen die u waarschijnlijk nog niet geprobeerd heeft
**Preview:** Het kleine venster, de tweede stand en de tafelrand

```
Beste [voornaam],

U gebruikt uw Daglamp nu een week. Drie dingen die mensen vaak over het hoofd
zien.

**1. Het kleine venster in het midden**
Dat vergroot vier keer in plaats van twee. Handig voor een draadje door een
naaldoog, een splinter of het serienummer op een apparaat. Voor gewoon
doorwerken is de grote lens prettiger.

**2. De felste stand is voor donker garen**
Bij donkerblauw, zwart of donkergroen garen is de laagste stand vaak net te
weinig. Druk een keer extra.

**3. De klem kan ook aan een plank of een armleuning**
Hij past op alles tot 6 centimeter dik. Een boekenplank naast uw stoel werkt
vaak beter dan de eettafel, omdat u de lamp dan niet elke keer hoeft te
verplaatsen.

Vragen? Bel [0XX - XXX XXXX] of antwoord op deze mail.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 6 — Vraag om een beoordeling

**Trigger:** 14 dagen na levering, alleen naar klanten die niet geretourneerd
hebben en geen klacht indienden.

### E-mail 6.1

**Onderwerp:** Mogen we u iets vragen?
**Preview:** Twee zinnen zijn genoeg

```
Beste [voornaam],

U heeft de lamp nu twee weken. Als het goed is, is het nieuwtje eraf en weet u
of hij bij u past.

Wij zijn een nieuwe winkel. Dat betekent dat mensen die overwegen te bestellen,
nog niet kunnen lezen wat anderen ervan vonden — en dat is precies waar ze het
meeste behoefte aan hebben.

Zou u willen opschrijven wat u ervan vindt? Twee zinnen is genoeg. En als iets
tegenviel, schrijft u dat er dan ook bij. Een rij beoordelingen waar alles
perfect is, gelooft niemand, en terecht.

    [ Uw ervaring opschrijven ]

Dank u wel.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

### E-mail 6.2 — na 5 dagen, alleen bij geen reactie

**Onderwerp:** Nog even over die beoordeling
**Preview:** Ook als het tegenviel

```
Beste [voornaam],

Kort: mocht u ertoe komen, dan stellen we een beoordeling erg op prijs.

    [ Uw ervaring opschrijven ]

En als de lamp tegenviel, horen we dat liever rechtstreeks dan helemaal niet.
Bel [0XX - XXX XXXX] of antwoord op deze mail. U heeft 60 dagen om terug te
sturen, dus als het niet is wat u zocht, is dat nog steeds op te lossen.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 7 — Vraag om een filmpje

**Trigger:** handmatig, naar klanten die positief reageerden op flow 4.3 of
flow 6. Zie `19-ugc-scripts.md`.

### E-mail 7.1

**Onderwerp:** Zou u iets voor ons willen doen? (vergoeding € 50)
**Preview:** Een filmpje van een minuut met uw telefoon

```
Beste [voornaam],

U schreef eerder dat u tevreden bent over uw Daglamp. Daar wilde ik op
doorvragen, met een vraag die u gerust mag weigeren.

Zou u een filmpje van ongeveer een minuut willen maken met uw telefoon, waarin
u laat zien hoe u de lamp gebruikt en vertelt wat u ervan vindt?

Het hoeft niet mooi te zijn. Eerlijk werkt beter dan gelikt. U vertelt gewoon
wat u doet, waar u tegenaan liep, en wat u er nu van vindt. Als iets tegenviel
mag dat er ook in — juist dan gelooft iemand het.

We zouden het gebruiken in onze advertenties op Facebook.

**De vergoeding is € 50,** en die staat los van wat u zegt. We betalen voor uw
tijd, niet voor uw mening.

Heeft u interesse? Antwoord op deze mail, dan stuur ik een kort lijstje met
waar u op kunt letten.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 8 — Cross-sell

**Trigger:** 30 dagen na levering. Met één product is dit beperkt, en dat is
precies waarom je hier niet moet pushen.

### E-mail 8.1

**Onderwerp:** Een tweede, voor de andere kamer
**Preview:** Of een reservelens, als de uwe iets heeft opgelopen

```
Beste [voornaam],

Een korte mail, en daarna laat ik u met rust.

**Een tweede lamp.** De meest gehoorde opmerking van klanten is dat ze hem
telkens verplaatsen — van de eettafel naar de stoel, of van beneden naar boven.
Als u dat herkent: een tweede kost € 59,95 in plaats van € 79,95, want de
verzending is al betaald.

    [ Een tweede bestellen ]

**Een reservelens.** Is uw lens gekrast, dan hoeft u geen nieuwe lamp. Een
losse lens kost € 24,95.

**Voor iemand anders.** Kent u iemand die hetzelfde probleem heeft? Dan is dit
in november en december een goed cadeau.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Flow 9 — Terughalen

**Trigger:** 120 dagen na de laatste aankoop, geen nieuwe bestelling.

### E-mail 9.1

**Onderwerp:** Doet hij het nog goed?
**Preview:** Even bijpraten, geen aanbieding

```
Beste [voornaam],

Het is een paar maanden geleden dat u bij ons bestelde. Ik was benieuwd of de
lamp het nog goed doet.

Als er iets mis is: u heeft twee jaar garantie. Bel [0XX - XXX XXXX] of
antwoord op deze mail, dan kijken we ernaar.

En als alles goed is, hoeft u niets te doen. Deze mail is geen aanbieding.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

### E-mail 9.2 — na 30 dagen

**Onderwerp:** Wat we sinds uw bestelling hebben gedaan
**Preview:** Een kort bericht van een kleine winkel

```
Beste [voornaam],

Sinds u bij ons bestelde is er het een en ander gebeurd. [Vul in: een tweede
product, betere verpakking, wat klanten vaak terugkoppelden.]

Mocht u iemand kennen die 's avonds ook eerder stopt met handwerk dan ze zou
willen, dan weet u ons te vinden.

    [ Bekijk de winkel ]

En anders: dank dat u destijds bij ons kocht. Bij een kleine winkel telt elke
bestelling echt.

Hartelijke groet,
[naam]

Zichtwerk · [adres] · KVK [nummer]
[Afmelden]
```

---

# Overzicht

| # | Flow | Trigger | E-mails | Doel |
|---|---|---|---|---|
| 1 | Welkom | inschrijving | 3 | Vertrouwen en kennis |
| 2 | Winkelwagen verlaten | 4 uur | 3 | Bezwaren wegnemen |
| 3 | Checkout verlaten | 1 uur | 2 | Technische drempel wegnemen |
| 4 | Na de bestelling | aankoop | 3 | Spanning wegnemen, problemen vroeg vangen |
| 5 | Productuitleg | dag 7 | 1 | Beter gebruik, minder retouren |
| 6 | Beoordeling | dag 14 | 2 | Sociale bewijskracht opbouwen |
| 7 | Filmpje | handmatig | 1 | UGC verzamelen |
| 8 | Cross-sell | dag 30 | 1 | Tweede lamp, accessoires |
| 9 | Terughalen | dag 120 | 2 | Relatie warm houden |

**Wat je meet:**

| Getal | Waar je op mikt |
|---|---|
| Openratio | 40–55% (tekstmails bij deze doelgroep scoren hoog) |
| Doorklikratio | 5–12% |
| Omzet uit e-mail, aandeel van totaal | 15–25% |
| Herstelde winkelwagens | 5–12% |
| Afmeldingen per e-mail | < 0,3% |

**Bouwvolgorde als je tijd tekortkomt:** flow 4 (na de bestelling) eerst, dan
flow 2 (winkelwagen), dan flow 6 (beoordeling). Die drie leveren samen het
grootste deel van de waarde. De rest kan wachten tot maand twee.

Door naar `21-cro-audit.md`.
