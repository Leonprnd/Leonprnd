// Welke kaart gebruiken we?
//
// Google Maps is de mooiste, maar Google geeft alleen een werkende sleutel als
// er een betaalrekening aan je project hangt — en daar moet je 18 voor zijn.
// Daarom kan de app het ook zonder: dan pakt hij OpenStreetMap, dat geen
// sleutel en geen account nodig heeft.
//
// De keuze gaat vanzelf: staat er een Google-sleutel in je .env, dan Google
// Maps. Staat die er niet, dan OpenStreetMap. Je hoeft dus nooit code aan te
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
// prima — alleen zonder ons roze kleurthema.
export const appleMapsInExpoGo = !opWeb && Platform.OS === 'ios' && inExpoGo;

// react-native-maps gebruiken we alleen als dat ook echt iets oplevert.
export const gebruiktNativeKaart = heeftGoogleSleutel || appleMapsInExpoGo;

// Anders: OpenStreetMap in een WebView.
export const gebruiktOpenStreetMap = !gebruiktNativeKaart;

// Het kleurthema is een Google-Maps-ding; Apple Maps doet er niets mee.
export const kleurthemaWerkt = heeftGoogleSleutel;

// Kort zinnetje voor onder in beeld, zodat je weet waar je naar kijkt.
export function kaartHerkomst() {
  if (heeftGoogleSleutel) return null;
  if (opWeb) return '© OpenStreetMap · CARTO';
  if (appleMapsInExpoGo) return 'Apple Maps · vul een Google-sleutel in voor het roze thema';
  return '© OpenStreetMap · CARTO';
}
