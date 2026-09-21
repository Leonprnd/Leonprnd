// Het blad dat over de kaart schuift.
//
// Je pakt het bij het handvat en sleept het omhoog of omlaag; het klikt vast
// op een paar hoogtes. Laat je het los met een zwiep, dan gaat het de kant op
// waar je het heen duwde — niet naar de dichtstbijzijnde hoogte, want dat
// voelt alsof de app je tegenwerkt.
//
// Het schuiven zelf gebeurt volledig in de animatielaag: geen enkele
// toetsaanslag van React ertussen, dus het blijft soepel ook als de kaart
// eronder druk bezig is.

import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { kleuren, ruimte, rond } from '../theme';

// Hoeveel een zwiep meetelt als je hem rustig loslaat. Te hoog en het blad
// schiet door bij het kleinste duwtje; te laag en een duidelijke zwiep doet
// niets.
const ZWIEP = 0.14;

// Vanaf deze snelheid is het geen sleepje meer maar een zwiep. Dan gaat het
// blad één stand op in de richting waar je het heen gooide, hoe klein de
// beweging ook was — dat is wat je bedoelde.
const ZWIEPGRENS = 450;

function beperk(waarde, laag, hoog) {
  return Math.min(hoog, Math.max(laag, waarde));
}

// `standen` zijn hoogtes in pixels, van laag naar hoog.
const Blad = forwardRef(function Blad(
  { standen, begin = 0, opStand, kop, children, style },
  ref,
) {
  const hoogste = standen[standen.length - 1];

  // Het blad is altijd zo hoog als zijn hoogste stand; we duwen het naar
  // beneden om een lagere stand te maken.
  const yVan = useCallback((index) => hoogste - standen[index], [hoogste, standen]);

  // Waar het blad stáát, los van het slepen.
  const [basis] = useState(() => new Animated.Value(hoogste - standen[begin]));
  // Wat je vinger er op dit moment bij optelt.
  const [sleep] = useState(() => new Animated.Value(0));
  // De stand in gewoon JavaScript, want tijdens een gebaar mogen we geen
  // animatiewaarde uitlezen.
  const standRef = useRef(begin);
  const basisRef = useRef(hoogste - standen[begin]);

  const laagsteY = 0;
  const hoogsteY = hoogste - standen[0];

  const y = Animated.add(basis, sleep).interpolate({
    inputRange: [laagsteY, hoogsteY],
    outputRange: [laagsteY, hoogsteY],
    extrapolate: 'clamp',
  });

  const naar = useCallback(
    (index, snelheid = 0, vanaf = null) => {
      const doel = beperk(index, 0, standen.length - 1);
      const doelY = yVan(doel);

      if (vanaf != null) {
        // Het gebaar verhuist in één tel van `sleep` naar `basis`, zodat het
        // blad niet even terugspringt voordat de veer begint.
        sleep.setValue(0);
        basis.setValue(vanaf);
      }

      basisRef.current = doelY;
      if (standRef.current !== doel) {
        standRef.current = doel;
        opStand?.(doel);
        // Een tikje bij het vastklikken; dat maakt het blad tastbaar.
        Haptics.selectionAsync().catch(() => {});
      }

      Animated.spring(basis, {
        toValue: doelY,
        velocity: snelheid,
        damping: 24,
        stiffness: 240,
        mass: 0.9,
        useNativeDriver: true,
      }).start();
    },
    [basis, sleep, standen.length, yVan, opStand],
  );

  useImperativeHandle(ref, () => ({
    naar: (index) => naar(index),
    stand: () => standRef.current,
  }));

  const opGebaar = Animated.event([{ nativeEvent: { translationY: sleep } }], {
    useNativeDriver: true,
  });

  function opTik(gebeurtenis) {
    if (gebeurtenis.nativeEvent.state !== State.ACTIVE) return;
    naar(standRef.current === 0 ? 1 : 0);
  }

  function opGebaarKlaar(gebeurtenis) {
    if (gebeurtenis.nativeEvent.state !== State.END) return;

    const { translationY, velocityY } = gebeurtenis.nativeEvent;
    const nu = beperk(basisRef.current + translationY, laagsteY, hoogsteY);

    // Een zwiep telt als "één omhoog" of "één omlaag". Omlaag slepen maakt de
    // waarde groter, en dat is een lágere stand.
    if (Math.abs(velocityY) > ZWIEPGRENS) {
      naar(standRef.current + (velocityY > 0 ? -1 : 1), velocityY, nu);
      return;
    }

    // Rustig losgelaten: waar zou het blad heen glijden? Daar zoeken we de
    // dichtstbijzijnde stand bij.
    const mikpunt = beperk(nu + velocityY * ZWIEP, laagsteY, hoogsteY);

    let beste = 0;
    let besteAfstand = Infinity;
    standen.forEach((_, index) => {
      const afstand = Math.abs(yVan(index) - mikpunt);
      if (afstand < besteAfstand) {
        besteAfstand = afstand;
        beste = index;
      }
    });

    naar(beste, velocityY, nu);
  }

  return (
    <Animated.View
      style={[
        stijl.blad,
        { height: hoogste, transform: [{ translateY: y }] },
        style,
      ]}
    >
      <PanGestureHandler onGestureEvent={opGebaar} onHandlerStateChange={opGebaarKlaar}>
        <Animated.View style={stijl.greep}>
          {/* Slepen is het mooist, maar een tik op het streepje hoort ook
              gewoon te werken. Dat moet een gebaar uit dezelfde laag zijn: een
              gewone knop hieronder krijgt de tik niet, want het sleepgebaar
              vangt hem af. Alleen het streepje, niet de hele kop — anders
              botst het met de knopjes die daarin staan. */}
          <TapGestureHandler onHandlerStateChange={opTik}>
            <View style={stijl.streepvak}>
              <View style={stijl.streepje} />
            </View>
          </TapGestureHandler>
          {kop}
        </Animated.View>
      </PanGestureHandler>

      <View style={stijl.inhoud}>{children}</View>
    </Animated.View>
  );
});

const stijl = StyleSheet.create({
  blad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: kleuren.wit,
    borderTopLeftRadius: rond.xl,
    borderTopRightRadius: rond.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#7A3A50',
        shadowOpacity: 0.16,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -8 },
      },
      android: { elevation: 20 },
      default: { boxShadow: '0 -8px 24px rgba(122,58,80,0.16)' },
    }),
  },
  greep: {
    // Een ruime greep: je wilt het blad kunnen pakken zonder te mikken.
    paddingBottom: ruimte.s,
  },
  // Het streepje zelf is klein, het gebied eromheen niet — zo raak je het ook
  // met een duim.
  streepvak: {
    paddingTop: 8,
    paddingBottom: ruimte.s,
    alignItems: 'center',
  },
  streepje: {
    width: 38,
    height: 5,
    borderRadius: rond.vol,
    backgroundColor: kleuren.inktFluister,
    opacity: 0.55,
  },
  inhoud: { flex: 1 },
});

export default Blad;
