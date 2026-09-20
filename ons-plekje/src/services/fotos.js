// Foto's kiezen, kleiner maken en in de Firebase-opslag zetten.
//
// Kleiner maken is belangrijk: een telefoonfoto is zo 5 MB, en dat is zonde
// van jullie data én van de gratis opslagruimte. 1400 px breed is ruim genoeg
// om op een telefoonscherm mooi te blijven.

import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import {
  ref as opslagRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { geefOpslag } from '../firebase';
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

// --- Klaarmaken en uploaden -------------------------------------------------

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

// Firebase Storage wil bytes. expo-file-system levert die rechtstreeks;
// lukt dat niet, dan pakken we het via fetch als reservepad.
async function leesBytes(uri) {
  try {
    const bestand = new File(uri);
    return await bestand.arrayBuffer();
  } catch {
    const antwoord = await fetch(uri);
    return await antwoord.blob();
  }
}

function maakBestandsnaam() {
  const willekeurig = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${willekeurig}.jpg`;
}

// Zet één gekozen foto in de opslag en geef terug wat we in Firestore bewaren.
export async function uploadFoto(code, momentId, asset) {
  const klein = await verklein(asset);
  const bytes = await leesBytes(klein.uri);

  const pad = `kaarten/${normaliseerCode(code)}/momenten/${momentId}/${maakBestandsnaam()}`;
  const verwijzing = opslagRef(geefOpslag(), pad);

  await uploadBytes(verwijzing, bytes, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(verwijzing);

  return {
    url,
    pad,
    breedte: klein.width,
    hoogte: klein.height,
  };
}

export async function uploadFotos(code, momentId, assets, bijVoortgang) {
  const klaar = [];
  for (let i = 0; i < assets.length; i += 1) {
    // Eén voor één: tegelijk uploaden vreet geheugen op een telefoon.
    const foto = await uploadFoto(code, momentId, assets[i]);
    klaar.push(foto);
    if (bijVoortgang) bijVoortgang(i + 1, assets.length);
  }
  return klaar;
}

// --- Opruimen ---------------------------------------------------------------

export async function verwijderFotos(fotos) {
  if (!fotos?.length) return;
  await Promise.all(
    fotos.map(async (foto) => {
      if (!foto?.pad) return;
      try {
        await deleteObject(opslagRef(geefOpslag(), foto.pad));
      } catch {
        // Foto al weg of geen rechten meer: niet erg, we gaan gewoon door.
      }
    }),
  );
}
