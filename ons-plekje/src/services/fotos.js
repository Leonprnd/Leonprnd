// Foto's kiezen, kleiner maken en naar Cloudinary sturen.
//
// Kleiner maken voor het versturen is belangrijk: een telefoonfoto is zo
// 5 MB, en dat is zonde van jullie data. 1400 px breed is ruim genoeg om op
// een telefoonscherm mooi te blijven; Cloudinary maakt daar daarna zelf de
// juiste maat van voor waar de foto getoond wordt.

import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {
  cloudinaryIsIngesteld,
  uploadAdres,
  uploadPreset,
  leesFout,
} from '../cloudinary';
import { normaliseerCode } from '../utils/code';

const MAX_BREEDTE = 1400;
const KWALITEIT = 0.72;
export const MAX_FOTOS_PER_MOMENT = 12;

// --- Kiezen -----------------------------------------------------------------

export async function kiesUitGalerij(maxAantal = MAX_FOTOS_PER_MOMENT) {
  const toestemming = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!toestemming.granted) {
    return { geweigerd: true, fotos: [] };
  }

  const resultaat = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: maxAantal,
    quality: 1,
    exif: false,
  });

  if (resultaat.canceled) return { geannuleerd: true, fotos: [] };
  return { fotos: resultaat.assets || [] };
}

export async function maakMetCamera() {
  const toestemming = await ImagePicker.requestCameraPermissionsAsync();
  if (!toestemming.granted) {
    return { geweigerd: true, fotos: [] };
  }

  const resultaat = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 1,
    exif: false,
  });

  if (resultaat.canceled) return { geannuleerd: true, fotos: [] };
  return { fotos: resultaat.assets || [] };
}

// --- Klaarmaken en versturen ------------------------------------------------

async function verklein(asset) {
  // Alleen verkleinen, nooit vergroten: een kleine foto oprekken maakt hem
  // alleen maar waziger en zwaarder.
  const origineleBreedte = asset.width || 0;
  const doel = origineleBreedte > 0 ? Math.min(MAX_BREEDTE, origineleBreedte) : MAX_BREEDTE;

  return manipulateAsync(
    asset.uri,
    [{ resize: { width: doel } }],
    { compress: KWALITEIT, format: SaveFormat.JPEG },
  );
}

// Zet één gekozen foto bij Cloudinary neer en geef terug wat we in Firestore
// bewaren. De mapnaam bevat jullie koppelcode en het nummer van het moment,
// zodat je in Cloudinary terugziet waar een foto bij hoort.
export async function uploadFoto(code, momentId, asset) {
  if (!cloudinaryIsIngesteld) {
    throw new Error(
      'Cloudinary is nog niet ingesteld. Vul EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME en EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in je .env in.',
    );
  }

  const klein = await verklein(asset);

  const formulier = new FormData();
  formulier.append('file', {
    uri: klein.uri,
    type: 'image/jpeg',
    name: 'foto.jpg',
  });
  formulier.append('upload_preset', uploadPreset);
  formulier.append('folder', `ons-plekje/${normaliseerCode(code)}/${momentId}`);

  // Geen Content-Type meegeven: fetch zet die zelf goed, inclusief de
  // scheidingstekens die bij een formulier horen.
  const antwoord = await fetch(uploadAdres, { method: 'POST', body: formulier });

  if (!antwoord.ok) {
    throw new Error(leesFout(await antwoord.text(), antwoord.status));
  }

  const gegevens = await antwoord.json();

  return {
    url: gegevens.secure_url,
    publicId: gegevens.public_id,
    breedte: gegevens.width,
    hoogte: gegevens.height,
  };
}

export async function uploadFotos(code, momentId, assets, bijVoortgang) {
  const klaar = [];
  for (let i = 0; i < assets.length; i += 1) {
    // Eén voor één: tegelijk versturen vreet geheugen op een telefoon.
    const foto = await uploadFoto(code, momentId, assets[i]);
    klaar.push(foto);
    if (bijVoortgang) bijVoortgang(i + 1, assets.length);
  }
  return klaar;
}

// --- Over het weggooien van foto's ------------------------------------------
//
// Haal je een foto of een heel plekje weg, dan verdwijnt hij uit jullie kaart
// en zien jullie hem allebei niet meer. Het bestand zelf blijft wel bij
// Cloudinary staan.
//
// Dat is geen slordigheid maar een bewuste keuze: iets bij Cloudinary
// weggooien vraagt om een geheime sleutel, en die kun je niet in een app
// zetten zonder hem weg te geven — dan zou iedereen die de app heeft ook
// júllie foto's kunnen wissen. Het alternatief is een eigen servertje, en dat
// is voor twee mensen overdreven.
//
// In de praktijk merk je er niets van: jullie hebben 25 GB, en een foto uit
// deze app is een paar honderd kilobyte. Wil je toch echt opruimen, dan kan
// dat in de Media Library van Cloudinary; de map heet naar jullie koppelcode.
