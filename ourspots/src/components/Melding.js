// Meldingen en ja/nee-vragen, in de stijl van de app.
//
// Waarom niet gewoon Alert.alert? Omdat die op het web helemaal niets doet:
// react-native-web heeft er letterlijk een lege functie van gemaakt. Op een
// telefoon zag je dus keurig "Weet je het zeker?", en in de webversie gebeurde
// er niets — het verwijderen van een plek leek kapot, en elke foutmelding werd
// stilletjes opgeslokt.
//
// Dit is één venster dat overal hetzelfde werkt. Gebruik:
//
//   const { meld, vraag } = useMelding();
//   await meld('Er ging iets mis', 'Probeer het zo nog eens.');
//   if (await vraag({ titel: 'Verwijderen?', bevestig: 'Weg ermee' })) { ... }

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useApp } from '../state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw } from '../theme';

const MeldingContext = createContext(null);

export function useMelding() {
  const context = useContext(MeldingContext);
  if (!context) {
    throw new Error('useMelding werkt alleen binnen <MeldingProvider>');
  }
  return context;
}

export function MeldingProvider({ children }) {
  const { t } = useApp();
  const [venster, setVenster] = useState(null);

  // Wie op het antwoord wacht. Geen state: het veranderen hiervan hoeft niets
  // opnieuw te tekenen.
  const wachtend = useRef(null);

  const sluit = useCallback((antwoord) => {
    setVenster(null);
    const klaar = wachtend.current;
    wachtend.current = null;
    if (klaar) klaar(antwoord);
  }, []);

  const meld = useCallback(
    (titel, tekst) =>
      new Promise((klaar) => {
        wachtend.current = klaar;
        setVenster({ titel, tekst, soort: 'melding' });
      }),
    [],
  );

  const vraag = useCallback(
    ({ titel, tekst, bevestig, afwijzen, gevaarlijk = false }) =>
      new Promise((klaar) => {
        wachtend.current = klaar;
        setVenster({ titel, tekst, bevestig, afwijzen, gevaarlijk, soort: 'vraag' });
      }),
    [],
  );

  const gereedschap = useMemo(() => ({ meld, vraag }), [meld, vraag]);

  return (
    <MeldingContext.Provider value={gereedschap}>
      {children}

      <Modal
        visible={Boolean(venster)}
        transparent
        animationType="fade"
        // Terug-knop op Android, Escape op het web.
        onRequestClose={() => sluit(false)}
      >
        <View style={stijl.achtergrond}>
          <View style={[stijl.venster, schaduw.kaart]}>
            {venster?.titel ? <Text style={stijl.titel}>{venster.titel}</Text> : null}
            {venster?.tekst ? <Text style={stijl.tekst}>{venster.tekst}</Text> : null}

            <View style={stijl.knoppen}>
              {venster?.soort === 'vraag' ? (
                <Pressable
                  onPress={() => sluit(false)}
                  style={({ pressed }) => [stijl.knop, stijl.zacht, pressed && stijl.ingedrukt]}
                >
                  <Text style={stijl.zachtTekst}>
                    {venster.afwijzen || t.algemeen.laten}
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => sluit(true)}
                style={({ pressed }) => [
                  stijl.knop,
                  venster?.gevaarlijk ? stijl.gevaarlijk : stijl.stevig,
                  pressed && stijl.ingedrukt,
                ]}
              >
                <Text style={stijl.stevigTekst}>
                  {venster?.soort === 'vraag'
                    ? venster.bevestig || t.algemeen.verder
                    : t.algemeen.sluiten}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </MeldingContext.Provider>
  );
}

const stijl = StyleSheet.create({
  achtergrond: {
    flex: 1,
    backgroundColor: 'rgba(60,32,44,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ruimte.xl,
  },
  venster: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: kleuren.wit,
    borderRadius: rond.xl,
    paddingVertical: ruimte.xl,
    paddingHorizontal: ruimte.xl,
  },
  titel: {
    fontFamily: letters.vet,
    fontSize: 18,
    color: kleuren.inkt,
    textAlign: 'center',
  },
  tekst: {
    fontFamily: letters.normaal,
    fontSize: 14,
    lineHeight: 20,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: ruimte.s,
  },
  knoppen: {
    flexDirection: 'row',
    gap: ruimte.s,
    marginTop: ruimte.xl,
  },
  knop: {
    flex: 1,
    borderRadius: rond.vol,
    paddingVertical: ruimte.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingedrukt: { opacity: 0.75 },
  zacht: { backgroundColor: kleuren.rozeWolk },
  zachtTekst: { fontFamily: letters.halfvet, fontSize: 14.5, color: kleuren.inktZacht },
  stevig: { backgroundColor: kleuren.roze },
  gevaarlijk: { backgroundColor: kleuren.rood },
  stevigTekst: { fontFamily: letters.halfvet, fontSize: 14.5, color: kleuren.wit },
});
