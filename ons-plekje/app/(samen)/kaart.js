// Het startscherm: jullie kaart.
//
// Alle plekjes staan erop als pin. Onderin schuif je door de herinneringen;
// wat je kiest, springt de kaart naartoe. Houd de kaart ergens ingedrukt om
// daar een nieuw plekje te maken.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useApp } from '../../src/state/AppProvider';
import Hartjes from '../../src/components/Hartjes';
import { kaartHerkomst } from '../../src/kaartProvider';
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../../src/theme';
import Kaartweergave from '../../src/components/kaart';
import MomentKaartje from '../../src/components/MomentKaartje';
import { Bolletje } from '../../src/components/basis';
import { afstandInMeter, afstandZinnetje } from '../../src/utils/afstand';
import { dagenSinds, geledenKort } from '../../src/utils/datum';

const KAART_BREEDTE = 300;
const KAART_STAP = KAART_BREEDTE + ruimte.m;

export default function Kaart() {
  const {
    momenten,
    momentenGeladen,
    mijnPositie,
    partnerLocatie,
    partner,
    ik,
    kaart,
    gekoppeld,
    deeltLocatie,
  } = useApp();

  const rand = useSafeAreaInsets();
  const kaartRef = useRef(null);
  const lijstRef = useRef(null);
  const middenRef = useRef({ lat: 52.1326, lng: 5.2913 });
  const alGepastRef = useRef(false);

  const [gekozenId, setGekozenId] = useState(null);

  // Komt je liefje er terwijl je de app open hebt? Dan mag dat gevierd worden.
  const [vorigePartner, setVorigePartner] = useState(partner?.uid || null);
  const [netErbij, setNetErbij] = useState(false);
  const huidigePartner = partner?.uid || null;
  if (vorigePartner !== huidigePartner) {
    setVorigePartner(huidigePartner);
    if (huidigePartner && !vorigePartner) setNetErbij(true);
  }

  // --- De kaart netjes inkaderen bij het openen -----------------------------

  const pasKaartAan = useCallback(() => {
    const punten = momenten
      .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      .map((m) => ({ lat: m.lat, lng: m.lng }));

    if (mijnPositie) {
      punten.push({ lat: mijnPositie.lat, lng: mijnPositie.lng });
    }

    kaartRef.current?.pasAan(punten);
  }, [momenten, mijnPositie]);

  useEffect(() => {
    if (alGepastRef.current) return;
    if (!momentenGeladen) return;
    if (!momenten.length && !mijnPositie) return;

    alGepastRef.current = true;
    const klus = setTimeout(pasKaartAan, 450);
    return () => clearTimeout(klus);
  }, [momentenGeladen, momenten.length, mijnPositie, pasKaartAan]);

  // --- Een plekje kiezen ----------------------------------------------------

  const kiesMoment = useCallback(
    (moment, vanafLijst) => {
      if (!moment) return;
      setGekozenId(moment.id);

      kaartRef.current?.gaNaar(moment.lat, moment.lng);

      if (!vanafLijst) {
        const index = momenten.findIndex((m) => m.id === moment.id);
        if (index >= 0) {
          lijstRef.current?.scrollToOffset({ offset: index * KAART_STAP, animated: true });
        }
      }
    },
    [momenten],
  );

  function opLijstGestopt(e) {
    const index = Math.round(e.nativeEvent.contentOffset.x / KAART_STAP);
    const moment = momenten[index];
    if (moment && moment.id !== gekozenId) {
      Haptics.selectionAsync().catch(() => {});
      kiesMoment(moment, true);
    }
  }

  // --- Nieuw plekje ---------------------------------------------------------

  function nieuwOpPlek(lat, lng) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({
      pathname: '/moment/nieuw',
      params: { lat: String(lat), lng: String(lng) },
    });
  }

  function nieuwOpMidden() {
    const midden = middenRef.current;
    nieuwOpPlek(midden.lat, midden.lng);
  }

  function naarMij() {
    if (!mijnPositie) return;
    Haptics.selectionAsync().catch(() => {});
    kaartRef.current?.gaNaar(mijnPositie.lat, mijnPositie.lng, 15);
  }

  // --- Het zinnetje bovenin -------------------------------------------------

  const afstand = useMemo(() => {
    if (!mijnPositie || !partnerLocatie?.lat) return null;
    return afstandInMeter(mijnPositie, { lat: partnerLocatie.lat, lng: partnerLocatie.lng });
  }, [mijnPositie, partnerLocatie]);

  const dagen = kaart?.samenSinds ? dagenSinds(kaart.samenSinds) : null;

  return (
    <View style={stijl.vol}>
      <Kaartweergave
        ref={kaartRef}
        momenten={momenten}
        gekozenId={gekozenId}
        partner={partner}
        partnerLocatie={partnerLocatie}
        mijnPositie={mijnPositie}
        toonMij={deeltLocatie}
        marges={{ boven: rand.top + 90, onder: 210 }}
        opMomentPress={(id) => {
          const moment = momenten.find((m) => m.id === id);
          if (!moment) return;
          Haptics.selectionAsync().catch(() => {});
          kiesMoment(moment, false);
        }}
        opLangDrukken={({ lat, lng }) => nieuwOpPlek(lat, lng)}
        opAchtergrond={() => setGekozenId(null)}
        opMidden={(midden) => {
          middenRef.current = midden;
        }}
      />

      {/* --- Bovenin: jullie tweeën --- */}
      <View style={[stijl.kop, { paddingTop: rand.top + ruimte.s }]} pointerEvents="box-none">
        <View style={[stijl.kopKaartje, schaduw.kaart]}>
          <View style={stijl.stel}>
            <Bolletje emoji={ik?.emoji} kleur={ik?.kleur} maat={36} />
            <Text style={stijl.stelHart}>{gekoppeld ? '💗' : '🤍'}</Text>
            <Bolletje
              emoji={gekoppeld ? partner?.emoji : '🎁'}
              kleur={gekoppeld ? partner?.kleur : kleuren.inktFluister}
              maat={36}
            />
          </View>

          <View style={stijl.kopTekst}>
            <Text style={stijl.kopNamen} numberOfLines={1}>
              {gekoppeld
                ? [ik?.naam, partner?.naam].filter(Boolean).join(' & ')
                : 'Jullie kaart'}
            </Text>
            <Text style={stijl.kopOnder} numberOfLines={1}>
              {!gekoppeld
                ? `${momenten.length} ${momenten.length === 1 ? 'plekje' : 'plekjes'} · alleen jij ziet dit`
                : dagen != null
                  ? `samen ${dagen} ${dagen === 1 ? 'dag' : 'dagen'} 💞`
                  : `${momenten.length} ${momenten.length === 1 ? 'plekje' : 'plekjes'} samen`}
            </Text>
          </View>
        </View>

        {!gekoppeld ? (
          <Pressable
            onPress={() => router.push('/(samen)/wij')}
            style={({ pressed }) => [stijl.afstandChip, pressed && { opacity: 0.7 }]}
          >
            <Text style={stijl.afstandTekst}>
              🤫 Nog een geheim · tik om de code te delen
            </Text>
          </Pressable>
        ) : afstand != null ? (
          <View style={stijl.afstandChip}>
            <Text style={stijl.afstandTekst}>{afstandZinnetje(afstand, partner?.naam)}</Text>
            <Text style={stijl.afstandTijd}>{geledenKort(partnerLocatie?.bijgewerktOp)}</Text>
          </View>
        ) : partner ? (
          <View style={stijl.afstandChip}>
            <Text style={stijl.afstandTekst}>
              {deeltLocatie
                ? `${partner.naam} deelt nu geen locatie`
                : 'Je deelt je locatie niet'}
            </Text>
          </View>
        ) : null}
      </View>

      {/* --- Rechts: knoppen --- */}
      <View style={[stijl.zijknoppen, { top: rand.top + 130 }]} pointerEvents="box-none">
        <RondeKnop icoon="🧭" opPress={naarMij} uit={!mijnPositie} />
        <RondeKnop icoon="🔍" opPress={pasKaartAan} />
      </View>

      {/* --- Onderin: de herinneringen --- */}
      <View style={stijl.onder} pointerEvents="box-none">
        {!momentenGeladen ? (
          <View style={[stijl.leegKaartje, schaduw.kaart]}>
            <ActivityIndicator color={kleuren.roze} />
          </View>
        ) : momenten.length === 0 ? (
          <Pressable onPress={nieuwOpMidden} style={[stijl.leegKaartje, schaduw.kaart]}>
            <Text style={stijl.leegIcoon}>📍</Text>
            <Text style={stijl.leegTitel}>Nog geen plekjes</Text>
            <Text style={stijl.leegTekst}>
              Houd de kaart ingedrukt op een plek waar jullie samen waren, of tik hier.
            </Text>
          </Pressable>
        ) : (
          <FlatList
            ref={lijstRef}
            data={momenten}
            keyExtractor={(m) => m.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={KAART_STAP}
            decelerationRate="fast"
            contentContainerStyle={stijl.lijst}
            onMomentumScrollEnd={opLijstGestopt}
            getItemLayout={(_, index) => ({
              length: KAART_STAP,
              offset: KAART_STAP * index,
              index,
            })}
            renderItem={({ item }) => (
              <MomentKaartje
                moment={item}
                breed
                actief={gekozenId === item.id}
                opPress={() => {
                  if (gekozenId === item.id) {
                    router.push(`/moment/${item.id}`);
                  } else {
                    kiesMoment(item, true);
                  }
                }}
              />
            )}
          />
        )}
      </View>

      {/* --- De grote plus --- */}
      <Pressable
        onPress={nieuwOpMidden}
        style={({ pressed }) => [
          stijl.plus,
          schaduw.kaart,
          { bottom: 210 },
          pressed && { transform: [{ scale: 0.93 }] },
        ]}
      >
        <LinearGradient
          colors={verlopen.roze}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={stijl.plusTeken}>+</Text>
      </Pressable>

      {netErbij ? (
        <View style={stijl.welkomVlak} pointerEvents="none">
          <View style={[stijl.welkomKaartje, schaduw.kaart]}>
            <Text style={stijl.welkomIcoon}>{partner?.emoji || '💞'}</Text>
            <Text style={stijl.welkomTitel}>{partner?.naam} is erbij!</Text>
            <Text style={stijl.welkomTekst}>
              Vanaf nu zien jullie allebei dezelfde kaart.
            </Text>
          </View>
        </View>
      ) : null}

      <Hartjes aan={netErbij} aantal={18} opKlaar={() => setNetErbij(false)} />

      {kaartHerkomst() ? (
        <View style={[stijl.notitie, { bottom: 196 }]} pointerEvents="none">
          <Text style={stijl.notitieTekst}>{kaartHerkomst()}</Text>
        </View>
      ) : null}
    </View>
  );
}

