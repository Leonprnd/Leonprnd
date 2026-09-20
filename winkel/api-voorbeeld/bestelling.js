// Voorbeeldfunctie om bestellingen naar Mollie te sturen.
//
// Kopieer dit bestand naar api/bestelling.js in de hoofdmap van je
// Vercel-project en zet MOLLIE_API_KEY in de omgevingsvariabelen.
// Zet daarna in winkel/paginas/afrekenen.html:
//     data-endpoint="/api/bestelling"
//
// Zie draaiboek/07-betalen-en-techniek.md.

// De prijzen staan HIER, op de server. Het bedrag dat de browser meestuurt
// wordt genegeerd -- anders bepaalt de klant zelf wat hij betaalt.
const PRIJZEN = {
  'bijtijds-28': 9995,
  'bijtijds-7': 5995,
  doseerring: 1495,
};

const VERZENDKOSTEN = 495;
const GRATIS_VANAF = 5000;

function centenNaarEuro(centen) {
  return (centen / 100).toFixed(2);
}

export default async function handler(verzoek, antwoord) {
  if (verzoek.method !== 'POST') {
    return antwoord.status(405).json({ fout: 'Alleen POST' });
  }

  const sleutel = process.env.MOLLIE_API_KEY;
  if (!sleutel) {
    console.error('MOLLIE_API_KEY ontbreekt');
    return antwoord.status(500).json({ fout: 'Betalen is nog niet ingesteld' });
  }

  const { klant, regels } = verzoek.body || {};

  if (!Array.isArray(regels) || regels.length === 0) {
    return antwoord.status(400).json({ fout: 'Lege bestelling' });
  }
  if (!klant || !klant.email || !klant.postcode) {
    return antwoord.status(400).json({ fout: 'Gegevens onvolledig' });
  }

  // Zelf opnieuw uitrekenen. Dit is de hele reden dat deze functie bestaat.
  let subtotaal = 0;
  const gecontroleerd = [];

  for (const regel of regels) {
    const prijs = PRIJZEN[regel.id];
    if (!prijs) {
      return antwoord.status(400).json({ fout: `Onbekend product: ${regel.id}` });
    }
    const aantal = Math.max(1, Math.min(20, parseInt(regel.aantal, 10) || 0));
    subtotaal += prijs * aantal;
    gecontroleerd.push({ id: regel.id, aantal });
  }

  const verzending = subtotaal >= GRATIS_VANAF ? 0 : VERZENDKOSTEN;
  const totaal = subtotaal + verzending;

  const basis = `https://${verzoek.headers.host}`;
  const bestelnummer = `BT-${Date.now().toString(36).toUpperCase()}`;

  try {
    const reactie = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sleutel}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: { currency: 'EUR', value: centenNaarEuro(totaal) },
        description: `Bestelling ${bestelnummer}`,
        redirectUrl: `${basis}/bedankt.html`,
        webhookUrl: `${basis}/api/mollie-melding`,
        metadata: {
          bestelnummer,
          regels: gecontroleerd,
          email: klant.email,
          naam: `${klant.voornaam || ''} ${klant.achternaam || ''}`.trim(),
        },
      }),
    });

    if (!reactie.ok) {
      const tekst = await reactie.text();
      console.error('Mollie weigerde de betaling:', reactie.status, tekst);
      return antwoord.status(502).json({ fout: 'Betaaldienst niet bereikbaar' });
    }

    const betaling = await reactie.json();

    // TODO: bewaar de bestelling voordat je de klant doorstuurt, zodat je hem
    // terugvindt als de webhook binnenkomt. Een e-mail naar jezelf volstaat
    // voor de eerste vijftig bestellingen.

    return antwoord.status(200).json({
      bestelnummer,
      betaalUrl: betaling._links.checkout.href,
    });
  } catch (fout) {
    console.error('Onverwachte fout bij het aanmaken van de betaling:', fout);
    return antwoord.status(500).json({ fout: 'Er ging iets mis' });
  }
}
