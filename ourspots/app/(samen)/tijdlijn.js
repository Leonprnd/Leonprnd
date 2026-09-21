// Jullie verhaal van boven naar beneden: alle plekjes op volgorde van datum,
// met een lijntje ertussen zodat het als één verhaal leest.

import React, { useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../../src/state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw } from '../../src/theme';
import { Titel, Lopend, Leeg, Knop, Chip } from '../../src/components/basis';
import MomentKaartje from '../../src/components/MomentKaartje';
import { typeVan } from '../../src/momentTypes';
import { naarDate, maandJaar, korteDatum } from '../../src/utils/datum';
import { sorteerOpDatum, telFotos, eersteMoment } from '../../src/services/momenten';

export default function Tijdlijn() {
  const { momenten, momentenGeladen, kaart, t } = useApp();
  const rand = useSafeAreaInsets();

  // Nieuwste bovenaan, gegroepeerd per maand.
  const groepen = useMemo(() => {
    const gesorteerd = sorteerOpDatum(momenten, 'aflopend');
    const perMaand = new Map();

    gesorteerd.forEach((moment) => {
      const d = naarDate(moment.datum);
      const sleutel = d ? `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}` : 'onbekend';
      if (!perMaand.has(sleutel)) {
        perMaand.set(sleutel, { titel: d ? maandJaar(d) : t.tijdlijn.zonderDatum, data: [] });
      }
      perMaand.get(sleutel).data.push(moment);
    });

    return [...perMaand.values()];
  }, [momenten, t]);

  const aantalFotos = telFotos(momenten);
  const eerste = eersteMoment(momenten);
  const mijlpalen = momenten.filter((m) => typeVan(m.type).bijzonder).length;

  if (momentenGeladen && momenten.length === 0) {
    return (
      <View style={[stijl.vol, stijl.midden, { paddingTop: rand.top }]}>
        <Leeg
          icoon="📖"
          titel={t.tijdlijn.leegTitel}
          tekst={t.tijdlijn.leegTekst}
        >
          <Knop
            titel={t.tijdlijn.naarKaart}
            icoon="🗺️"
            onPress={() => router.replace('/(samen)/kaart')}
            style={{ marginTop: ruimte.l, paddingHorizontal: ruimte.xxl }}
          />
        </Leeg>
      </View>
    );
  }

  return (
    <View style={stijl.vol}>
      <SectionList
        sections={groepen}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingTop: rand.top + ruimte.l,
          paddingBottom: ruimte.xxl,
          paddingHorizontal: ruimte.l,
        }}
        ListHeaderComponent={
          <View style={stijl.kop}>
            <Titel>{t.tijdlijn.titel}</Titel>
            <Lopend zacht klein style={{ marginTop: 2 }}>
              {momenten.length}{' '}
              {momenten.length === 1 ? t.algemeen.plek : t.algemeen.plekken}
              {aantalFotos > 0
                ? ` · ${aantalFotos} ${aantalFotos === 1 ? t.algemeen.foto : t.algemeen.fotos}`
                : ''}
            </Lopend>

            <View style={stijl.chipRij}>
              {mijlpalen > 0 ? (
                <Chip tekst={t.tijdlijn.mijlpalen(mijlpalen)} icoon="✨" kleur={kleuren.goud} klein />
              ) : null}
              {eerste ? (
                <Chip
                  tekst={t.tijdlijn.vanaf(korteDatum(eerste.datum))}
                  icoon="🌱"
                  kleur={kleuren.mint}
                  klein
                />
              ) : null}
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={stijl.maandKop}>
            <View style={stijl.maandLijn} />
            <Text style={stijl.maandTekst}>{section.titel}</Text>
            <View style={stijl.maandLijn} />
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const type = typeVan(item.type);
          const laatste = index === section.data.length - 1;
          return (
            <View style={stijl.rij}>
              <View style={stijl.spoor}>
                <View style={[stijl.stip, { backgroundColor: type.kleur }]}>
                  <Text style={stijl.stipIcoon}>{type.icoon}</Text>
                </View>
                {!laatste ? <View style={stijl.draad} /> : null}
              </View>

              <View style={{ flex: 1, paddingBottom: ruimte.m }}>
                <MomentKaartje
                  moment={item}
                  opPress={() => router.push(`/moment/${item.id}`)}
                />
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          momenten.length > 0 ? (
            <Pressable
              onPress={() => router.replace('/(samen)/kaart')}
              style={({ pressed }) => [stijl.slot, pressed && { opacity: 0.7 }]}
            >
              <Text style={stijl.slotHart}>💞</Text>
              <Text style={stijl.slotTekst}>
                {kaart?.samenSinds ? t.tijdlijn.slot : t.tijdlijn.slotLeeg}
              </Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.rozeWolk },
  midden: { alignItems: 'center', justifyContent: 'center' },

  kop: { marginBottom: ruimte.l },
  chipRij: { flexDirection: 'row', gap: ruimte.s, marginTop: ruimte.m },

  maandKop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    marginTop: ruimte.m,
    marginBottom: ruimte.m,
  },
  maandLijn: { flex: 1, height: 1, backgroundColor: kleuren.lijn },
  maandTekst: {
    fontFamily: letters.handVet,
    fontSize: 21,
    color: kleuren.rozeDiep,
  },

  rij: { flexDirection: 'row', gap: ruimte.m },
  spoor: { width: 34, alignItems: 'center' },
  stip: {
    width: 30,
    height: 30,
    borderRadius: rond.vol,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: kleuren.wit,
    ...schaduw.zacht,
  },
  stipIcoon: { fontSize: 13 },
  draad: { flex: 1, width: 2, backgroundColor: kleuren.lijn, marginVertical: 3 },

  slot: { alignItems: 'center', marginTop: ruimte.xl, gap: 2 },
  slotHart: { fontSize: 26 },
  slotTekst: { fontFamily: letters.hand, fontSize: 19, color: kleuren.inktZacht },
});
