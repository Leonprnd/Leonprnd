// De kaart via react-native-maps: Google Maps als je een sleutel hebt,
// Apple Maps op een iPhone in Expo Go.

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { heeftGoogleSleutel, kleurthemaWerkt } from '../../kaartProvider';
import { kaartStijl } from '../../mapStyle';
import MomentPin, { PartnerStip, useTekenEenKeer } from '../MomentPin';

const BEGIN_GEBIED = {
  latitude: 52.1326,
  longitude: 5.2913,
  latitudeDelta: 3.2,
  longitudeDelta: 3.2,
};

const NativeKaart = forwardRef(function NativeKaart(
  {
    momenten,
    gekozenId,
    partner,
    partnerLocatie,
    toonMij,
    marges,
    opMomentPress,
    opLangDrukken,
    opAchtergrond,
    opMidden,
  },
  ref,
) {
  const kaartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    gaNaar(lat, lng, zoom) {
      kaartRef.current?.animateCamera(
        { center: { latitude: lat, longitude: lng }, ...(zoom ? { zoom } : {}) },
        { duration: 600 },
      );
    },
    pasAan(punten) {
      if (!punten?.length) return;
      if (punten.length === 1) {
        kaartRef.current?.animateCamera(
          { center: { latitude: punten[0].lat, longitude: punten[0].lng }, zoom: 14 },
          { duration: 650 },
        );
        return;
      }
      kaartRef.current?.fitToCoordinates(
        punten.map((p) => ({ latitude: p.lat, longitude: p.lng })),
        {
          edgePadding: {
            top: marges?.boven ?? 160,
            right: 70,
            bottom: marges?.onder ?? 260,
            left: 70,
          },
          animated: true,
        },
      );
    },
  }));

  return (
    <MapView
      ref={kaartRef}
      style={StyleSheet.absoluteFill}
      provider={heeftGoogleSleutel ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      customMapStyle={kleurthemaWerkt ? kaartStijl : undefined}
      initialRegion={BEGIN_GEBIED}
      onRegionChange={(gebied) => opMidden?.({ lat: gebied.latitude, lng: gebied.longitude })}
      onLongPress={(e) =>
        opLangDrukken?.({
          lat: e.nativeEvent.coordinate.latitude,
          lng: e.nativeEvent.coordinate.longitude,
        })
      }
      onPress={() => opAchtergrond?.()}
      showsUserLocation={toonMij}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      mapPadding={{
        top: marges?.boven ?? 90,
        right: 0,
        bottom: marges?.onder ?? 210,
        left: 0,
      }}
    >
      {momenten.map((moment) => (
        <MomentMarkering
          key={moment.id}
          moment={moment}
          gekozen={gekozenId === moment.id}
          opPress={() => opMomentPress?.(moment.id)}
        />
      ))}

      {partnerLocatie?.lat != null && partner ? (
        <Marker
          coordinate={{ latitude: partnerLocatie.lat, longitude: partnerLocatie.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={999}
          tracksViewChanges={false}
        >
          <PartnerStip emoji={partner.emoji} kleur={partner.kleur} naam={partner.naam} />
        </Marker>
      ) : null}
    </MapView>
  );
});

// Elke pin apart, zodat hij na het tekenen stil kan blijven staan (scheelt accu).
function MomentMarkering({ moment, gekozen, opPress }) {
  const tekent = useTekenEenKeer(`${gekozen}-${moment.fotos?.length || 0}-${moment.type}`);

  if (!Number.isFinite(moment.lat) || !Number.isFinite(moment.lng)) return null;

  return (
    <Marker
      coordinate={{ latitude: moment.lat, longitude: moment.lng }}
      anchor={{ x: 0.5, y: 1 }}
      onPress={opPress}
      tracksViewChanges={tekent}
      zIndex={gekozen ? 500 : 1}
    >
      <MomentPin moment={moment} gekozen={gekozen} aantalFotos={moment.fotos?.length || 0} />
    </Marker>
  );
}

export default NativeKaart;
