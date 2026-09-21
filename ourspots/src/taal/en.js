// English. Same keys as nl.js — see the note at the top of that file.

export default {
  naam: 'English',
  vlag: '🇬🇧',

  app: {
    naam: 'OurSpots',
    partner: 'your partner',
  },

  algemeen: {
    verder: 'Continue',
    opslaan: 'Save',
    annuleren: 'Cancel',
    terug: 'Back',
    sluiten: 'Close',
    delen: 'Share',
    kopieren: 'Copy',
    gekopieerd: 'Copied',
    laten: 'Never mind',
    weggooien: 'Delete',
    aanpassen: 'Edit',
    vandaag: 'Today',
    laden: 'Loading…',
    oeps: 'Something went wrong',
    dag: 'day',
    dagen: 'days',
    plek: 'spot',
    plekken: 'spots',
    foto: 'photo',
    fotos: 'photos',
  },

  instellen: {
    titel: 'Almost there',
    tekst: 'The app still needs its connection to Firebase. This is a one-time setup.',
    kop: 'What to do',
    stappen: [
      'Create a free project at console.firebase.google.com',
      'Turn on Authentication with "Anonymous"',
      'Create a Firestore database (Standard edition)',
      'Add a web app and copy the keys',
      'Put them in the .env file (see .env.example)',
      'Restart with npx expo start -c',
    ],
    fotosKop: 'And for the photos',
    fotosTekst:
      'Create a free account at cloudinary.com, set an upload preset to "Unsigned" under Settings > Upload, and put your cloud name and that preset name in your .env.',
    mistKop: 'Missing from your .env',
    mistTekst: 'Fill in these lines in your .env file and restart with npx expo start -c.',
    leesmij: 'README.md walks through every step.',
  },

  welkom: {
    vraag: 'Who are you?',
    uitleg: 'Your partner will see this name and icon on your map.',
    naamLabel: 'Your name',
    jouwNaam: 'your name',
    icoonKop: 'Pick your icon',
    kleurKop: 'And your colour',
    taalKop: 'Language',
  },

  koppelen: {
    hoi: (naam) => `Hi ${naam}`,
    uitleg: 'One more step: create your map or join one.',
    maakTitel: 'I’ll make the map',
    maakTekst: 'You get a code to give your partner whenever you want.',
    hebCodeTitel: 'I have a code',
    hebCodeTekst: 'Enter it and you’ll share the same map.',

    klaarTitel: 'Your map is ready',
    klaarTekst:
      'Take your time filling it with your spots. Your partner sees nothing yet — you hand over the code when you’re ready.',
    onzeCode: 'your code',
    codeStaatBij: 'always under "Us"',
    beginnen: 'Start adding spots',
    geheim: 'As long as you keep the code, this map is yours alone.',
    ofNu: 'Or hand it over now:',
    versturen: 'Send',
    opnieuw: 'Start over',

    gekoppeldTitel: 'You now share one map',
    gekoppeldTekst: 'From now on the map is your home screen.',

    invulTitel: 'Enter the code',
    invulTekst: 'The six characters you were given.',
    codeHint: 'ABC-123',
    koppelen: 'Connect',
    rareLetters:
      'Our codes never contain B, I, L, O, S or Z. Look again — it is probably an 8, a J, a D, a 5 or a 2.',
    berichtDelen: (code) =>
      `I made a map for us in OurSpots.\n\nOur code is ${code} — download the app and enter it to see all our spots.`,
  },

  kaart: {
    tabblad: 'Map',
    leegTitel: 'No spots yet',
    leegTekst: 'Press and hold the map somewhere you were together, or tap here.',
    partnerGeenLocatie: (naam) => `${naam} isn’t sharing a location`,
    jijGeenLocatie: 'You’re not sharing your location',
    erbij: (naam) => `${naam} joined`,
    erbijTekst: 'You both see the same map from now on.',
  },

  tijdlijn: {
    tabblad: 'Timeline',
    titel: 'Your story',
    leegTitel: 'Your story starts here',
    leegTekst: 'Put the first spot on the map and it will show up here.',
    naarKaart: 'Go to the map',
    mijlpalen: (n) => `${n} milestones`,
    vanaf: (datum) => `since ${datum}`,
    zonderDatum: 'No date',
    slot: 'and it keeps going…',
    slotLeeg: 'add more spots',
  },

  wij: {
    tabblad: 'Us',
    nogGeheim: 'still a secret',
    jij: 'You',
    partner: 'Your partner',
    dagSamen: 'day together',
    dagenSamen: 'days together',
    mijlpaalOver: (n, wat) => `${n} ${n === 1 ? 'day' : 'days'} until ${wat}`,

    cadeauKop: 'The code',
    cadeauTitel: 'Your partner isn’t here yet',
    cadeauTekst:
      'Take your time. Fill the map with your spots and hand over the code when it’s done. Until then nobody else sees anything.',
    weggeven: 'Hand over',

    samenSindsKop: 'Together since',
    samenSindsLeeg: 'Set the day you got together and the app will count the days.',
    samenSindsGezet: (datum) => `${datum} · you both see this.`,

    locatieKop: 'Live location',
    deelMijn: 'Share my location',
    deelMijnAan: (naam) => `${naam} can see where you are.`,
    deelMijnUit: 'You’re not on the map right now.',
    deelMijnAlleen: 'Once your partner joins, they’ll see where you are.',
    partnerGeenLocatie: 'Not sharing a location right now.',
    afstandVan: (afstand) => `${afstand} away`,
    geenToegangTitel: 'No access to your location',
    geenToegangTekst:
      'Turn on location for OurSpots in your phone settings to see each other on the map.',

    cijfersKop: 'In numbers',
    plekken: 'spots',
    fotos: 'photos',
    mijlpalen: 'milestones',
    mijlpalenKop: 'Your milestones',
    eerstePlek: (titel, datum) => `Your first spot: ${titel}, ${datum}`,

    profielKop: 'Your name and icon',
    tikAanpassen: 'Tap to edit',
    icoon: 'Icon',
    kleur: 'Colour',

    taalKop: 'Language',

    herstelKop: 'If someone gets locked out',
    herstelTekst: 'If one of you loses access — new phone, app reinstalled, browser data cleared — the app sees that person as someone new, and the map is full. Remove them here and let them enter the code again; every spot stays.',
    herstelKnop: 'Remove partner from the map',
    herstelTitel: 'Remove partner from the map?',
    herstelBevestig: 'That frees a slot so your partner can join again with the same code. All spots and photos stay.',
    codeKop: 'Your code',
    codeTekst: 'This map belongs to the two of you. Nobody else can get in.',
    loskoppelen: 'Leave this map',
    loskoppelenTitel: 'Leave this map?',
    loskoppelenTekst:
      'You’ll be removed from this map. The spots stay for your partner, but you won’t see them again unless you enter the code.',
  },

  moment: {
    nieuwTitel: 'New spot',
    bewerkTitel: 'Edit spot',
    zoeken: 'Looking up the place…',
    hierWaren: 'You were here together',
    waarLabel: 'Where was this?',
    wanneerLabel: 'When',
    kiesDatum: 'pick a date',
    watGebeurde: 'What happened?',
    watGebeurdeHint: 'Write down what you want to remember…',
    mijlpalenKop: 'Milestones',
    gewoonKop: 'What did you do?',
    fotosKop: 'Photos',
    fotosGeen: 'none yet',
    fotosVan: (n, max) => `${n} of ${max}`,
    kiezen: 'Choose',
    maken: 'Take',
    opDeKaart: 'Put it on the map',
    versturenFoto: (n, totaal) => `Sending photo ${n} of ${totaal}…`,
    vol: (max) => `Up to ${max} photos per spot.`,
    geenToegangFotos:
      'The app can’t reach your photos yet. You can allow that in your phone settings.',
    geenToegangCamera:
      'The app can’t reach your camera yet. You can allow that in your phone settings.',
    weggooienTitel: 'Delete?',
    weggooienTekst:
      'This spot and its photos disappear for both of you. This cannot be undone.',
    weggooienKnop: 'Delete this spot',
    opslaanMislukt: 'Saving failed. Are you online?',

    mijlpaal: 'Milestone',
    geenFotos: 'No photos on this spot yet',
    fotosToevoegen: 'Add photos',
    weg: 'This spot no longer exists',
    wegTekst: 'It may have just been deleted.',
    naarKaart: 'Back to the map',
    gisteren: 'yesterday',
    dagenGeleden: (n) => `${n} days ago`,
    veegTip: 'swipe for the next one',
    vanTotaal: (n, totaal) => `${n} of ${totaal}`,
  },

  fouten: {
    codeOnbekend: 'We don’t know this code. Check that you typed it correctly.',
    kaartVol: 'This map already has two people on it. Ask for a new code.',
    codeMaken: 'Creating a code didn’t work. Please try again.',
    geenNaam: 'Enter your name first.',
  },

  types: {
    'eerste-ontmoeting': { label: 'First time we met', zin: 'We had no idea yet' },
    'eerste-date': { label: 'First date', zin: 'Where it started' },
    'eerste-kus': { label: 'First kiss', zin: 'That one moment' },
    samen: { label: 'Together', zin: 'From here on it’s us' },
    'ik-hou-van-jou': { label: 'I love you', zin: 'The first time said' },
    'eerste-feestje': { label: 'First party', zin: 'Out together' },
    'eerste-logeren': { label: 'First night over', zin: 'The first night' },
    jubileum: { label: 'Anniversary', zin: 'Another year' },

    date: { label: 'Date' },
    eten: { label: 'Dinner out' },
    drinken: { label: 'Drinks' },
    film: { label: 'Film' },
    wandeling: { label: 'Walk' },
    strand: { label: 'Beach' },
    zonsondergang: { label: 'Sunset' },
    reis: { label: 'Trip' },
    feest: { label: 'Party' },
    concert: { label: 'Concert' },
    verjaardag: { label: 'Birthday' },
    anders: { label: 'Just together' },
  },

  afstand: {
    samen: 'You’re in the same place',
    bijna: (afstand) => `${afstand} apart`,
    tussen: (afstand) => `${afstand} between you`,
    verWeg: (afstand) => `${afstand} apart`,
  },

  tijd: {
    netNu: 'just now',
    minGeleden: (n) => `${n} min ago`,
    uurGeleden: (n) => (n === 1 ? '1 hour ago' : `${n} hours ago`),
    gisteren: 'yesterday',
    dagenGeleden: (n) => `${n} days ago`,
  },

  datum: {
    maanden: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    maandenKort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dagen: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dagkoppen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    kiesJaar: 'pick a year',
    tikJaar: 'tap for year',
  },
};
