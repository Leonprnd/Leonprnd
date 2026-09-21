// De pin zoals hij op de kaart staat.
//
// Zonder foto: een gekleurde bol met het icoontje erin. Mét foto vult die de
// hele bol en verhuist de kleur naar de rand — geen icoontje of telletje
// eroverheen, want dat stond juist voor de foto die je wilde zien.
//
// Bijzondere momenten (eerste date, eerste kus, verkering...) krijgen een roze
// rand met een hartje ernaast, zodat je meteen ziet welke plekjes de grote
// zijn.

import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { kleuren, letters, schaduw } from '../theme';
import { useAnimatie } from '../utils/animatie';
import { typeVan } from '../momentTypes';
import { fotoUrl, MINI } from '../cloudinary';

export default function MomentPin({ moment, gekozen }) {
  const type = typeVan(moment.type);
  // Is er een foto, dan is die veel herkenbaarder dan een icoontje.
  const foto = moment.fotos?.[0]?.url || null;
  const stuiter = useAnimatie(gekozen ? 1 : 0);

  useEffect(() => {
    Animated.spring(stuiter, {
      toValue: gekozen ? 1 : 0,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [gekozen, stuiter]);

  const schaal = stuiter.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const omhoog = stuiter.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <Animated.View
      style={[stijl.omhulsel, { transform: [{ scale: schaal }, { translateY: omhoog }] }]}
    >
      <View
        style={[
          stijl.bol,
          schaduw.pin,
          foto
            ? { borderColor: type.kleur, overflow: 'hidden' }
            : { backgroundColor: type.kleur },
          foto && !type.bijzonder && stijl.witteRing,
          type.bijzonder && stijl.bijzonderRing,
        ]}
      >
        {foto ? (
          <Image
            source={{ uri: fotoUrl(foto, MINI) }}
            style={stijl.fotoInPin}
            contentFit="cover"
            transition={160}
            cachePolicy="memory-disk"
          />
        ) : (
          <Text style={stijl.icoon}>{type.icoon}</Text>
        )}
      </View>

      {/* Buiten de bol, zodat het niets afdekt. */}
      {type.bijzonder ? <Text style={stijl.hartje}>💖</Text> : null}

      <View style={[stijl.puntje, { borderTopColor: type.kleur }]} />
    </Animated.View>
  );
}

// De stip van je liefje: een zacht kloppend hartje op zijn of haar plek.
export function PartnerStip({ emoji, kleur = kleuren.roze, naam }) {
  const klop = useAnimatie(0);

  useEffect(() => {
    const lus = Animated.loop(
      Animated.sequence([
        Animated.timing(klop, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(klop, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    lus.start();
    return () => lus.stop();
  }, [klop]);

  const ringSchaal = klop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 2.4] });
  const ringDoorzicht = klop.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.45, 0.18, 0] });

  return (
    <View style={stijl.partnerOmhulsel}>
      <Animated.View
        style={[
          stijl.partnerRing,
          {
            backgroundColor: kleur,
            opacity: ringDoorzicht,
            transform: [{ scale: ringSchaal }],
          },
        ]}
      />
      <View style={[stijl.partnerBol, schaduw.pin, { borderColor: kleur }]}>
        <Text style={stijl.partnerEmoji}>{emoji || '💗'}</Text>
      </View>
      {naam ? (
        <View style={[stijl.partnerNaam, { backgroundColor: kleur }]}>
          <Text style={stijl.partnerNaamTekst} numberOfLines={1}>
            {naam}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// react-native-maps tekent een eigen View-markering telkens opnieuw zolang
// tracksViewChanges aan staat. Dat kost veel accu, dus zetten we het na het
// eerste tekenen uit. Bij een verandering (gekozen, aantal foto's) even weer aan.
export function useTekenEenKeer(afhankelijk) {
  const [staat, setStaat] = useState({ sleutel: afhankelijk, tekent: true });

  // Verandert er iets aan de pin, dan mag hij even opnieuw getekend worden.
  if (staat.sleutel !== afhankelijk) {
    setStaat({ sleutel: afhankelijk, tekent: true });
  }

  useEffect(() => {
    const klus = setTimeout(
      () => setStaat((oud) => ({ ...oud, tekent: false })),
      700,
    );
    return () => clearTimeout(klus);
  }, [afhankelijk]);

  return staat.tekent;
}

const stijl = StyleSheet.create({
  omhulsel: { alignItems: 'center', paddingTop: 4 },
  bol: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: kleuren.wit,
  },
  // Een ring búiten de pin. Niet de rand zelf roze maken: bij een pin die zelf
  // al roze is zie je dat verschil niet, en dan valt het witte randje weg dat
  // de pin losmaakt van de kaart.
  bijzonderRing: {
    outlineWidth: 3,
    outlineColor: kleuren.rozeDiep,
    outlineStyle: 'solid',
  },
  // Met een foto zit de kleur in de rand, dus komt het wit erbuiten.
  witteRing: {
    outlineWidth: 2,
    outlineColor: kleuren.wit,
    outlineStyle: 'solid',
  },
  icoon: { fontSize: 25 },
  fotoInPin: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
    backgroundColor: kleuren.rozeZacht,
  },
  hartje: {
    position: 'absolute',
    top: -5,
    right: -6,
    fontSize: 16,
  },
  puntje: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  partnerOmhulsel: { alignItems: 'center', justifyContent: 'center', width: 110, height: 96 },
  partnerRing: { position: 'absolute', top: 18, width: 44, height: 44, borderRadius: 22 },
  partnerBol: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: kleuren.wit,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerEmoji: { fontSize: 21 },
  partnerNaam: {
    marginTop: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: 104,
  },
  partnerNaamTekst: {
    fontFamily: letters.vet,
    fontSize: 11.5,
    color: kleuren.wit,
  },
});
