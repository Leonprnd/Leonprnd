// Español. Mismas claves que nl.js — ver la nota al principio de ese archivo.

export default {
  naam: 'Español',
  vlag: '🇪🇸',

  app: {
    naam: 'OurSpots',
    partner: 'tu pareja',
  },

  algemeen: {
    verder: 'Continuar',
    opslaan: 'Guardar',
    annuleren: 'Cancelar',
    terug: 'Atrás',
    sluiten: 'Cerrar',
    delen: 'Compartir',
    kopieren: 'Copiar',
    gekopieerd: 'Copiado',
    laten: 'Déjalo',
    weggooien: 'Eliminar',
    aanpassen: 'Editar',
    vandaag: 'Hoy',
    laden: 'Cargando…',
    oeps: 'Algo salió mal',
    dag: 'día',
    dagen: 'días',
    plek: 'lugar',
    plekken: 'lugares',
    foto: 'foto',
    fotos: 'fotos',
  },

  instellen: {
    titel: 'Casi listo',
    tekst: 'La app todavía necesita su conexión con Firebase. Es algo de una sola vez.',
    kop: 'Qué hacer',
    stappen: [
      'Crea un proyecto gratuito en console.firebase.google.com',
      'Activa Authentication con "Anónimo"',
      'Crea una base de datos Firestore (Standard edition)',
      'Añade una app web y copia las claves',
      'Ponlas en el archivo .env (ver .env.example)',
      'Reinicia con npx expo start -c',
    ],
    fotosKop: 'Y para las fotos',
    fotosTekst:
      'Crea una cuenta gratuita en cloudinary.com, pon un upload preset en "Unsigned" bajo Settings > Upload, y añade tu cloud name y ese nombre de preset a tu .env.',
    mistKop: 'Falta en tu .env',
    mistTekst: 'Rellena estas líneas en tu archivo .env y reinicia con npx expo start -c.',
    leesmij: 'README.md explica cada paso.',
  },

  welkom: {
    vraag: '¿Quién eres?',
    uitleg: 'Tu pareja verá este nombre y este icono en vuestro mapa.',
    naamLabel: 'Tu nombre',
    jouwNaam: 'tu nombre',
    icoonKop: 'Elige tu icono',
    kleurKop: 'Y tu color',
    taalKop: 'Idioma',
  },

  koppelen: {
    hoi: (naam) => `Hola ${naam}`,
    uitleg: 'Un paso más: crea vuestro mapa o únete a uno.',
    maakTitel: 'Yo creo el mapa',
    maakTekst: 'Recibirás un código para dárselo a tu pareja cuando quieras.',
    hebCodeTitel: 'Tengo un código',
    hebCodeTekst: 'Introdúcelo y compartiréis el mismo mapa.',

    klaarTitel: 'Tu mapa está listo',
    klaarTekst:
      'Tómate tu tiempo para llenarlo con vuestros lugares. Tu pareja aún no ve nada — el código se lo das cuando estés listo.',
    onzeCode: 'vuestro código',
    codeStaatBij: 'siempre en "Nosotros"',
    beginnen: 'Empezar a añadir lugares',
    geheim: 'Mientras no compartas el código, este mapa es solo tuyo.',
    ofNu: 'O dáselo ya:',
    versturen: 'Enviar',
    opnieuw: 'Empezar de nuevo',

    gekoppeldTitel: 'Ahora compartís un mapa',
    gekoppeldTekst: 'A partir de ahora el mapa es tu pantalla de inicio.',

    invulTitel: 'Introduce el código',
    invulTekst: 'Los seis caracteres que has recibido.',
    codeHint: 'ABC-123',
    koppelen: 'Conectar',
    rareLetters:
      'Nuestros códigos nunca llevan B, I, L, O, S ni Z. Míralo otra vez — seguro que es un 8, una J, una D, un 5 o un 2.',
    berichtDelen: (code) =>
      `He hecho un mapa para nosotros en OurSpots.\n\nNuestro código es ${code} — descarga la app e introdúcelo para ver todos nuestros lugares.`,
  },

  kaart: {
    tabblad: 'Mapa',
    leegTitel: 'Aún no hay lugares',
    leegTekst: 'Mantén pulsado el mapa donde estuvisteis juntos, o toca aquí.',
    partnerGeenLocatie: (naam) => `${naam} no comparte su ubicación`,
    jijGeenLocatie: 'No compartes tu ubicación',
    erbij: (naam) => `${naam} se ha unido`,
    erbijTekst: 'A partir de ahora veis el mismo mapa.',
  },

  tijdlijn: {
    tabblad: 'Historia',
    titel: 'Vuestra historia',
    leegTitel: 'Vuestra historia empieza aquí',
    leegTekst: 'Pon el primer lugar en el mapa y aparecerá aquí.',
    naarKaart: 'Ir al mapa',
    mijlpalen: (n) => `${n} momentos clave`,
    vanaf: (datum) => `desde ${datum}`,
    zonderDatum: 'Sin fecha',
    slot: 'y sigue…',
    slotLeeg: 'añade más lugares',
  },

  wij: {
    tabblad: 'Nosotros',
    nogGeheim: 'aún es un secreto',
    jij: 'Tú',
    partner: 'Tu pareja',
    dagSamen: 'día juntos',
    dagenSamen: 'días juntos',
    mijlpaalOver: (n, wat) => `${n} ${n === 1 ? 'día' : 'días'} para ${wat}`,

    cadeauKop: 'El código',
    cadeauTitel: 'Tu pareja aún no está',
    cadeauTekst:
      'Tómate tu tiempo. Llena el mapa con vuestros lugares y dale el código cuando esté listo. Hasta entonces nadie más ve nada.',
    weggeven: 'Entregar',

    samenSindsKop: 'Juntos desde',
    samenSindsLeeg: 'Pon el día en que empezasteis y la app contará los días.',
    samenSindsGezet: (datum) => `${datum} · lo veis los dos.`,

    locatieKop: 'Ubicación en vivo',
    deelMijn: 'Compartir mi ubicación',
    deelMijnAan: (naam) => `${naam} puede ver dónde estás.`,
    deelMijnUit: 'Ahora mismo no apareces en el mapa.',
    deelMijnAlleen: 'Cuando tu pareja se una, verá dónde estás.',
    partnerGeenLocatie: 'Ahora mismo no comparte ubicación.',
    afstandVan: (afstand) => `a ${afstand} de ti`,
    geenToegangTitel: 'Sin acceso a tu ubicación',
    geenToegangTekst:
      'Activa la ubicación para OurSpots en los ajustes de tu teléfono para veros en el mapa.',

    cijfersKop: 'En números',
    plekken: 'lugares',
    fotos: 'fotos',
    mijlpalen: 'momentos clave',
    mijlpalenKop: 'Vuestros momentos clave',
    eerstePlek: (titel, datum) => `Vuestro primer lugar: ${titel}, ${datum}`,

    profielKop: 'Tu nombre e icono',
    tikAanpassen: 'Toca para editar',
    icoon: 'Icono',
    kleur: 'Color',

    taalKop: 'Idioma',

    herstelKop: 'Si alguien pierde el acceso',
    herstelTekst: 'Si uno de vosotros pierde el acceso — móvil nuevo, app reinstalada, datos del navegador borrados — la app ve a esa persona como alguien nuevo, y el mapa está lleno. Quítala aquí y deja que introduzca el código otra vez; todos los lugares se quedan.',
    herstelKnop: 'Quitar a tu pareja del mapa',
    herstelTitel: '¿Quitar a tu pareja del mapa?',
    herstelBevestig: 'Eso libera un sitio para que tu pareja pueda unirse de nuevo con el mismo código. Todos los lugares y fotos se quedan.',
    codeKop: 'Vuestro código',
    codeTekst: 'Este mapa es de vosotros dos. Nadie más puede entrar.',
    loskoppelen: 'Salir de este mapa',
    loskoppelenTitel: '¿Salir de este mapa?',
    loskoppelenTekst:
      'Saldrás de este mapa. Los lugares seguirán ahí para tu pareja, pero tú no los verás salvo que vuelvas a introducir el código.',
  },

  moment: {
    nieuwTitel: 'Nuevo lugar',
    bewerkTitel: 'Editar lugar',
    zoeken: 'Buscando el sitio…',
    hierWaren: 'Aquí estuvisteis juntos',
    waarLabel: '¿Dónde fue esto?',
    wanneerLabel: 'Cuándo',
    kiesDatum: 'elige una fecha',
    watGebeurde: '¿Qué pasó?',
    watGebeurdeHint: 'Escribe lo que quieres recordar…',
    mijlpalenKop: 'Momentos clave',
    gewoonKop: '¿Qué hicisteis?',
    fotosKop: 'Fotos',
    fotosGeen: 'ninguna aún',
    fotosVan: (n, max) => `${n} de ${max}`,
    kiezen: 'Elegir',
    maken: 'Hacer',
    opDeKaart: 'Ponerlo en el mapa',
    versturenFoto: (n, totaal) => `Enviando foto ${n} de ${totaal}…`,
    vol: (max) => `Máximo ${max} fotos por lugar.`,
    geenToegangFotos:
      'La app aún no puede acceder a tus fotos. Puedes permitirlo en los ajustes del teléfono.',
    geenToegangCamera:
      'La app aún no puede acceder a tu cámara. Puedes permitirlo en los ajustes del teléfono.',
    weggooienTitel: '¿Eliminar?',
    weggooienTekst:
      'Este lugar y sus fotos desaparecen para los dos. No se puede deshacer.',
    weggooienKnop: 'Eliminar este lugar',
    opslaanMislukt: 'No se pudo guardar. ¿Tienes conexión?',

    mijlpaal: 'Momento clave',
    geenFotos: 'Aún no hay fotos en este lugar',
    fotosToevoegen: 'Añadir fotos',
    weg: 'Este lugar ya no existe',
    wegTekst: 'Puede que lo acaben de eliminar.',
    naarKaart: 'Volver al mapa',
    gisteren: 'ayer',
    dagenGeleden: (n) => `hace ${n} días`,
    veegTip: 'desliza para la siguiente',
    vanTotaal: (n, totaal) => `${n} de ${totaal}`,
  },

  fouten: {
    codeOnbekend: 'No conocemos este código. Comprueba que lo has escrito bien.',
    kaartVol: 'Este mapa ya tiene dos personas. Pide un código nuevo.',
    codeMaken: 'No se pudo crear un código. Inténtalo de nuevo.',
    geenNaam: 'Primero escribe tu nombre.',
  },

  types: {
    'eerste-ontmoeting': { label: 'Primera vez que nos vimos', zin: 'Aún no sabíamos nada' },
    'eerste-date': { label: 'Primera cita', zin: 'Donde empezó' },
    'eerste-kus': { label: 'Primer beso', zin: 'Ese momento' },
    samen: { label: 'Juntos', zin: 'Desde aquí somos nosotros' },
    'ik-hou-van-jou': { label: 'Te quiero', zin: 'La primera vez que se dijo' },
    'eerste-feestje': { label: 'Primera fiesta', zin: 'Salir juntos' },
    'eerste-logeren': { label: 'Primera noche juntos', zin: 'La primera noche' },
    jubileum: { label: 'Aniversario', zin: 'Otro año' },

    date: { label: 'Cita' },
    eten: { label: 'Cenar fuera' },
    drinken: { label: 'Tomar algo' },
    film: { label: 'Cine' },
    wandeling: { label: 'Paseo' },
    strand: { label: 'Playa' },
    zonsondergang: { label: 'Atardecer' },
    reis: { label: 'Viaje' },
    feest: { label: 'Fiesta' },
    concert: { label: 'Concierto' },
    verjaardag: { label: 'Cumpleaños' },
    anders: { label: 'Simplemente juntos' },
  },

  afstand: {
    samen: 'Estáis en el mismo sitio',
    bijna: (afstand) => `a ${afstand} el uno del otro`,
    tussen: (afstand) => `${afstand} entre vosotros`,
    verWeg: (afstand) => `a ${afstand} de distancia`,
  },

  tijd: {
    netNu: 'ahora mismo',
    minGeleden: (n) => `hace ${n} min`,
    uurGeleden: (n) => (n === 1 ? 'hace 1 hora' : `hace ${n} horas`),
    gisteren: 'ayer',
    dagenGeleden: (n) => `hace ${n} días`,
  },

  datum: {
    maanden: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    maandenKort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    dagen: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dagkoppen: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
    kiesJaar: 'elige un año',
    tikJaar: 'toca para el año',
  },
};
