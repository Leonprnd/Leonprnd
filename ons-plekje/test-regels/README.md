# De beveiligingsregels testen

Deze map staat los van de app. Je hebt hem niet nodig om Ons Plekje te
gebruiken — `npm install` in de hoofdmap raakt hier niets van.

Hij bestaat omdat beveiligingsregels stil kunnen falen. Een regel die te
streng is, merk je pas als de app "Missing or insufficient permissions" geeft;
een regel die te ruim is, merk je misschien nooit. Deze test draait de regels
tegen de echte Firestore-emulator en controleert allebei de kanten.

## Draaien

Je hebt **Java** nodig (de emulator van Google draait daarop) en Node 20+.

```bash
cd test-regels
npm install
npm test
```

De eerste keer haalt Firebase de emulator op; dat duurt even.

## Wat er getest wordt

* Een vrije code opvragen mag — dat doet de app als je een kaart maakt.
* Een kaart aanmaken kan alleen met jezelf erop.
* Je liefje kan zichzelf toevoegen, maar niet de maker eraf gooien.
* Zodra er twee mensen op staan, komt er niemand anders meer bij.
* Plekjes en foto-adressen zijn alleen voor die twee.
* Je schrijft alleen je eigen locatie, en leest die van je liefje.
* Niemand kan door alle kaarten heen bladeren.

Pas je `firestore.rules` aan, draai dit dan even. Het scheelt een avond zoeken.
