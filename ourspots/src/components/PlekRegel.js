// Eén plek als regel in het blad onder de kaart.
//
// Smal en rustig, zodat er veel op je scherm passen: links de foto (of het
// icoontje als er geen foto is), in het midden wat het was, rechts hoe ver weg.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { kleuren, letters, ruimte, rond } from '../theme';
import { typeVan } from '../momentTypes';
import { korteDatum } from '../utils/datum';
import { fotoUrl, MINI } from '../cloudinary';
import { useApp } from '../state/AppProvider';

export default function PlekRegel({ moment, actief, afstand, scheiding, opPress }) {
  const { t } = useApp();
  const type = typeVan(moment.type);
  const foto = moment.fotos?.[0]?.url || null;
  const aantal = moment.fotos?.length || 0;

  return (
    <Pressable
      onPress={opPress}
      style={({ pressed }) => [
        stijl.regel,
        actief && { backgroundColor: kleuren.rozeWolk },
        pressed && { backgroundColor: kleuren.rozeZacht },
      ]}
    >
      {/* Ligt los over de regel heen, zodat elke regel even hoog blijft — de
          lijst rekent met een vaste hoogte om naar een plek toe te springen. */}
      {scheiding && !actief ? <View style={stijl.streep} /> : null}

      <View
        style={[
          stijl.vierkant,
          { backgroundColor: foto ? kleuren.rozeZacht : `${type.kleur}1F` },
          actief && { borderColor: type.kleur, borderWidth: 2 },
        ]}
      >
        {foto ? (
          <Image
            source={{ uri: fotoUrl(foto, MINI) }}
            style={stijl.foto}
            contentFit="cover"
            transition={160}
            cachePolicy="memory-disk"
          />
        ) : (
          <Text style={stijl.icoon}>{type.icoon}</Text>
        )}

        {aantal > 1 ? (
          <View style={stijl.telletje}>
            <Text style={stijl.telletjeTekst}>{aantal}</Text>
          </View>
        ) : null}
      </View>

      <View style={stijl.tekst}>
        <Text style={stijl.titel} numberOfLines={1}>
          {moment.titel || t.types[type.id].label}
        </Text>
        <View style={stijl.onderrij}>
          {type.bijzonder ? <Text style={stijl.hartje}>💖</Text> : null}
          <Text style={[stijl.label, { color: type.kleur }]} numberOfLines={1}>
            {t.types[type.id].label}
          </Text>
          <Text style={stijl.punt}>·</Text>
          <Text style={stijl.datum} numberOfLines={1}>
            {korteDatum(moment.datum)}
          </Text>
        </View>
      </View>

      {afstand ? <Text style={stijl.afstand}>{afstand}</Text> : null}
    </Pressable>
  );
}

const stijl = StyleSheet.create({
  streep: {
    position: 'absolute',
    left: 76,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: kleuren.lijn,
  },
  regel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    paddingHorizontal: ruimte.l,
    paddingVertical: 9,
  },
  vierkant: {
    width: 48,
    height: 48,
    borderRadius: rond.s,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foto: { width: '100%', height: '100%' },
  icoon: { fontSize: 22 },
  telletje: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: rond.vol,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telletjeTekst: { fontFamily: letters.vet, fontSize: 10, color: kleuren.rozeDiep },

  tekst: { flex: 1 },
  titel: { fontFamily: letters.vet, fontSize: 15, color: kleuren.inkt },
  onderrij: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  hartje: { fontSize: 10.5 },
  label: { fontFamily: letters.halfvet, fontSize: 12, flexShrink: 1 },
  punt: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktFluister },
  datum: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktZacht },

  afstand: {
    fontFamily: letters.halfvet,
    fontSize: 12,
    color: kleuren.inktZacht,
  },
});
