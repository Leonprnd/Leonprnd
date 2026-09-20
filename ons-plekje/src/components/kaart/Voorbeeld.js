// Het stilstaande kaartje bovenaan het scherm waar je een plekje maakt: even
// laten zien waar je pin komt te staan. Werkt met allebei de kaartsoorten.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { gebruiktOpenStreetMap, heeftGoogleSleutel, kleurthemaWerkt } from '../../kaartProvider';
import { kaartStijl } from '../../mapStyle';
import { kleuren } from '../../theme';
import MomentPin from '../MomentPin';

const TEGEL = 256;
const ZOOM = 15;

export default function Voorbeeld({ lat, lng, type, style }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return <View style={[stijl.leeg, style]} />;
  }

  return (
    <View style={[stijl.vlak, style]}>
      {gebruiktOpenStreetMap ? (
        <>
          <Tegels lat={lat} lng={lng} />
          <View style={stijl.waas} pointerEvents="none" />
          <View style={stijl.pinVlak} pointerEvents="none">
            <MomentPin moment={{ type }} gekozen />
          </View>
        </>
      ) : (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={heeftGoogleSleutel ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          customMapStyle={kleurthemaWerkt ? kaartStijl : undefined}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          pointerEvents="none"
        >
          <Marker coordinate={{ latitude: lat, longitude: lng }} anchor={{ x: 0.5, y: 1 }}>
            <MomentPin moment={{ type }} gekozen />
          </Marker>
        </MapView>
      )}
    </View>
  );
}

// De tegelwiskunde van OpenStreetMap: van graden naar tegelnummers.
function tegelVan(lat, lng, zoom) {
  const n = 2 ** zoom;
  const radialen = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(radialen) + 1 / Math.cos(radialen)) / Math.PI) / 2) * n,
  };
}

// Een plat plaatje van de omgeving: negen tegels rond je plek. Voor een
// stilstaand voorbeeldje is een hele Leaflet-kaart in een WebView zonde.
function Tegels({ lat, lng }) {
  const { x, y } = tegelVan(lat, lng, ZOOM);
  const middenX = Math.floor(x);
  const middenY = Math.floor(y);

  // Drie bij drie, met de middelste tegel om je plek heen. Zo ligt er altijd
  // minstens één hele tegel aan elke kant, hoe dicht je ook bij een rand zit.
  const tegels = [];
  for (let rij = -1; rij <= 1; rij += 1) {
    for (let kolom = -1; kolom <= 1; kolom += 1) {
      tegels.push({
        x: middenX + kolom,
        y: middenY + rij,
        links: (kolom + 1) * TEGEL,
        boven: (rij + 1) * TEGEL,
      });
    }
  }

  // Waar ligt je plek binnen dat blok van 768 px? Die plek schuiven we naar
  // het midden van het vakje.
  const plekInBlokX = (x - middenX + 1) * TEGEL;
  const plekInBlokY = (y - middenY + 1) * TEGEL;

  return (
    <View style={stijl.tegelVlak} pointerEvents="none">
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -plekInBlokX,
          marginTop: -plekInBlokY,
          width: TEGEL * 3,
          height: TEGEL * 3,
        }}
      >
        {tegels.map((tegel) => (
          <Image
            key={`${tegel.x}-${tegel.y}`}
            source={{
              uri: `https://a.basemaps.cartocdn.com/light_all/${ZOOM}/${tegel.x}/${tegel.y}.png`,
            }}
            style={{
              position: 'absolute',
              left: tegel.links,
              top: tegel.boven,
              width: TEGEL,
              height: TEGEL,
            }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ))}
      </View>
    </View>
  );
}

const stijl = StyleSheet.create({
  vlak: { overflow: 'hidden', backgroundColor: kleuren.rozeZacht },
  leeg: { backgroundColor: kleuren.rozeZacht },
  tegelVlak: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },

  // Hetzelfde roze waasje als op de grote kaart.
  waas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: kleuren.roze,
    opacity: 0.12,
  },

  // De punt van de pin moet op het midden staan, niet het midden van de pin
  // zelf — vandaar de ruimte eronder.
  pinVlak: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
});
