# Onderdelenbeheer PUUUR

Programma voor de werkplaats: Roy zet per kast op een lijst welke onderdelen
nodig zijn, Dean pakt die kast en geeft aan of alles compleet was. Wat mist,
komt bij Roy op de lijst met wat er besteld moet worden.

De website: **https://leonprnd.github.io/Leonprnd/**

## Wie ziet wat

Linksboven kies je wie er achter het scherm zit. Het programma ziet er voor
allebei anders uit.

**Roy** heeft twee tabbladen:

* **Kastlijst maken** – kastnummer en omschrijving invullen, onderdelen erbij
  zoeken (op naam, nummer, locatie of leverancier) en het aantal instellen.
  Onderaan staan alle eerder gemaakte kastlijsten. Hier voeg je ook nieuwe
  onderdelen toe of pas je een bestaand onderdeel aan.
* **Te bestellen** – alles wat Dean tekort kwam, met het aantal, de locatie,
  de leverancier en bij welke kast het miste. Bestellen zelf gebeurt (nog)
  buiten het programma; met *afgehandeld* haal je een regel van de lijst.

**Dean** heeft twee tabbladen:

* **Kastlijsten** – de kasten die klaarstaan.
* **Voorraad** – alle onderdelen onder elkaar op volgorde van locatie, met per
  onderdeel een vakje voor het aantal. Tellen doe je in één doorloop: typen,
  Tab, typen. Elk aantal wordt meteen bewaard, met de datum en wie het telde.
  Later is ditzelfde tabblad het overzicht van hoeveel er van alles ligt.

Het kastlijstscherm van Dean: de kasten die klaarstaan. Hij kiest de kast die hij
gaat maken en krijgt dan de complete lijst onderdelen te zien, op volgorde van
locatienummer. Onderaan staat één vraag: *Heb je alle onderdelen?*

* **Ja, alles compleet** – de kast is afgerond.
* **Nee, er mist iets** – hij vinkt aan wat er mist en hoeveel; dat gaat naar
  de lijst van Roy.

De onderdelenlijst zelf komt van het papieren blad: naam, artikelnummer,
locatie, leverancier en een foto. Overal waar onderdelen in een lijst staan,
staan ze op volgorde van locatienummer, van laag naar hoog.

## De website aanpassen

`site/index.html` is de hele website. Na een wijziging:

```bash
npm run build:site
```

Dat zet de pagina met de tekeningen klaar in `docs/`; GitHub Pages publiceert
die map bij elke push. `docs/gegevens.json` is de onderdelenlijst waarmee een
apparaat begint.

De website bewaart de gegevens in de browser van het apparaat waarop je hem
opent. Met *Gegevens opslaan als bestand* en *Bestand inlezen* verhuis je ze
naar een ander apparaat.

## Serverversie (ouder)

In `public/`, `src/` en `server.js` staat een oudere opzet met een eigen
server: die houdt één gedeelde voorraad bij voor iedereen, inclusief
voorraadaantallen, bestelpunten en bestellingen. Die opzet is nog niet
meegegaan met de indeling hierboven.

```bash
npm start     # http://localhost:4000
npm test
```
