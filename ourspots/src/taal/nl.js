// Nederlands. Dit bestand is de maat: en.js en es.js hebben precies dezelfde
// sleutels. Waar een tekst een getal of naam nodig heeft, staat er een functie.

export default {
  naam: 'Nederlands',
  vlag: '🇳🇱',

  app: {
    naam: 'OurSpots',
    partner: 'je partner',
  },

  algemeen: {
    verder: 'Verder',
    opslaan: 'Opslaan',
    annuleren: 'Annuleren',
    terug: 'Terug',
    sluiten: 'Sluiten',
    delen: 'Delen',
    kopieren: 'Kopiëren',
    gekopieerd: 'Gekopieerd',
    laten: 'Laat maar',
    weggooien: 'Verwijderen',
    aanpassen: 'Aanpassen',
    vandaag: 'Vandaag',
    laden: 'Laden…',
    oeps: 'Er ging iets mis',
    dag: 'dag',
    dagen: 'dagen',
    plek: 'plek',
    plekken: 'plekken',
    foto: 'foto',
    fotos: "foto's",
  },

  instellen: {
    titel: 'Bijna klaar',
    tekst: 'De app mist nog zijn verbinding met Firebase. Dat is eenmalig werk.',
    kop: 'Wat je moet doen',
    stappen: [
      'Maak een gratis project op console.firebase.google.com',
      'Zet Authentication aan met "Anoniem"',
      'Maak een Firestore-database (Standard edition)',
      'Voeg een web-app toe en kopieer de sleutels',
      'Zet die in het bestand .env (zie .env.example)',
      'Start opnieuw met npx expo start -c',
    ],
    fotosKop: 'En voor de foto’s',
    fotosTekst:
      'Maak een gratis account op cloudinary.com, zet onder Settings > Upload een upload-preset op "Unsigned", en vul je cloud name en die presetnaam in je .env in.',
    mistKop: 'Dit staat nog niet in je .env',
    mistTekst: 'Vul deze regels in het bestand .env in en start opnieuw op met npx expo start -c.',
    leesmij: 'In README.md staat elke stap uitgeschreven.',
  },

  welkom: {
    vraag: 'Wie ben jij?',
    uitleg: 'Je partner ziet straks deze naam en dit icoon op jullie kaart.',
    naamLabel: 'Je naam',
    jouwNaam: 'jouw naam',
    icoonKop: 'Kies je icoon',
    kleurKop: 'En je kleur',
    taalKop: 'Taal',
  },

  koppelen: {
    hoi: (naam) => `Hoi ${naam}`,
    uitleg: 'Nog één stap: jullie kaart aanmaken of erbij komen.',
    maakTitel: 'Ik maak de kaart',
    maakTekst: 'Je krijgt een code die je later aan je partner geeft.',
    hebCodeTitel: 'Ik heb een code',
    hebCodeTekst: 'Vul hem in en jullie delen dezelfde kaart.',

    klaarTitel: 'Je kaart staat klaar',
    klaarTekst:
      'Vul hem rustig met jullie plekken. Je partner ziet er nog niets van — de code geef je pas als je zover bent.',
    onzeCode: 'jullie code',
    codeStaatBij: 'staat altijd bij "Wij"',
    beginnen: 'Beginnen met plekken',
    geheim: 'Zolang je de code niet deelt, is deze kaart alleen van jou.',
    ofNu: 'Of geef hem nu al:',
    versturen: 'Versturen',
    opnieuw: 'Opnieuw beginnen',

    gekoppeldTitel: 'Jullie delen nu één kaart',
    gekoppeldTekst: 'Vanaf nu is de kaart je startscherm.',

    invulTitel: 'Vul de code in',
    invulTekst: 'De zes tekens die je hebt gekregen.',
    codeHint: 'ABC-123',
    koppelen: 'Koppelen',
    rareLetters:
      'In onze codes zitten nooit een B, I, L, O, S of Z. Kijk nog even goed — het is vast een 8, een J, een D, een 5 of een 2.',
    berichtDelen: (code) =>
      `Ik heb een kaart voor ons gemaakt in OurSpots.\n\nOnze code is ${code} — download de app en vul hem in, dan staan al onze plekken erop.`,
  },

  kaart: {
    tabblad: 'Kaart',
    leegTitel: 'Nog geen plekken',
    leegTekst: 'Houd de kaart ingedrukt op een plek waar jullie samen waren, of tik hier.',
    geheimChip: 'Alleen jij ziet deze kaart — tik om de code te delen',
    partnerGeenLocatie: (naam) => `${naam} deelt nu geen locatie`,
    jijGeenLocatie: 'Je deelt je locatie niet',
    erbij: (naam) => `${naam} is erbij`,
    erbijTekst: 'Vanaf nu zien jullie allebei dezelfde kaart.',
  },

  tijdlijn: {
    tabblad: 'Tijdlijn',
    titel: 'Jullie verhaal',
    leegTitel: 'Jullie verhaal begint hier',
    leegTekst: 'Zet de eerste plek op de kaart, dan komt hij hier te staan.',
    naarKaart: 'Naar de kaart',
    mijlpalen: (n) => `${n} mijlpalen`,
    vanaf: (datum) => `vanaf ${datum}`,
    zonderDatum: 'Zonder datum',
    slot: 'en het gaat verder…',
    slotLeeg: 'zet er meer plekken bij',
  },

  wij: {
    tabblad: 'Wij',
    nogGeheim: 'nog geheim',
    jij: 'Jij',
    partner: 'Je partner',
    dagSamen: 'dag samen',
    dagenSamen: 'dagen samen',
    mijlpaalOver: (n, wat) => `Nog ${n} ${n === 1 ? 'dag' : 'dagen'} tot ${wat}`,

    cadeauKop: 'De code',
    cadeauTitel: 'Je partner is er nog niet',
    cadeauTekst:
      'Neem je tijd. Vul de kaart met jullie plekken en geef de code pas als het af is. Tot die tijd ziet niemand anders iets.',
    weggeven: 'Weggeven',

    samenSindsKop: 'Samen sinds',
    samenSindsLeeg: 'Vul de dag in dat jullie samen kwamen, dan telt de app de dagen.',
    samenSindsGezet: (datum) => `${datum} · dat zien jullie allebei.`,

    locatieKop: 'Live locatie',
    deelMijn: 'Deel mijn locatie',
    deelMijnAan: (naam) => `${naam} ziet waar je bent.`,
    deelMijnUit: 'Je staat nu niet op de kaart.',
    deelMijnAlleen: 'Zodra je partner meedoet, ziet die waar je bent.',
    partnerGeenLocatie: 'Deelt op dit moment geen locatie.',
    afstandVan: (afstand) => `${afstand} van je vandaan`,
    geenToegangTitel: 'Geen toegang tot je locatie',
    geenToegangTekst:
      'Zet locatie voor OurSpots aan in de instellingen van je telefoon om elkaar op de kaart te zien.',

    cijfersKop: 'In cijfers',
    plekken: 'plekken',
    fotos: "foto's",
    mijlpalen: 'mijlpalen',
    mijlpalenKop: 'Jullie mijlpalen',
    eerstePlek: (titel, datum) => `Jullie eerste plek: ${titel}, ${datum}`,

    profielKop: 'Jouw naam en icoon',
    tikAanpassen: 'Tik om aan te passen',
    icoon: 'Icoon',
    kleur: 'Kleur',

    taalKop: 'Taal',
    geluidKop: 'Geluid',
    geluidEffecten: 'Geluidjes',
    geluidEffectenTekst: 'Korte tonen bij opslaan en bladeren.',

    herstelKop: 'Als iemand er niet meer in komt',
    herstelTekst: 'Raakt een van jullie toegang kwijt — nieuwe telefoon, app opnieuw geïnstalleerd, browsergegevens gewist — dan ziet de app die persoon als iemand nieuw. De kaart zit dan vol. Haal hem of haar hier van de kaart en laat de code opnieuw invullen; alle plekken blijven staan.',
    herstelKnop: 'Partner van de kaart halen',
    herstelTitel: 'Partner van de kaart halen?',
    herstelBevestig: 'Er komt dan een plek vrij, zodat je partner opnieuw kan koppelen met dezelfde code. De plekken en foto’s blijven allemaal staan.',
    codeKop: 'Jullie code',
    codeTekst: 'Deze kaart hoort bij jullie twee. Er kan niemand anders bij.',
    loskoppelen: 'Loskoppelen van deze kaart',
    loskoppelenTitel: 'Loskoppelen?',
    loskoppelenTekst:
      'Je gaat van deze kaart af. De plekken blijven staan voor je partner, maar jij ziet ze niet meer tenzij je de code opnieuw invult.',
  },

  moment: {
    nieuwTitel: 'Nieuwe plek',
    bewerkTitel: 'Plek aanpassen',
    zoeken: 'De plek opzoeken…',
    hierWaren: 'Hier waren jullie samen',
    waarLabel: 'Waar was dit?',
    wanneerLabel: 'Wanneer',
    kiesDatum: 'kies een datum',
    watGebeurde: 'Wat gebeurde er?',
    watGebeurdeHint: 'Schrijf op wat je je wilt blijven herinneren…',
    mijlpalenKop: 'Mijlpalen',
    gewoonKop: 'Wat hebben jullie gedaan?',
    fotosKop: "Foto's",
    fotosGeen: 'nog geen',
    fotosVan: (n, max) => `${n} van de ${max}`,
    kiezen: 'Kiezen',
    maken: 'Maken',
    opDeKaart: 'Op de kaart zetten',
    versturenFoto: (n, totaal) => `Foto ${n} van ${totaal} versturen…`,
    vol: (max) => `Maximaal ${max} foto's per plek.`,
    geenToegangFotos:
      'De app mag nog niet bij je foto’s. Dat kun je aanzetten in de instellingen van je telefoon.',
    geenToegangCamera:
      'De app mag nog niet bij je camera. Dat kun je aanzetten in de instellingen van je telefoon.',
    weggooienTitel: 'Verwijderen?',
    weggooienTekst:
      'Deze plek en de foto’s verdwijnen bij jullie allebei. Dat kun je niet terugdraaien.',
    weggooienKnop: 'Deze plek verwijderen',
    opslaanMislukt: 'Opslaan lukte niet. Heb je internet?',

    mijlpaal: 'Mijlpaal',
    geenFotos: 'Nog geen foto’s bij deze plek',
    fotosToevoegen: "Foto's toevoegen",
    weg: 'Deze plek bestaat niet meer',
    wegTekst: 'Misschien is hij net verwijderd.',
    naarKaart: 'Terug naar de kaart',
    gisteren: 'gisteren',
    dagenGeleden: (n) => `${n} dagen geleden`,
    veegTip: 'veeg voor de volgende',
    vanTotaal: (n, totaal) => `${n} van ${totaal}`,
  },

  fouten: {
    codeOnbekend: 'Deze code kennen we niet. Check of je hem goed hebt overgetypt.',
    kaartVol: 'Deze kaart heeft al twee mensen. Vraag om een nieuwe code.',
    codeMaken: 'Het lukt even niet om een code te maken. Probeer het nog eens.',
    geenNaam: 'Vul eerst je naam in.',
  },

  types: {
    'eerste-ontmoeting': { label: 'Eerste keer gezien', zin: 'Toen wisten we nog niks' },
    'eerste-date': { label: 'Eerste date', zin: 'Waar het begon' },
    'eerste-kus': { label: 'Eerste kus', zin: 'Dat ene moment' },
    samen: { label: 'Samen', zin: 'Vanaf hier zijn we wij' },
    'ik-hou-van-jou': { label: 'Ik hou van jou', zin: 'De eerste keer gezegd' },
    'eerste-feestje': { label: 'Eerste feestje', zin: 'Samen uit' },
    'eerste-logeren': { label: 'Eerste keer logeren', zin: 'De eerste nacht' },
    jubileum: { label: 'Jubileum', zin: 'Weer een jaar' },

    date: { label: 'Date' },
    eten: { label: 'Uit eten' },
    drinken: { label: 'Wat drinken' },
    film: { label: 'Film' },
    wandeling: { label: 'Wandeling' },
    strand: { label: 'Strand' },
    zonsondergang: { label: 'Zonsondergang' },
    reis: { label: 'Reis' },
    feest: { label: 'Feestje' },
    concert: { label: 'Concert' },
    verjaardag: { label: 'Verjaardag' },
    anders: { label: 'Gewoon samen' },
  },

  afstand: {
    samen: 'Jullie zijn op dezelfde plek',
    bijna: (afstand) => `${afstand} van elkaar`,
    tussen: (afstand) => `${afstand} tussen jullie in`,
    verWeg: (afstand) => `${afstand} uit elkaar`,
  },

  tijd: {
    netNu: 'net nu',
    minGeleden: (n) => `${n} min geleden`,
    uurGeleden: (n) => (n === 1 ? '1 uur geleden' : `${n} uur geleden`),
    gisteren: 'gisteren',
    dagenGeleden: (n) => `${n} dagen geleden`,
  },

  datum: {
    maanden: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    maandenKort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    dagen: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
    dagkoppen: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
    kiesJaar: 'kies een jaar',
    tikJaar: 'tik voor jaar',
  },
};
