# Onderdelenbeheer

Voorraad- en picklijstprogramma voor de meubelmakerij: welke onderdelen zijn er,
wat is er voor een kast nodig, wat is er gepakt en wat moet er besteld worden.

De vormgeving is bewust minimaal: zwart, wit en goud, met de artikelnummers
en aantallen in een vaste-breedte letter zodat kolommen recht onder elkaar
staan.

Het programma is gemaakt voor twee manieren van werken:

* **Roy (inkoop)** maakt per kast een lijst met onderdelen, ziet welke onderdelen
  onder het bestelpunt zakken en bestelt op tijd bij.
* **Dean (werkplaats)** kiest op de laptop bij de kast het kastnummer, pakt de
  onderdelen, vinkt ze af en geeft aan het eind aan of alles compleet was. Wat
  mist gaat meteen naar de bestellijst van Roy.

## Starten

```bash
npm start
```

Daarna in de browser openen:

* op deze computer: `http://localhost:4000`
* op de laptop bij de kast: het netwerkadres dat bij het starten in beeld komt,
  bijvoorbeeld `http://192.168.1.20:4000`

Er is geen installatie of database nodig; Node.js 20 of nieuwer is genoeg.
Alle gegevens staan in één bestand: `data/db.json`. Bewaar een kopie van dat
bestand als back-up. De eerste keer vult het programma zichzelf met een
voorbeeldlijst onderdelen, die je kunt aanpassen of verwijderen.

De poort en de plek van de gegevens zijn in te stellen:

```bash
PORT=8080 DATA_DIR=/pad/naar/gegevens npm start
```

## Zo werkt het

### 1. Onderdelen

Alle onderdelen staan met **foto, naam en artikelnummer** in de lijst, plus
categorie, leverancier, locatie in het magazijn en de voorraad. Zoeken kan op
naam, nummer, leverancier of locatie, en filteren op status of categorie.

Bij elk onderdeel staan drie aantallen:

| Aantal | Betekenis |
| --- | --- |
| **Voorraad** | wat er werkelijk in het magazijn ligt |
| **Gereserveerd** | wat al op openstaande kastlijsten staat |
| **Vrij** | voorraad min gereserveerd: wat je echt nog kunt gebruiken |

De status volgt uit het **vrije** aantal, zodat Roy bestelt vóórdat de
scharnieren op zijn:

* **Op voorraad** – ruim boven het bestelpunt
* **Bestellen** – op of onder het bestelpunt
* **Besteld** – onder het bestelpunt, maar er is al een bestelling onderweg
* **Op** – niets meer vrij

Een foto toevoegen of vervangen kan bij *Nieuw onderdeel* en *Wijzigen*; de
foto's komen in `data/uploads/` te staan.

### 2. Kastlijsten (Roy)

*Kastlijsten → Nieuwe kastlijst*: zoek de onderdelen bij elkaar, zet het aantal
erbij en vul het kastnummer in (bijvoorbeeld 51436). Staat er meer op de lijst
dan er vrij is, dan waarschuwt het scherm meteen. De lijst is ook af te drukken.

### 3. Pakken (Dean)

*Pakken*: kies het kastnummer, loop de lijst langs en vink elk onderdeel af
(of zet met − en + het aantal dat je echt gepakt hebt). Tussendoor wordt alles
bewaard, dus je kunt de laptop gerust even wegleggen.

Aan het eind zijn er twee knoppen:

* **Alles gepakt** – de lijst is compleet; alle aantallen gaan van de voorraad af.
* **Er mist iets** – je ziet per onderdeel wat er mist, en na bevestigen gaat het
  tekort naar Roy. Wat wél gepakt is gaat gewoon van de voorraad af.

### 4. Bestellen (Roy)

*Bestellen* laat in één scherm zien wat er moet gebeuren: de tekorten uit de
werkplaats bovenaan, daarna alles wat onder het bestelpunt zit, gegroepeerd per
leverancier met een knop om de bestellijst te kopiëren. Het programma stelt een
aantal voor (aanvullen tot twee keer het bestelpunt, minimaal de standaard
bestelhoeveelheid, plus het gemelde tekort).

Zodra een bestelling binnen is, klik je op **Ontvangen**: de voorraad gaat
omhoog en het bijbehorende tekort is afgehandeld.

### 5. Historie

Alles wat er gebeurt – gepakte kastlijsten, gemelde tekorten, bestellingen en
voorraadcorrecties – komt in *Historie* te staan, met wie het gedaan heeft.

Linksonder kies je wie er achter het scherm zit (Roy, Dean of Werkplaats); die
naam komt bij alle gebeurtenissen te staan. Er is bewust geen wachtwoord, zodat
er in de werkplaats niet ingelogd hoeft te worden.

## Onder de motorkap

```
server.js          start de webserver
src/http.js        levert de schermen en de API uit
src/api.js         alle acties: onderdelen, kastlijsten, bestellingen, foto's
src/store.js       opslag in data/db.json
src/derive.js      rekenregels: reservering, status, besteladvies
src/seed.js        voorbeeldgegevens bij de eerste start
public/            de schermen (geen bouwstap, gewoon HTML, CSS en JavaScript)
test/              tests van de rekenregels en de complete werkwijze
```

Geen externe pakketten nodig – alles draait op Node.js zelf.

Tests draaien:

```bash
npm test
```
