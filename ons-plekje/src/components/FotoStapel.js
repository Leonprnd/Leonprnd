// De fotostapel bovenaan een herinnering.
//
// De foto's liggen als polaroids op elkaar, een beetje scheef, met een stukje
// washi-tape erop. De bovenste kun je wegslepen; dan schuift hij naar achteren
// en komt de volgende tevoorschijn. Tikken opent hem groot.
//
// Alles draait op de ingebouwde Animated van React Native, zodat er geen extra
// bibliotheek nodig is.

import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { kleuren, letters, rond, ruimte, schaduw } from '../theme';
import { useAnimatie, useAnimatieXY } from '../utils/animatie';
import { fotoUrl, STAPEL, GROOT } from '../cloudinary';
import { korteDatum } from '../utils/datum';

const SCHERM = Dimensions.get('window');
const ZICHTBAAR = 4; // zoveel polaroids zie je in de stapel
const TAPE_KLEUREN = ['#FFD9E3AA', '#FFE9C9AA', '#D9F0E8AA', '#E5DBF7AA'];

// Elke foto krijgt altijd dezelfde "willekeurige" hoek, zodat de stapel niet
// gaat springen bij elke keer opnieuw tekenen.
function hoekVoor(sleutel, index) {
  const tekst = `${sleutel}-${index}`;
  let som = 0;
  for (let i = 0; i < tekst.length; i += 1) som = (som * 31 + tekst.charCodeAt(i)) % 1000;
  return ((som % 140) - 70) / 10; // tussen -7 en +7 graden
}

