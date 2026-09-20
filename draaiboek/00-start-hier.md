# Start hier

Dit is het draaiboek bij de webwinkel in `winkel/`. De winkel zelf is af en werkt.
Wat hier staat is alles wat *om* de winkel heen moet gebeuren voordat er geld
binnenkomt.

## Wat er klaarstaat

| Onderdeel | Waar | Status |
|---|---|---|
| Complete webwinkel, 15 pagina's | `winkel/paginas/` | Werkt |
| Winkelwagen, afrekenen, bevestiging | `winkel/assets/js/winkel.js` | Werkt, 19 tests groen |
| Cookietoestemming met Meta Pixel | `winkel/assets/js/toestemming.js` | Werkt, pixel staat uit |
| Productbeelden | `winkel/assets/img/` | Vectorrenders — vervangen door foto's |
| Juridische pagina's | voorwaarden, privacy, cookies, retour | Concept, moet nagekeken |
| Bedrijfsgegevens | `winkel/bedrijf.json` | **7 velden nog invullen** |

## De volgorde die ik zou aanhouden

Niet alles tegelijk. In deze volgorde loop je niet vast:

1. **[Het product](01-het-product.md)** — lees waarom het dit product werd, zodat je
   aan de telefoon weet waar je het over hebt.
2. **[Inkoop](02-inkoop-en-leveranciers.md)** — bestel eerst drie monsters. Niet
   overslaan. Dit is de stap waar de meeste mensen onderuit gaan.
3. **[KVK en juridisch](08-juridisch-en-kvk.md)** — inschrijven, btw-nummer,
   zakelijke rekening. Kost een uur en 75 euro.
4. **[Prijzen en marges](03-prijzen-en-marges.md)** — weet wat je overhoudt vóór je
   een euro aan advertenties uitgeeft.
5. **[Betalen aanzetten](07-betalen-en-techniek.md)** — Mollie koppelen.
6. **[Foto's en video](09-foto-en-videoplan.md)** — dit bepaalt je advertentie meer
   dan wat dan ook.
7. **[De winkel live zetten](04-de-winkel-live-zetten.md)** — domein en hosting.
8. **[Facebook-advertenties](05-facebook-ads.md)** — pas als 1 tot en met 7 klaar zijn.
9. **[E-mails na de bestelling](06-e-mails-na-de-bestelling.md)** — hier zit je
   herhaalaankoop en je beoordelingen.
10. **[De eerste 30 dagen](10-de-eerste-30-dagen.md)** — wat je dagelijks doet en
    wanneer je stopt.

## Drie dingen die ik bewust niet gebouwd heb

Deze ontbreken niet per ongeluk. Ze staan in vrijwel elke dropshipping-template
en ze zijn in Nederland verboden of onverstandig:

- **Verzonnen beoordelingen.** Sinds de Omnibus-richtlijn strafbaar. De ACM
  beboet er actief op; de boete kan oplopen tot 900.000 euro of 1% van je
  jaaromzet. Er staat een eerlijke "nog geen beoordelingen"-tekst op de
  productpagina die zelf als vertrouwenssignaal werkt.
- **Aftelklokjes en "nog 3 op voorraad".** Misleidende schaarste is een
  oneerlijke handelspraktijk (artikel 6:193g BW).
- **Doorgestreepte prijzen die nooit gegolden hebben.** Een van-prijs moet de
  laagste prijs van de afgelopen 30 dagen zijn. Het veld zit in de code, maar
  staat leeg tot je een prijs hébt die je kunt doorstrepen.

Bij een doelgroep van 70-plussers die je op je woord gelooft, is dit niet alleen
een juridisch risico. Het is ook de snelste manier om je retourpercentage en je
klachten omhoog te jagen.

## Het eerlijke verhaal over de cijfers

Op 99,95 euro met een inkoop van rond de 36 euro houd je **ongeveer 46 euro per
bestelling** over voordat je adverteert. Je mag dus maximaal 46 euro per klant aan
advertenties uitgeven om quitte te spelen. Dat betekent een break-even ROAS van
ongeveer **2,2**.

Dat is werkbaar, maar het is geen gratis geld. De rekensom staat helemaal
uitgeschreven in [prijzen en marges](03-prijzen-en-marges.md), inclusief wat
retouren en defecten ermee doen.
