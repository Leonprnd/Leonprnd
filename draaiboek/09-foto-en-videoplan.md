# Foto's en video

## Wat er nu staat, en waarom

In `winkel/assets/img/` staan zes beelden. Het zijn **vectorrenders**, geen
foto's. De omgeving waarin deze winkel gebouwd is blokkeert alle fotobronnen, dus
echte productfoto's downloaden kon niet.

Ze zijn goed genoeg om de winkel mee te laten zien en om mee te testen. Ze zijn
**niet** goed genoeg om echt mee te verkopen. Vervang ze zodra je monsters binnen
zijn.

| Bestand | Toont | Vervangen door |
|---|---|---|
| `product-1.svg` | Gesloten, van boven | Foto van boven op witte ondergrond |
| `product-2.svg` | Open, 28 gevulde vakjes | Foto met écht gevulde vakjes |
| `product-3.svg` | Het display | Close-up van het scherm |
| `product-4.svg` | Afmetingen naast een mok | Foto met liniaal of mok erbij |
| `product-7dagen.svg` | De 7-daagse uitvoering | Foto van dat model |
| `doos.svg` | De verpakking | Foto van de doos zoals hij aankomt |

## Zo vervang je ze

Sla je foto's op als `.jpg` in `winkel/assets/img/` en pas de verwijzingen aan:

```bash
cd /home/user/Leonprnd
# Alle verwijzingen naar product-1.svg vervangen door product-1.jpg
grep -rl "product-1.svg" winkel/ | xargs sed -i 's/product-1\.svg/product-1.jpg/g'
npm run build:winkel
```

Vierkant bijsnijden (1:1), minstens 1200 × 1200 pixels, en onder de 250 kB per
foto houden. Een trage productpagina kost je conversie, zeker bij bezoekers die
nog op een oudere telefoon zitten.

**Vergeet de alt-teksten niet.** Die staan nu beschreven per beeld in
`winkel/paginas/product.html`. Ze zijn er niet voor Google maar voor bezoekers
met een schermlezer of slecht zicht — bij deze doelgroep geen randgeval.

## De opnamelijst

Je hebt geen fotostudio nodig. Een telefoon van na 2020, daglicht en een wit
vel A2-papier is genoeg. **Nooit flitsen** — dat geeft harde schaduwen op wit
plastic.

### Zeven productfoto's

1. **Van boven, gesloten, display aan.** Je hoofdbeeld. Wit papier eronder, bij
   een raam, niet in direct zonlicht.
2. **Van boven, deksel eraf, vakjes gevuld.** Vul ze écht, met verschillende
   kleuren. Dit beeld verkoopt het "28 vakjes"-argument in één oogopslag.
3. **Display van dichtbij.** Zorg dat er een echte tijd op staat, geen 00:00.
4. **Het slot met de sleutel erin.**
5. **Naast iets bekends** — een koffiemok of een hand. Dit beantwoordt de vraag
   "hoe groot is dat ding" die anders je klantenservice belt.
6. **De doos en alles wat erin zit,** netjes uitgestald: apparaat, sleutels,
   batterijen, handleiding.
7. **Op een keukentafel,** in een echt huis. Dit is je enige sfeerbeeld en het
   doet meer dan de andere zes samen.

### Video

Drie video's van 20 tot 30 seconden, verticaal (9:16). De inhoud staat in
[Facebook-advertenties](05-facebook-ads.md).

Praktische punten die het verschil maken:

- **Verticaal filmen.** Vierkant of liggend verliest de helft van het scherm.
- **Vanaf een statief of een stapel boeken.** Trillend beeld leest als amateur.
- **Ondertitel alles.** Rond de 80% kijkt zonder geluid. Ondertitels zijn geen
  extraatje maar de hoofdtekst.
- **Grote letters in beeld.** Minstens 1/12 van de schermhoogte.
- **Het eerste beeld is alles.** Begin met het apparaat dat piept en knippert.
  Geen logo, geen intro, geen opbouw. Je hebt drie seconden.
- **Laat handen zien.** Handen die iets doen houden mensen langer vast dan een
  product dat stilstaat.

### Wat je niet moet doen

- **Geen foto's van de leverancier gebruiken.** Ze zijn auteursrechtelijk
  beschermd, ze staan op honderd andere winkels, en ze zien er precies uit als
  wat ze zijn.
- **Geen stockfoto's van lachende ouderen.** Die herkent iedereen en ze maken je
  winkel onmiddellijk minder geloofwaardig.
- **Geen modellen die duidelijk acteren.** Bij deze doelgroep werkt echt en
  onhandig beter dan glad.
