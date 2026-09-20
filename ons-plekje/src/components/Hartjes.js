// Hartjes die omhoog zweven. Klein feestje als er iets liefs gebeurt:
// een nieuwe herinnering opgeslagen, of jullie zijn net gekoppeld.

import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useAnimatie } from '../utils/animatie';

const SCHERM = Dimensions.get('window');
const TEKENS = ['💗', '💕', '✨', '💖', '🩷', '💞'];

export default function Hartjes({ aan, aantal = 14, opKlaar }) {
  if (!aan) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: aantal }, (_, i) => (
        <Hartje key={i} index={i} aantal={aantal} opKlaar={i === 0 ? opKlaar : undefined} />
      ))}
    </View>
  );
}

function Hartje({ index, aantal, opKlaar }) {
  const stijg = useAnimatie(0);

  const startX = (SCHERM.width / (aantal + 1)) * (index + 1) - 14;
  const zwaai = (index % 2 === 0 ? 1 : -1) * (24 + (index % 4) * 12);
  const vertraging = index * 85;
  const duur = 2100 + (index % 5) * 260;
  const grootte = 20 + (index % 4) * 7;

  useEffect(() => {
    const animatie = Animated.timing(stijg, {
      toValue: 1,
      duration: duur,
      delay: vertraging,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animatie.start(({ finished }) => {
      if (finished && opKlaar) opKlaar();
    });
    return () => animatie.stop();
  }, [stijg, duur, vertraging, opKlaar]);

  const y = stijg.interpolate({
    inputRange: [0, 1],
    outputRange: [SCHERM.height * 0.62, -80],
  });
  const x = stijg.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, zwaai, 0],
  });
  const doorzicht = stijg.interpolate({
    inputRange: [0, 0.12, 0.75, 1],
    outputRange: [0, 1, 1, 0],
  });
  const draai = stijg.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${zwaai > 0 ? 24 : -24}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        opacity: doorzicht,
        transform: [{ translateY: y }, { translateX: x }, { rotate: draai }],
      }}
    >
      <Text style={{ fontSize: grootte }}>{TEKENS[index % TEKENS.length]}</Text>
    </Animated.View>
  );
}
