// Zoek een plek op naam, boven aan de kaart.
//
// Typen is genoeg: na een korte stilte gaat de zoekopdracht eruit. Die stilte
// is niet alleen netjes tegenover de zoekers van OpenStreetMap, het scheelt je
// ook een lijst die bij elke letter opnieuw opspringt.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { zoekPlekken } from '../services/zoeken';
import { useApp } from '../state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw } from '../theme';

const STILTE = 450;
const MINIMUM = 3;

// `bijRef` wijst naar het midden van de kaart. Met opzet een ref en geen
// gewone waarde: dat midden verandert bij elke veeg, en daar hoeft deze balk
// niet telkens opnieuw voor getekend te worden. We lezen hem pas op het moment
// dat we echt gaan zoeken.
export default function Zoekbalk({ bijRef, opKiezen, style }) {
  const { t } = useApp();

  const [tekst, setTekst] = useState('');
  // Eén brok: bij wélke vraag hoort deze uitkomst? Zo hoeven we bij het typen
  // niets terug te zetten — we zien vanzelf dat de uitkomst nog niet bij de
  // vraag hoort, en dat ís "bezig".
  const [uitkomst, setUitkomst] = useState({ vraag: '', lijst: [], mislukt: false });

  const loopt = useRef(null);

  const vraag = tekst.trim();
  const kort = vraag.length < MINIMUM;
  const bezig = !kort && uitkomst.vraag !== vraag;

  useEffect(() => {
    if (vraag.length < MINIMUM) return undefined;

    const stoppen = new AbortController();
    loopt.current = stoppen;

    const klok = setTimeout(async () => {
      try {
        // Plekken bij jou in de buurt horen bovenaan te staan; vandaar dat we
        // meegeven waar je kijkt.
        const gevonden = await zoekPlekken(vraag, bijRef?.current, stoppen.signal);
        if (!stoppen.signal.aborted) {
          setUitkomst({ vraag, lijst: gevonden, mislukt: false });
        }
      } catch {
        if (!stoppen.signal.aborted) {
          setUitkomst({ vraag, lijst: [], mislukt: true });
        }
      }
    }, STILTE);

    // Typ je door, dan vervalt deze zoekopdracht meteen.
    return () => {
      clearTimeout(klok);
      stoppen.abort();
    };
  }, [vraag, bijRef]);

  const leeg = useCallback(() => {
    loopt.current?.abort();
    setTekst('');
  }, []);

  return (
    <View style={[stijl.vlak, style]} pointerEvents="box-none">
      <View style={[stijl.balk, schaduw.kaart]}>
        <Text style={stijl.teken}>🔍</Text>
        <TextInput
          value={tekst}
          onChangeText={setTekst}
          placeholder={t.kaart.zoekPlaceholder}
          placeholderTextColor={kleuren.inktFluister}
          style={[stijl.invoer, Platform.OS === 'web' && stijl.geenRandje]}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {bezig ? <ActivityIndicator size="small" color={kleuren.roze} /> : null}
        {tekst.length > 0 && !bezig ? (
          <Pressable onPress={leeg} hitSlop={10} style={stijl.kruisje}>
            <Text style={stijl.kruisjeTeken}>×</Text>
          </Pressable>
        ) : null}
      </View>

      {!kort ? (
        <View style={[stijl.lijst, schaduw.kaart]}>
          {uitkomst.lijst.length && !bezig ? (
            <ScrollView keyboardShouldPersistTaps="handled" style={stijl.rol}>
              {uitkomst.lijst.map((plek, i) => (
                <Pressable
                  key={plek.id}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    leeg();
                    opKiezen(plek);
                  }}
                  style={({ pressed }) => [
                    stijl.regel,
                    i > 0 && stijl.streep,
                    pressed && { backgroundColor: kleuren.rozeWolk },
                  ]}
                >
                  <Text style={stijl.regelTitel} numberOfLines={1}>
                    {plek.titel}
                  </Text>
                  {plek.ondertitel ? (
                    <Text style={stijl.regelTekst} numberOfLines={1}>
                      {plek.ondertitel}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text style={stijl.mager}>
              {bezig
                ? t.kaart.zoekBezig
                : uitkomst.mislukt
                  ? t.kaart.zoekFout
                  : t.kaart.zoekNiets}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const stijl = StyleSheet.create({
  vlak: { position: 'absolute', left: ruimte.l, right: ruimte.l },

  balk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.s,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: rond.vol,
    paddingHorizontal: ruimte.l,
    height: 44,
  },
  teken: { fontSize: 15 },
  invoer: {
    flex: 1,
    fontFamily: letters.halfvet,
    fontSize: 15,
    color: kleuren.inkt,
  },
  // Een browser tekent een eigen randje om een veld waar je in staat. Op een
  // telefoon bestaat die stijl niet, vandaar apart.
  geenRandje: { outlineStyle: 'none' },
  kruisje: { width: 20, alignItems: 'center' },
  kruisjeTeken: { fontSize: 21, lineHeight: 24, color: kleuren.inktZacht },

  lijst: {
    marginTop: ruimte.s,
    backgroundColor: kleuren.wit,
    borderRadius: rond.m,
    overflow: 'hidden',
  },
  rol: { maxHeight: 264 },
  regel: { paddingHorizontal: ruimte.l, paddingVertical: ruimte.m },
  streep: { borderTopWidth: 1, borderTopColor: kleuren.lijn },
  regelTitel: { fontFamily: letters.halfvet, fontSize: 15, color: kleuren.inkt },
  regelTekst: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktZacht,
    marginTop: 1,
  },
  mager: {
    fontFamily: letters.normaal,
    fontSize: 13.5,
    color: kleuren.inktZacht,
    textAlign: 'center',
    paddingHorizontal: ruimte.l,
    paddingVertical: ruimte.l,
  },
});
