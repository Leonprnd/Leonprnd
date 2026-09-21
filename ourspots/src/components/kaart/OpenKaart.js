// De kaart via OpenFreeMap, getekend door MapLibre in een WebView.
//
// Geen sleutel, geen account, geen betaalgegevens. Naar buiten toe gedraagt
// hij zich precies als NativeKaart, zodat het kaartscherm niet hoeft te weten
// welke van de twee er onder zit.

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { kaartHtml } from './kaartHtml';
import { kleuren } from '../../theme';
import { typeVan } from '../../momentTypes';
import { fotoUrl, MINI } from '../../cloudinary';

const OpenKaart = forwardRef(function OpenKaart(
  {
    momenten,
    gekozenId,
    partner,
    partnerLocatie,
    mijnPositie,
    toonMij,
    marges,
    opMomentPress,
    opLangDrukken,
    opAchtergrond,
    opMidden,
  },
  ref,
) {
  const webRef = useRef(null);
  const [geladen, setGeladen] = useState(false);

  // Alles wat we naar de kaartpagina sturen gaat als stukje JavaScript. De
  // afsluitende "true;" hoort erbij: zonder dat klaagt iOS.
  const stuur = useCallback((code) => {
    webRef.current?.injectJavaScript(`${code} true;`);
  }, []);

  useImperativeHandle(ref, () => ({
    gaNaar(lat, lng, zoom) {
      stuur(`window.onsPlekje.gaNaar(${lat}, ${lng}, ${zoom || 'null'});`);
    },
    pasAan(punten) {
      stuur(
        `window.onsPlekje.pasAan(${JSON.stringify(punten)}, ${JSON.stringify(marges || {})});`,
      );
    },
  }));

  // --- Wat we de kaart laten zien -------------------------------------------

  // De pinnen in de kleinst mogelijke vorm: de WebView hoeft niet te weten wat
  // er verder in een herinnering staat.
  const pinnen = (momenten || [])
    .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
    .map((m) => {
      const type = typeVan(m.type);
      return {
        id: m.id,
        lat: m.lat,
        lng: m.lng,
        icoon: type.icoon,
        kleur: type.kleur,
        bijzonder: Boolean(type.bijzonder),
        fotos: m.fotos?.length || 0,
        foto: m.fotos?.[0]?.url ? fotoUrl(m.fotos[0].url, MINI) : null,
      };
    });

  const pinnenSleutel = JSON.stringify(pinnen);
  const liefSleutel = JSON.stringify(
    partnerLocatie?.lat != null && partner
      ? {
          lat: partnerLocatie.lat,
          lng: partnerLocatie.lng,
          emoji: partner.emoji,
          kleur: partner.kleur,
          naam: partner.naam,
        }
      : null,
  );
  const ikSleutel = JSON.stringify(
    toonMij && mijnPositie ? { lat: mijnPositie.lat, lng: mijnPositie.lng } : null,
  );

  // Zodra de kaartpagina klaar is, en daarna telkens als er iets verandert,
  // sturen we de nieuwe stand door. De sleutels hierboven zijn gewone tekst,
  // dus een effect draait alleen opnieuw als er echt iets anders is.
  useEffect(() => {
    if (!geladen) return;
    stuur(`window.onsPlekje.zetMomenten(${pinnenSleutel});`);
  }, [geladen, pinnenSleutel, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur(`window.onsPlekje.zetGekozen(${JSON.stringify(gekozenId || null)});`);
  }, [geladen, gekozenId, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur(`window.onsPlekje.zetLief(${liefSleutel});`);
  }, [geladen, liefSleutel, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur(`window.onsPlekje.zetIk(${ikSleutel});`);
  }, [geladen, ikSleutel, stuur]);

  // --- Wat de kaart ons terugstuurt -----------------------------------------

  function opBericht(gebeurtenis) {
    let bericht;
    try {
      bericht = JSON.parse(gebeurtenis.nativeEvent.data);
    } catch {
      return;
    }

    switch (bericht.soort) {
      case 'klaar':
        // De effecten hierboven vullen de kaart meteen met de huidige stand.
        setGeladen(true);
        break;
      case 'moment':
        opMomentPress?.(bericht.id);
        break;
      case 'langIngedrukt':
        opLangDrukken?.({ lat: bericht.lat, lng: bericht.lng });
        break;
      case 'achtergrond':
        opAchtergrond?.();
        break;
      case 'midden':
        opMidden?.({ lat: bericht.lat, lng: bericht.lng });
        break;
      default:
        break;
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <WebView
        ref={webRef}
        source={{ html: kaartHtml, baseUrl: 'https://localhost' }}
        originWhitelist={['*']}
        onMessage={opBericht}
        style={stijl.web}
        containerStyle={StyleSheet.absoluteFill}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
      />

      {!geladen ? (
        <View style={stijl.laden} pointerEvents="none">
          <ActivityIndicator color={kleuren.roze} />
        </View>
      ) : null}
    </View>
  );
});

const stijl = StyleSheet.create({
  web: { flex: 1, backgroundColor: kleuren.creme },
  laden: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: kleuren.creme,
  },
});

export default OpenKaart;
