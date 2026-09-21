# OurSpots

Een kaart van jullie samen. Je zet plekken vast waar jullie zijn geweest, met
de datum, een verhaal en foto's die als polaroids op elkaar liggen. Je stelt
de kaart eerst in je eentje samen als cadeau, geeft de code wanneer je zover
bent, en daarna vullen jullie hem samen aan — inclusief elkaars live locatie.

Beschikbaar in het Nederlands, Engels en Spaans. Gemaakt voor de telefoon, met
Expo (React Native), Firebase en Cloudinary.

---

## Wat je gaat doen

De app is af, maar moet nog aan een paar diensten gekoppeld worden:

| | Waarvoor | Nodig? | Creditcard? |
|---|---|---|---|
| **Firebase** | jullie kaart, de plekjes, inloggen | ja | nee |
| **Cloudinary** | de foto's | ja | nee |
| **Google Maps** | een mooiere kaart | **nee** | ja |

Firebase en Cloudinary zijn genoeg om de app volledig te laten werken, en
allebei vragen ze geen betaalgegevens.

Google Maps is een extraatje. De mobiele Maps SDK is gratis en onbeperkt,
maar Google geeft alleen een werkende sleutel als er een betaalrekening aan
je project hangt — en daarvoor moet je 18 zijn. Heb je die niet, dan gebruikt
de app **OpenStreetMap**: geen sleutel, geen account, werkt meteen. Vul je
later alsnog een sleutel in, dan schakelt de app vanzelf over.

Reken op een minuut of twintig. Daarna: `npm start`, QR-code scannen, en de
app draait op je telefoon.

---

## Stap 0 — Node.js en de app klaarzetten

Je hebt **Node.js 20 of nieuwer** nodig. Check of je het al hebt:

```bash
node -v
```

Zie je een foutmelding of een lager nummer, haal Node op bij
[nodejs.org](https://nodejs.org) (kies de LTS-versie).

Dan, in deze map:

```bash
cd ourspots
npm install
```

Zet ook de **Expo Go**-app op je telefoon (gratis, in de App Store of
Play Store). Daarmee test je de app zonder dat je hem hoeft te publiceren.

---

## Stap 1 — Firebase (jullie kaart, plekjes en inloggen)

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com)
   en log in met je Google-account.
2. Klik **Project toevoegen**. Noem het bijvoorbeeld `ourspots`.
   Google Analytics mag je uitzetten — dat heb je niet nodig.
3. **Authentication** aanzetten:
   - Linksin het menu: *Build → Authentication → Aan de slag*.
   - Tabblad **Sign-in method** → klik **Anoniem** → zet aan → **Opslaan**.
   - Hiermee krijgt iedereen stilletjes een account. Geen wachtwoorden,
     geen e-mailadressen. De koppelcode is wat jullie verbindt.
4. **Firestore Database** aanmaken:
   - In het linkermenu: **Databases & Storage → Firestore**
     (dit zat vroeger onder *Build*).
   - Klik **Create database** / **Database maken**.
   - Kies **Standard edition** — niet Enterprise. Die laatste is voor
     bedrijven en kost geld.
   - **Database ID: laat `(default)` staan.** De app en de
     beveiligingsregels gaan uit van die naam; geef je hem iets anders, dan
     vindt de app je gegevens niet.
   - Locatie: **eur3 (europe-west)** — dat is het dichtstbij.
   - Beveiligingsregels: start in **productiemodus**. De echte regels zet je
     in de volgende stap.
5. **De sleutels ophalen:**
   - Klik op het tandwiel linksboven → **Projectinstellingen**.
   - Scroll naar **Je apps** → klik op het **web-icoontje `</>`**.
   - Geef het een naam (`OurSpots`) en klik **App registreren**.
   - Je krijgt nu een blokje code te zien met `apiKey`, `authDomain`,
     enzovoort. **Die heb je straks nodig** — laat dit scherm open staan.

