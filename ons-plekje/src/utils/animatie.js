// Kleine hulpjes voor animaties.
//
// De klassieke manier is useRef(new Animated.Value(0)).current, maar dat leest
// een ref tijdens het tekenen — iets waar React tegenwoordig terecht over
// klaagt. useState met een startfunctie geeft precies hetzelfde: de waarde
// wordt één keer gemaakt en blijft daarna hetzelfde.

import { useState } from 'react';
import { Animated } from 'react-native';

export function useAnimatie(begin = 0) {
  const [waarde] = useState(() => new Animated.Value(begin));
  return waarde;
}

export function useAnimatieXY(begin = { x: 0, y: 0 }) {
  const [waarde] = useState(() => new Animated.ValueXY(begin));
  return waarde;
}
