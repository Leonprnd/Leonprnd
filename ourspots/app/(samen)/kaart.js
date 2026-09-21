// Het startscherm: jullie kaart.
//
// De kaart vult het scherm. Daaroverheen schuift een blad dat je met je duim
// omhoog trekt: eerst zie je alleen wie waar is, daarna alle plekken. Tik je
// een plek aan — in de lijst of op de kaart — dan zakt het blad weg zodat je
// de kaart ziet, met bovenaan het blad wat je gekozen hebt.
//
// Houd de kaart ergens ingedrukt om daar een nieuw plekje te maken.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useApp } from '../../src/state/AppProvider';
import Hartjes from '../../src/components/Hartjes';
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../../src/theme';
import Kaartweergave from '../../src/components/kaart';
import Zoekbalk from '../../src/components/Zoekbalk';
import Blad from '../../src/components/Blad';
import {
  BladKop,
  BladLijst,
  GekozenKop,
  REGEL_HOOGTE,
} from '../../src/components/PlekkenBlad';
import { afstandInMeter, afstandTekst } from '../../src/utils/afstand';
import { naarDate } from '../../src/utils/datum';

const PIN_ZOOM = 16; // hoe dicht de kaart op een pin gaat staan
const MIJ_ZOOM = 15;

// De hoogtes waarop het blad vastklikt.
const KIEM = 88; // net het handvat en de kop, en verder niets
const HALF = 330;

