// Even voorstellen: hoe heet je, en welk beestje ben jij?
// Meer hoef je niet in te vullen — geen wachtwoord, geen e-mailadres.

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useApp, emojiKeuzes, kleurKeuzes } from '../src/state/AppProvider';
import { talen } from '../src/taal';
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../src/theme';
import { Titel, Lopend, Knop, Veld, Bolletje } from '../src/components/basis';

export default function Welkom() {
  const { profiel, bewaarProfiel, taal, kiesTaal, t } = useApp();
  const rand = useSafeAreaInsets();

  const [naam, setNaam] = useState(profiel?.naam || '');
  const [emoji, setEmoji] = useState(profiel?.emoji || emojiKeuzes[0]);
  const [kleur, setKleur] = useState(profiel?.kleur || kleurKeuzes[0]);
  const [bezig, setBezig] = useState(false);

  const magVerder = naam.trim().length >= 1;

  async function verder() {
    if (!magVerder) return;
    setBezig(true);
    await bewaarProfiel({ naam: naam.trim(), emoji, kleur });
    setBezig(false);
    router.replace('/koppelen');
  }

  return (
    <KeyboardAvoidingView
      style={stijl.vol}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={verlopen.lucht} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={[
          stijl.inhoud,
          { paddingTop: rand.top + ruimte.xxl, paddingBottom: rand.bottom + ruimte.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={stijl.kop}>
          <Text style={stijl.hartje}>📍</Text>
          <Titel style={{ textAlign: 'center' }}>{t.welkom.vraag}</Titel>
          <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
            {t.welkom.uitleg}
          </Lopend>
        </View>

        <View style={stijl.voorbeeld}>
          <Bolletje emoji={emoji} kleur={kleur} maat={86} />
          <Text style={[stijl.voorbeeldNaam, { color: kleur }]} numberOfLines={1}>
            {naam.trim() || t.welkom.jouwNaam}
          </Text>
        </View>

        <Veld
          label={t.welkom.naamLabel}
          waarde={naam}
          opWijziging={setNaam}
          maxLength={18}
          autoCapitalize="words"
          returnKeyType="done"
          style={{ marginBottom: ruimte.xl }}
        />

        <Text style={stijl.kopje}>{t.welkom.icoonKop}</Text>
        <View style={stijl.raster}>
          {emojiKeuzes.map((keuze) => (
            <Pressable
              key={keuze}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setEmoji(keuze);
              }}
              style={({ pressed }) => [
                stijl.emojiVak,
                emoji === keuze && { borderColor: kleur, backgroundColor: `${kleur}1F` },
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <Text style={stijl.emoji}>{keuze}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[stijl.kopje, { marginTop: ruimte.xl }]}>{t.welkom.kleurKop}</Text>
        <View style={stijl.raster}>
          {kleurKeuzes.map((keuze) => (
            <Pressable
              key={keuze}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setKleur(keuze);
              }}
              style={({ pressed }) => [
                stijl.kleurVak,
                { backgroundColor: keuze },
                kleur === keuze && stijl.kleurGekozen,
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              {kleur === keuze ? <Text style={stijl.kleurVink}>✓</Text> : null}
            </Pressable>
          ))}
        </View>

        <Text style={[stijl.kopje, { marginTop: ruimte.xl }]}>{t.welkom.taalKop}</Text>
        <View style={stijl.raster}>
          {talen.map((keuze) => (
            <Pressable
              key={keuze.code}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                kiesTaal(keuze.code);
              }}
              style={({ pressed }) => [
                stijl.taalVak,
                taal === keuze.code && { borderColor: kleur, backgroundColor: `${kleur}1F` },
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
            >
              <Text style={stijl.taalVlag}>{keuze.vlag}</Text>
              <Text style={stijl.taalNaam}>{keuze.naam}</Text>
            </Pressable>
          ))}
        </View>

        <Knop
          titel={t.algemeen.verder}
          onPress={verder}
          uit={!magVerder}
          bezig={bezig}
          style={{ marginTop: ruimte.xxl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1 },
  inhoud: { paddingHorizontal: ruimte.xl },

  kop: { alignItems: 'center', marginBottom: ruimte.xl },
  hartje: { fontSize: 46, marginBottom: ruimte.s },

  voorbeeld: {
    alignItems: 'center',
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    paddingVertical: ruimte.l,
    marginBottom: ruimte.xl,
    ...schaduw.zacht,
  },
  voorbeeldNaam: {
    fontFamily: letters.vet,
    fontSize: 19,
    marginTop: ruimte.s,
    maxWidth: '80%',
  },

  kopje: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: ruimte.m,
  },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: ruimte.s },

  emojiVak: {
    width: 54,
    height: 54,
    borderRadius: rond.m,
    backgroundColor: kleuren.wit,
    borderWidth: 2,
    borderColor: kleuren.lijn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },

  taalVak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: ruimte.m,
    paddingVertical: ruimte.s,
    borderRadius: rond.vol,
    backgroundColor: kleuren.wit,
    borderWidth: 2,
    borderColor: kleuren.lijn,
  },
  taalVlag: { fontSize: 16 },
  taalNaam: { fontFamily: letters.halfvet, fontSize: 13.5, color: kleuren.inkt },

  kleurVak: {
    width: 44,
    height: 44,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  kleurGekozen: { borderColor: kleuren.wit, ...schaduw.zacht },
  kleurVink: { color: kleuren.wit, fontFamily: letters.vet, fontSize: 18 },
});
