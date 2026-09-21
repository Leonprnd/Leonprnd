// Een nieuw plekje op de kaart zetten.
//
// De titel vullen we alvast in met de plek die Google kent; je kunt hem
// natuurlijk aanpassen naar iets liefs. Daaronder de datum, wat er gebeurde,
// en de foto's die bovenaan op de stapel komen.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useApp } from '../../src/state/AppProvider';
import { kleuren, letters, ruimte, rond, schaduw } from '../../src/theme';
import { Titel, Lopend, Knop, Veld, TekstKnop } from '../../src/components/basis';
import TypeKiezer from '../../src/components/TypeKiezer';
import DatumKiezer from '../../src/components/DatumKiezer';
import Voorbeeld from '../../src/components/kaart/Voorbeeld';
import Hartjes from '../../src/components/Hartjes';
import { typeVan } from '../../src/momentTypes';
import { zoekAdres } from '../../src/services/locatie';
import { bewaarNieuwMoment, bewerkMoment, verwijderMoment } from '../../src/services/momenten';
import {
  kiesUitGalerij,
  maakMetCamera,
  uploadFotos,
  MAX_FOTOS_PER_MOMENT,
} from '../../src/services/fotos';
import { vandaagSleutel } from '../../src/utils/datum';
import { speel } from '../../src/services/geluid';

