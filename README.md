# PUUUR Parts Manager

Programma voor de werkplaats. De website is Engelstalig; deze uitleg is voor
jullie zelf.

De website: **https://leonprnd.github.io/Leonprnd/**

## Wie ziet wat

Linksboven kies je wie er achter het scherm zit.

**Roy** — twee tabbladen:

* **Cabinet lists** — kastnummer en omschrijving invullen, onderdelen erbij
  zoeken, aantal instellen, opslaan. Of **Import CSV**: het exportbestand uit
  de tekensoftware inlezen. Het kastnummer en de omschrijving komen uit de
  bestandsnaam, per regel wordt het aantal overgenomen en stelt het programma
  voor welk onderdeel uit de catalogus bedoeld wordt; regels die het niet kent
  worden als nieuw onderdeel aangemaakt.
* **History** — afgeronde kasten met datum, wie het pakte en of alles klopte of
  wat er miste.

**Dean** — vier tabbladen:

* **Cabinet lists** — kies de kast die je gaat maken, zie alle onderdelen op
  volgorde van locatie en beantwoord onderaan één vraag: *Do you have all
  parts?* Bij *no* vink je aan wat er mist en hoeveel.
* **Stock** — alle onderdelen met per stuk het aantal én een minimum. Tel aan
  het begin één keer alles; daarna houdt het programma het bij.
* **Monthly check** — een korte lijst onderdelen die één keer per maand geteld
  wordt. Het programma vergelijkt met wat het verwacht en laat zien hoeveel er
  ontbreekt: groen is (bijna) niets, geel is weinig, rood is meer dan een
  kwart. Elke check wordt bewaard onder *Previous checks*.
* **History** — hetzelfde overzicht als bij Roy.

## Hoe de aantallen lopen

* Zodra een kastlijst wordt opgeslagen gaan die aantallen van de voorraad af.
  Wijzigen boekt het verschil, verwijderen (van een nog niet gepakte lijst)
  boekt alles terug.
* Zakt een aantal tot op of onder het minimum, dan komt het onderdeel in de
  bestelmail naar roymantel@puuur-interiors.nl.
* Meldt Dean een onderdeel als tekort, dan lag het er niet: dat onderdeel gaat
  op nul.

## De bestelmail aanzetten

De mail wordt één keer per dag verstuurd, vlak na middernacht. Dat staat nog
uit: bovenin `site/index.html` staat

```js
const MAIL = { serviceId: '', templateId: '', publicKey: '' };
```

Vul daar de drie gegevens van een (gratis) EmailJS-account in, bouw opnieuw en
de site mailt de lijst zelf. Zolang het leeg is stuurt de site niets en is de
mail te lezen en te kopiëren via *Order email* in het tabblad Stock.

## De website aanpassen

`site/index.html` is de hele website. Na een wijziging:

```bash
npm run build:site
```

Dat zet de pagina met de tekeningen klaar in `docs/`; GitHub Pages publiceert
die map bij elke push. `docs/gegevens.json` is de onderdelenlijst waarmee een
apparaat begint. De website bewaart de gegevens in de browser van het apparaat
waarop je hem opent; met *Save data to a file* en *Load data from a file* (in
het tabblad Stock) verhuis je ze naar een ander apparaat.

## Serverversie (ouder)

In `public/`, `src/` en `server.js` staat een oudere opzet met een eigen server
en één gedeelde voorraad voor iedereen. Die is niet meegegaan met de indeling
hierboven.

```bash
npm start     # http://localhost:4000
npm test
```
