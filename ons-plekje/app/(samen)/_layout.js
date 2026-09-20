// De drie tabbladen zodra jullie gekoppeld zijn: de kaart, de tijdlijn en
// alles over jullie tweeën.

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/state/AppProvider';
import { kleuren, letters, rond } from '../../src/theme';

const TABBLADEN = [
  { naam: 'kaart', label: 'Kaart', icoon: '🗺️' },
  { naam: 'tijdlijn', label: 'Tijdlijn', icoon: '📖' },
  { naam: 'wij', label: 'Wij', icoon: '💞' },
];

export default function SamenSchil() {
  const { klaar, kaartGeladen, gekoppeld } = useApp();
  const rand = useSafeAreaInsets();

  // Niet (meer) gekoppeld? Dan hoor je hier niet te zijn.
  if (klaar && kaartGeladen && !gekoppeld) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          stijl.balk,
          { height: 58 + rand.bottom, paddingBottom: rand.bottom },
        ],
        tabBarItemStyle: { paddingTop: 6 },
        tabBarActiveTintColor: kleuren.rozeDiep,
        tabBarInactiveTintColor: kleuren.inktFluister,
        tabBarLabelStyle: stijl.label,
        sceneStyle: { backgroundColor: kleuren.rozeWolk },
      }}
    >
      {TABBLADEN.map((blad) => (
        <Tabs.Screen
          key={blad.naam}
          name={blad.naam}
          options={{
            title: blad.label,
            tabBarIcon: ({ focused }) => (
              <View style={[stijl.icoonVak, focused && stijl.icoonActief]}>
                <Text style={[stijl.icoon, focused && stijl.icoonGroot]}>{blad.icoon}</Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const stijl = StyleSheet.create({
  balk: {
    backgroundColor: kleuren.wit,
    borderTopWidth: 1,
    borderTopColor: kleuren.lijn,
    ...Platform.select({
      ios: {
        shadowColor: '#B5657E',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 12 },
    }),
  },
  label: { fontFamily: letters.halfvet, fontSize: 11, marginTop: -2 },
  icoonVak: {
    width: 34,
    height: 26,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoonActief: { backgroundColor: kleuren.rozeZacht },
  icoon: { fontSize: 15 },
  icoonGroot: { fontSize: 17 },
});
