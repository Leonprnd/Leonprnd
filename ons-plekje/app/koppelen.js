// Hier maak je de kaart, of doe je mee met die van je liefje.
//
// Maak jij hem: je krijgt een code, die deel je. Zodra de ander meedoet,
// springt dit scherm vanzelf door naar jullie kaart.

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
  const modus = wilCodeInvullen ? 'meedoen' : code ? 'wachten' : 'kies';

  const [invoer, setInvoer] = useState('');
  const [bezig, setBezig] = useState(false);
  const [foutje, setFoutje] = useState(null);
  const [gekopieerd, setGekopieerd] = useState(false);

  // Zodra je liefje meedoet, is dit vanaf nu jullie startscherm.
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

        {modus === 'wachten' ? (
          <Wachten
            code={code}
            kaart={kaart}
            gekoppeld={gekoppeld}
            gekopieerd={gekopieerd}
            opKopieer={kopieer}
            opDeel={deel}
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

// --- Stap 2a: de code delen en wachten --------------------------------------

function Wachten({ code, kaart, gekoppeld, gekopieerd, opKopieer, opDeel, opAnnuleer }) {
  const partnerErbij = gekoppeld;

  return (
    <View>
      <View style={stijl.kop}>
        <Text style={stijl.hartje}>{partnerErbij ? '💞' : '💌'}</Text>
        <Titel style={{ textAlign: 'center' }}>
          {partnerErbij ? 'Jullie zijn gekoppeld!' : 'Jullie code'}
        </Titel>
        <Lopend zacht style={{ textAlign: 'center', marginTop: 6 }}>
          {partnerErbij
            ? 'Vanaf nu is de kaart jullie startscherm.'
            : 'Geef deze code aan je liefje. Zodra die hem invult, staan jullie samen op de kaart.'}
        </Lopend>
      </View>

      <View style={[stijl.codeVak, schaduw.kaart]}>
        <Text style={stijl.codeLabel}>onze code</Text>
        <Text style={stijl.code}>{code ? toonCode(code) : '· · ·'}</Text>
        <Text style={stijl.codeHint}>hoofdletters maken niet uit</Text>
      </View>

      {!partnerErbij ? (
        <>
          <View style={stijl.knopRij}>
            <Knop
              titel={gekopieerd ? 'Gekopieerd!' : 'Kopiëren'}
              icoon={gekopieerd ? '✓' : '📋'}
              soort="rand"
              onPress={opKopieer}
              style={{ flex: 1 }}
            />
            <Knop titel="Versturen" icoon="💌" onPress={opDeel} style={{ flex: 1 }} />
          </View>

          <View style={stijl.wachtVak}>
            <ActivityIndicator color={kleuren.roze} />
            <Text style={stijl.wachtTekst}>Wachten op je liefje...</Text>
            <Text style={stijl.wachtKlein}>
              Je kunt de app rustig dichtdoen. Zodra de ander meedoet, staat
              jullie kaart klaar.
            </Text>
          </View>

          <TekstKnop
            titel="Toch een andere code"
            onPress={opAnnuleer}
            kleur={kleuren.inktZacht}
            style={{ alignSelf: 'center', marginTop: ruimte.xl }}
          />
        </>
      ) : (
        <View style={stijl.wachtVak}>
          <Text style={{ fontSize: 34 }}>🎉</Text>
          <Text style={stijl.wachtTekst}>
            {Object.values(kaart?.leden || {})
              .map((l) => l.naam)
              .filter(Boolean)
              .join(' & ')}
          </Text>
        </View>
      )}
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
