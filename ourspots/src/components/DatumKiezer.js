// Wanneer was dit? Een eigen kalendertje, zodat er geen extra pakket nodig is
// en hij past bij de rest van de app.

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { kleuren, letters, ruimte, rond, schaduw } from '../theme';
import { naarDate, naarDatumSleutel, langeDatum, vandaagSleutel } from '../utils/datum';
import { useApp } from '../state/AppProvider';
import { speel } from '../services/geluid';



export default function DatumKiezer({ datum, opWijziging, style }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          setOpen(true);
        }}
        style={({ pressed }) => [stijl.veld, pressed && { opacity: 0.8 }, style]}
      >
        <View style={{ flex: 1 }}>
          <Text style={stijl.label}>{t.moment.wanneerLabel}</Text>
          <Text style={stijl.waarde}>{langeDatum(datum) || t.moment.kiesDatum}</Text>
        </View>
        <Text style={stijl.kalenderIcoon}>🗓️</Text>
      </Pressable>

      <Kalender
        t={t}
        open={open}
        datum={datum}
        opSluiten={() => setOpen(false)}
        opKiezen={(sleutel) => {
          opWijziging(sleutel);
          setOpen(false);
        }}
      />
    </>
  );
}

function Kalender({ t, open, datum, opKiezen, opSluiten }) {
  const gekozen = naarDate(datum) || new Date();
  const [bladert, setBladert] = useState({
    jaar: gekozen.getFullYear(),
    maand: gekozen.getMonth(),
  });
  const [jaarLijst, setJaarLijst] = useState(false);

  const gekozenSleutel = naarDatumSleutel(gekozen);
  const vandaag = vandaagSleutel();

  // De vakjes van de maand: eerst de lege plekken tot de eerste dag.
  const vakjes = useMemo(() => {
    const eerste = new Date(bladert.jaar, bladert.maand, 1);
    const aantalDagen = new Date(bladert.jaar, bladert.maand + 1, 0).getDate();
    // getDay() geeft 0 voor zondag; wij beginnen de week op maandag.
    const voorloop = (eerste.getDay() + 6) % 7;

    const lijst = Array.from({ length: voorloop }, () => null);
    for (let d = 1; d <= aantalDagen; d += 1) {
      lijst.push(new Date(bladert.jaar, bladert.maand, d));
    }
    return lijst;
  }, [bladert]);

  function schuifMaand(richting) {
    Haptics.selectionAsync().catch(() => {});
    setBladert((oud) => {
      const nieuw = new Date(oud.jaar, oud.maand + richting, 1);
      return { jaar: nieuw.getFullYear(), maand: nieuw.getMonth() };
    });
  }

  const nuJaar = new Date().getFullYear();
  const jaren = Array.from({ length: 16 }, (_, i) => nuJaar - 14 + i);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={opSluiten}>
      <Pressable style={stijl.achtergrond} onPress={opSluiten}>
        <Pressable style={[stijl.venster, schaduw.kaart]} onPress={(e) => e.stopPropagation()}>
          <View style={stijl.kop}>
            <Pressable onPress={() => schuifMaand(-1)} hitSlop={12} style={stijl.pijlKnop}>
              <Text style={stijl.pijl}>‹</Text>
            </Pressable>

            <Pressable onPress={() => setJaarLijst((x) => !x)} hitSlop={8}>
              <Text style={stijl.maandTitel}>
                {t.datum.maanden[bladert.maand]} {bladert.jaar}
              </Text>
              <Text style={stijl.maandHint}>
                {jaarLijst ? t.datum.kiesJaar : t.datum.tikJaar}
              </Text>
            </Pressable>

            <Pressable onPress={() => schuifMaand(1)} hitSlop={12} style={stijl.pijlKnop}>
              <Text style={stijl.pijl}>›</Text>
            </Pressable>
          </View>

          {jaarLijst ? (
            <ScrollView style={stijl.jaren} contentContainerStyle={stijl.jaarRaster}>
              {jaren.map((jaar) => (
                <Pressable
                  key={jaar}
                  onPress={() => {
                    setBladert((oud) => ({ ...oud, jaar }));
                    setJaarLijst(false);
                  }}
                  style={[stijl.jaarVak, jaar === bladert.jaar && stijl.jaarActief]}
                >
                  <Text
                    style={[stijl.jaarTekst, jaar === bladert.jaar && { color: kleuren.wit }]}
                  >
                    {jaar}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <>
              <View style={stijl.dagKoppen}>
                {t.datum.dagkoppen.map((d) => (
                  <Text key={d} style={stijl.dagKop}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={stijl.raster}>
                {vakjes.map((dag, i) => {
                  if (!dag) return <View key={`leeg-${i}`} style={stijl.vakje} />;

                  const sleutel = naarDatumSleutel(dag);
                  const isGekozen = sleutel === gekozenSleutel;
                  const isVandaag = sleutel === vandaag;

                  return (
                    <Pressable
                      key={sleutel}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        speel('tik');
                        opKiezen(sleutel);
                      }}
                      style={[
                        stijl.vakje,
                        isGekozen && stijl.vakjeGekozen,
                        !isGekozen && isVandaag && stijl.vakjeVandaag,
                      ]}
                    >
                      <Text
                        style={[
                          stijl.dagTekst,
                          isGekozen && { color: kleuren.wit },
                          !isGekozen && isVandaag && { color: kleuren.rozeDiep },
                        ]}
                      >
                        {dag.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <View style={stijl.onderrij}>
            <Pressable onPress={() => opKiezen(vandaag)} hitSlop={8}>
              <Text style={stijl.snelknop}>{t.algemeen.vandaag}</Text>
            </Pressable>
            <Pressable onPress={opSluiten} hitSlop={8}>
              <Text style={[stijl.snelknop, { color: kleuren.inktZacht }]}>
                {t.algemeen.sluiten}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const stijl = StyleSheet.create({
  veld: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: kleuren.wit,
    borderRadius: rond.m,
    borderWidth: 1.5,
    borderColor: kleuren.lijn,
    paddingHorizontal: ruimte.l,
    paddingVertical: ruimte.m,
  },
  label: {
    fontFamily: letters.halfvet,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: 4,
  },
  waarde: { fontFamily: letters.halfvet, fontSize: 16, color: kleuren.inkt },
  kalenderIcoon: { fontSize: 21 },

  achtergrond: {
    flex: 1,
    backgroundColor: 'rgba(60,32,44,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ruimte.xl,
  },
  venster: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: kleuren.wit,
    borderRadius: rond.xl,
    padding: ruimte.l,
  },

  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ruimte.m,
  },
  pijlKnop: {
    width: 36,
    height: 36,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeWolk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pijl: { fontSize: 24, color: kleuren.rozeDiep, fontFamily: letters.normaal, marginTop: -3 },
  maandTitel: {
    fontFamily: letters.vet,
    fontSize: 17,
    color: kleuren.inkt,
    textAlign: 'center',
  },
  maandHint: {
    fontFamily: letters.normaal,
    fontSize: 10.5,
    color: kleuren.inktFluister,
    textAlign: 'center',
  },

  dagKoppen: { flexDirection: 'row', marginBottom: 4 },
  dagKop: {
    flex: 1,
    textAlign: 'center',
    fontFamily: letters.halfvet,
    fontSize: 11,
    color: kleuren.inktFluister,
  },
  raster: { flexDirection: 'row', flexWrap: 'wrap' },
  vakje: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rond.vol,
  },
  vakjeGekozen: { backgroundColor: kleuren.roze },
  vakjeVandaag: { backgroundColor: kleuren.rozeZacht },
  dagTekst: { fontFamily: letters.halfvet, fontSize: 14.5, color: kleuren.inkt },

  jaren: { maxHeight: 240 },
  jaarRaster: { flexDirection: 'row', flexWrap: 'wrap', gap: ruimte.s, paddingVertical: 4 },
  jaarVak: {
    paddingHorizontal: ruimte.l,
    paddingVertical: ruimte.s,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeWolk,
  },
  jaarActief: { backgroundColor: kleuren.roze },
  jaarTekst: { fontFamily: letters.halfvet, fontSize: 14.5, color: kleuren.inkt },

  onderrij: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ruimte.m,
    paddingTop: ruimte.m,
    borderTopWidth: 1,
    borderTopColor: kleuren.lijn,
  },
  snelknop: { fontFamily: letters.vet, fontSize: 14.5, color: kleuren.rozeDiep },
});