export default function Kaart() {
  const {
    momenten,
    momentenGeladen,
    mijnPositie,
    partnerLocatie,
    partner,
    gekoppeld,
    deeltLocatie,
    t,
  } = useApp();

  const rand = useSafeAreaInsets();
  const { height: schermHoogte } = useWindowDimensions();

  const kaartRef = useRef(null);
  const lijstRef = useRef(null);
  const bladRef = useRef(null);
  const middenRef = useRef({ lat: 52.1326, lng: 5.2913 });
  const alGepastRef = useRef(false);
  const alGeopendRef = useRef(false);

  const [gekozenId, setGekozenId] = useState(null);
  const [sortering, setSortering] = useState('recent');

  const standen = useMemo(
    () => [KIEM, HALF, Math.max(HALF + 40, schermHoogte * 0.72)],
    [schermHoogte],
  );

  // Komt je liefje er terwijl je de app open hebt? Dan mag dat gevierd worden.
  const [vorigePartner, setVorigePartner] = useState(partner?.uid || null);
  const [netErbij, setNetErbij] = useState(false);
  const huidigePartner = partner?.uid || null;
  if (vorigePartner !== huidigePartner) {
    setVorigePartner(huidigePartner);
    if (huidigePartner && !vorigePartner) setNetErbij(true);
  }

  // --- De volgorde in het blad ---------------------------------------------

  const gesorteerd = useMemo(() => {
    const lijst = [...momenten];
    if (sortering === 'dichtbij' && mijnPositie) {
      return lijst.sort(
        (a, b) =>
          (afstandInMeter(mijnPositie, a) ?? Infinity) -
          (afstandInMeter(mijnPositie, b) ?? Infinity),
      );
    }
    return lijst.sort(
      (a, b) => (naarDate(b.datum)?.getTime() || 0) - (naarDate(a.datum)?.getTime() || 0),
    );
  }, [momenten, sortering, mijnPositie]);

  const gekozen = useMemo(
    () => gesorteerd.find((m) => m.id === gekozenId) || null,
    [gesorteerd, gekozenId],
  );

  // --- De kaart netjes inkaderen bij het openen -----------------------------

  const pasKaartAan = useCallback(() => {
    const punten = momenten
      .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      .map((m) => ({ lat: m.lat, lng: m.lng }));

    if (mijnPositie) punten.push({ lat: mijnPositie.lat, lng: mijnPositie.lng });
    if (partnerLocatie) punten.push({ lat: partnerLocatie.lat, lng: partnerLocatie.lng });

    kaartRef.current?.pasAan(punten);
  }, [momenten, mijnPositie, partnerLocatie]);

  useEffect(() => {
    if (alGepastRef.current) return;
    if (!momentenGeladen) return;
    if (!momenten.length && !mijnPositie) return;

    alGepastRef.current = true;
    const klus = setTimeout(pasKaartAan, 450);
    return () => clearTimeout(klus);
  }, [momentenGeladen, momenten.length, mijnPositie, pasKaartAan]);

  // Nog geen enkele plek? Dan zetten we het blad één keer open, zodat je leest
  // hoe je er een maakt in plaats van naar een lege kaart te kijken.
  useEffect(() => {
    if (alGeopendRef.current) return;
    if (!momentenGeladen || momenten.length) return;

    alGeopendRef.current = true;
    const klus = setTimeout(() => bladRef.current?.naar(1), 700);
    return () => clearTimeout(klus);
  }, [momentenGeladen, momenten.length]);

  // --- Een plekje kiezen ----------------------------------------------------

  const kiesMoment = useCallback(
    (moment) => {
      if (!moment) return;

      // Tik je op wat al gekozen is, dan wil je het opendoen. Zo hoef je niet
      // eerst naar de knop in de kop te zoeken.
      if (moment.id === gekozenId) {
        router.push(`/moment/${moment.id}`);
        return;
      }

      setGekozenId(moment.id);
      kaartRef.current?.gaNaar(moment.lat, moment.lng, PIN_ZOOM);

      // Het blad zakt weg: je wilt nu de kaart zien, niet de lijst. Bovenin
      // blijft staan wat je gekozen hebt.
      bladRef.current?.naar(0);

      const index = gesorteerd.findIndex((m) => m.id === moment.id);
      if (index >= 0) {
        lijstRef.current?.scrollToOffset({
          offset: Math.max(0, index * REGEL_HOOGTE - REGEL_HOOGTE),
          animated: true,
        });
      }
    },
    [gesorteerd, gekozenId],
  );

  function naarMij() {
    if (!mijnPositie) return;
    Haptics.selectionAsync().catch(() => {});
    setGekozenId(null);
    kaartRef.current?.gaNaar(mijnPositie.lat, mijnPositie.lng, MIJ_ZOOM);
    bladRef.current?.naar(0);
  }

  function naarPartner() {
    if (!partnerLocatie) return;
    Haptics.selectionAsync().catch(() => {});
    setGekozenId(null);
    kaartRef.current?.gaNaar(partnerLocatie.lat, partnerLocatie.lng, MIJ_ZOOM);
    bladRef.current?.naar(0);
  }

  function allesInBeeld() {
    Haptics.selectionAsync().catch(() => {});
    setGekozenId(null);
    pasKaartAan();
    bladRef.current?.naar(0);
  }

  // --- Nieuw plekje ---------------------------------------------------------

  function nieuwOpPlek(lat, lng) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({
      pathname: '/moment/nieuw',
      params: { lat: String(lat), lng: String(lng) },
    });
  }

  function nieuwOpGevonden(plek) {
    kaartRef.current?.gaNaar(plek.lat, plek.lng, PIN_ZOOM);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({
      pathname: '/moment/nieuw',
      params: {
        lat: String(plek.lat),
        lng: String(plek.lng),
        titel: plek.titel || '',
        adres: plek.ondertitel || '',
      },
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
        marges={{ boven: rand.top + 96, onder: KIEM + 80 }}
        opMomentPress={(id) => {
          const moment = momenten.find((m) => m.id === id);
          if (!moment) return;
          Haptics.selectionAsync().catch(() => {});
          kiesMoment(moment);
        }}
        opLangDrukken={({ lat, lng }) => nieuwOpPlek(lat, lng)}
        opAchtergrond={() => setGekozenId(null)}
        opMidden={(midden) => {
          middenRef.current = midden;
        }}
      />

      <Zoekbalk
        bijRef={middenRef}
        opKiezen={nieuwOpGevonden}
        style={{ top: rand.top + ruimte.s }}
      />

      {/* --- De knoppen, net boven het blad --- */}
      <View style={[stijl.knoppen, { bottom: KIEM + ruimte.m }]} pointerEvents="box-none">
        {/* De tekentjes zijn met opzet getekend en geen letter of emoji: een
            teken dat het lettertype niet kent wordt een leeg blokje, en dat
            zou hier midden op de kaart staan. */}
        <Pressable
          onPress={allesInBeeld}
          style={({ pressed }) => [
            stijl.rondje,
            schaduw.kaart,
            pressed && { transform: [{ scale: 0.92 }] },
          ]}
        >
          <View style={stijl.kader} />
        </Pressable>

        {mijnPositie ? (
          <Pressable
            onPress={naarMij}
            style={({ pressed }) => [
              stijl.rondje,
              schaduw.kaart,
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <View style={stijl.ring}>
              <View style={stijl.ringStip} />
            </View>
          </Pressable>
        ) : null}

        <Pressable
          onPress={nieuwOpMidden}
          style={({ pressed }) => [
            stijl.plus,
            schaduw.kaart,
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
      </View>

      {/* --- Het blad --- */}
      <Blad
        ref={bladRef}
        standen={standen}
        kop={
          gekozen ? (
            <GekozenKop
              moment={gekozen}
              afstand={
                mijnPositie
                  ? afstandTekst(afstandInMeter(mijnPositie, gekozen))
                  : null
              }
              opOpenen={() => router.push(`/moment/${gekozen.id}`)}
            />
          ) : (
            <BladKop
              aantal={momenten.length}
              sortering={sortering}
              opSortering={setSortering}
              kanDichtbij={Boolean(mijnPositie)}
            />
          )
        }
      >
        {!momentenGeladen ? (
          <View style={stijl.laden}>
            <ActivityIndicator color={kleuren.roze} />
          </View>
        ) : (
          <BladLijst
            lijstRef={lijstRef}
            momenten={gesorteerd}
            gekozenId={gekozenId}
            mijnPositie={mijnPositie}
            partner={partner}
            partnerLocatie={partnerLocatie}
            gekoppeld={gekoppeld}
            opPlek={kiesMoment}
            opPartner={naarPartner}
            opMij={naarMij}
            onder={rand.bottom + ruimte.xl}
          />
        )}
      </Blad>

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

  knoppen: {
    position: 'absolute',
    right: ruimte.l,
    alignItems: 'center',
    gap: ruimte.s,
  },
  rondje: {
    width: 40,
    height: 40,
    borderRadius: rond.vol,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Een kadertje: alles in beeld.
  kader: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: kleuren.inktZacht,
  },
  // Een ringetje met een stip: naar waar jij bent.
  ring: {
    width: 18,
    height: 18,
    borderRadius: rond.vol,
    borderWidth: 2,
    borderColor: kleuren.inktZacht,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringStip: {
    width: 6,
    height: 6,
    borderRadius: rond.vol,
    backgroundColor: kleuren.inktZacht,
  },
  plus: {
    width: 54,
    height: 54,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: kleuren.roze,
  },
  plusTeken: {
    fontFamily: letters.licht,
    fontSize: 31,
    lineHeight: 35,
    color: kleuren.wit,
  },

  laden: { paddingTop: ruimte.xl, alignItems: 'center' },


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
