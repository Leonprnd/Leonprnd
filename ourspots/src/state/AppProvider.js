// De gedeelde toestand van de hele app: wie ben jij, welke kaart hoor je bij,
// welke herinneringen staan erop en waar is je liefje nu.
//
// Alles wat de schermen nodig hebben, komt hier vandaan via useApp().

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseIsIngesteld, zorgVoorAccount, volgAccount } from '../firebase';
import { woordenVan, taalVanTelefoon, zetActieveTaal } from '../taal';
import { zetEffecten, zetVogels as zetVogelsGeluid, ruimOp } from '../services/geluid';
import {
  maakKaart,
  doeMee,
  volgKaart,
  verlaatKaart,
  bewaarSamenSinds,
  bewerkLid,
  partnerVan,
  ikVan,
  benLidVan,
  isGekoppeld,
} from '../services/koppel';
import { volgMomenten } from '../services/momenten';
import {
  startDelen,
  stopMetDelen,
  volgLocatieVan,
  schrijfLocatie,
  huidigePositie,
  heeftToestemming,
  vraagToestemming,
} from '../services/locatie';

const OPSLAG_SLEUTEL = 'ourspots/profiel';
// De app heette eerst anders. Wie hem al gebruikte heeft zijn gegevens onder
// de oude naam staan; die halen we één keer over, zodat niemand zijn kaart
// kwijtraakt bij het hernoemen.
const OUDE_OPSLAG_SLEUTEL = 'ons-plekje/profiel';

const AppContext = createContext(null);

export const emojiKeuzes = [
  '🐻', '🐰', '🐼', '🦊', '🐶', '🐱', '🐨', '🦁',
  '🐯', '🐸', '🐧', '🦄', '🌸', '🌻', '⭐', '🍓',
];

export const kleurKeuzes = [
  '#FF6F91', '#FF8FAB', '#F08A5D', '#F3B03C',
  '#8FD3C7', '#6FBF8B', '#4FA3D9', '#7F7FD5',
  '#C9A7EB', '#E36BAE', '#A67C52', '#5BB98C',
];