export default function FotoStapel({ fotos, datum, hoogte = 300, sleutel = 'stapel' }) {
  const [volgorde, setVolgorde] = useState(() => (fotos || []).map((_, i) => i));
  const [groot, setGroot] = useState(null);

  const pan = useAnimatieXY();
  const schuif = useAnimatie(0);
  const [gooitWeg, setGooitWeg] = useState(false);

  // Raakt de lijst foto's van lengte, dan beginnen we de volgorde opnieuw.
  const aantal = fotos?.length || 0;
  const [vorigAantal, setVorigAantal] = useState(aantal);
  if (vorigAantal !== aantal) {
    setVorigAantal(aantal);
    setVolgorde(Array.from({ length: aantal }, (_, i) => i));
  }

  const naarAchteren = useCallback(() => {
    setVolgorde((oud) => (oud.length < 2 ? oud : [...oud.slice(1), oud[0]]));
    pan.setValue({ x: 0, y: 0 });
    schuif.setValue(1);
    Animated.spring(schuif, {
      toValue: 0,
      friction: 7,
      tension: 60,
      useNativeDriver: false,
    }).start(() => setGooitWeg(false));
  }, [pan, schuif]);

  const opLosgelaten = useCallback(
    (_, g) => {
      const verGenoeg = Math.abs(g.dx) > 90 || Math.abs(g.vx) > 0.6;

      if (verGenoeg && !gooitWeg) {
        setGooitWeg(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        Animated.timing(pan, {
          toValue: { x: g.dx > 0 ? SCHERM.width : -SCHERM.width, y: g.dy * 0.6 },
          duration: 220,
          useNativeDriver: false,
        }).start(naarAchteren);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          useNativeDriver: false,
        }).start();
      }
    },
    [pan, naarAchteren, gooitWeg],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          aantal > 1 && (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6),
        onPanResponderGrant: () => {
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: opLosgelaten,
      }),
    [aantal, pan, opLosgelaten],
  );

  if (!aantal) return null;

  const polaroidBreedte = Math.min(SCHERM.width - 96, hoogte * 0.86);

  // We tekenen van achter naar voren, dus de bovenste komt als laatste.
  const zichtbaar = volgorde.slice(0, ZICHTBAAR).reverse();

  return (
    <View style={[stijl.omhulsel, { height: hoogte }]}>
      {zichtbaar.map((fotoIndex, plek) => {
        const diepte = zichtbaar.length - 1 - plek; // 0 = bovenste
        const isBovenste = diepte === 0;
        const foto = fotos[fotoIndex];
        if (!foto?.url) return null;

        const basisHoek = hoekVoor(sleutel, fotoIndex);
        const tape = TAPE_KLEUREN[fotoIndex % TAPE_KLEUREN.length];

        // De kaartjes eronder schuiven een beetje omhoog en worden kleiner.
        const diepteY = schuif.interpolate({
          inputRange: [0, 1],
          outputRange: [-diepte * 9, -(diepte + 1) * 9],
        });
        const diepteSchaal = schuif.interpolate({
          inputRange: [0, 1],
          outputRange: [1 - diepte * 0.045, 1 - (diepte + 1) * 0.045],
        });

        const transform = isBovenste
          ? [
              { translateX: pan.x },
              { translateY: pan.y },
              {
                rotate: pan.x.interpolate({
                  inputRange: [-SCHERM.width, 0, SCHERM.width],
                  outputRange: [`${basisHoek - 18}deg`, `${basisHoek}deg`, `${basisHoek + 18}deg`],
                }),
              },
            ]
          : [
              { translateY: diepteY },
              { scale: diepteSchaal },
              { rotate: `${basisHoek}deg` },
            ];

        const handlers = isBovenste ? panResponder.panHandlers : {};

        return (
          <Animated.View
            key={`${fotoIndex}-${foto.url}`}
            {...handlers}
            style={[
              stijl.polaroid,
              schaduw.kaart,
              {
                width: polaroidBreedte,
                opacity: diepte > 2 ? 0.5 : 1,
                zIndex: 10 - diepte,
                transform,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                if (!isBovenste) return;
                Haptics.selectionAsync().catch(() => {});
                setGroot(fotoIndex);
              }}
              style={stijl.polaroidBinnen}
            >
              <View style={[stijl.tape, { backgroundColor: tape }]} />
              <Image
                source={{ uri: fotoUrl(foto.url, STAPEL) }}
                style={[stijl.foto, { height: polaroidBreedte * 0.92 }]}
                contentFit="cover"
                transition={220}
                cachePolicy="memory-disk"
              />
              <View style={stijl.onderrand}>
                <Text style={stijl.onderschrift} numberOfLines={1}>
                  {datum ? korteDatum(datum) : 'ons moment'}
                </Text>
                {aantal > 1 ? (
                  <Text style={stijl.teller}>
                    {volgorde.indexOf(fotoIndex) + 1}/{aantal}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        );
      })}

      {aantal > 1 ? (
        <View style={stijl.tip} pointerEvents="none">
          <Text style={stijl.tipTekst}>veeg voor de volgende ✨</Text>
        </View>
      ) : null}

      <GroteWeergave
        fotos={fotos}
        start={groot}
        opSluiten={() => setGroot(null)}
        datum={datum}
      />
    </View>
  );
}

// --- Foto's groot bekijken --------------------------------------------------

function GroteWeergave({ fotos, start, opSluiten, datum }) {
  const scrollRef = useRef(null);
  const [huidig, setHuidig] = useState(start || 0);
  const [vorigeStart, setVorigeStart] = useState(start);
  const open = start != null;

  // Open je de weergave op een andere foto, dan begint de teller daar.
  if (vorigeStart !== start) {
    setVorigeStart(start);
    if (start != null) setHuidig(start);
  }

  // contentOffset alleen is op Android niet betrouwbaar, vandaar ook een
  // scrollTo zodra het venster er staat.
  useEffect(() => {
    if (start == null) return undefined;
    const klus = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: start * SCHERM.width, animated: false });
    }, 0);
    return () => clearTimeout(klus);
  }, [start]);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={opSluiten}>
      <StatusBar barStyle="light-content" />
      <View style={stijl.grootAchtergrond}>
        <Pressable style={StyleSheet.absoluteFill} onPress={opSluiten} />

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: (start || 0) * SCHERM.width, y: 0 }}
          onMomentumScrollEnd={(e) =>
            setHuidig(Math.round(e.nativeEvent.contentOffset.x / SCHERM.width))
          }
          style={stijl.grootScroll}
        >
          {(fotos || []).map((foto, i) => (
            <View key={foto.url || i} style={stijl.grootPagina}>
              <Image
                source={{ uri: fotoUrl(foto.url, GROOT) }}
                style={stijl.grootFoto}
                contentFit="contain"
                transition={180}
                cachePolicy="memory-disk"
              />
            </View>
          ))}
        </ScrollView>

        <View style={stijl.grootOnder} pointerEvents="none">
          <Text style={stijl.grootTekst}>
            {datum ? korteDatum(datum) : ''}
            {fotos?.length > 1 ? `  ·  ${huidig + 1} van ${fotos.length}` : ''}
          </Text>
        </View>

        <Pressable style={stijl.sluitKnop} onPress={opSluiten} hitSlop={12}>
          <Text style={stijl.sluitTeken}>✕</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const stijl = StyleSheet.create({
  omhulsel: { alignItems: 'center', justifyContent: 'center' },

  polaroid: {
    position: 'absolute',
    backgroundColor: kleuren.wit,
    borderRadius: 8,
    padding: 9,
    paddingBottom: 6,
  },
  polaroidBinnen: { borderRadius: 4, overflow: 'visible' },
  tape: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    width: 62,
    height: 22,
    borderRadius: 2,
    transform: [{ rotate: '-3deg' }],
    zIndex: 5,
  },
  foto: {
    width: '100%',
    borderRadius: 3,
    backgroundColor: kleuren.rozeZacht,
  },
  onderrand: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  onderschrift: {
    fontFamily: letters.handVet,
    fontSize: 19,
    color: kleuren.rozeDiep,
    flex: 1,
  },
  teller: {
    fontFamily: letters.halfvet,
    fontSize: 11,
    color: kleuren.inktFluister,
  },

  tip: { position: 'absolute', bottom: -2 },
  tipTekst: {
    fontFamily: letters.normaal,
    fontSize: 11.5,
    color: kleuren.inktFluister,
  },

  grootAchtergrond: {
    flex: 1,
    backgroundColor: 'rgba(38,20,28,0.94)',
    justifyContent: 'center',
  },
  grootScroll: { flexGrow: 0 },
  grootPagina: {
    width: SCHERM.width,
    height: SCHERM.height * 0.74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grootFoto: { width: SCHERM.width - 24, height: '100%' },
  grootOnder: { position: 'absolute', bottom: 54, width: '100%', alignItems: 'center' },
  grootTekst: {
    fontFamily: letters.normaal,
    fontSize: 14,
    color: '#FFD9E3',
  },
  sluitKnop: {
    position: 'absolute',
    top: 56,
    right: ruimte.xl,
    width: 40,
    height: 40,
    borderRadius: rond.vol,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sluitTeken: { color: kleuren.wit, fontSize: 18, fontFamily: letters.halfvet },
});
