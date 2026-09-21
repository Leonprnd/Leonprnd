// Dezelfde kaart als op de telefoon, maar dan in een iframe in plaats van een
// WebView. react-native-webview bestaat niet op het web, dus deze versie komt
// ervoor in de plaats — Metro pakt vanzelf het .web.js-bestand.
//
// De kaartpagina zelf (leafletHtml) is precies dezelfde. Het enige verschil is
// hoe we ermee praten: geen injectJavaScript maar postMessage.

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { leafletHtml } from './leafletHtml';
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
  const iframeRef = useRef(null);
  const [geladen, setGeladen] = useState(false);

  const stuur = useCallback((functie, ...args) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ soort: 'opdracht', functie, args }),
      '*',
    );
  }, []);

  useImperativeHandle(ref, () => ({
    gaNaar(lat, lng, zoom) {
      stuur('gaNaar', lat, lng, zoom || null);
    },
    pasAan(punten) {
      stuur('pasAan', punten, marges || {});
    },
  }));

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

  useEffect(() => {
    if (!geladen) return;
    stuur('zetMomenten', JSON.parse(pinnenSleutel));
  }, [geladen, pinnenSleutel, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur('zetGekozen', gekozenId || null);
  }, [geladen, gekozenId, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur('zetLief', JSON.parse(liefSleutel));
  }, [geladen, liefSleutel, stuur]);

  useEffect(() => {
    if (!geladen) return;
    stuur('zetIk', JSON.parse(ikSleutel));
  }, [geladen, ikSleutel, stuur]);

  // --- Wat de kaart terugstuurt ---------------------------------------------

  useEffect(() => {
    function opBericht(gebeurtenis) {
      // Alleen luisteren naar ons eigen iframe.
      if (gebeurtenis.source !== iframeRef.current?.contentWindow) return;

      let bericht;
      try {
        bericht =
          typeof gebeurtenis.data === 'string'
            ? JSON.parse(gebeurtenis.data)
            : gebeurtenis.data;
      } catch {
        return;
      }
      if (!bericht?.soort) return;

      switch (bericht.soort) {
        case 'klaar':
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

    window.addEventListener('message', opBericht);
    return () => window.removeEventListener('message', opBericht);
  }, [opMomentPress, opLangDrukken, opAchtergrond, opMidden]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <iframe
        ref={iframeRef}
        title="kaart"
        srcDoc={leafletHtml}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
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
  laden: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: kleuren.creme,
  },
});

export default OpenKaart;
