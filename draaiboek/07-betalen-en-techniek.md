# Betalen en techniek

## Waarom Mollie

- **iDEAL is 65% van alle online betalingen in Nederland.** Zonder iDEAL verkoop
  je niets aan deze doelgroep.
- Mollie rekent **€ 0,29 per iDEAL-transactie** — een vast bedrag, geen
  percentage. Op een bestelling van € 99,95 is dat 0,3%. Bij een aanbieder die
  1,8% + € 0,25 rekent betaal je € 2,05. Dat scheelt over duizend bestellingen
  bijna € 1.800.
- Geen abonnement, geen maandkosten.
- Je hebt er een KvK-nummer en een zakelijke rekening voor nodig.

Alternatief: Stripe, maar die is voor de Nederlandse markt duurder op iDEAL.

## Hoe de winkel nu werkt

De afrekenpagina staat in **demo-stand**: hij controleert de ingevulde
gegevens, slaat de bestelling op en toont de bedankpagina. Er wordt niets
afgeschreven. Zo kun je de hele winkel testen zonder betaalkoppeling.

In `winkel/paginas/afrekenen.html` staat:

```html
<form class="wagen-rooster" data-afrekenen data-endpoint="" novalidate>
```

Zodra `data-endpoint` gevuld is, stuurt de winkel de bestelling als JSON naar
dat adres en verwacht hij `{ "betaalUrl": "https://..." }` terug. Daar stuurt hij
de klant dan heen.

## De koppeling aanzetten

1. Maak een account op <https://www.mollie.com/> en doorloop de controle.
   Reken op één tot drie werkdagen.
2. Haal je **live API-sleutel** op (begint met `live_`).
3. Zet die sleutel in Vercel onder **Settings → Environment Variables** als
   `MOLLIE_API_KEY`. **Zet hem nooit in de code en nooit in deze repository.**
4. Kopieer `winkel/api-voorbeeld/bestelling.js` naar `api/bestelling.js` in de
   hoofdmap van je Vercel-project.
5. Zet in `afrekenen.html`: `data-endpoint="/api/bestelling"`.
6. Bouw opnieuw en doe een echte testbestelling van € 0,01.

## Wat die functie doet

Het voorbeeld in `winkel/api-voorbeeld/bestelling.js` is bewust kort maar doet
het belangrijkste goed:

- **Het rekent het bedrag zelf opnieuw uit** op basis van de productlijst op de
  server. Het bedrag dat de browser meestuurt wordt genegeerd. Zonder die stap
  kan iemand met de ontwikkelaarsconsole zijn eigen prijs bepalen — dit is de
  meest gemaakte fout in zelfgebouwde webshops.
- Het controleert de ingevulde gegevens nog een keer.
- Het maakt de betaling aan bij Mollie en geeft de betaal-URL terug.

## Wat je er nog bij moet bouwen

Het voorbeeld is een startpunt, geen complete winkel. Dit komt er nog bij:

- **Een webhook** waar Mollie naartoe meldt dat er betaald is. Pas dán is de
  bestelling echt. Vertrouw nooit op de terugkeer van de klant in de browser.
- **Bestellingen ergens bewaren.** Begin desnoods met een e-mail naar jezelf per
  bestelling; dat is voor de eerste vijftig bestellingen prima.
- **Een bevestigingsmail naar de klant.** Zie
  [e-mails na de bestelling](06-e-mails-na-de-bestelling.md).

## Als je hier niet uitkomt

Dat is geen schande — dit is het lastigste stuk. Twee uitwegen:

1. **Begin telefonisch.** De winkel is er al op ingericht: overal staat "bel ons
   en wij nemen de bestelling op". Je neemt de bestelling aan, stuurt een
   betaalverzoek via je bank, en verstuurt. Voor je eerste twintig bestellingen
   werkt dat prima en je leert er meer van dan van elke koppeling.
2. **Zet de betaalwijze op overboeking.** Staat al in het formulier. Je mailt het
   rekeningnummer en verstuurt zodra het geld binnen is. Ouderwets, maar bij deze
   doelgroep verrassend goed geaccepteerd.