function RondeKnop({ icoon, opPress, uit }) {
  return (
    <Pressable
      onPress={opPress}
      disabled={uit}
      style={({ pressed }) => [
        stijl.rondeKnop,
        schaduw.zacht,
        uit && { opacity: 0.4 },
        pressed && { transform: [{ scale: 0.92 }] },
      ]}
    >
      <Text style={stijl.rondeKnopIcoon}>{icoon}</Text>
    </Pressable>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.creme },

  kop: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: ruimte.l },
  kopKaartje: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    backgroundColor: kleuren.wit,
    borderRadius: rond.vol,
    paddingVertical: 8,
    paddingHorizontal: ruimte.m,
  },
  stel: { flexDirection: 'row', alignItems: 'center' },
  stelHart: { fontSize: 13, marginHorizontal: -6, zIndex: 2 },
  kopTekst: { flex: 1 },
  kopNamen: { fontFamily: letters.vet, fontSize: 15.5, color: kleuren.inkt },
  kopOnder: { fontFamily: letters.normaal, fontSize: 12.5, color: kleuren.inktZacht },

  afstandChip: {
    alignSelf: 'center',
    marginTop: ruimte.s,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: rond.vol,
    paddingHorizontal: ruimte.m,
    paddingVertical: 5,
    alignItems: 'center',
  },
  afstandTekst: { fontFamily: letters.halfvet, fontSize: 12.5, color: kleuren.rozeDiep },
  afstandTijd: { fontFamily: letters.normaal, fontSize: 10.5, color: kleuren.inktFluister },

  zijknoppen: { position: 'absolute', right: ruimte.l, gap: ruimte.s },
  rondeKnop: {
    width: 44,
    height: 44,
    borderRadius: rond.vol,
    backgroundColor: kleuren.wit,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rondeKnopIcoon: { fontSize: 19 },

  onder: { position: 'absolute', left: 0, right: 0, bottom: ruimte.l },
  lijst: { paddingHorizontal: ruimte.l, gap: ruimte.m },

  leegKaartje: {
    marginHorizontal: ruimte.l,
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.xl,
    alignItems: 'center',
  },
  leegIcoon: { fontSize: 30, marginBottom: 4 },
  leegTitel: { fontFamily: letters.vet, fontSize: 16.5, color: kleuren.inkt },
  leegTekst: {
    fontFamily: letters.normaal,
    fontSize: 13.5,
    lineHeight: 19,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: 3,
  },

  plus: {
    position: 'absolute',
    right: ruimte.l,
    width: 58,
    height: 58,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: kleuren.roze,
  },
  plusTeken: {
    fontFamily: letters.licht,
    fontSize: 34,
    lineHeight: 39,
    color: kleuren.wit,
  },

  welkomVlak: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welkomKaartje: {
    backgroundColor: kleuren.wit,
    borderRadius: rond.xl,
    paddingVertical: ruimte.xl,
    paddingHorizontal: ruimte.xxl,
    alignItems: 'center',
    maxWidth: 300,
  },
  welkomIcoon: { fontSize: 44 },
  welkomTitel: {
    fontFamily: letters.vet,
    fontSize: 20,
    color: kleuren.inkt,
    marginTop: ruimte.s,
    textAlign: 'center',
  },
  welkomTekst: {
    fontFamily: letters.normaal,
    fontSize: 13.5,
    lineHeight: 19,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: 4,
  },

  notitie: {
    position: 'absolute',
    left: ruimte.l,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: rond.vol,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  notitieTekst: { fontFamily: letters.normaal, fontSize: 10, color: kleuren.inktZacht },
});
