// De buitenste schil van de app: lettertypes laden, het startscherm vasthouden
// tot alles klaar is, en de schermen aan elkaar knopen.

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { Caveat_600SemiBold, Caveat_700Bold } from '@expo-google-fonts/caveat';

import { AppProvider } from '../src/state/AppProvider';
import { kleuren } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Schil() {
  const [lettersKlaar, lettersFout] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Caveat_600SemiBold,
    Caveat_700Bold,
  });

  useEffect(() => {
    // Lukt het laden van de lettertypes niet, dan gaan we gewoon door met het
    // systeemlettertype in plaats van eindeloos op een leeg scherm te blijven.
    if (lettersKlaar || lettersFout) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [lettersKlaar, lettersFout]);

  if (!lettersKlaar && !lettersFout) return null;

  return (
    <GestureHandlerRootView style={stijl.vol}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: kleuren.rozeWolk },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="welkom" options={{ animation: 'fade' }} />
            <Stack.Screen name="koppelen" />
            <Stack.Screen name="(samen)" options={{ animation: 'fade' }} />
            <Stack.Screen
              name="moment/nieuw"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="moment/[id]"
              options={{
                animation: 'slide_from_bottom',
                // Geen wegveeggebaar: dat pakte de veeg van de fotostapel af,
                // waardoor je halverwege het bladeren terugsprong naar de kaart.
                gestureEnabled: false,
              }}
            />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.rozeWolk },
});
