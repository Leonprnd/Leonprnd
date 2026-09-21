// Wat er in het blad onder de kaart staat: bovenaan wie waar is, daaronder
// alle plekken.
//
// De kop en de lijst zijn apart, want het blad gebruikt de kop als handvat om
// aan te slepen en de lijst als inhoud die zelf mag schuiven.

import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { kleuren, letters, ruimte, rond } from '../theme';
import { useApp } from '../state/AppProvider';
import { afstandInMeter, afstandTekst } from '../utils/afstand';
import { geledenKort, korteDatum } from '../utils/datum';
import { typeVan } from '../momentTypes';
import { fotoUrl, MINI } from '../cloudinary';
import PlekRegel from './PlekRegel';

export const REGEL_HOOGTE = 66;

// --- De kop: het handvat van het blad ---------------------------------------

export function BladKop({ aantal, sortering, opSortering, kanDichtbij }) {
  const { t } = useApp();

  return (
    <View style={stijl.kop}>
      <View style={stijl.kopTekst}>
        <Text style={stijl.kopTitel}>{t.kaart.bladTitel}</Text>
        <Text style={stijl.kopAantal}>
          {aantal} {aantal === 1 ? t.algemeen.plek : t.algemeen.plekken}
        </Text>
      </View>

      {aantal > 1 ? (
        <View style={stijl.chips}>
          <Chip
            aan={sortering === 'recent'}
            tekst={t.kaart.sorteerRecent}
            opPress={() => opSortering('recent')}
          />
          {kanDichtbij ? (
            <Chip
              aan={sortering === 'dichtbij'}
              tekst={t.kaart.sorteerDichtbij}
              opPress={() => opSortering('dichtbij')}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function Chip({ aan, tekst, opPress }) {
  return (
    <Pressable
      onPress={opPress}
      style={({ pressed }) => [
        stijl.chip,
        aan && stijl.chipAan,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[stijl.chipTekst, aan && stijl.chipTekstAan]}>{tekst}</Text>
    </Pressable>
  );
}

// De kop van het blad zodra je een plek gekozen hebt: de foto, welke plek het
// is, en een knop om hem open te slaan. Precies genoeg om te weten waar je
// naar kijkt zonder dat het blad omhoog hoeft.
export function GekozenKop({ moment, afstand, opOpenen }) {
  const { t } = useApp();
  const type = typeVan(moment.type);
  const foto = moment.fotos?.[0]?.url || null;

  return (
    <View style={stijl.gekozenKop}>
      <View style={[stijl.gekozenFoto, { backgroundColor: `${type.kleur}1F` }]}>
        {foto ? (
          <Image
            source={{ uri: fotoUrl(foto, MINI) }}
            style={stijl.gekozenFotoBeeld}
            contentFit="cover"
            transition={160}
            cachePolicy="memory-disk"
          />
        ) : (
          <Text style={stijl.gekozenIcoon}>{type.icoon}</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={stijl.gekozenTitel} numberOfLines={1}>
          {moment.titel || t.types[type.id].label}
        </Text>
        <Text style={stijl.gekozenOnder} numberOfLines={1}>
          {[t.types[type.id].label, korteDatum(moment.datum), afstand]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>

      <Pressable
        onPress={opOpenen}
        style={({ pressed }) => [stijl.openen, pressed && { opacity: 0.75 }]}
      >
        <Text style={stijl.openenTekst}>{t.kaart.openen}</Text>
      </Pressable>
    </View>
  );
}

// --- Wie waar is ------------------------------------------------------------

function PersoonRegel({ emoji, kleur, naam, onder, stil, opPress }) {
  return (
    <Pressable
      onPress={opPress}
      disabled={!opPress}
      style={({ pressed }) => [stijl.persoon, pressed && opPress && { opacity: 0.7 }]}
    >
      <View style={[stijl.bol, { borderColor: kleur || kleuren.roze }]}>
        <Text style={stijl.bolEmoji}>{emoji || '💗'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={stijl.persoonNaam} numberOfLines={1}>
          {naam}
        </Text>
        <Text style={[stijl.persoonOnder, stil && { color: kleuren.inktFluister }]} numberOfLines={1}>
          {onder}
        </Text>
      </View>
      {opPress ? <View style={[stijl.stip, { backgroundColor: kleur || kleuren.roze }]} /> : null}
    </Pressable>
  );
}

// --- De lijst ---------------------------------------------------------------

export function BladLijst({
  lijstRef,
  momenten,
  gekozenId,
  mijnPositie,
  partner,
  partnerLocatie,
  gekoppeld,
  opPlek,
  opPartner,
  opMij,
  onder,
}) {
  const { t, profiel } = useApp();

  const partnerAfstand =
    mijnPositie && partnerLocatie
      ? afstandTekst(afstandInMeter(mijnPositie, partnerLocatie))
      : null;

  // "0 m" leest als een foutje. Sta je er praktisch bovenop, dan is "hier"
  // wat je bedoelt.
  function hoeVer(moment) {
    if (!mijnPositie) return null;
    const meters = afstandInMeter(mijnPositie, moment);
    if (meters == null) return null;
    return meters < 60 ? t.kaart.hier : afstandTekst(meters);
  }

  const kop = (
    <View style={stijl.mensen}>
      {gekoppeld && partner ? (
        <PersoonRegel
          emoji={partner.emoji}
          kleur={partner.kleur}
          naam={partner.naam || t.wij.partner}
          stil={!partnerLocatie}
          onder={
            partnerLocatie
              ? [partnerAfstand, geledenKort(partnerLocatie.bijgewerktOp)]
                  .filter(Boolean)
                  .join(' · ')
              : t.kaart.partnerGeenLocatie(partner.naam || t.wij.partner)
          }
          opPress={partnerLocatie ? opPartner : undefined}
        />
      ) : null}

      <PersoonRegel
        emoji={profiel?.emoji}
        kleur={profiel?.kleur}
        naam={t.wij.jij}
        stil={!mijnPositie}
        onder={mijnPositie ? t.kaart.jouwLocatie : t.kaart.jijGeenLocatie}
        opPress={mijnPositie ? opMij : undefined}
      />
    </View>
  );

  return (
    <FlatList
      ref={lijstRef}
      data={momenten}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={kop}
      contentContainerStyle={{ paddingBottom: onder }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      getItemLayout={(_, index) => ({
        length: REGEL_HOOGTE,
        offset: REGEL_HOOGTE * index,
        index,
      })}
      renderItem={({ item, index }) => (
        <PlekRegel
          moment={item}
          actief={item.id === gekozenId}
          scheiding={index > 0}
          afstand={hoeVer(item)}
          opPress={() => opPlek(item)}
        />
      )}
      ListEmptyComponent={
        <View style={stijl.leeg}>
          <Text style={stijl.leegIcoon}>📍</Text>
          <Text style={stijl.leegTitel}>{t.kaart.leegTitel}</Text>
          <Text style={stijl.leegTekst}>{t.kaart.leegTekst}</Text>
        </View>
      }
    />
  );
}

const stijl = StyleSheet.create({
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ruimte.l,
    paddingBottom: ruimte.s,
    gap: ruimte.m,
  },
  kopTekst: { flex: 1 },
  kopTitel: { fontFamily: letters.vet, fontSize: 17, color: kleuren.inkt },
  kopAantal: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktZacht,
    marginTop: 1,
  },

  gekozenKop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    paddingHorizontal: ruimte.l,
    paddingBottom: ruimte.s,
  },
  gekozenFoto: {
    width: 44,
    height: 44,
    borderRadius: rond.s,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gekozenFotoBeeld: { width: '100%', height: '100%' },
  gekozenIcoon: { fontSize: 21 },
  gekozenTitel: { fontFamily: letters.vet, fontSize: 16, color: kleuren.inkt },
  gekozenOnder: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktZacht,
    marginTop: 1,
  },
  openen: {
    paddingHorizontal: ruimte.l,
    paddingVertical: 8,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeWolk,
  },
  openenTekst: { fontFamily: letters.halfvet, fontSize: 13, color: kleuren.rozeDiep },

  chips: { flexDirection: 'row', gap: 6 },
  chip: {
    paddingHorizontal: ruimte.m,
    paddingVertical: 6,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeWolk,
  },
  chipAan: { backgroundColor: kleuren.roze },
  chipTekst: { fontFamily: letters.halfvet, fontSize: 12, color: kleuren.inktZacht },
  chipTekstAan: { color: kleuren.wit },

  mensen: {
    paddingTop: 2,
    paddingBottom: ruimte.s,
    marginBottom: ruimte.s,
    borderBottomWidth: 1,
    borderBottomColor: kleuren.lijn,
  },
  persoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    paddingHorizontal: ruimte.l,
    paddingVertical: 7,
  },
  bol: {
    width: 42,
    height: 42,
    borderRadius: rond.vol,
    borderWidth: 2.5,
    backgroundColor: kleuren.wit,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolEmoji: { fontSize: 20 },
  persoonNaam: { fontFamily: letters.vet, fontSize: 15, color: kleuren.inkt },
  persoonOnder: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktZacht,
    marginTop: 1,
  },
  stip: { width: 8, height: 8, borderRadius: rond.vol },

  leeg: { alignItems: 'center', paddingHorizontal: ruimte.xl, paddingTop: ruimte.l },
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
});
