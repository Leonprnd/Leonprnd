// Welke kaart-aanbieder gebruiken we?
//
// Google Maps (met ons eigen roze jasje) kan overal, behalve in Expo Go op een
// iPhone: die app heeft alleen Apple Maps aan boord. Dan vallen we daarop
// terug zodat de app het nog steeds doet — alleen zonder het kleurthema.
// In een eigen build (npx expo run:ios of EAS) krijg je wél Google Maps.

import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';

export const inExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const gebruiktGoogleMaps = !(Platform.OS === 'ios' && inExpoGo);

export const kaartProvider = gebruiktGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

// Het kleurthema hoort bij Google Maps; Apple Maps doet er niets mee.
export function stijlVoorKaart(stijl) {
  return gebruiktGoogleMaps ? stijl : undefined;
}