export function AppProvider({ children }) {
  const [klaar, setKlaar] = useState(false);
  const [uid, setUid] = useState(null);
  const [profiel, setProfiel] = useState(null); // { naam, emoji, kleur }
  const [code, setCode] = useState(null);
  const [kaart, setKaart] = useState(null);
  const [kaartGeladen, setKaartGeladen] = useState(true);
  const [momenten, setMomenten] = useState([]);
  const [momentenGeladen, setMomentenGeladen] = useState(false);
  const [deeltLocatie, setDeeltLocatie] = useState(true);
  const [taal, setTaal] = useState(() => taalVanTelefoon());
  const [geluidAan, setGeluidAan] = useState(true);
  const [vogelsAan, setVogelsAan] = useState(true);
  const [mijnPositie, setMijnPositie] = useState(null);
  const [partnerLocatie, setPartnerLocatie] = useState(null);
  const [fout, setFout] = useState(null);

  const delenRef = useRef(null);
  const toestemmingGevraagdRef = useRef(false);

  // --- Opstarten: profiel uit de telefoon lezen en stil inloggen ------------

  useEffect(() => {
    let levend = true;

    (async () => {
      try {
        let rauw = await AsyncStorage.getItem(OPSLAG_SLEUTEL);
        if (!rauw) {
          rauw = await AsyncStorage.getItem(OUDE_OPSLAG_SLEUTEL);
          if (rauw) await AsyncStorage.setItem(OPSLAG_SLEUTEL, rauw);
        }
        if (levend && rauw) {
          const bewaard = JSON.parse(rauw);
          setProfiel(bewaard.profiel || null);
          setCode(bewaard.code || null);
          if (typeof bewaard.deeltLocatie === 'boolean') {
            setDeeltLocatie(bewaard.deeltLocatie);
          }
          if (bewaard.taal && woordenVan(bewaard.taal)) {
            setTaal(bewaard.taal);
            zetActieveTaal(bewaard.taal);
          }
          if (typeof bewaard.geluidAan === 'boolean') setGeluidAan(bewaard.geluidAan);
          if (typeof bewaard.vogelsAan === 'boolean') setVogelsAan(bewaard.vogelsAan);
        }
      } catch {
        // Niets bewaard of onleesbaar: we beginnen gewoon opnieuw.
      }

      if (!firebaseIsIngesteld) {
        if (levend) setKlaar(true);
        return;
      }

      try {
        await zorgVoorAccount();
      } catch (e) {
        if (levend) setFout(e?.message || 'Inloggen lukt even niet.');
      }
      if (levend) setKlaar(true);
    })();

    return () => {
      levend = false;
    };
  }, []);

  useEffect(() => {
    if (!firebaseIsIngesteld) return undefined;
    return volgAccount((gebruiker) => setUid(gebruiker ? gebruiker.uid : null));
  }, []);

  // --- Bewaren wat we lokaal onthouden -------------------------------------

  const bewaarLokaal = useCallback(async (nieuw) => {
    try {
      await AsyncStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(nieuw));
    } catch {
      // Niet kunnen bewaren is vervelend maar niet fataal.
    }
  }, []);

  useEffect(() => {
    if (!klaar) return;
    bewaarLokaal({ profiel, code, deeltLocatie, taal, geluidAan, vogelsAan });
  }, [klaar, profiel, code, deeltLocatie, taal, geluidAan, vogelsAan, bewaarLokaal]);

  // De geluidsdienst is geen React-component, dus die moet het apart horen.
  useEffect(() => {
    zetEffecten(geluidAan);
  }, [geluidAan]);

  useEffect(() => {
    zetVogelsGeluid(vogelsAan);
  }, [vogelsAan]);

  // Bij het afsluiten alle spelers netjes opruimen.
  useEffect(() => ruimOp, []);

  // --- Wisselen van kaart ---------------------------------------------------

  // Ga je naar een andere kaart (of koppel je los), dan mag er niets van de
  // vorige blijven staan. Dit hoort bij het tekenen en niet in een effect:
  // zo zie je nooit even de gegevens van de oude kaart.
  const [vorigeCode, setVorigeCode] = useState(code);
  if (vorigeCode !== code) {
    setVorigeCode(code);
    setKaart(null);
    setKaartGeladen(!code);
    setMomenten([]);
    setMomentenGeladen(!code);
    setPartnerLocatie(null);
  }

  // --- De kaart volgen ------------------------------------------------------

  useEffect(() => {
    if (!code || !firebaseIsIngesteld) return undefined;
    return volgKaart(
      code,
      (nieuw) => {
        setKaart(nieuw);
        setKaartGeladen(true);
        // Kaart bestaat niet meer (of iemand heeft 'm verlaten): loskoppelen.
        if (nieuw === null) setCode(null);
      },
      (e) => {
        setFout(e?.message || 'De kaart laden lukt even niet.');
        setKaartGeladen(true);
      },
    );
  }, [code]);

  // --- De herinneringen volgen ---------------------------------------------

  useEffect(() => {
    if (!code || !firebaseIsIngesteld) return undefined;
    return volgMomenten(
      code,
      (lijst) => {
        setMomenten(lijst);
        setMomentenGeladen(true);
      },
      (e) => {
        setFout(e?.message || 'De herinneringen laden lukt even niet.');
        setMomentenGeladen(true);
      },
    );
  }, [code]);

  const partner = useMemo(() => partnerVan(kaart, uid), [kaart, uid]);
  const ik = useMemo(() => ikVan(kaart, uid), [kaart, uid]);
  const benLid = benLidVan(kaart, uid);
  const gekoppeld = isGekoppeld(kaart);

  // --- De locatie van je liefje volgen -------------------------------------

  useEffect(() => {
    if (!code || !partner?.uid || !firebaseIsIngesteld) return undefined;
    return volgLocatieVan(
      code,
      partner.uid,
      (data) => setPartnerLocatie(data?.deelt && data?.lat != null ? data : null),
      () => setPartnerLocatie(null),
    );
  }, [code, partner?.uid]);

  // --- Je eigen locatie delen ----------------------------------------------

  useEffect(() => {
    let levend = true;

    async function regel() {
      // Eerst een eventuele oude volger netjes afsluiten.
      if (delenRef.current) {
        delenRef.current.remove();
        delenRef.current = null;
      }

      if (!code || !uid || !deeltLocatie || !firebaseIsIngesteld) return;

      // Locatie delen staat standaard aan, dus vragen we er één keer om.
      let mag = await heeftToestemming();
      if (!mag && !toestemmingGevraagdRef.current) {
        toestemmingGevraagdRef.current = true;
        mag = await vraagToestemming();
      }
      if (!mag || !levend) return;

      try {
        const nu = await huidigePositie();
        if (!levend) return;
        setMijnPositie(nu);
        await schrijfLocatie(code, uid, nu);
      } catch {
        // Locatie nog niet beschikbaar; watchPositionAsync pakt het straks op.
      }

      if (!levend) return;
      const abonnement = await startDelen(code, uid, (positie) => {
        if (levend) setMijnPositie(positie);
      });
      if (!levend) {
        abonnement?.remove();
        return;
      }
      delenRef.current = abonnement;
    }

    regel();

    return () => {
      levend = false;
      if (delenRef.current) {
        delenRef.current.remove();
        delenRef.current = null;
      }
    };
  }, [code, uid, deeltLocatie]);

  // --- Dingen die de schermen kunnen doen ----------------------------------

  const bewaarProfiel = useCallback(
    async (nieuw) => {
      setProfiel(nieuw);
      if (code && uid) {
        try {
          await bewerkLid(code, uid, nieuw);
        } catch {
          // Naam aanpassen lukt niet zonder internet; lokaal klopt het wel.
        }
      }
    },
    [code, uid],
  );

  const beginNieuweKaart = useCallback(async () => {
    if (!uid || !profiel) throw new Error('Vul eerst je naam in.');
    const nieuweCode = await maakKaart({ uid, ...profiel });
    setCode(nieuweCode);
    return nieuweCode;
  }, [uid, profiel]);

  const koppelMetCode = useCallback(
    async (invoer) => {
      if (!uid || !profiel) throw new Error('Vul eerst je naam in.');
      const kaal = await doeMee({ code: invoer, uid, ...profiel });
      setCode(kaal);
      return kaal;
    },
    [uid, profiel],
  );

  const koppelLos = useCallback(async () => {
    if (code && uid) {
      try {
        await stopMetDelen(code, uid);
        await verlaatKaart(code, uid);
      } catch {
        // Ook als dat misgaat laten we deze telefoon los.
      }
    }
    setCode(null);
    setKaart(null);
    setMomenten([]);
    setPartnerLocatie(null);
  }, [code, uid]);

  const zetDelen = useCallback(
    async (aan) => {
      if (aan) {
        const mag = (await heeftToestemming()) || (await vraagToestemming());
        if (!mag) return false;
        setDeeltLocatie(true);
        return true;
      }
      setDeeltLocatie(false);
      if (code && uid) {
        try {
          await stopMetDelen(code, uid);
        } catch {
          // Volgende keer online gaan we het opnieuw proberen.
        }
      }
      return true;
    },
    [code, uid],
  );

  const kiesTaal = useCallback((nieuw) => {
    // Eerst de losse hulpjes bijwerken, dan pas opnieuw tekenen: zo staat een
    // datum meteen in de nieuwe taal en niet pas één scherm later.
    zetActieveTaal(nieuw);
    setTaal(nieuw);
  }, []);

  const zetSamenSinds = useCallback(
    async (datumSleutel) => {
      if (!code) return;
      await bewaarSamenSinds(code, datumSleutel);
    },
    [code],
  );

  const waarde = useMemo(
    () => ({
      klaar,
      firebaseIsIngesteld,
      uid,
      profiel,
      code,
      kaart,
      kaartGeladen,
      ik,
      partner,
      benLid,
      gekoppeld,
      momenten,
      momentenGeladen,
      mijnPositie,
      // Zonder partner is er ook geen stip: anders blijft die van iemand die
      // net is losgekoppeld nog even op de kaart staan.
      partnerLocatie: partner ? partnerLocatie : null,
      deeltLocatie,
      taal,
      t: woordenVan(taal),
      geluidAan,
      vogelsAan,
      fout,
      setFout,
      kiesTaal,
      setGeluidAan,
      setVogelsAan,
      bewaarProfiel,
      beginNieuweKaart,
      koppelMetCode,
      koppelLos,
      zetDelen,
      zetSamenSinds,
    }),
    [
      klaar, uid, profiel, code, kaart, kaartGeladen, ik, partner, benLid, gekoppeld, momenten,
      momentenGeladen, mijnPositie, partnerLocatie, deeltLocatie, taal,
      geluidAan, vogelsAan, fout, bewaarProfiel, beginNieuweKaart,
      koppelMetCode, koppelLos, zetDelen, zetSamenSinds, kiesTaal,
    ],
  );

  return <AppContext.Provider value={waarde}>{children}</AppContext.Provider>;
}

export function useApp() {
  const waarde = useContext(AppContext);
  if (!waarde) throw new Error('useApp moet binnen AppProvider gebruikt worden.');
  return waarde;
}
