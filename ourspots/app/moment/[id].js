// Eén herinnering helemaal.
//
// Bovenaan de fotostapel: polaroids die je opzij kunt vegen. Daaronder waar
// het was, wanneer, en wat er gebeurde.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useApp } from '../../src/state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw } from '../../src/theme';
import { Lopend, Chip, Leeg, Knop } from '../../src/components/basis';
import FotoStapel from '../../src/components/FotoStapel';
import Hartjes from '../../src/components/Hartjes';
import { typeVan } from '../../src/momentTypes';
import { datumMetDag, dagenSinds } from '../../src/utils/datum';
import { zetHartje } from '../../src/services/momenten';

export default function MomentDetail() {
  const { id } = useLocalSearchParams();
  const { momenten, momentenGeladen, code, uid, partner, t } = useApp();
  const rand = useSafeAreaInsets();

  const [feest, setFeest] = useState(false);

  const moment = useMemo(() => momenten.find((m) => m.id === id), [momenten, id]);

  if (!moment) {
    return (
      <View style={[stijl.vol, stijl.midden]}>
        <Leeg
          icoon={momentenGeladen ? '🫧' : '⏳'}
          titel={momentenGeladen ? t.moment.weg : t.algemeen.laden}
          tekst={momentenGeladen ? t.moment.wegTekst : undefined}
        >
          {momentenGeladen ? (
            <Knop
              titel={t.moment.naarKaart}
              soort="zacht"
              onPress={() => router.replace('/(samen)/kaart')}
              style={{ marginTop: ruimte.l, paddingHorizontal: ruimte.xl }}
            />
          ) : null}
        </Leeg>
      </View>
    );
  }

  const type = typeVan(moment.type);
  const fotos = moment.fotos || [];
  const mijnHartje = Boolean(moment.hartjes?.[uid]);
  const partnerHartje = partner ? Boolean(moment.hartjes?.[partner.uid]) : false;

  const dagenGeleden = dagenSinds(moment.datum);

  async function tikHartje() {
    if (!code) return;
    const nieuw = !mijnHartje;
    Haptics.impactAsync(
      nieuw ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    ).catch(() => {});
    if (nieuw) {
      setFeest(true);
      setTimeout(() => setFeest(false), 2600);
    }
    try {
      await zetHartje(code, moment.id, uid, nieuw);
    } catch {
      // Zonder internet lukt het niet; de volgende keer wel.
    }
  }

  async function deel() {
    try {
      await Share.share({
        message:
          `${type.icoon} ${moment.titel}\n${datumMetDag(moment.datum)}\n\n` +
          `${moment.beschrijving || ''}`.trim(),
      });
    } catch {
      // Afgebroken, niets aan de hand.
    }
  }

  return (
    <View style={stijl.vol}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: rand.bottom + ruimte.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Bovenkant met de fotostapel --- */}
        <LinearGradient
          colors={[`${type.kleur}33`, kleuren.rozeWolk]}
          style={[stijl.bovenkant, { paddingTop: rand.top + 58 }]}
        >
          {fotos.length ? (
            <FotoStapel
              fotos={fotos}
              datum={moment.datum}
              sleutel={moment.id}
              hoogte={330}
            />
          ) : (
            <View style={stijl.geenFotos}>
              <Text style={stijl.geenFotosIcoon}>{type.icoon}</Text>
              <Text style={stijl.geenFotosTekst}>{t.moment.geenFotos}</Text>
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/moment/nieuw', params: { bewerk: moment.id } })
                }
              >
                <Text style={stijl.geenFotosKnop}>{t.moment.fotosToevoegen}</Text>
              </Pressable>
            </View>
          )}
        </LinearGradient>

        {/* --- De tekst --- */}
        <View style={stijl.inhoud}>
          <View style={stijl.chipRij}>
            <Chip tekst={t.types[type.id].label} icoon={type.icoon} kleur={type.kleur} />
            {type.bijzonder ? (
              <Chip tekst={t.moment.mijlpaal} icoon="💖" kleur={kleuren.rozeDiep} />
            ) : null}
          </View>

          <Text style={stijl.titel}>{moment.titel}</Text>
          <Text style={stijl.datum}>{datumMetDag(moment.datum)}</Text>

          {dagenGeleden != null && dagenGeleden > 0 ? (
            <Text style={stijl.geleden}>
              {dagenGeleden === 1 ? t.moment.gisteren : t.moment.dagenGeleden(dagenGeleden)}
            </Text>
          ) : null}

          {moment.adres ? (
            <View style={stijl.adresRij}>
              <Text style={stijl.adresIcoon}>📍</Text>
              <Lopend zacht klein style={{ flex: 1 }}>
                {moment.adres}
              </Lopend>
            </View>
          ) : null}

          {moment.beschrijving ? (
            <View style={[stijl.briefje, schaduw.zacht]}>
              <Text style={stijl.briefjeTekst}>{moment.beschrijving}</Text>
            </View>
          ) : null}

          {/* --- Knoppen --- */}
          <View style={stijl.knopRij}>
            <Pressable
              onPress={tikHartje}
              hitSlop={10}
              style={({ pressed }) => [
                stijl.hartKnop,
                mijnHartje && { backgroundColor: kleuren.rozeZacht },
                pressed && { transform: [{ scale: 0.9 }] },
              ]}
            >
              <Text style={stijl.hartTeken}>{mijnHartje ? '❤️' : '🤍'}</Text>
              {partnerHartje ? <View style={stijl.hartStip} /> : null}
            </Pressable>

            <Knop
              titel={t.algemeen.aanpassen}
              soort="rand"
              klein
              onPress={() =>
                router.push({ pathname: '/moment/nieuw', params: { bewerk: moment.id } })
              }
              style={{ flex: 1 }}
            />
            <Knop
              titel={t.algemeen.delen}
              soort="zacht"
              klein
              onPress={deel}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* --- Terugknop --- */}
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(samen)/kaart'))}
        style={[stijl.terug, { top: rand.top + ruimte.s }]}
        hitSlop={10}
      >
        <Text style={stijl.terugTeken}>‹</Text>
      </Pressable>

      <Hartjes aan={feest} aantal={12} />
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.rozeWolk },
  midden: { alignItems: 'center', justifyContent: 'center' },

  bovenkant: { paddingBottom: ruimte.xl, alignItems: 'center' },
  geenFotos: { alignItems: 'center', paddingVertical: ruimte.xxl, gap: 4 },
  geenFotosIcoon: { fontSize: 52 },
  geenFotosTekst: { fontFamily: letters.normaal, fontSize: 14, color: kleuren.inktZacht },
  geenFotosKnop: {
    fontFamily: letters.vet,
    fontSize: 14.5,
    color: kleuren.rozeDiep,
    marginTop: 4,
  },

  inhoud: { paddingHorizontal: ruimte.l, marginTop: -6 },
  chipRij: { flexDirection: 'row', gap: ruimte.s, marginBottom: ruimte.s },

  titel: {
    fontFamily: letters.vet,
    fontSize: 27,
    lineHeight: 33,
    color: kleuren.inkt,
    letterSpacing: -0.4,
  },
  datum: {
    fontFamily: letters.handVet,
    fontSize: 25,
    color: kleuren.rozeDiep,
    marginTop: 2,
  },
  geleden: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktFluister,
    marginTop: -2,
  },

  adresRij: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: ruimte.m },
  adresIcoon: { fontSize: 13 },

  briefje: {
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.l,
    marginTop: ruimte.l,
    borderLeftWidth: 4,
    borderLeftColor: kleuren.rozeZacht,
  },
  briefjeTekst: {
    fontFamily: letters.normaal,
    fontSize: 15.5,
    lineHeight: 24,
    color: kleuren.inkt,
  },

  makerRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.m,
    marginTop: ruimte.l,
  },
  makerNaam: { fontFamily: letters.halfvet, fontSize: 14, color: kleuren.inkt },
  makerOnder: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktZacht },
  hartKnop: {
    width: 44,
    height: 44,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: kleuren.rozeWolk,
  },
  hartTeken: { fontSize: 21 },
  hartStip: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: kleuren.rozeDiep,
  },

  knopRij: { flexDirection: 'row', gap: ruimte.m, marginTop: ruimte.l },

  terug: {
    position: 'absolute',
    left: ruimte.l,
    width: 38,
    height: 38,
    borderRadius: rond.vol,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...schaduw.zacht,
  },
  terugTeken: {
    fontSize: 28,
    color: kleuren.inkt,
    fontFamily: letters.normaal,
    marginTop: -4,
  },
});
