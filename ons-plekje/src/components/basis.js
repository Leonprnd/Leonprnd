// De kleine bouwsteentjes die overal terugkomen: knoppen, invulvelden,
// kaartjes en labels. Zo ziet alles er hetzelfde uit.

import React from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { kleuren, ruimte, rond, letters, schaduw, verlopen } from '../theme';

// --- Tekst ------------------------------------------------------------------

export function Titel({ children, style, klein }) {
  return (
    <Text style={[stijl.titel, klein && stijl.titelKlein, style]}>{children}</Text>
  );
}

export function Kopje({ children, style }) {
  return <Text style={[stijl.kopje, style]}>{children}</Text>;
}

export function Lopend({ children, style, zacht, klein }) {
  return (
    <Text style={[stijl.lopend, zacht && stijl.lopendZacht, klein && stijl.lopendKlein, style]}>
      {children}
    </Text>
  );
}

export function Hand({ children, style }) {
  return <Text style={[stijl.hand, style]}>{children}</Text>;
}

// --- Knoppen ----------------------------------------------------------------

export function Knop({
  titel,
  onPress,
  soort = 'vol',
  bezig,
  uit,
  icoon,
  style,
  klein,
}) {
  const geblokkeerd = uit || bezig;

  function tik(e) {
    if (geblokkeerd) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(e);
  }

  const inhoud = (
    <View style={stijl.knopInhoud}>
      {bezig ? (
        <ActivityIndicator color={soort === 'vol' ? kleuren.wit : kleuren.roze} />
      ) : (
        <>
          {icoon ? <Text style={stijl.knopIcoon}>{icoon}</Text> : null}
          <Text
            style={[
              stijl.knopTekst,
              soort !== 'vol' && stijl.knopTekstZacht,
              klein && stijl.knopTekstKlein,
            ]}
          >
            {titel}
          </Text>
        </>
      )}
    </View>
  );

  if (soort === 'vol') {
    return (
      <Pressable
        onPress={tik}
        disabled={geblokkeerd}
        style={({ pressed }) => [
          stijl.knop,
          klein && stijl.knopKlein,
          schaduw.zacht,
          pressed && stijl.ingedrukt,
          geblokkeerd && stijl.knopUit,
          style,
        ]}
      >
        <LinearGradient
          colors={verlopen.roze}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {inhoud}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={tik}
      disabled={geblokkeerd}
      style={({ pressed }) => [
        stijl.knop,
        klein && stijl.knopKlein,
        soort === 'rand' ? stijl.knopRand : stijl.knopZacht,
        pressed && stijl.ingedrukt,
        geblokkeerd && stijl.knopUit,
        style,
      ]}
    >
      {inhoud}
    </Pressable>
  );
}

export function TekstKnop({ titel, onPress, style, kleur }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [pressed && { opacity: 0.55 }, style]}
    >
      <Text style={[stijl.tekstKnop, kleur && { color: kleur }]}>{titel}</Text>
    </Pressable>
  );
}

// --- Invoer -----------------------------------------------------------------

export function Veld({
  label,
  waarde,
  opWijziging,
  hint,
  regels,
  style,
  ...rest
}) {
  return (
    <View style={[stijl.veldRand, style]}>
      {label ? <Text style={stijl.veldLabel}>{label}</Text> : null}
      <TextInput
        value={waarde}
        onChangeText={opWijziging}
        placeholder={hint}
        placeholderTextColor={kleuren.inktFluister}
        multiline={Boolean(regels && regels > 1)}
        style={[
          stijl.veld,
          regels && regels > 1 && {
            minHeight: 22 * Math.max(2, regels),
            textAlignVertical: 'top',
          },
        ]}
        {...rest}
      />
    </View>
  );
}

// --- Vlakken ----------------------------------------------------------------

export function Kaartje({ children, style, zwevend }) {
  return (
    <View style={[stijl.kaartje, zwevend ? schaduw.kaart : schaduw.zacht, style]}>
      {children}
    </View>
  );
}

