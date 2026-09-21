// Hier maak je de kaart, of doe je mee met die van je liefje.
//
// Maak jij hem: je krijgt een code, en daarna ga je meteen door naar je eigen
// kaart. Je liefje hoeft er nog niet bij te zijn — juist niet. Je vult hem
// eerst in je eentje met al jullie plekjes, en geeft de code pas weg als het
// cadeau af is. De code staat altijd klaar in het Wij-scherm.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Share,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { useApp } from '../src/state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../src/theme';
import { Titel, Lopend, Knop, Veld, TekstKnop, Bolletje } from '../src/components/basis';
import Hartjes from '../src/components/Hartjes';
import { toonCode, normaliseerCode, isVolledigeCode, bevatOnmogelijkTeken } from '../src/utils/code';

export default function Koppelen() {
  const { profiel, code, kaart, gekoppeld, beginNieuweKaart, koppelMetCode, koppelLos } = useApp();
  const rand = useSafeAreaInsets();

  // Wil je zelf een code invullen, dan onthouden we dat; verder volgt het
  // scherm gewoon of er al een kaart is.
  const [wilCodeInvullen, setWilCodeInvullen] = useState(false);
  const modus = wilCodeInvullen ? 'meedoen' : code ? 'klaar' : 'kies';

  const [invoer, setInvoer] = useState('');
  const [bezig, setBezig] = useState(false);
  const [foutje, setFoutje] = useState(null);
  const [gekopieerd, setGekopieerd] = useState(false);

  // Doe je mee met de code van je liefje, dan sta je meteen samen op de kaart.
  useEffect(() => {
    if (!gekoppeld) return undefined;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const klus = setTimeout(() => router.replace('/(samen)/kaart'), 1600);
    return () => clearTimeout(klus);
  }, [gekoppeld]);

  async function maakKaartAan() {
    setBezig(true);
    setFoutje(null);
    try {
      await beginNieuweKaart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      setFoutje(e?.message || 'Dat lukte even niet. Probeer het nog eens.');
    }
    setBezig(false);
  }

  async function doeMeeMetCode() {
    setBezig(true);
    setFoutje(null);
    try {
      await koppelMetCode(invoer);
      setWilCodeInvullen(false);
    } catch (e) {
      setFoutje(e?.message || 'Dat lukte even niet. Probeer het nog eens.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
    setBezig(false);
  }

  async function kopieer() {
    await Clipboard.setStringAsync(toonCode(code));
    setGekopieerd(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => setGekopieerd(false), 1800);
  }

  async function deel() {
    try {
      await Share.share({
        message:
          `Ik heb een kaartje voor ons gemaakt in Ons Plekje 💗\n\n` +
          `Onze code is ${toonCode(code)} — download de app en vul 'm in, ` +
          `dan staan al onze plekjes erop.`,
      });
    } catch {
      // Delen afgebroken, verder niets aan de hand.
    }
  }

  return (
    <KeyboardAvoidingView
      style={stijl.vol}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={verlopen.lucht} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={[
          stijl.inhoud,
          { paddingTop: rand.top + ruimte.xl, paddingBottom: rand.bottom + ruimte.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {modus === 'kies' ? (
          <Kiezen
            profiel={profiel}
            bezig={bezig}
            foutje={foutje}
            opMaken={maakKaartAan}
            opMeedoen={() => {
              setWilCodeInvullen(true);
              setFoutje(null);
            }}
          />
        ) : null}

        {modus === 'klaar' ? (
          <Klaar
            code={code}
            kaart={kaart}
            gekoppeld={gekoppeld}
            gekopieerd={gekopieerd}
            opKopieer={kopieer}
            opDeel={deel}
            opVerder={() => router.replace('/(samen)/kaart')}
            opAnnuleer={async () => {
              await koppelLos();
              setWilCodeInvullen(false);
            }}
          />
        ) : null}

        {modus === 'meedoen' ? (
          <Meedoen
            invoer={invoer}
            opInvoer={(t) => {
              setInvoer(normaliseerCode(t));
              setFoutje(null);
            }}
            bezig={bezig}
            foutje={foutje}
            opVerstuur={doeMeeMetCode}
            opTerug={() => {
              setWilCodeInvullen(false);
              setFoutje(null);
            }}
          />
        ) : null}
      </ScrollView>

      <Hartjes aan={gekoppeld} aantal={18} />
    </KeyboardAvoidingView>
  );
}

// --- Stap 1: wat wil je doen? ----------------------------------------------

function Kiezen({ profiel, bezig, foutje, opMaken, opMeedoen }) {
  return (
    <View>
      <View style={stijl.kop}>
        <Bolletje emoji={profiel?.emoji} kleur={profiel?.kleur} maat={72} />
        <Titel style={{ textAlign: 'center', marginTop: ruimte.m }}>
          Hoi {profiel?.naam || 'daar'}!
        </Titel>
        <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
          Nog één stapje: jullie kaart aan elkaar knopen.
        </Lopend>
      </View>

      <Pressable onPress={opMaken} disabled={bezig} style={({ pressed }) => [
        stijl.groteKeuze,
        schaduw.kaart,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
        <LinearGradient
          colors={verlopen.roze}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {bezig ? (
          <ActivityIndicator color={kleuren.wit} />
        ) : (
          <>
            <Text style={stijl.keuzeIcoon}>🗺️</Text>
            <Text style={stijl.keuzeTitel}>Ik maak de kaart</Text>
            <Text style={stijl.keuzeTekst}>
              Je krijgt een code die je aan je liefje geeft. Perfect als cadeau.
            </Text>
          </>
        )}
      </Pressable>

      <Pressable onPress={opMeedoen} style={({ pressed }) => [
        stijl.kleineKeuze,
        schaduw.zacht,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
        <Text style={stijl.keuzeIcoonKlein}>💌</Text>
        <View style={{ flex: 1 }}>
          <Text style={stijl.keuzeTitelKlein}>Ik heb een code gekregen</Text>
          <Text style={stijl.keuzeTekstKlein}>Vul hem in en jullie zijn gekoppeld.</Text>
        </View>
        <Text style={stijl.pijl}>›</Text>
      </Pressable>

      {foutje ? <Text style={stijl.fout}>{foutje}</Text> : null}
    </View>
  );
}

// --- Stap 2a: je kaart staat klaar ------------------------------------------
//
// Geen wachtscherm: je gaat meteen door naar je eigen kaart. De code is een
// cadeau dat je weggeeft wanneer jij er klaar voor bent.

function Klaar({ code, kaart, gekoppeld, gekopieerd, opKopieer, opDeel, opVerder, opAnnuleer }) {
  if (gekoppeld) {
    return (
      <View>
        <View style={stijl.kop}>
          <Text style={stijl.hartje}>💞</Text>
          <Titel style={{ textAlign: 'center' }}>Jullie zijn gekoppeld!</Titel>
          <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
            Vanaf nu is de kaart jullie startscherm.
          </Lopend>
        </View>

        <View style={stijl.wachtVak}>
          <Text style={{ fontSize: 34 }}>🎉</Text>
          <Text style={stijl.wachtTekst}>
            {Object.values(kaart?.leden || {})
              .map((l) => l.naam)
              .filter(Boolean)
              .join(' & ')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={stijl.kop}>
        <Text style={stijl.hartje}>🗺️</Text>
        <Titel style={{ textAlign: 'center' }}>Je kaart staat klaar</Titel>
        <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
          Vul hem nu rustig met al jullie plekjes. Je liefje ziet er nog niets
          van — de code geef je pas als het cadeau af is.
        </Lopend>
      </View>

      <View style={[stijl.codeVak, schaduw.kaart]}>
        <Text style={stijl.codeLabel}>onze code</Text>
        <Text style={stijl.code}>{code ? toonCode(code) : '· · ·'}</Text>
        <Text style={stijl.codeHint}>staat altijd bij &quot;Wij&quot;</Text>
      </View>

      <Knop
        titel="Beginnen met plekjes"
        icoon="📍"
        onPress={opVerder}
        style={{ marginTop: ruimte.xl }}
      />

      <View style={stijl.geheimVak}>
        <Text style={stijl.geheimIcoon}>🤫</Text>
        <Text style={stijl.geheimTekst}>
          Zolang jij de code niet deelt, is deze kaart alleen van jou.
        </Text>
      </View>

      <Text style={stijl.alKlaar}>Of geef hem nu al weg:</Text>
      <View style={stijl.knopRij}>
        <Knop
          titel={gekopieerd ? 'Gekopieerd!' : 'Kopiëren'}
          icoon={gekopieerd ? '✓' : '📋'}
          soort="rand"
          klein
          onPress={opKopieer}
          style={{ flex: 1 }}
        />
        <Knop titel="Versturen" icoon="💌" soort="zacht" klein onPress={opDeel} style={{ flex: 1 }} />
      </View>

      <TekstKnop
        titel="Toch opnieuw beginnen"
        onPress={opAnnuleer}
        kleur={kleuren.inktZacht}
        style={{ alignSelf: 'center', marginTop: ruimte.xl }}
      />
    </View>
  );
}

// --- Stap 2b: de code van je liefje invullen --------------------------------

function Meedoen({ invoer, opInvoer, bezig, foutje, opVerstuur, opTerug }) {
  const compleet = isVolledigeCode(invoer);
  const rareLetters = invoer.length > 0 && bevatOnmogelijkTeken(invoer);

  return (
    <View>
      <View style={stijl.kop}>
        <Text style={stijl.hartje}>💌</Text>
        <Titel style={{ textAlign: 'center' }}>Vul de code in</Titel>
        <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
          De zes tekens die je van je liefje kreeg.
        </Lopend>
      </View>

      <View style={[stijl.codeInvoerVak, schaduw.zacht]}>
        <Veld
          waarde={toonCode(invoer)}
          opWijziging={opInvoer}
          hint="ABC-123"
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          maxLength={7}
          returnKeyType="done"
          onSubmitEditing={compleet ? opVerstuur : undefined}
          style={stijl.codeInvoer}
        />
      </View>

      {rareLetters ? (
        <Text style={stijl.waarschuwing}>
          Let op: in onze codes zitten nooit een B, I, L, O, S of Z. Kijk nog
          even goed — het is vast een 8, een J, een D, een 5 of een 2.
        </Text>
      ) : null}

      {foutje ? <Text style={stijl.fout}>{foutje}</Text> : null}

      <Knop
        titel="Koppelen"
        icoon="💞"
        onPress={opVerstuur}
        uit={!compleet}
        bezig={bezig}
        style={{ marginTop: ruimte.xl }}
      />
      <TekstKnop
        titel="Terug"
        onPress={opTerug}
        kleur={kleuren.inktZacht}
        style={{ alignSelf: 'center', marginTop: ruimte.l }}
      />
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1 },
  inhoud: { paddingHorizontal: ruimte.xl, flexGrow: 1, justifyContent: 'center' },

  kop: { alignItems: 'center', marginBottom: ruimte.xl },
  hartje: { fontSize: 46, marginBottom: ruimte.s },

  groteKeuze: {
    borderRadius: rond.xl,
    padding: ruimte.xl,
    overflow: 'hidden',
    minHeight: 150,
    justifyContent: 'center',
    backgroundColor: kleuren.roze,
  },
  keuzeIcoon: { fontSize: 32, marginBottom: ruimte.s },
  keuzeTitel: { fontFamily: letters.vet, fontSize: 21, color: kleuren.wit },
  keuzeTekst: {
    fontFamily: letters.normaal,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFFDD',
    marginTop: 4,
  },

  kleineKeuze: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    padding: ruimte.l,
    marginTop: ruimte.m,
  },
  keuzeIcoonKlein: { fontSize: 26 },
  keuzeTitelKlein: { fontFamily: letters.vet, fontSize: 15.5, color: kleuren.inkt },
  keuzeTekstKlein: {
    fontFamily: letters.normaal,
    fontSize: 13,
    color: kleuren.inktZacht,
    marginTop: 1,
  },
  pijl: { fontSize: 26, color: kleuren.inktFluister, fontFamily: letters.normaal },

  codeVak: {
    backgroundColor: kleuren.wit,
    borderRadius: rond.xl,
    paddingVertical: ruimte.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: kleuren.rozeZacht,
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontFamily: letters.hand,
    fontSize: 20,
    color: kleuren.inktZacht,
  },
  code: {
    fontFamily: letters.vet,
    fontSize: 42,
    letterSpacing: 5,
    color: kleuren.rozeDiep,
    marginVertical: 2,
  },
  codeHint: { fontFamily: letters.normaal, fontSize: 11.5, color: kleuren.inktFluister },

  knopRij: { flexDirection: 'row', gap: ruimte.m, marginTop: ruimte.l },

  geheimVak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    backgroundColor: kleuren.goudZacht,
    borderRadius: rond.m,
    padding: ruimte.m,
    marginTop: ruimte.l,
  },
  geheimIcoon: { fontSize: 20 },
  geheimTekst: {
    flex: 1,
    fontFamily: letters.normaal,
    fontSize: 13,
    lineHeight: 19,
    color: kleuren.inkt,
  },
  alKlaar: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    color: kleuren.inktFluister,
    textAlign: 'center',
    marginTop: ruimte.xl,
    marginBottom: ruimte.s,
  },

  wachtVak: {
    alignItems: 'center',
    marginTop: ruimte.xxl,
    gap: ruimte.s,
    paddingHorizontal: ruimte.m,
  },
  wachtTekst: { fontFamily: letters.vet, fontSize: 16, color: kleuren.inkt },
  wachtKlein: {
    fontFamily: letters.normaal,
    fontSize: 13,
    lineHeight: 19,
    color: kleuren.inktZacht,
    textAlign: 'center',
  },

  codeInvoerVak: { borderRadius: rond.l, overflow: 'hidden' },
  codeInvoer: { paddingVertical: ruimte.l },

  fout: {
    fontFamily: letters.halfvet,
    fontSize: 13.5,
    lineHeight: 20,
    color: kleuren.rood,
    textAlign: 'center',
    marginTop: ruimte.l,
  },
  waarschuwing: {
    fontFamily: letters.normaal,
    fontSize: 13,
    lineHeight: 19,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: ruimte.m,
  },
});
