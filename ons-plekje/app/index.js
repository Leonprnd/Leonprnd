// Het eerste wat er gebeurt als je de app opent: kijken waar je bent gebleven.
//
// Heb je al een kaart? Dan ga je meteen naar de kaart — dat is vanaf dat
// moment je startscherm. Je liefje hoeft er nog niet bij te zijn: je mag hem
// eerst in je eentje vullen. Anders eerst je naam, en dan een kaart maken.

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../src/state/AppProvider';
import { cloudinaryIsIngesteld } from '../src/cloudinary';
import { kleuren, letters, ruimte, rond } from '../src/theme';
import { Titel, Lopend, Kaartje } from '../src/components/basis';

export default function Start() {
  const { klaar, kaartGeladen, profiel, benLid, firebaseIsIngesteld } = useApp();

  useEffect(() => {
    if (!klaar || !firebaseIsIngesteld) return;
    // Wachten tot we weten of je al een kaart hebt; anders zou je bij elke
    // start eerst even op het koppelscherm belanden.
    if (!kaartGeladen) return;

    if (benLid) {
      router.replace('/(samen)/kaart');
    } else if (profiel?.naam) {
      router.replace('/koppelen');
    } else {
      router.replace('/welkom');
    }
  }, [klaar, kaartGeladen, profiel, benLid, firebaseIsIngesteld]);

  if (klaar && !firebaseIsIngesteld) return <NogInstellen />;

  return (
    <View style={stijl.midden}>
      <Text style={stijl.logo}>💌</Text>
      <Text style={stijl.naam}>Ons Plekje</Text>
      <ActivityIndicator color={kleuren.roze} style={{ marginTop: ruimte.xl }} />
    </View>
  );
}

// Zolang de Firebase-sleutels nog niet ingevuld zijn, leggen we hier uit wat
// er nog moet gebeuren in plaats van een onbegrijpelijke foutmelding te geven.
function NogInstellen() {
  return (
    <ScrollView contentContainerStyle={stijl.uitleg}>
      <Text style={stijl.logo}>🔧</Text>
      <Titel style={{ textAlign: 'center' }}>Bijna klaar!</Titel>
      <Lopend zacht style={{ textAlign: 'center', marginTop: ruimte.s }}>
        De app mist nog zijn verbinding met Firebase. Dat is eenmalig werk van
        een minuut of tien.
      </Lopend>

      <Kaartje style={{ marginTop: ruimte.xl, width: '100%' }}>
        <Text style={stijl.stapKop}>Wat je moet doen</Text>
        {[
          'Maak een gratis project op console.firebase.google.com',
          'Zet Authentication aan met "Anoniem"',
          'Maak een Firestore-database (Standard edition)',
          'Voeg een web-app toe en kopieer de sleutels',
          'Zet die in het bestand .env (zie .env.example)',
          'Stop de app en start hem opnieuw met npx expo start -c',
        ].map((stap, i) => (
          <View key={stap} style={stijl.stap}>
            <View style={stijl.stapBol}>
              <Text style={stijl.stapNummer}>{i + 1}</Text>
            </View>
            <Text style={stijl.stapTekst}>{stap}</Text>
          </View>
        ))}
      </Kaartje>

      {!cloudinaryIsIngesteld ? (
        <Kaartje style={{ marginTop: ruimte.m, width: '100%' }}>
          <Text style={stijl.stapKop}>En voor de foto’s</Text>
          <Text style={stijl.stapTekst}>
            Maak een gratis account op cloudinary.com, zet onder
            Settings {'>'} Upload een upload-preset op {'"'}Unsigned{'"'}, en vul je
            cloud name en de naam van die preset in je .env in. Geen
            creditcard nodig.
          </Text>
        </Kaartje>
      ) : null}

      <Lopend zacht klein style={{ textAlign: 'center', marginTop: ruimte.l }}>
        In README.md staat elke stap uitgeschreven.
      </Lopend>
    </ScrollView>
  );
}

const stijl = StyleSheet.create({
  midden: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: kleuren.rozeWolk,
  },
  logo: { fontSize: 58 },
  naam: {
    fontFamily: letters.vet,
    fontSize: 30,
    color: kleuren.rozeDiep,
    marginTop: ruimte.m,
    letterSpacing: -0.5,
  },

  uitleg: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ruimte.xl,
    backgroundColor: kleuren.rozeWolk,
  },
  stapKop: {
    fontFamily: letters.halfvet,
    fontSize: 12.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: kleuren.inktZacht,
    marginBottom: ruimte.m,
  },
  stap: { flexDirection: 'row', gap: ruimte.m, alignItems: 'flex-start', marginBottom: ruimte.m },
  stapBol: {
    width: 24,
    height: 24,
    borderRadius: rond.vol,
    backgroundColor: kleuren.rozeZacht,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stapNummer: { fontFamily: letters.vet, fontSize: 12.5, color: kleuren.rozeDiep },
  stapTekst: {
    flex: 1,
    fontFamily: letters.normaal,
    fontSize: 14.5,
    lineHeight: 21,
    color: kleuren.inkt,
  },
});