export function Chip({ tekst, icoon, kleur = kleuren.roze, style, klein }) {
  return (
    <View
      style={[
        stijl.chip,
        klein && stijl.chipKlein,
        { backgroundColor: `${kleur}22`, borderColor: `${kleur}55` },
        style,
      ]}
    >
      {icoon ? <Text style={klein ? stijl.chipIcoonKlein : stijl.chipIcoon}>{icoon}</Text> : null}
      <Text style={[stijl.chipTekst, klein && stijl.chipTekstKlein, { color: kleur }]}>
        {tekst}
      </Text>
    </View>
  );
}

export function Leeg({ icoon, titel, tekst, children }) {
  return (
    <View style={stijl.leeg}>
      <Text style={stijl.leegIcoon}>{icoon}</Text>
      <Text style={stijl.leegTitel}>{titel}</Text>
      {tekst ? <Text style={stijl.leegTekst}>{tekst}</Text> : null}
      {children}
    </View>
  );
}

// De bolletjes met een emoji erin: jullie twee.
export function Bolletje({ emoji, kleur = kleuren.roze, maat = 44, rand = true, style }) {
  return (
    <View
      style={[
        {
          width: maat,
          height: maat,
          borderRadius: maat / 2,
          backgroundColor: `${kleur}2E`,
          borderWidth: rand ? 2.5 : 0,
          borderColor: kleur,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: maat * 0.5 }}>{emoji || '💗'}</Text>
    </View>
  );
}

const stijl = StyleSheet.create({
  titel: {
    fontFamily: letters.vet,
    fontSize: 27,
    color: kleuren.inkt,
    letterSpacing: -0.4,
  },
  titelKlein: { fontSize: 20 },
  kopje: {
    fontFamily: letters.halfvet,
    fontSize: 13,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
  },
  lopend: {
    fontFamily: letters.normaal,
    fontSize: 15.5,
    lineHeight: 23,
    color: kleuren.inkt,
  },
  lopendZacht: { color: kleuren.inktZacht },
  lopendKlein: { fontSize: 13.5, lineHeight: 19 },
  hand: {
    fontFamily: letters.handVet,
    fontSize: 26,
    color: kleuren.rozeDiep,
  },

  knop: {
    height: 54,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: kleuren.roze,
  },
  knopKlein: { height: 42, paddingHorizontal: ruimte.l },
  knopZacht: { backgroundColor: kleuren.rozeZacht },
  knopRand: {
    backgroundColor: kleuren.wit,
    borderWidth: 1.5,
    borderColor: kleuren.lijn,
  },
  knopUit: { opacity: 0.45 },
  ingedrukt: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  knopInhoud: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  knopIcoon: { fontSize: 17 },
  knopTekst: {
    fontFamily: letters.vet,
    fontSize: 16.5,
    color: kleuren.wit,
  },
  knopTekstZacht: { color: kleuren.rozeDiep },
  knopTekstKlein: { fontSize: 14.5 },
  tekstKnop: {
    fontFamily: letters.halfvet,
    fontSize: 15,
    color: kleuren.rozeDiep,
  },

  veldRand: {
    backgroundColor: kleuren.wit,
    borderRadius: rond.m,
    borderWidth: 1.5,
    borderColor: kleuren.lijn,
    paddingHorizontal: ruimte.l,
    paddingTop: ruimte.m,
    paddingBottom: ruimte.m,
  },
  veldLabel: {
    fontFamily: letters.halfvet,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: 4,
  },
  veld: {
    fontFamily: letters.normaal,
    fontSize: 16,
    color: kleuren.inkt,
    padding: 0,
  },

  kaartje: {
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.l,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: rond.vol,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipKlein: { paddingHorizontal: 8, paddingVertical: 3, gap: 3 },
  chipIcoon: { fontSize: 14 },
  chipIcoonKlein: { fontSize: 11 },
  chipTekst: { fontFamily: letters.halfvet, fontSize: 13 },
  chipTekstKlein: { fontSize: 11 },

  leeg: { alignItems: 'center', paddingHorizontal: ruimte.xl, paddingVertical: ruimte.xxl },
  leegIcoon: { fontSize: 46, marginBottom: ruimte.m },
  leegTitel: {
    fontFamily: letters.vet,
    fontSize: 19,
    color: kleuren.inkt,
    textAlign: 'center',
  },
  leegTekst: {
    fontFamily: letters.normaal,
    fontSize: 15,
    lineHeight: 22,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: 6,
  },
});
