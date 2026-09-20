# Ons Plekje 💌

Een kaart van jullie samen. Je zet pinpoints op de plekken waar jullie zijn
geweest, met de datum, een verhaaltje en foto's die als polaroids op elkaar
liggen. Je maakt de kaart als cadeau, geeft je liefje de code, en vanaf dat
moment kunnen jullie er allebei plekjes bij zetten — en zien jullie elkaar
live op de kaart staan.

Gemaakt voor de telefoon, met Expo (React Native), Firebase en Google Maps.

---

## Wat je gaat doen

De app is af, maar hij moet nog aan twee gratis diensten van Google gekoppeld
worden: **Firebase** (waar jullie kaart en foto's staan) en **Google Maps**
(de kaart zelf). Dat is eenmalig, en kost ongeveer twintig minuten.

Daarna: `npm start`, QR-code scannen, en de app draait op je telefoon.

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
cd ons-plekje
npm install
```

Zet ook de **Expo Go**-app op je telefoon (gratis, in de App Store of
Play Store). Daarmee test je de app zonder dat je hem hoeft te publiceren.

---

## Stap 1 — Firebase (jullie kaart en foto's)

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com)
   en log in met je Google-account.
2. Klik **Project toevoegen**. Noem het bijvoorbeeld `ons-plekje`.
   Google Analytics mag je uitzetten — dat heb je niet nodig.
3. **Authentication** aanzetten:
   - Linksin het menu: *Build → Authentication → Aan de slag*.
   - Tabblad **Sign-in method** → klik **Anoniem** → zet aan → **Opslaan**.
   - Hiermee krijgt iedereen stilletjes een account. Geen wachtwoorden,
     geen e-mailadressen. De koppelcode is wat jullie verbindt.
4. **Firestore Database** aanmaken:
   - *Build → Firestore Database → Database maken*.
   - Kies locatie **eur3 (europe-west)** — dat is het dichtstbij.
   - Start in **productiemodus** (de regels zetten we zo goed).
5. **Storage** aanmaken (voor de foto's):
   - *Build → Storage → Aan de slag*. Zelfde locatie.
   - Firebase vraagt je hier om over te stappen op het **Blaze-plan**
     (betalen naar gebruik). Sinds februari 2026 kan Storage niet meer
     zonder gekoppelde betaalrekening. Je moet dus een creditcard invullen,
     maar de eerste 5 GB blijft gratis — en jullie foto's halen dat nooit.
     In stap 2b hieronder zet je een budgetmelding, zodat je het zou merken.
6. **De sleutels ophalen:**
   - Klik op het tandwiel linksboven → **Projectinstellingen**.
   - Scroll naar **Je apps** → klik op het **web-icoontje `</>`**.
   - Geef het een naam (`Ons Plekje`) en klik **App registreren**.
   - Je krijgt nu een blokje code te zien met `apiKey`, `authDomain`,
     enzovoort. **Die heb je straks nodig** — laat dit scherm open staan.

### De beveiligingsregels erin zetten

Dit is belangrijk: zonder deze regels kan iedereen bij jullie foto's.

- **Firestore:** ga naar *Firestore Database → Regels*. Verwijder wat er staat,
  plak de inhoud van [`firestore.rules`](./firestore.rules) erin, klik
  **Publiceren**.
- **Storage:** ga naar *Storage → Regels*. Zelfde verhaal met
  [`storage.rules`](./storage.rules).

Wat die regels doen: een kaart hoort bij precies twee accounts. Alleen die
twee kunnen de pinpoints en foto's zien of aanpassen. Iemand anders kan de
kaart alleen openen op het moment dat er nog maar één persoon op staat — dat
is precies wanneer je liefje de code invult.

---

## Stap 2 — Google Maps

De kaart zelf komt van Google. Daar heb je een sleutel voor nodig.

1. Ga naar [console.cloud.google.com](https://console.cloud.google.com).
   Kies linksboven **hetzelfde project** dat Firebase net heeft aangemaakt.
2. Ga naar *API's en services → Bibliotheek*. Zoek en zet **aan**:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** (alleen nodig als je een iPhone hebt)
3. Ga naar *API's en services → Inloggegevens → Gegevens maken → API-sleutel*.
   Kopieer de sleutel die je krijgt.
4. Klik op de sleutel om hem te beperken (aanrader): onder
   **API-beperkingen** vink je alleen de twee Maps SDK's aan die je net
   aanzette.

> **Over de kosten:** de *Maps SDK for Android* en *Maps SDK for iOS* zijn
> gratis en onbeperkt — de kaart in de app kost dus nooit iets, hoe vaak je
> hem ook opent. De creditcard is alleen nodig omdat Google Cloud er een aan
> je account wil hebben (dezelfde die je bij Storage hebt ingevuld).
>
> De app gebruikt verder geen betaalde onderdelen: het opzoeken van de
> plaatsnaam gebeurt door je telefoon zelf, niet via de Geocoding API.

---

## Stap 2b — Zet een budgetmelding op €0 (aanrader)

Nu er een creditcard aan hangt, is dit het knopje waardoor je rustig slaapt.

1. Ga naar [Budgetten en meldingen](https://console.cloud.google.com/billing/budgets).
2. **Budget maken** → geef het een naam → bij *Bedrag* kies **Aangepast** en
   vul `1` euro in.
3. Zet de meldingen op **50%, 90% en 100%**.

Je krijgt nu een mailtje zodra er ook maar 50 cent aan kosten ontstaat. In
de praktijk gebeurt dat niet, maar dan weet je het meteen.

---

## Stap 3 — De sleutels invullen

Maak in de map `ons-plekje` een bestand dat precies `.env` heet (met de punt
ervoor). Het makkelijkst:

```bash
cp .env.example .env
```

Open `.env` en vul in wat je in stap 1 en 2 hebt opgehaald:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ons-plekje.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ons-plekje
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=ons-plekje.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123

EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=AIza...
EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY=AIza...
```

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

Expo Go is prima om te testen, maar als cadeau wil je een echte app met het
eigen icoontje. Dat gaat met **EAS Build** (gratis voor een paar builds per
maand):

```bash
npm install -g eas-cli
eas login              # maak gratis een account op expo.dev
eas build:configure
```

**Android** (makkelijkst — je krijgt een bestand dat je kunt installeren):

```bash
eas build --platform android --profile preview
```

Je krijgt een link naar een `.apk`. Die stuur je naar je liefje; op Android
installeer je hem rechtstreeks (even "onbekende bronnen" toestaan).

**iPhone** is strenger: daarvoor heb je een Apple Developer-account nodig
(€99 per jaar) óf je gebruikt een gratis build op je eigen telefoon die na
zeven dagen verloopt:

```bash
eas build --platform ios --profile development
```

Wil je liever eerst gewoon lokaal draaien met Google Maps erbij:

```bash
npx expo run:android      # of: npx expo run:ios
```

---

## Hoe de app werkt

**De eerste keer**
Je vult je naam in en kiest een icoontje en kleur. Dan kies je: *ik maak de
kaart* (je krijgt een code) of *ik heb een code gekregen*. Zodra de tweede
persoon de code invult, zijn jullie gekoppeld en is de kaart vanaf dat moment
het startscherm.

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

**Live locatie** — staat standaard aan, zoals afgesproken. Je positie wordt
hooguit elke twintig seconden bijgewerkt, en alleen als je meer dan veertig
meter bent verplaatst; dat scheelt accu. In het Wij-scherm zet je het met één
tik uit, en dan verdwijnt je stip meteen bij je liefje. Alleen jullie twee
kunnen die locatie zien.

---

## Wat waar staat

```
ons-plekje/
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

**Foto's uploaden lukt niet** — check of Storage is aangemaakt en of
`storage.rules` erin staat. Kijk ook of `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
precies overeenkomt met wat in de Firebase-console staat.

**"Deze code kennen we niet"** — in onze codes zitten nooit een B, I, L, O, S
of Z; die lijken te veel op 8, 1, 0, 5 en 2. Kijk dus nog eens goed naar de
code die je overtypt.

**Je liefje ziet je niet op de kaart** — check in het Wij-scherm of *Deel
mijn locatie* aan staat, en of de app in de telefooninstellingen bij je
locatie mag.

---

Veel plezier ermee. 💗
