// De verbinding met Firebase. Alle sleutels komen uit .env, zodat ze niet in
// de code staan. Staat er nog niets ingevuld, dan start de app gewoon op en
// legt hij in beeld uit wat er nog moet gebeuren.

import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import {
  initializeAuth,
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseIsIngesteld = Boolean(
  config.apiKey && config.projectId && config.appId,
);

let app = null;
let auth = null;
let db = null;

function start() {
  if (app) return;
  app = getApps().length ? getApp() : initializeApp(config);

  // Inloggen onthouden tussen keren dat je de app opent. Op de telefoon gaat
  // dat via AsyncStorage; op web regelt de browser het zelf, en daar bestaat
  // getReactNativePersistence niet — vandaar de controle.
  // getReactNativePersistence bestaat alleen in de React Native-uitvoering van
  // firebase/auth, niet in die voor de browser. De linter ziet alleen die
  // laatste; op de telefoon is hij er wel, en anders vangt de controle het op.
  // eslint-disable-next-line import/namespace
  const metAsyncStorage = firebaseAuth.getReactNativePersistence;
  try {
    auth = metAsyncStorage
      ? initializeAuth(app, { persistence: metAsyncStorage(AsyncStorage) })
      : getAuth(app);
  } catch {
    // initializeAuth klaagt als auth al eerder is opgezet (bij hot reload).
    auth = getAuth(app);
  }

  // Long polling: de websocket-verbinding van Firestore is op sommige
  // telefoonnetwerken onbetrouwbaar; hiermee werkt het overal.
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: memoryLocalCache(),
  });

}

export function geefAuth() {
  start();
  return auth;
}

export function geefDb() {
  start();
  return db;
}

// Iedereen krijgt stilletjes een account; niemand hoeft een wachtwoord te
// bedenken. De koppelcode is wat jullie twee aan elkaar verbindt.
export async function zorgVoorAccount() {
  const a = geefAuth();
  if (a.currentUser) return a.currentUser;
  const resultaat = await signInAnonymously(a);
  return resultaat.user;
}

export function volgAccount(callback) {
  return onAuthStateChanged(geefAuth(), callback);
}
