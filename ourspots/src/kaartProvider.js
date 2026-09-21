// Welke kaart gebruiken we?
//
// Google Maps geeft alleen een werkende sleutel als er een betaalrekening aan
// je project hangt — en daar moet je 18 voor zijn. Daarom kan de app het ook
// zonder: dan tekent MapLibre de kaart uit de vectorgegevens van OpenFreeMap,
// dat geen sleutel en geen account nodig heeft. Zie kaartHtml.js.
//
// De keuze gaat vanzelf: staat er een Google-sleutel in je .env, dan Google
// Maps. Staat die er niet, dan de eigen kaart. Je hoeft dus nooit code aan te
// passen — alleen .env invullen en de app opnieuw starten.

import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const androidSleutel = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY;
const iosSleutel = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY;

export const opWeb = Platform.OS === 'web';

export const inExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Heb je voor dít toestel een sleutel ingevuld? Op het web gebruiken we
// react-native-maps sowieso niet, dus daar telt de sleutel niet mee.
export const heeftGoogleSleutel =
  !opWeb && Boolean(Platform.OS === 'android' ? androidSleutel : iosSleutel);

// Op een iPhone in Expo Go bestaat Google Maps sowieso niet; daar is Apple
// Maps aan boord. Die is gratis en heeft geen sleutel nodig, dus dat is daar
// prima — alleen zonder ons eigen kleurthema.
export const appleMapsInExpoGo = !opWeb && Platform.OS === 'ios' && inExpoGo;

// react-native-maps gebruiken we alleen als dat ook echt iets oplevert.
export const gebruiktNativeKaart = heeftGoogleSleutel || appleMapsInExpoGo;

// Anders: onze eigen kaart in een WebView.
export const gebruiktOpenStreetMap = !gebruiktNativeKaart;

// Het kleurthema is een Google-Maps-ding; Apple Maps doet er niets mee.
export const kleurthemaWerkt = heeftGoogleSleutel;

// De herkomstvermelding staat niet meer apart in beeld: elke kaart draagt hem
// zelf. Google en Apple tekenen hun eigen logo, en onze eigen kaart klapt de
// vermelding van OpenStreetMap op in het rondje rechtsonder.