export default function NieuwMoment() {
  const { lat, lng, bewerk } = useLocalSearchParams();
  const { code, uid, profiel, momenten, t } = useApp();
  const rand = useSafeAreaInsets();

  const bestaand = bewerk ? momenten.find((m) => m.id === bewerk) : null;
  // Zijn de herinneringen nog niet binnen, dan weten we nog niet wat we
  // aanpassen. Zonder deze controle zou de app er een nieuwe van maken.
  const wachtOpBestaand = Boolean(bewerk) && !bestaand;

  const breedte = Number(bestaand?.lat ?? lat);
  const lengte = Number(bestaand?.lng ?? lng);

  const [titel, setTitel] = useState(bestaand?.titel || '');
  const [adres, setAdres] = useState(bestaand?.adres || '');
  const [beschrijving, setBeschrijving] = useState(bestaand?.beschrijving || '');
  const [type, setType] = useState(bestaand?.type || 'date');
  const [datum, setDatum] = useState(bestaand?.datum || vandaagSleutel());
  const [nieuweFotos, setNieuweFotos] = useState([]); // nog te uploaden
  const [oudeFotos, setOudeFotos] = useState(bestaand?.fotos || []);

  const [zoekt, setZoekt] = useState(
    () => !bestaand && Number.isFinite(breedte) && Number.isFinite(lengte),
  );
  const [bezig, setBezig] = useState(false);
  const [voortgang, setVoortgang] = useState(null);
  const [feest, setFeest] = useState(false);

  // --- Naam van de plek opzoeken -------------------------------------------

  useEffect(() => {
    if (bestaand) return undefined;
    if (!Number.isFinite(breedte) || !Number.isFinite(lengte)) return undefined;

    let levend = true;
    (async () => {
      const gevonden = await zoekAdres(breedte, lengte);
      if (!levend) return;
      if (gevonden.titel) setTitel((oud) => oud || gevonden.titel);
      if (gevonden.adres) setAdres(gevonden.adres);
      setZoekt(false);
    })();

    return () => {
      levend = false;
    };
  }, [breedte, lengte, bestaand]);

  // --- Foto's ---------------------------------------------------------------

  const ruimteOver =
    MAX_FOTOS_PER_MOMENT - (oudeFotos.length + nieuweFotos.length);

  const voegFotosToe = useCallback(
    async (bron) => {
      if (ruimteOver <= 0) {
        Alert.alert(t.algemeen.oeps, t.moment.vol(MAX_FOTOS_PER_MOMENT));
        return;
      }

      const resultaat =
        bron === 'camera' ? await maakMetCamera() : await kiesUitGalerij(ruimteOver);

      if (resultaat.geweigerd) {
        Alert.alert(
          t.algemeen.oeps,
          bron === 'camera' ? t.moment.geenToegangCamera : t.moment.geenToegangFotos,
        );
        return;
      }

      if (resultaat.fotos?.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setNieuweFotos((oud) => [...oud, ...resultaat.fotos].slice(0, MAX_FOTOS_PER_MOMENT));
      }
    },
    [ruimteOver, t],
  );

  function gooiNieuweWeg(index) {
    setNieuweFotos((oud) => oud.filter((_, i) => i !== index));
  }

  function gooiOudeWeg(foto) {
    setOudeFotos((oud) => oud.filter((f) => f.url !== foto.url));
  }

  // --- Opslaan --------------------------------------------------------------

  async function bewaar() {
    if (!code || !uid) return;
    if (!Number.isFinite(breedte) || !Number.isFinite(lengte)) {
      Alert.alert(t.algemeen.oeps, t.moment.opslaanMislukt);
      return;
    }

    setBezig(true);
    try {
      const gegevens = {
        titel: titel.trim() || t.types[typeVan(type).id].label,
        beschrijving,
        type,
        datum,
        lat: breedte,
        lng: lengte,
        adres,
        doorUid: uid,
        doorNaam: profiel?.naam || '',
      };

      let momentId = bestaand?.id;

      if (!bestaand) {
        // Eerst het moment zelf, dan de foto's: die hebben het id nodig.
        momentId = await bewaarNieuwMoment(code, { ...gegevens, fotos: [] });
      }

      let alleFotos = oudeFotos;
      if (nieuweFotos.length) {
        setVoortgang({ klaar: 0, totaal: nieuweFotos.length });
        const geupload = await uploadFotos(
          code,
          momentId,
          nieuweFotos,
          (klaar, totaal, deel) => setVoortgang({ klaar, totaal, deel: deel || 0 }),
        );
        alleFotos = [...oudeFotos, ...geupload];
      }

      await bewerkMoment(code, momentId, { ...gegevens, fotos: alleFotos });

      setVoortgang(null);
      setFeest(true);
      speel(bestaand ? 'bewaard' : 'pin');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      setTimeout(() => {
        if (bestaand) router.back();
        else router.replace(`/moment/${momentId}`);
      }, 900);
    } catch (e) {
      setBezig(false);
      setVoortgang(null);
      Alert.alert(t.algemeen.oeps, e?.message || t.moment.opslaanMislukt);
    }
  }

  function gooiMomentWeg() {
    Alert.alert(
      t.moment.weggooienTitel,
      t.moment.weggooienTekst,
      [
        { text: t.algemeen.laten, style: 'cancel' },
        {
          text: t.algemeen.weggooien,
          style: 'destructive',
          onPress: async () => {
            setBezig(true);
            try {
              await verwijderMoment(code, bestaand);
              router.replace('/(samen)/kaart');
            } catch {
              setBezig(false);
              Alert.alert(t.algemeen.oeps, t.algemeen.oeps);
            }
          },
        },
      ],
    );
  }

  const gekozenType = typeVan(type);
  const magOpslaan = !bezig && Number.isFinite(breedte) && Number.isFinite(lengte);

  if (wachtOpBestaand) {
    return (
      <View style={[stijl.vol, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={kleuren.roze} />
        <Text style={stijl.wachtTekst}>{t.algemeen.laden}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={stijl.vol}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: rand.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Een klein kaartje zodat je ziet waar je pin komt */}
        <View style={stijl.voorbeeldKaart}>
          <Voorbeeld lat={breedte} lng={lengte} type={type} style={StyleSheet.absoluteFill} />

          <View style={[stijl.sluit, { top: rand.top + ruimte.s }]}>
            <Pressable onPress={() => router.back()} style={stijl.sluitKnop} hitSlop={10}>
              <Text style={stijl.sluitTeken}>✕</Text>
            </Pressable>
          </View>
        </View>

        <View style={stijl.inhoud}>
          <Titel klein>{bestaand ? t.moment.bewerkTitel : t.moment.nieuwTitel}</Titel>
          <Lopend zacht klein style={{ marginTop: 2, marginBottom: ruimte.l }}>
            {zoekt ? t.moment.zoeken : adres || t.moment.hierWaren}
          </Lopend>

          <Veld
            label={t.moment.waarLabel}
            waarde={titel}
            opWijziging={setTitel}
            hint={zoekt ? t.moment.zoeken : t.types[gekozenType.id].label}
            maxLength={60}
            style={{ marginBottom: ruimte.m }}
          />

          <DatumKiezer datum={datum} opWijziging={setDatum} style={{ marginBottom: ruimte.l }} />

          <TypeKiezer gekozen={type} opKiezen={setType} />

          <View style={{ height: ruimte.l }} />

          <Veld
            label={t.moment.watGebeurde}
            waarde={beschrijving}
            opWijziging={setBeschrijving}
            hint={t.moment.watGebeurdeHint}
            regels={4}
            maxLength={900}
            style={{ marginBottom: ruimte.l }}
          />

          <FotoRij
            t={t}
            oude={oudeFotos}
            nieuwe={nieuweFotos}
            ruimteOver={ruimteOver}
            opKiezen={voegFotosToe}
            opGooiNieuweWeg={gooiNieuweWeg}
            opGooiOudeWeg={gooiOudeWeg}
          />

          {bestaand ? (
            <TekstKnop
              titel={t.moment.weggooienKnop}
              onPress={gooiMomentWeg}
              kleur={kleuren.rood}
              style={{ alignSelf: 'center', marginTop: ruimte.xxl }}
            />
          ) : null}
        </View>
      </ScrollView>

      {/* Opslaanknop blijft onderin staan */}
      <View style={[stijl.onderbalk, { paddingBottom: rand.bottom + ruimte.m }]}>
        {voortgang ? (
          <View style={stijl.voortgang}>
            <View style={stijl.voortgangRij}>
              <ActivityIndicator color={kleuren.roze} />
              <Text style={stijl.voortgangTekst}>
                {t.moment.versturenFoto(
                  Math.min(voortgang.klaar + 1, voortgang.totaal),
                  voortgang.totaal,
                )}
              </Text>
            </View>
            <View style={stijl.balkAchter}>
              <View
                style={[
                  stijl.balkVoor,
                  {
                    width: `${Math.round(
                      ((voortgang.klaar + (voortgang.deel || 0)) / voortgang.totaal) * 100,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        ) : (
          <Knop
            titel={bestaand ? t.algemeen.opslaan : t.moment.opDeKaart}
            icoon={gekozenType.icoon}
            onPress={bewaar}
            bezig={bezig}
            uit={!magOpslaan}
          />
        )}
      </View>

      <Hartjes aan={feest} aantal={16} />
    </KeyboardAvoidingView>
  );
}

// --- De foto's onder elkaar -------------------------------------------------

function FotoRij({ t, oude, nieuwe, ruimteOver, opKiezen, opGooiNieuweWeg, opGooiOudeWeg }) {
  const totaal = oude.length + nieuwe.length;

  return (
    <View>
      <View style={stijl.fotoKop}>
        <Text style={stijl.fotoLabel}>{t.moment.fotosKop}</Text>
        <Text style={stijl.fotoAantal}>
          {totaal > 0 ? t.moment.fotosVan(totaal, MAX_FOTOS_PER_MOMENT) : t.moment.fotosGeen}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stijl.fotoRij}>
        <Pressable
          onPress={() => opKiezen('galerij')}
          disabled={ruimteOver <= 0}
          style={({ pressed }) => [
            stijl.voegToe,
            ruimteOver <= 0 && { opacity: 0.4 },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Text style={stijl.voegToeIcoon}>🖼️</Text>
          <Text style={stijl.voegToeTekst}>{t.moment.kiezen}</Text>
        </Pressable>

        <Pressable
          onPress={() => opKiezen('camera')}
          disabled={ruimteOver <= 0}
          style={({ pressed }) => [
            stijl.voegToe,
            ruimteOver <= 0 && { opacity: 0.4 },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Text style={stijl.voegToeIcoon}>📷</Text>
          <Text style={stijl.voegToeTekst}>{t.moment.maken}</Text>
        </Pressable>

        {oude.map((foto) => (
          <FotoVakje key={foto.url} uri={foto.url} opWeg={() => opGooiOudeWeg(foto)} />
        ))}
        {nieuwe.map((asset, i) => (
          <FotoVakje
            key={`${asset.uri}-${i}`}
            uri={asset.uri}
            nieuw
            opWeg={() => opGooiNieuweWeg(i)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function FotoVakje({ uri, opWeg, nieuw }) {
  return (
    <View style={[stijl.fotoVakje, schaduw.zacht]}>
      <Image source={{ uri }} style={stijl.fotoBeeld} contentFit="cover" transition={150} />
      {nieuw ? <View style={stijl.nieuwStip} /> : null}
      <Pressable onPress={opWeg} style={stijl.fotoWeg} hitSlop={8}>
        <Text style={stijl.fotoWegTeken}>✕</Text>
      </Pressable>
    </View>
  );
}

const stijl = StyleSheet.create({
  vol: { flex: 1, backgroundColor: kleuren.rozeWolk },

  voorbeeldKaart: {
    height: 210,
    backgroundColor: kleuren.rozeZacht,
  },
  sluit: { position: 'absolute', right: ruimte.l },
  sluitKnop: {
    width: 36,
    height: 36,
    borderRadius: rond.vol,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...schaduw.zacht,
  },
  sluitTeken: { fontFamily: letters.halfvet, fontSize: 15, color: kleuren.inkt },

  inhoud: {
    backgroundColor: kleuren.rozeWolk,
    borderTopLeftRadius: rond.xl,
    borderTopRightRadius: rond.xl,
    marginTop: -22,
    paddingTop: ruimte.xl,
    paddingHorizontal: ruimte.l,
  },

  fotoKop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: ruimte.s,
  },
  fotoLabel: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
  },
  fotoAantal: { fontFamily: letters.normaal, fontSize: 12, color: kleuren.inktFluister },
  fotoRij: { gap: ruimte.s, paddingVertical: 4, paddingRight: ruimte.l },

  voegToe: {
    width: 84,
    height: 84,
    borderRadius: rond.m,
    backgroundColor: kleuren.wit,
    borderWidth: 2,
    borderColor: kleuren.rozeZacht,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  voegToeIcoon: { fontSize: 21 },
  voegToeTekst: { fontFamily: letters.halfvet, fontSize: 11.5, color: kleuren.rozeDiep },

  fotoVakje: { width: 84, height: 84, borderRadius: rond.m },
  fotoBeeld: {
    width: '100%',
    height: '100%',
    borderRadius: rond.m,
    backgroundColor: kleuren.rozeZacht,
  },
  nieuwStip: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: kleuren.mint,
    borderWidth: 1.5,
    borderColor: kleuren.wit,
  },
  fotoWeg: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 23,
    height: 23,
    borderRadius: rond.vol,
    backgroundColor: kleuren.inkt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoWegTeken: { color: kleuren.wit, fontSize: 11, fontFamily: letters.vet },

  onderbalk: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: ruimte.l,
    paddingTop: ruimte.m,
    backgroundColor: kleuren.wit,
    borderTopWidth: 1,
    borderTopColor: kleuren.lijn,
  },
  wachtTekst: {
    fontFamily: letters.normaal,
    fontSize: 14,
    color: kleuren.inktZacht,
    marginTop: ruimte.m,
  },
  voortgang: { height: 54, justifyContent: 'center', gap: 8 },
  voortgangRij: { flexDirection: 'row', alignItems: 'center', gap: ruimte.m },
  balkAchter: {
    height: 5,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeZacht,
    overflow: 'hidden',
  },
  balkVoor: { height: '100%', borderRadius: rond.vol, backgroundColor: kleuren.roze },
  voortgangTekst: { fontFamily: letters.halfvet, fontSize: 14.5, color: kleuren.inkt },
});
