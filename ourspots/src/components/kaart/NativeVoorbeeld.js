// Het voorbeeldkaartje met react-native-maps. Op het web bestaat die
// bibliotheek niet; daar komt NativeVoorbeeld.web.js voor in de plaats.

import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { heeftGoogleSleutel, kleurthemaWerkt } from '../../kaartProvider';
import { kaartStijl } from '../../mapStyle';
import MomentPin from '../MomentPin';

export default function NativeVoorbeeld({ lat, lng, type }) {
  return (
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
  );
}
