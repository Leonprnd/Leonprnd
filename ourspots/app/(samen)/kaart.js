// Het startscherm: jullie kaart.
//
// Alle plekjes staan erop als pin. Onderin schuif je door de herinneringen;
// wat je kiest, springt de kaart naartoe. Houd de kaart ergens ingedrukt om
// daar een nieuw plekje te maken.

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../../src/theme';
import Kaartweergave from '../../src/components/kaart';
import MomentKaartje from '../../src/components/MomentKaartje';

const KAART_BREEDTE = 300;
const PIN_ZOOM = 16; // hoe dicht de kaart op een pin gaat staan
const KAART_STAP = KAART_BREEDTE + ruimte.m;

export default function Kaart() {
  const {
    momenten,
    momentenGeladen,
    mijnPositie,
    partnerLocatie,
    partner,
    deeltLocatie,
    t,
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

      // Inzoomen op de pin: je wilt zien wáár het precies was.
      kaartRef.current?.gaNaar(moment.lat, moment.lng, PIN_ZOOM);

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
        marges={{ boven: rand.top + 90, onder: 195 }}
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

      {/* --- Onderin: de herinneringen --- */}
      <View style={stijl.onder} pointerEvents="box-none">
        {!momentenGeladen ? (
          <View style={[stijl.leegKaartje, schaduw.kaart]}>
            <ActivityIndicator color={kleuren.roze} />
          </View>
        ) : momenten.length === 0 ? (
          <Pressable onPress={nieuwOpMidden} style={[stijl.leegKaartje, schaduw.kaart]}>
            <Text style={stijl.leegIcoon}>📍</Text>
            <Text style={stijl.leegTitel}>{t.kaart.leegTitel}</Text>
            <Text style={stijl.leegTekst}>{t.kaart.leegTekst}</Text>
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
          { bottom: 132 },
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
            <Text style={stijl.welkomTitel}>{t.kaart.erbij(partner?.naam || '')}</Text>
            <Text style={stijl.welkomTekst}>{t.kaart.erbijTekst}</Text>
          </View>
        </View>
      ) : null}

      <Hartjes aan={netErbij} aantal={18} opKlaar={() => setNetErbij(false)} />
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.creme },

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
    width: 52,
    height: 52,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: kleuren.roze,
  },
  plusTeken: {
    fontFamily: letters.licht,
    fontSize: 30,
    lineHeight: 34,
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
});
