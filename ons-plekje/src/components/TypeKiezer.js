// Het kiezen van het soort herinnering. De mijlpalen staan apart bovenaan,
// want dat zijn de momenten waar het echt om gaat.

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { kleuren, letters, ruimte, rond, schaduw } from '../theme';
import { bijzondereTypes, gewoneTypes } from '../momentTypes';

export default function TypeKiezer({ gekozen, opKiezen }) {
  function kies(id) {
    Haptics.selectionAsync().catch(() => {});
    opKiezen(id);
  }

  return (
    <View>
      <Text style={stijl.kopje}>Grote momenten</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={stijl.rij}
      >
        {bijzondereTypes.map((type) => (
          <GrooteTegel
            key={type.id}
            type={type}
            actief={gekozen === type.id}
            opKiezen={() => kies(type.id)}
          />
        ))}
      </ScrollView>

      <Text style={[stijl.kopje, { marginTop: ruimte.l }]}>Wat hebben jullie gedaan?</Text>
      <View style={stijl.raster}>
        {gewoneTypes.map((type) => (
          <KleineTegel
            key={type.id}
            type={type}
            actief={gekozen === type.id}
            opKiezen={() => kies(type.id)}
          />
        ))}
      </View>
    </View>
  );
}

function GrooteTegel({ type, actief, opKiezen }) {
  return (
    <Pressable
      onPress={opKiezen}
      style={({ pressed }) => [
        stijl.groot,
        schaduw.zacht,
        { backgroundColor: actief ? type.kleur : kleuren.wit },
        actief && stijl.grootActief,
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
    >
      <Text style={stijl.grootIcoon}>{type.icoon}</Text>
      <Text
        style={[stijl.grootLabel, { color: actief ? kleuren.wit : kleuren.inkt }]}
        numberOfLines={1}
      >
        {type.label}
      </Text>
      <Text
        style={[stijl.grootZin, { color: actief ? '#FFFFFFCC' : kleuren.inktFluister }]}
        numberOfLines={1}
      >
        {type.zinnetje}
      </Text>
      {actief ? <Text style={stijl.vinkje}>✓</Text> : null}
    </Pressable>
  );
}

function KleineTegel({ type, actief, opKiezen }) {
  return (
    <Pressable
      onPress={opKiezen}
      style={({ pressed }) => [
        stijl.klein,
        {
          backgroundColor: actief ? type.kleur : `${type.kleur}18`,
          borderColor: actief ? type.kleur : `${type.kleur}33`,
        },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text style={stijl.kleinIcoon}>{type.icoon}</Text>
      <Text
        style={[stijl.kleinLabel, { color: actief ? kleuren.wit : kleuren.inkt }]}
        numberOfLines={1}
      >
        {type.label}
      </Text>
    </Pressable>
  );
}

const stijl = StyleSheet.create({
  kopje: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: ruimte.s,
  },
  rij: { gap: ruimte.m, paddingVertical: 4, paddingRight: ruimte.l },

  groot: {
    width: 132,
    borderRadius: rond.m,
    padding: ruimte.m,
    borderWidth: 1.5,
    borderColor: kleuren.lijn,
  },
  grootActief: { borderColor: kleuren.goud, borderWidth: 2 },
  grootIcoon: { fontSize: 26, marginBottom: 6 },
  grootLabel: { fontFamily: letters.vet, fontSize: 14.5 },
  grootZin: { fontFamily: letters.normaal, fontSize: 11.5, marginTop: 2 },
  vinkje: {
    position: 'absolute',
    top: 8,
    right: 10,
    color: kleuren.wit,
    fontFamily: letters.vet,
    fontSize: 14,
  },

  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: ruimte.s },
  klein: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: rond.vol,
    borderWidth: 1.5,
  },
  kleinIcoon: { fontSize: 15 },
  kleinLabel: { fontFamily: letters.halfvet, fontSize: 13.5 },
});
