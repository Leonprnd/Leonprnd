// Eén herinnering als kaartje: in het rijtje onderaan de kaart en in de
// tijdlijn. Links een kleine stapel foto's, rechts wat er gebeurd is.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { kleuren, letters, ruimte, rond, schaduw } from '../theme';
import { typeVan } from '../momentTypes';
import { korteDatum } from '../utils/datum';
import { fotoUrl, MINI } from '../cloudinary';

export default function MomentKaartje({ moment, opPress, breed, actief }) {
  const type = typeVan(moment.type);
  const fotos = moment.fotos || [];
  const hartjes = Object.values(moment.hartjes || {}).filter(Boolean).length;

  return (
    <Pressable
      onPress={opPress}
      style={({ pressed }) => [
        stijl.kaartje,
        schaduw.zacht,
        breed && stijl.breed,
        actief && { borderColor: type.kleur, borderWidth: 2 },
        pressed && { transform: [{ scale: 0.985 }] },
      ]}
    >
      <MiniStapel fotos={fotos} kleur={type.kleur} icoon={type.icoon} />

      <View style={stijl.tekst}>
        <View style={stijl.bovenrij}>
          <View style={[stijl.typeBol, { backgroundColor: `${type.kleur}22` }]}>
            <Text style={stijl.typeIcoon}>{type.icoon}</Text>
          </View>
          <Text style={[stijl.typeLabel, { color: type.kleur }]} numberOfLines={1}>
            {type.label}
          </Text>
          {type.bijzonder ? <Text style={stijl.ster}>✨</Text> : null}
        </View>

        <Text style={stijl.titel} numberOfLines={1}>
          {moment.titel}
        </Text>
        <Text style={stijl.datum} numberOfLines={1}>
          {korteDatum(moment.datum)}
        </Text>

        {moment.beschrijving ? (
          <Text style={stijl.beschrijving} numberOfLines={2}>
            {moment.beschrijving}
          </Text>
        ) : null}

        <View style={stijl.onderrij}>
          {fotos.length > 0 ? (
            <Text style={stijl.klein}>
              {fotos.length} {fotos.length === 1 ? 'foto' : "foto's"}
            </Text>
          ) : null}
          {hartjes > 0 ? <Text style={stijl.klein}>{'💗'.repeat(hartjes)}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

// Drie foto's achter elkaar, net als de grote stapel maar dan klein.
export function MiniStapel({ fotos, kleur, icoon, maat = 76 }) {
  const zichtbaar = (fotos || []).slice(0, 3);

  if (!zichtbaar.length) {
    return (
      <View style={[stijl.geenFoto, { width: maat, height: maat, backgroundColor: `${kleur}1A` }]}>
        <Text style={{ fontSize: maat * 0.4 }}>{icoon}</Text>
      </View>
    );
  }

  return (
    <View style={{ width: maat, height: maat }}>
      {zichtbaar
        .slice()
        .reverse()
        .map((foto, i) => {
          const diepte = zichtbaar.length - 1 - i;
          const hoeken = [0, -6, 7];
          return (
            <Image
              key={foto.url || i}
              source={{ uri: fotoUrl(foto.url, MINI) }}
              contentFit="cover"
              transition={180}
              cachePolicy="memory-disk"
              style={[
                stijl.miniFoto,
                {
                  width: maat - diepte * 6,
                  height: maat - diepte * 6,
                  top: diepte * 3,
                  left: diepte * 3,
                  zIndex: 3 - diepte,
                  transform: [{ rotate: `${hoeken[diepte] || 0}deg` }],
                },
              ]}
            />
          );
        })}
      {fotos.length > 3 ? (
        <View style={stijl.meerBadge}>
          <Text style={stijl.meerTekst}>+{fotos.length - 3}</Text>
        </View>
      ) : null}
    </View>
  );
}

const stijl = StyleSheet.create({
  kaartje: {
    flexDirection: 'row',
    gap: ruimte.m,
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.m,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  breed: { width: 300 },

  tekst: { flex: 1, justifyContent: 'center' },
  bovenrij: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeBol: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIcoon: { fontSize: 12 },
  typeLabel: {
    fontFamily: letters.halfvet,
    fontSize: 11.5,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  ster: { fontSize: 11 },

  titel: {
    fontFamily: letters.vet,
    fontSize: 16.5,
    color: kleuren.inkt,
    marginTop: 3,
  },
  datum: {
    fontFamily: letters.hand,
    fontSize: 17,
    color: kleuren.rozeDiep,
    marginTop: -1,
  },
  beschrijving: {
    fontFamily: letters.normaal,
    fontSize: 13,
    lineHeight: 18,
    color: kleuren.inktZacht,
    marginTop: 3,
  },
  onderrij: { flexDirection: 'row', gap: ruimte.s, marginTop: 5, alignItems: 'center' },
  klein: { fontFamily: letters.normaal, fontSize: 11.5, color: kleuren.inktFluister },

  geenFoto: {
    borderRadius: rond.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniFoto: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: kleuren.wit,
    backgroundColor: kleuren.rozeZacht,
  },
  meerBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    minWidth: 22,
    paddingHorizontal: 5,
    height: 20,
    borderRadius: 10,
    backgroundColor: kleuren.rozeDiep,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  meerTekst: { fontFamily: letters.vet, fontSize: 10.5, color: kleuren.wit },
});
