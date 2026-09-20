// Alles over jullie tweeën: sinds wanneer, hoeveel plekjes, de koppelcode,
// en de knop voor het delen van je live locatie.

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { useApp, emojiKeuzes, kleurKeuzes } from '../../src/state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw, verlopen } from '../../src/theme';
import { Lopend, Kaartje, Knop, Veld, Bolletje, TekstKnop } from '../../src/components/basis';
import DatumKiezer from '../../src/components/DatumKiezer';
import Hartjes from '../../src/components/Hartjes';
import { typeVan } from '../../src/momentTypes';
import { toonCode } from '../../src/utils/code';
import { dagenSinds, langeDatum, volgendeMijlpaal, geledenKort } from '../../src/utils/datum';
import { telFotos, eersteMoment } from '../../src/services/momenten';
import { afstandInMeter, afstandTekst } from '../../src/utils/afstand';

export default function Wij() {
  const {
    ik,
    partner,
    kaart,
    code,
    momenten,
    profiel,
    deeltLocatie,
    partnerLocatie,
    mijnPositie,
    bewaarProfiel,
    zetDelen,
    zetSamenSinds,
    koppelLos,
  } = useApp();

  const rand = useSafeAreaInsets();
  const [gekopieerd, setGekopieerd] = useState(false);
  const [bewerkt, setBewerkt] = useState(false);
  const [naam, setNaam] = useState(profiel?.naam || '');
  const [emoji, setEmoji] = useState(profiel?.emoji || emojiKeuzes[0]);
  const [kleur, setKleur] = useState(profiel?.kleur || kleurKeuzes[0]);
  const [feest, setFeest] = useState(false);

  const dagen = kaart?.samenSinds ? dagenSinds(kaart.samenSinds) : null;
  const mijlpaal = kaart?.samenSinds ? volgendeMijlpaal(kaart.samenSinds) : null;
  const aantalFotos = telFotos(momenten);
  const eerste = eersteMoment(momenten);
  const bijzondere = momenten.filter((m) => typeVan(m.type).bijzonder);

  const afstand =
    mijnPositie && partnerLocatie?.lat != null
      ? afstandInMeter(mijnPositie, { lat: partnerLocatie.lat, lng: partnerLocatie.lng })
      : null;

  async function kopieerCode() {
    await Clipboard.setStringAsync(toonCode(code));
    setGekopieerd(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setTimeout(() => setGekopieerd(false), 1800);
  }

  async function wisselDelen(aan) {
    Haptics.selectionAsync().catch(() => {});
    const gelukt = await zetDelen(aan);
    if (aan && !gelukt) {
      Alert.alert(
        'Geen toegang tot je locatie',
        'Zet locatie voor Ons Plekje aan in de instellingen van je telefoon, dan zien jullie elkaar weer op de kaart.',
      );
    }
  }

  async function bewaarMijnProfiel() {
    await bewaarProfiel({ naam: naam.trim() || 'Ik', emoji, kleur });
    setBewerkt(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  function vraagLoskoppelen() {
    Alert.alert(
      'Loskoppelen?',
      'Je gaat van deze kaart af. De plekjes blijven staan voor je liefje, maar jij ziet ze niet meer tenzij je de code opnieuw invult.',
      [
        { text: 'Laat maar', style: 'cancel' },
        {
          text: 'Loskoppelen',
          style: 'destructive',
          onPress: async () => {
            await koppelLos();
            router.replace('/');
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={stijl.vol}
      contentContainerStyle={{
        paddingTop: rand.top + ruimte.l,
        paddingBottom: ruimte.xxl,
        paddingHorizontal: ruimte.l,
      }}
    >
      {/* --- Jullie tweeën --- */}
      <View style={[stijl.stelKaart, schaduw.kaart]}>
        <LinearGradient
          colors={verlopen.zonsondergang}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={stijl.stelRij}>
          <View style={stijl.persoon}>
            <Bolletje emoji={ik?.emoji} kleur={kleuren.wit} maat={62} />
            <Text style={stijl.persoonNaam} numberOfLines={1}>
              {ik?.naam || 'Jij'}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setFeest(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setTimeout(() => setFeest(false), 2800);
            }}
          >
            <Text style={stijl.groteHart}>💞</Text>
          </Pressable>

          <View style={stijl.persoon}>
            <Bolletje emoji={partner?.emoji} kleur={kleuren.wit} maat={62} />
            <Text style={stijl.persoonNaam} numberOfLines={1}>
              {partner?.naam || 'Je liefje'}
            </Text>
          </View>
        </View>

        {dagen != null ? (
          <View style={stijl.dagenVak}>
            <Text style={stijl.dagenGetal}>{dagen}</Text>
            <Text style={stijl.dagenTekst}>
              {dagen === 1 ? 'dag samen' : 'dagen samen'}
            </Text>
          </View>
        ) : null}

        {mijlpaal ? (
          <Text style={stijl.mijlpaal}>
            Nog {mijlpaal.over} {mijlpaal.over === 1 ? 'dag' : 'dagen'} tot {mijlpaal.tekst} 🎉
          </Text>
        ) : null}
      </View>

      {/* --- Samen sinds --- */}
      <Kopje>Samen sinds</Kopje>
      <DatumKiezer
        datum={kaart?.samenSinds || null}
        opWijziging={(sleutel) => zetSamenSinds(sleutel)}
      />
      {!kaart?.samenSinds ? (
        <Lopend zacht klein style={{ marginTop: 6 }}>
          Vul de dag in dat jullie iets kregen, dan telt de app de dagen voor jullie.
        </Lopend>
      ) : (
        <Lopend zacht klein style={{ marginTop: 6 }}>
          {langeDatum(kaart.samenSinds)} · dat zien jullie allebei.
        </Lopend>
      )}

      {/* --- Live locatie --- */}
      <Kopje>Live locatie</Kopje>
      <Kaartje>
        <View style={stijl.schakelRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.schakelTitel}>Deel mijn locatie</Text>
            <Text style={stijl.schakelTekst}>
              {deeltLocatie
                ? `${partner?.naam || 'Je liefje'} ziet waar je bent.`
                : 'Je staat nu niet op de kaart bij je liefje.'}
            </Text>
          </View>
          <Switch
            value={deeltLocatie}
            onValueChange={wisselDelen}
            trackColor={{ false: kleuren.lijn, true: kleuren.roze }}
            thumbColor={kleuren.wit}
          />
        </View>

        <View style={stijl.scheiding} />

        <View style={stijl.schakelRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.schakelTitel}>{partner?.naam || 'Je liefje'}</Text>
            <Text style={stijl.schakelTekst}>
              {partnerLocatie?.lat != null
                ? `${afstand != null ? `${afstandTekst(afstand)} van je vandaan · ` : ''}${geledenKort(partnerLocatie.bijgewerktOp)}`
                : 'Deelt op dit moment geen locatie.'}
            </Text>
          </View>
          <Text style={{ fontSize: 22 }}>{partnerLocatie?.lat != null ? '📍' : '💤'}</Text>
        </View>
      </Kaartje>

      {/* --- Weetjes --- */}
      <Kopje>Jullie in cijfers</Kopje>
      <View style={stijl.weetjes}>
        <Weetje getal={momenten.length} tekst="plekjes" icoon="📍" />
        <Weetje getal={aantalFotos} tekst="foto's" icoon="📸" />
        <Weetje getal={bijzondere.length} tekst="mijlpalen" icoon="✨" />
      </View>

      {bijzondere.length > 0 ? (
        <Kaartje style={{ marginTop: ruimte.m }}>
          <Text style={stijl.lijstKop}>Jullie mijlpalen</Text>
          {bijzondere
            .slice()
            .sort((a, b) => String(a.datum).localeCompare(String(b.datum)))
            .map((moment) => {
              const type = typeVan(moment.type);
              return (
                <Pressable
                  key={moment.id}
                  onPress={() => router.push(`/moment/${moment.id}`)}
                  style={({ pressed }) => [stijl.mijlpaalRij, pressed && { opacity: 0.6 }]}
                >
                  <Text style={stijl.mijlpaalIcoon}>{type.icoon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={stijl.mijlpaalTitel}>{type.label}</Text>
                    <Text style={stijl.mijlpaalPlek} numberOfLines={1}>
                      {moment.titel}
                    </Text>
                  </View>
                  <Text style={stijl.mijlpaalDatum}>{langeDatum(moment.datum)}</Text>
                </Pressable>
              );
            })}
        </Kaartje>
      ) : null}

      {eerste ? (
        <Lopend zacht klein style={{ marginTop: ruimte.m, textAlign: 'center' }}>
          Jullie eerste plekje: {eerste.titel}, {langeDatum(eerste.datum)}
        </Lopend>
      ) : null}

      {/* --- Jouw profiel --- */}
      <Kopje>Jouw naam en icoontje</Kopje>
      {bewerkt ? (
        <Kaartje>
          <Veld label="Je naam" waarde={naam} opWijziging={setNaam} maxLength={18} />

          <Text style={[stijl.kleinLabel, { marginTop: ruimte.l }]}>Icoontje</Text>
          <View style={stijl.raster}>
            {emojiKeuzes.map((keuze) => (
              <Pressable
                key={keuze}
                onPress={() => setEmoji(keuze)}
                style={[stijl.emojiVak, emoji === keuze && { borderColor: kleur, backgroundColor: `${kleur}1F` }]}
              >
                <Text style={{ fontSize: 21 }}>{keuze}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[stijl.kleinLabel, { marginTop: ruimte.l }]}>Kleur</Text>
          <View style={stijl.raster}>
            {kleurKeuzes.map((keuze) => (
              <Pressable
                key={keuze}
                onPress={() => setKleur(keuze)}
                style={[
                  stijl.kleurVak,
                  { backgroundColor: keuze },
                  kleur === keuze && stijl.kleurGekozen,
                ]}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: ruimte.m, marginTop: ruimte.l }}>
            <Knop titel="Opslaan" onPress={bewaarMijnProfiel} klein style={{ flex: 1 }} />
            <Knop
              titel="Laat maar"
              soort="rand"
              klein
              onPress={() => setBewerkt(false)}
              style={{ flex: 1 }}
            />
          </View>
        </Kaartje>
      ) : (
        <Pressable onPress={() => setBewerkt(true)}>
          <Kaartje>
            <View style={stijl.schakelRij}>
              <Bolletje emoji={ik?.emoji} kleur={ik?.kleur} maat={44} />
              <View style={{ flex: 1, marginLeft: ruimte.m }}>
                <Text style={stijl.schakelTitel}>{ik?.naam || 'Jij'}</Text>
                <Text style={stijl.schakelTekst}>Tik om aan te passen</Text>
              </View>
              <Text style={stijl.pijl}>›</Text>
            </View>
          </Kaartje>
        </Pressable>
      )}

      {/* --- De code --- */}
      <Kopje>Jullie code</Kopje>
      <Kaartje>
        <View style={stijl.codeRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.code}>{code ? toonCode(code) : '—'}</Text>
            <Text style={stijl.schakelTekst}>
              Deze kaart hoort bij jullie twee. Er kan niemand anders bij.
            </Text>
          </View>
          <Pressable onPress={kopieerCode} hitSlop={10} style={stijl.kopieerKnop}>
            <Text style={{ fontSize: 17 }}>{gekopieerd ? '✓' : '📋'}</Text>
          </Pressable>
        </View>
      </Kaartje>

      <TekstKnop
        titel="Loskoppelen van deze kaart"
        onPress={vraagLoskoppelen}
        kleur={kleuren.rood}
        style={{ alignSelf: 'center', marginTop: ruimte.xxl }}
      />

      <Text style={stijl.afsluiter}>gemaakt met 💗</Text>

      <Hartjes aan={feest} aantal={20} />
    </ScrollView>
  );
}

function Kopje({ children }) {
  return <Text style={stijl.kopje}>{children}</Text>;
}

function Weetje({ getal, tekst, icoon }) {
  return (
    <View style={[stijl.weetje, schaduw.zacht]}>
      <Text style={stijl.weetjeIcoon}>{icoon}</Text>
      <Text style={stijl.weetjeGetal}>{getal}</Text>
      <Text style={stijl.weetjeTekst}>{tekst}</Text>
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.rozeWolk },

  stelKaart: {
    borderRadius: rond.xl,
    padding: ruimte.xl,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: kleuren.perzik,
  },
  stelRij: { flexDirection: 'row', alignItems: 'center', gap: ruimte.l },
  persoon: { alignItems: 'center', width: 96 },
  persoonNaam: {
    fontFamily: letters.vet,
    fontSize: 15,
    color: kleuren.wit,
    marginTop: 6,
  },
  groteHart: { fontSize: 30 },

  dagenVak: { alignItems: 'center', marginTop: ruimte.l },
  dagenGetal: {
    fontFamily: letters.vet,
    fontSize: 46,
    color: kleuren.wit,
    letterSpacing: -1.5,
  },
  dagenTekst: {
    fontFamily: letters.hand,
    fontSize: 22,
    color: '#FFFFFFE0',
    marginTop: -6,
  },
  mijlpaal: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    color: '#FFFFFFDD',
    marginTop: ruimte.s,
    textAlign: 'center',
  },

  kopje: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginTop: ruimte.xl,
    marginBottom: ruimte.s,
  },

  schakelRij: { flexDirection: 'row', alignItems: 'center', gap: ruimte.m },
  schakelTitel: { fontFamily: letters.vet, fontSize: 15.5, color: kleuren.inkt },
  schakelTekst: {
    fontFamily: letters.normaal,
    fontSize: 12.5,
    lineHeight: 18,
    color: kleuren.inktZacht,
    marginTop: 1,
  },
  scheiding: { height: 1, backgroundColor: kleuren.lijn, marginVertical: ruimte.m },
  pijl: { fontSize: 24, color: kleuren.inktFluister, fontFamily: letters.normaal },

  weetjes: { flexDirection: 'row', gap: ruimte.m },
  weetje: {
    flex: 1,
    backgroundColor: kleuren.wit,
    borderRadius: rond.l,
    paddingVertical: ruimte.l,
    alignItems: 'center',
  },
  weetjeIcoon: { fontSize: 20 },
  weetjeGetal: {
    fontFamily: letters.vet,
    fontSize: 24,
    color: kleuren.inkt,
    marginTop: 2,
  },
  weetjeTekst: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktZacht },

  lijstKop: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: ruimte.s,
  },
  mijlpaalRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ruimte.m,
    paddingVertical: ruimte.s,
  },
  mijlpaalIcoon: { fontSize: 21 },
  mijlpaalTitel: { fontFamily: letters.vet, fontSize: 14.5, color: kleuren.inkt },
  mijlpaalPlek: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktZacht },
  mijlpaalDatum: { fontFamily: letters.hand, fontSize: 17, color: kleuren.rozeDiep },

  kleinLabel: {
    fontFamily: letters.halfvet,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: ruimte.s,
  },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: ruimte.s },
  emojiVak: {
    width: 42,
    height: 42,
    borderRadius: rond.s,
    backgroundColor: kleuren.rozeWolk,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kleurVak: {
    width: 34,
    height: 34,
    borderRadius: rond.vol,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  kleurGekozen: { borderColor: kleuren.inkt },

  codeRij: { flexDirection: 'row', alignItems: 'center', gap: ruimte.m },
  code: {
    fontFamily: letters.vet,
    fontSize: 26,
    letterSpacing: 3,
    color: kleuren.rozeDiep,
  },
  kopieerKnop: {
    width: 42,
    height: 42,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeWolk,
    alignItems: 'center',
    justifyContent: 'center',
  },

  afsluiter: {
    fontFamily: letters.hand,
    fontSize: 20,
    color: kleuren.inktFluister,
    textAlign: 'center',
    marginTop: ruimte.xl,
  },
});