### De beveiligingsregels erin zetten

Dit is belangrijk: zonder deze regels kan iedereen bij jullie foto's.

Ga naar *Databases & Storage → Firestore → tabblad Rules*. Verwijder wat er
staat, plak de inhoud van [`firestore.rules`](./firestore.rules) erin, en klik
**Publiceren**.

Heb je de Firebase CLI, dan kan het ook in één commando:

```bash
npx firebase deploy --only firestore:rules
```
Wat die regels doen: een kaart hoort bij precies twee accounts. Alleen die
twee kunnen de pinpoints en foto's zien of aanpassen. Iemand anders kan de
kaart alleen openen op het moment dat er nog maar één persoon op staat — dat
is precies wanneer je liefje de code invult.

---

## Stap 2 — Cloudinary (de foto's)

Gratis, geen creditcard, ruim 25 GB. Cloudinary is gemaakt voor precies dit:
foto's bewaren en ze in de juiste maat afleveren.

1. Maak een gratis account op
   [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free).
2. Op je dashboard staat je **Cloud name** (iets als `dq8xk2vfp`). Die heb je
   zo nodig.
3. Ga naar **Settings** (tandwiel) → **Upload** → **Upload presets** →
   **Add upload preset**.
4. Belangrijk: zet **Signing Mode** op **Unsigned**. Zonder dat kan de app
   niets versturen.
5. Geef de preset een naam, bijvoorbeeld `ons_plekje`, en onthoud die.
6. Aanrader: beperk **Allowed formats** tot `jpg, png, heic, webp` en zet de
   maximale bestandsgrootte op zo'n **10 MB**. De app verkleint foto's al
   vóór het versturen, dus daar kom je nooit aan.
7. **Save**.

Je hebt nu twee dingen: je *cloud name* en de *naam van je preset*.

> **Waarom "unsigned"?** In een telefoon-app kun je geen geheim bewaren — wat
> erin zit, kan iemand eruit halen. Daarom stuurt de app zonder geheime
> sleutel, en beperkt de preset wat er mag. De foto's komen in een map die
> naar jullie koppelcode heet, en die adressen staan alleen in jullie eigen
> kaart in Firestore. Wie het adres niet heeft, vindt de foto niet.

> **Over weggooien:** haal je een foto of een plekje weg, dan is hij uit
> jullie kaart verdwenen en zien jullie hem allebei niet meer. Het bestand
> blijft wel bij Cloudinary staan, omdat wissen een geheime sleutel vraagt
> die niet in een app kan. Met 25 GB merk je daar niets van; opruimen kan
> altijd handmatig in de Media Library.

---

## Stap 2b — Google Maps (optioneel, mag je overslaan)

**Sla je dit over, dan is er niets aan de hand.** De app gebruikt dan
OpenStreetMap, en alles werkt: pinnen zetten, foto's, de tijdlijn, live
locatie. Je ziet alleen een iets eenvoudiger kaart.

Vervelende voorwaarde van Google: de *Maps SDK for Android* en *iOS* zijn
gratis en onbeperkt, maar je krijgt alleen een wérkende sleutel als er een
betaalrekening aan je Google Cloud-project hangt. En voor zo'n
factureringsaccount moet je meerderjarig zijn — dat is Google's voorwaarde,
daar helpt geen enkele pas of bank omheen. Ben je nog geen 18, dan kan een
ouder het factureringsaccount aanmaken; jij blijft gewoon eigenaar van het
project en de app.

**Heb je een creditcard of een betaalkaart die Google accepteert:**

