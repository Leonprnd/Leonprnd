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
  Share,
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
import { talen } from '../../src/taal';
import { speel } from '../../src/services/geluid';
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
    gekoppeld,
    bewaarProfiel,
    zetDelen,
    zetSamenSinds,
    koppelLos,
    verwijderPartner,
    taal,
    kiesTaal,
    geluidAan,
    setGeluidAan,
    t,
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

  async function deelCode() {
    try {
      await Share.share({
        message:
          t.koppelen.berichtDelen(toonCode(code)),
      });
    } catch {
      // Delen afgebroken, verder niets aan de hand.
    }
  }

  async function wisselDelen(aan) {
    Haptics.selectionAsync().catch(() => {});
    const gelukt = await zetDelen(aan);
    if (aan && !gelukt) {
      Alert.alert(t.wij.geenToegangTitel, t.wij.geenToegangTekst);
    }
  }

  async function bewaarMijnProfiel() {
    await bewaarProfiel({ naam: naam.trim() || t.wij.jij, emoji, kleur });
    setBewerkt(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  function vraagPartnerVerwijderen() {
    Alert.alert(t.wij.herstelTitel, t.wij.herstelBevestig, [
      { text: t.algemeen.laten, style: 'cancel' },
      {
        text: t.algemeen.weggooien,
        style: 'destructive',
        onPress: () => verwijderPartner(),
      },
    ]);
  }

  function vraagLoskoppelen() {
    Alert.alert(
      t.wij.loskoppelenTitel,
      t.wij.loskoppelenTekst,
      [
        { text: t.algemeen.laten, style: 'cancel' },
        {
          text: t.algemeen.weggooien,
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
              {ik?.naam || t.wij.jij}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setFeest(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setTimeout(() => setFeest(false), 2800);
            }}
          >
            <Text style={stijl.groteHart}>{gekoppeld ? '💞' : '🤍'}</Text>
          </Pressable>

          <View style={stijl.persoon}>
            <Bolletje emoji={gekoppeld ? partner?.emoji : '🎁'} kleur={kleuren.wit} maat={62} />
            <Text style={stijl.persoonNaam} numberOfLines={1}>
              {gekoppeld ? partner?.naam : t.wij.nogGeheim}
            </Text>
          </View>
        </View>

        {dagen != null ? (
          <View style={stijl.dagenVak}>
            <Text style={stijl.dagenGetal}>{dagen}</Text>
            <Text style={stijl.dagenTekst}>
              {dagen === 1 ? t.wij.dagSamen : t.wij.dagenSamen}
            </Text>
          </View>
        ) : null}

        {mijlpaal ? (
          <Text style={stijl.mijlpaal}>
            {t.wij.mijlpaalOver(mijlpaal.over, mijlpaal.tekst)}
          </Text>
        ) : null}
      </View>

      {!gekoppeld ? (
        <>
          <Kopje>{t.wij.cadeauKop}</Kopje>
          <Kaartje>
            <Text style={stijl.cadeauIcoon}>🎁</Text>
            <Text style={stijl.cadeauTitel}>{t.wij.cadeauTitel}</Text>
            <Text style={stijl.cadeauTekst}>{t.wij.cadeauTekst}</Text>

            <View style={stijl.cadeauCode}>
              <Text style={stijl.cadeauCodeTekst}>{code ? toonCode(code) : '—'}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: ruimte.m, marginTop: ruimte.m }}>
              <Knop
                titel={gekopieerd ? t.algemeen.gekopieerd : t.algemeen.kopieren}
                icoon={gekopieerd ? '✓' : '📋'}
                soort="rand"
                klein
                onPress={kopieerCode}
                style={{ flex: 1 }}
              />
              <Knop
                titel={t.wij.weggeven}
                icoon="💌"
                klein
                onPress={deelCode}
                style={{ flex: 1 }}
              />
            </View>
          </Kaartje>
        </>
      ) : null}

      {/* --- Samen sinds --- */}
      <Kopje>{t.wij.samenSindsKop}</Kopje>
      <DatumKiezer
        datum={kaart?.samenSinds || null}
        opWijziging={(sleutel) => zetSamenSinds(sleutel)}
      />
      {!kaart?.samenSinds ? (
        <Lopend zacht klein style={{ marginTop: 6 }}>
          {t.wij.samenSindsLeeg}
        </Lopend>
      ) : (
        <Lopend zacht klein style={{ marginTop: 6 }}>
          {t.wij.samenSindsGezet(langeDatum(kaart.samenSinds))}
        </Lopend>
      )}

      {/* --- Live locatie --- */}
      <Kopje>{t.wij.locatieKop}</Kopje>
      <Kaartje>
        <View style={stijl.schakelRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.schakelTitel}>{t.wij.deelMijn}</Text>
            <Text style={stijl.schakelTekst}>
              {!gekoppeld
                ? t.wij.deelMijnAlleen
                : deeltLocatie
                  ? t.wij.deelMijnAan(partner?.naam || t.wij.partner)
                  : t.wij.deelMijnUit}
            </Text>
          </View>
          <Switch
            value={deeltLocatie}
            onValueChange={wisselDelen}
            trackColor={{ false: kleuren.lijn, true: kleuren.roze }}
            thumbColor={kleuren.wit}
          />
        </View>

        {gekoppeld ? <View style={stijl.scheiding} /> : null}

        {gekoppeld ? (
        <View style={stijl.schakelRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.schakelTitel}>{partner?.naam || t.wij.partner}</Text>
            <Text style={stijl.schakelTekst}>
              {partnerLocatie?.lat != null
                ? `${afstand != null ? `${t.wij.afstandVan(afstandTekst(afstand))} · ` : ''}${geledenKort(partnerLocatie.bijgewerktOp)}`
                : t.wij.partnerGeenLocatie}
            </Text>
          </View>
          <Text style={{ fontSize: 22 }}>{partnerLocatie?.lat != null ? '📍' : '💤'}</Text>
        </View>
        ) : null}
      </Kaartje>

      {/* --- Weetjes --- */}
      <Kopje>{t.wij.cijfersKop}</Kopje>
      <View style={stijl.weetjes}>
        <Weetje getal={momenten.length} tekst={t.wij.plekken} icoon="📍" />
        <Weetje getal={aantalFotos} tekst={t.wij.fotos} icoon="📸" />
        <Weetje getal={bijzondere.length} tekst={t.wij.mijlpalen} icoon="✨" />
      </View>

      {bijzondere.length > 0 ? (
        <Kaartje style={{ marginTop: ruimte.m }}>
          <Text style={stijl.lijstKop}>{t.wij.mijlpalenKop}</Text>
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
                    <Text style={stijl.mijlpaalTitel}>{t.types[type.id].label}</Text>
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
          {t.wij.eerstePlek(eerste.titel, langeDatum(eerste.datum))}
        </Lopend>
      ) : null}

      {/* --- Jouw profiel --- */}
      <Kopje>{t.wij.profielKop}</Kopje>
      {bewerkt ? (
        <Kaartje>
          <Veld label={t.welkom.naamLabel} waarde={naam} opWijziging={setNaam} maxLength={18} />

          <Text style={[stijl.kleinLabel, { marginTop: ruimte.l }]}>{t.wij.icoon}</Text>
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

          <Text style={[stijl.kleinLabel, { marginTop: ruimte.l }]}>{t.wij.kleur}</Text>
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
            <Knop titel={t.algemeen.opslaan} onPress={bewaarMijnProfiel} klein style={{ flex: 1 }} />
            <Knop
              titel={t.algemeen.laten}
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
                <Text style={stijl.schakelTitel}>{ik?.naam || t.wij.jij}</Text>
                <Text style={stijl.schakelTekst}>{t.wij.tikAanpassen}</Text>
              </View>
              <Text style={stijl.pijl}>›</Text>
            </View>
          </Kaartje>
        </Pressable>
      )}

      {/* --- De code --- */}
      {/* --- Taal --- */}
      <Kopje>{t.wij.taalKop}</Kopje>
      <View style={stijl.taalRij}>
        {talen.map((keuze) => (
          <Pressable
            key={keuze.code}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              speel('tik');
              kiesTaal(keuze.code);
            }}
            style={({ pressed }) => [
              stijl.taalVak,
              taal === keuze.code && stijl.taalActief,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={stijl.taalVlag}>{keuze.vlag}</Text>
            <Text
              style={[stijl.taalNaam, taal === keuze.code && { color: kleuren.wit }]}
              numberOfLines={1}
            >
              {keuze.naam}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* --- Geluid --- */}
      <Kopje>{t.wij.geluidKop}</Kopje>
      <Kaartje>
        <View style={stijl.schakelRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.schakelTitel}>{t.wij.geluidEffecten}</Text>
            <Text style={stijl.schakelTekst}>{t.wij.geluidEffectenTekst}</Text>
          </View>
          <Switch
            value={geluidAan}
            onValueChange={(aan) => {
              setGeluidAan(aan);
              if (aan) setTimeout(() => speel('tik'), 60);
            }}
            trackColor={{ false: kleuren.lijn, true: kleuren.roze }}
            thumbColor={kleuren.wit}
          />
        </View>

      </Kaartje>

      {gekoppeld ? (
        <>
          <Kopje>{t.wij.herstelKop}</Kopje>
          <Kaartje>
            <Text style={stijl.schakelTekst}>{t.wij.herstelTekst}</Text>
            <TekstKnop
              titel={t.wij.herstelKnop}
              onPress={vraagPartnerVerwijderen}
              kleur={kleuren.rood}
              style={{ alignSelf: 'flex-start', marginTop: ruimte.m }}
            />
          </Kaartje>
        </>
      ) : null}

      <Kopje>{t.wij.codeKop}</Kopje>
      <Kaartje>
        <View style={stijl.codeRij}>
          <View style={{ flex: 1 }}>
            <Text style={stijl.code}>{code ? toonCode(code) : '—'}</Text>
            <Text style={stijl.schakelTekst}>{t.wij.codeTekst}</Text>
          </View>
          <Pressable onPress={kopieerCode} hitSlop={10} style={stijl.kopieerKnop}>
            <Text style={{ fontSize: 17 }}>{gekopieerd ? '✓' : '📋'}</Text>
          </Pressable>
        </View>
      </Kaartje>

      <TekstKnop
        titel={t.wij.loskoppelen}
        onPress={vraagLoskoppelen}
        kleur={kleuren.rood}
        style={{ alignSelf: 'center', marginTop: ruimte.xxl }}
      />

      <Text style={stijl.afsluiter}>OurSpots</Text>

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

  taalRij: { flexDirection: 'row', gap: ruimte.s },
  taalVak: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: ruimte.m,
    borderRadius: rond.m,
    backgroundColor: kleuren.wit,
    borderWidth: 2,
    borderColor: kleuren.lijn,
  },
  taalActief: { backgroundColor: kleuren.roze, borderColor: kleuren.roze },
  taalVlag: { fontSize: 20 },
  taalNaam: { fontFamily: letters.halfvet, fontSize: 12.5, color: kleuren.inkt },

  cadeauIcoon: { fontSize: 32, textAlign: 'center' },
  cadeauTitel: {
    fontFamily: letters.vet,
    fontSize: 17,
    color: kleuren.inkt,
    textAlign: 'center',
    marginTop: 4,
  },
  cadeauTekst: {
    fontFamily: letters.normaal,
    fontSize: 13.5,
    lineHeight: 20,
    color: kleuren.inktZacht,
    textAlign: 'center',
    marginTop: 4,
  },
  cadeauCode: {
    alignSelf: 'center',
    marginTop: ruimte.l,
    paddingHorizontal: ruimte.xl,
    paddingVertical: ruimte.s,
    borderRadius: rond.m,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: kleuren.rozeZacht,
  },
  cadeauCodeTekst: {
    fontFamily: letters.vet,
    fontSize: 28,
    letterSpacing: 4,
    color: kleuren.rozeDiep,
  },

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
