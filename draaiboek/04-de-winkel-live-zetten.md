# De winkel live zetten

## Hoe het nu in elkaar zit

Deze repository bevat twee losse dingen die elkaar niet in de weg zitten:

| Wat | Bron | Wordt gebouwd naar |
|---|---|---|
| Onderdelenbeheer PUUUR (bestond al) | `site/` | `docs/index.html` |
| De webwinkel (nieuw) | `winkel/` | `docs/winkel/` |

`npm run build:site` raakt alleen `docs/index.html` en `docs/img/` aan.
`npm run build:winkel` raakt alleen `docs/winkel/` aan. Ze kunnen elkaar niet
overschrijven.

## Lokaal bekijken

```bash
npm run build:winkel
cd docs && python3 -m http.server 8000
```

Open daarna <http://localhost:8000/winkel/>.

Controleer na elke wijziging of het rekenwerk nog klopt:
<http://localhost:8000/winkel/_test-winkelwagen.html>. Onderaan hoort
`UITSLAG: ALLES GOED` te staan.

## Optie 1 — meteen zichtbaar via GitHub Pages

Na een push staat de winkel op:
`https://leonprnd.github.io/Leonprnd/winkel/`

Prima om te delen en te testen. **Niet geschikt om echt op te verkopen**: je
adres bevat een andere merknaam, wat bij deze doelgroep meteen wantrouwen wekt.

## Optie 2 — eigen domein (dit wil je)

1. **Domein kopen.** `bijtijds.nl` of wat je kiest, ongeveer € 10 per jaar bij
   TransIP, Versio of Cloudflare. Kies een `.nl`: Nederlandse kopers van in de
   zeventig vertrouwen `.nl` aantoonbaar meer dan `.com` of `.shop`.
2. **Vercel koppelen.** De repository is al ingesteld (`vercel.json`). Verbind
   hem, voeg het domein toe en zet de DNS om zoals Vercel aangeeft. Gratis, en
   https regelt Vercel zelf.
3. **Zorg dat de winkel op de hoofdmap staat.** Nu staat hij op `/winkel/`.
   Voor een eigen domein wil je hem op `/`. Zet in `vercel.json` de
   `outputDirectory` op `docs/winkel` in een apart Vercel-project dat je aan dat
   domein hangt, zodat je werkplaats-app op zijn eigen adres blijft staan.
4. **Zet het webadres goed** in `winkel/bedrijf.json` bij `webadres`. Dat veld
   bepaalt je canonieke links, je sitemap en je deelvoorbeelden.

## Voor de livegang aflopen

```bash
npm run build:winkel
```

De bouwer waarschuwt zelf welke velden in `winkel/bedrijf.json` nog openstaan.
Ga niet live zolang die melding er is.

- [ ] Alle `[VELDEN]` in `winkel/bedrijf.json` ingevuld
- [ ] Alle `[INVULLEN]` in `winkel/paginas/verhaal.html` vervangen door je
      eigen, kloppende verhaal
- [ ] De gele waarschuwing bovenaan de algemene voorwaarden weggehaald
      (nadat je ze hebt laten nakijken)
- [ ] Telefoonnummer werkt echt en wordt opgenomen
- [ ] E-mailadres werkt en je leest het
- [ ] Een testbestelling helemaal doorlopen
- [ ] Op je eigen telefoon bekeken, niet alleen op de computer
- [ ] Iemand van boven de 65 de bestelling laten proberen zonder hulp —
      **dit vindt meer fouten dan alle andere punten samen**