1. Zet aan:
   [Maps SDK for Android](https://console.cloud.google.com/apis/library/maps-android-backend.googleapis.com)
   en, voor een iPhone,
   [Maps SDK for iOS](https://console.cloud.google.com/apis/library/maps-ios-backend.googleapis.com).
2. Maak een sleutel onder
   [Inloggegevens](https://console.cloud.google.com/apis/credentials) →
   *Gegevens maken* → *API-sleutel*.
3. Beperk hem tot die twee SDK's onder **API-beperkingen**.
4. Zet een [budgetmelding](https://console.cloud.google.com/billing/budgets)
   van €1, voor de zekerheid. Kosten maakt deze app niet: de mobiele Maps
   SDK's vallen buiten de betaalde onderdelen, en het opzoeken van de
   plaatsnaam doet je telefoon zelf.

**Heb je die niet:** laat de twee Maps-regels in je `.env` leeg. Klaar.

> **Let op als Google om een vooruitbetaling vraagt.** Bij sommige accounts
> eist Google een *prepayment* van zo'n €25 voordat de proefperiode begint.
> Dat is geen kostenpost maar tegoed — alleen: je maakt het nooit op. De Maps
> SDK voor Android en iOS is gratis en onbeperkt, dus deze app verbruikt er
> niets van. Dat tegoed is bovendien niet terug te vragen en vervalt na een
> jaar, tenzij je later overstapt naar achteraf betalen.
>
> Met andere woorden: die €25 levert je alleen een andere ondergrond op de
> kaart op. Sla het over en gebruik OpenStreetMap.

### Welke kaart krijg ik dan?

Dat kiest de app zelf, aan de hand van je `.env`:

| Situatie | Kaart |
|---|---|
| Geen sleutel ingevuld | **OpenStreetMap** — geen account, geen sleutel |
| Sleutel ingevuld | **Google Maps** met het roze kleurthema |
| iPhone in Expo Go, geen sleutel | Apple Maps (die zit al in Expo Go) |

Je hoeft dus nooit code aan te passen. Vul je later een sleutel in en start je
opnieuw op met `npx expo start -c`, dan staat Google Maps er.

De OpenStreetMap-kaart wordt getekend met Leaflet, met tegels rechtstreeks van
OpenStreetMap. Die worden eerst ontkleurd en dan roze gemaakt met een
SVG-kleurmatrix; dat laatste omdat `sepia` en `hue-rotate` verzadiging nodig
hebben die een lichte kaart niet heeft. Je pins, de fotostapel en de live
locatie werken precies hetzelfde.

---

## Stap 3 — De sleutels invullen

Maak in de map `ourspots` een bestand dat precies `.env` heet (met de punt
ervoor). Het makkelijkst:

```bash
cp .env.example .env
```

Op Windows in de opdrachtprompt is dat:

```
copy .env.example .env
notepad .env
```

Open `.env` en vul in wat je hebt opgehaald:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ourspots-1234.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ourspots-1234
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123

EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dq8xk2vfp
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ons_plekje

EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY=
```

Zonder betaalrekening bij Google laat je die laatste twee gewoon leeg.

`.env` staat in `.gitignore`, dus je sleutels komen niet per ongeluk op
GitHub terecht.

---

## Stap 4 — Starten

```bash
npm start
```

Er verschijnt een QR-code. Scan hem met je telefoon (op Android met de Expo
Go-app zelf, op iPhone met de camera). De app opent in Expo Go.

Zie je een foutmelding over sleutels die niet gevonden worden? Stop met
`Ctrl+C` en start opnieuw met `npx expo start -c` — de `-c` gooit de cache
leeg, want `.env` wordt alleen bij het opstarten gelezen.

### Eén ding over de iPhone

Expo Go op iOS heeft alleen Apple Maps aan boord. De app werkt daar gewoon,
maar je ziet de standaard Apple-kaart in plaats van ons roze thema. Op Android
klopt het meteen. Wil je Google Maps op je iPhone, dan heb je een eigen build
nodig — zie hieronder.

---

## De app echt op jullie telefoons zetten

Expo Go is om te testen: jij scant een QR-code en de app draait bínnen Expo Go,
alleen zolang je computer aanstaat. Voor een echte app zijn er twee routes.

### Route 1 — de webversie op je beginscherm (gratis)

Dit is de route voor iPhones zonder Apple Developer-account. Je zet de app
online, je opent hem één keer in Safari, en daarna staat er een icoon op je
beginscherm dat schermvullend opent. Niet van een echte app te onderscheiden.

**Bouwen:**

```bash
npm run build:web
```

Dat zet alles klaar in `dist/`: de app, een manifest, een icoon, en de
omleidingsregels voor Vercel en Netlify.

**Online zetten** — het makkelijkst met Vercel:

1. Maak een gratis account op [vercel.com](https://vercel.com) en installeer
   de CLI:

   ```bash
   npm install -g vercel
   ```

2. **Kopieer `dist` naar buiten de repo.** Dat klinkt omslachtig maar is het
   punt waar het misgaat: publiceer je vanuit een map die in een git-repo
   ligt, dan zoekt Vercel de herkomst op en koppelt hij aan het project dat
   al aan die repo hangt. Je overschrijft dan een andere site, en bij de
   volgende push wordt jouw app er weer af gegooid.

   ```bash
   xcopy /E /I /Y dist C:\Users\<jij>\ourspots-web    # Windows
   cp -r dist ~/ourspots-web                            # Mac
   ```

3. Publiceren vanuit die map:

   ```bash
   cd ~/ourspots-web
   vercel --prod
   ```

   Bij *Which project?* kies je **Create a new project** en noem je hem
   `ourspots`. Bij *Code directory?* en *Customize settings?* gewoon Enter en
   nee: er valt niets te bouwen, de map is al klaar.

4. Je krijgt een adres als `https://ourspots.vercel.app`.

**Een nieuwe versie online zetten** gaat daarna met dezelfde vier stappen;
het adres blijft hetzelfde.

[Netlify](https://app.netlify.com/drop) kan ook: sleep de map `dist` gewoon
het venster in. Daar speelt het git-probleem niet.

**Op je beginscherm zetten (iPhone):**

1. Open het adres in **Safari** — niet in Chrome, want alleen Safari kan dit.
2. Tik op het deel-icoon onderin (het vierkantje met de pijl).
3. Kies **Zet op beginscherm**.
4. Er staat nu een OurSpots-icoon tussen je apps.

Op Android gaat het net zo, via *Toevoegen aan startscherm* in Chrome.

**Wat je partner doet:** stuur het adres. Zij of hij doet hetzelfde en vult
daarna jullie code in. Verder niets.

**Waar je op moet rekenen:**

* Het geluid begint pas na je eerste tik op het scherm. Safari staat geen
  geluid toe voordat je iets hebt aangeraakt; daar is niets aan te doen.
* Je locatie delen werkt, maar alleen zolang de app open is — net als in de
  telefoonversie.
* **Wis de websitegegevens van dit adres niet.** Je inlog zit daarin, en je
  bent dan voor de app iemand nieuw. Gebeurt het toch: je partner haalt je in
  het Wij-scherm van de kaart, en je vult de code opnieuw in.
* Bij elke wijziging draai je `npm run build:web` en `vercel --prod` opnieuw;
  het adres blijft hetzelfde.

### Route 2 — een echte app via EAS Build

Voor Android krijg je zo een `.apk` die je gewoon doorstuurt:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Voor iPhone heb je een **Apple Developer-account** nodig (€99 per jaar):

```bash
eas build --platform ios --profile preview
```

> De bouwserver krijgt je `.env` alleen mee dankzij het bestand `.easignore`.
> Zodra dat bestaat gebruikt EAS dat in plaats van `.gitignore`, en daar staat
> `.env` expres niet in. Gooi het niet weg, anders start de gebouwde app met
> een leeg instelscherm.

---

## Hoe de app werkt

**De eerste keer**
Je vult je naam in en kiest een icoontje en kleur. Dan kies je: *ik maak de
kaart* of *ik heb een code gekregen*.

Maak jij de kaart, dan krijg je een code en ga je meteen door naar je eigen
kaart. **Je liefje hoeft er nog niet bij te zijn — juist niet.** Je vult hem
eerst in je eentje met al jullie plekjes, foto's en verhalen, en geeft de code
pas weg als het cadeau af is. Zolang je dat niet doet, ziet niemand anders
iets. De code staat altijd klaar in het Wij-scherm, onder *Het cadeau*.

Vult je liefje de code in, dan verschijnt die ineens op je kaart, mét hartjes.
Vanaf dat moment kunnen jullie er allebei plekjes bij zetten en zien jullie
elkaars live locatie.

**De kaart** — alle plekjes staan erop als pin. Houd de kaart ergens
ingedrukt om daar een nieuw plekje te maken, of tik op de roze plus. Onderin
schuif je door de herinneringen; wat je kiest, springt de kaart naartoe.
Bovenin staan jullie namen, hoeveel dagen jullie samen zijn, en hoe ver
jullie op dit moment uit elkaar zijn.

**Een plekje maken** — de titel wordt alvast ingevuld met de plek die Google
kent (het café, het park), en die pas je aan naar wat je wilt. Dan de datum,
het soort moment, wat er gebeurde, en de foto's.

**De momenten met een gouden randje** — eerste date, eerste kus, verkering,
eerste keer *ik hou van jou*, de eerste keer dat jullie elkaar zagen, en
jubilea. Die krijgen een sterretje op de kaart en staan apart in het
Wij-scherm.

**De fotostapel** — bovenaan een herinnering liggen de foto's als polaroids
op elkaar, een beetje scheef, met een stukje tape erop. Veeg de bovenste opzij
en de volgende komt tevoorschijn; tik erop en hij gaat schermvullend open.

**De tijdlijn** — jullie verhaal van boven naar beneden, per maand
gegroepeerd, met een lijntje ertussen.

**Wij** — hoeveel dagen jullie samen zijn (vul daarvoor *samen sinds* in),
alle weetjes, jullie mijlpalen, de koppelcode, en de knop voor je live
locatie.

**Taal** — Nederlands, Engels of Spaans. Bij de eerste start kiest de app de
taal van je telefoon; daarna stel je hem in bij *Wij*. Alles gaat mee: de
schermen, de namen van de momenten, de datums en de foutmeldingen.

**Geluid** — korte tonen bij het opslaan, bladeren en een plek zetten. Geen
achtergrondgeluid; dat is een bewuste keuze. Uit te zetten bij *Wij*. De
geluiden worden gemaakt door `scripts/maak-geluiden.mjs`; wil je echte
opnames, vervang dan de bestanden in `assets/geluid/`.

**Als iemand er niet meer in komt** — raakt een van jullie de toegang kwijt
(nieuwe telefoon, app opnieuw geïnstalleerd, websitegegevens gewist), dan ziet
de app die persoon als iemand nieuw en zit de kaart vol. In het Wij-scherm
haalt de ander hem of haar van de kaart; daarna kun je opnieuw koppelen met
dezelfde code. Alle plekken en foto's blijven staan.

**Live locatie** — staat standaard aan, zoals afgesproken. Je positie wordt
hooguit elke twintig seconden bijgewerkt, en alleen als je meer dan veertig
meter bent verplaatst; dat scheelt accu. In het Wij-scherm zet je het met één
tik uit, en dan verdwijnt je stip meteen bij je liefje. Alleen jullie twee
kunnen die locatie zien.

---

## Wat waar staat

```
ourspots/
├── app/                      de schermen (expo-router: mapnaam = adres)
│   ├── _layout.js            lettertypes laden, navigatie
│   ├── index.js              waar begin je? (kaart, koppelen of welkom)
│   ├── welkom.js             naam, icoontje en kleur kiezen
│   ├── koppelen.js           code maken of invullen
│   ├── (samen)/              de drie tabbladen zodra je gekoppeld bent
│   │   ├── kaart.js          het startscherm
│   │   ├── tijdlijn.js       jullie verhaal op volgorde
│   │   └── wij.js            dagen samen, weetjes, instellingen
│   └── moment/
│       ├── nieuw.js          een plekje toevoegen of aanpassen
│       └── [id].js           één herinnering met de fotostapel
│
├── src/
│   ├── theme.js              alle kleuren, rondingen en lettertypes
│   ├── momentTypes.js        de soorten plekjes met hun icoontjes
│   ├── mapStyle.js           het roze kleurthema voor Google Maps
│   ├── firebase.js           de verbinding met Firebase
│   ├── state/AppProvider.js  de gedeelde toestand van de hele app
│   ├── services/             praten met Firebase (koppelen, momenten,
│   │                         foto's, locatie)
│   ├── components/           de bouwstenen, waaronder FotoStapel.js
│   └── utils/                datums, afstanden, de koppelcode
│
├── assets/                   het icoon (gemaakt door scripts/maak-iconen.mjs)
├── firestore.rules           wie mag wat in de database
├── firebase.json             waar de regels staan, voor de Firebase CLI
├── test-regels/              test die de regels tegen de emulator draait
├── storage.rules             wie mag wat met de foto's
└── .env                      jouw sleutels (staat niet op GitHub)
```

---

## Zelf aanpassen

**Andere kleuren?** Alles staat in `src/theme.js`. Verander `kleuren.roze` en
de hele app kleurt mee.

**Een soort plekje toevoegen?** Zet er een regel bij in `src/momentTypes.js`:

```js
{ id: 'zwemmen', label: 'Zwemmen', icoon: '🏊', kleur: '#4FA3D9' },
```

Zet `bijzonder: true` erbij en hij krijgt het gouden randje met het sterretje.

**Ander icoon?** Pas `scripts/maak-iconen.mjs` aan en draai `npm run icons`,
of gooi je eigen PNG's in `assets/`.

**De kaart een andere sfeer geven?** `src/mapStyle.js` is een gewone
Google-Maps-stijl. Je kunt er ook een maken op
[mapstyle.withgoogle.com](https://mapstyle.withgoogle.com) en het resultaat
hierin plakken.

---

## Als er iets niet werkt

**"Bijna klaar!" blijft in beeld** — `.env` is nog niet ingevuld, of de app
heeft hem nog niet gelezen. Stop en start opnieuw met `npx expo start -c`.

**De kaart blijft grijs of leeg** — de Google Maps-sleutel klopt nog niet, of
de *Maps SDK for Android/iOS* staat nog niet aan in Google Cloud. In Expo Go
op Android werkt de sleutel uit `.env` pas na `npx expo start -c`.

**"Missing or insufficient permissions"** — de regels uit `firestore.rules`
staan nog niet in de Firebase-console, of *Anoniem inloggen* staat nog uit.
Heb je een oudere versie van de regels geplakt, haal dan even `git pull` en
plak ze opnieuw.

**Foto's versturen lukt niet** — de app zegt zelf wat er mis is. Meestal
staat de upload-preset nog op *Signed* in plaats van *Unsigned*, of is de
naam van de preset of de cloud name verkeerd overgetypt (let op hoofdletters).

**"Unsupported FormDataPart implementation"** — die hoort er niet meer te
zijn. Kwam je hem tegen op een oudere versie: haal `git pull` en start opnieuw
op. Expo vervangt de globale `fetch` door een strikte variant die geen
bestandsadressen accepteert; de app verstuurt foto's daarom via
XMLHttpRequest.

**"Deze code kennen we niet"** — in onze codes zitten nooit een B, I, L, O, S
of Z; die lijken te veel op 8, 1, 0, 5 en 2. Kijk dus nog eens goed naar de
code die je overtypt.

**Je liefje ziet je niet op de kaart** — check in het Wij-scherm of *Deel
mijn locatie* aan staat, en of de app in de telefooninstellingen bij je
locatie mag.

---

Veel plezier ermee. 💗
