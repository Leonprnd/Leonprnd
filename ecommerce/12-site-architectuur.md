# 12 — Site-architectuur

## Uitgangspunt: één product, geen doolhof

Dit is een eenproductwinkel. Elke extra keuze is een extra kans om af te haken,
en bij een doelgroep die zorgvuldig beslist is dat dubbel zo waar.

Dus: **geen categoriepagina's, geen filters, geen zoekfunctie, geen blog bij
lancering.** Er is één product en één pad ernaartoe.

## Sitemap

```
/                                  Home
/products/zichtwerk-daglamp        Productpagina  ← al het advertentieverkeer
/pages/over-ons                    Over ons
/pages/contact                     Contact
/pages/veelgestelde-vragen         FAQ
/pages/verzending                  Verzending en levering
/pages/retourneren                 Retourneren en herroepingsrecht
/pages/garantie                    Garantie
/pages/bestelling-volgen           Bestelling volgen
/pages/herroeping                  Herroepingsknop  ← wettelijk verplicht
/policies/privacy-policy           Privacybeleid
/policies/terms-of-service         Algemene voorwaarden
/policies/legal-notice             Cookiebeleid
/cart                              Winkelwagen
/checkout                          Afrekenen (Shopify)
```

Dat is het. Elf pagina's plus checkout.

> **Over `/pages/herroeping`:** sinds 19 juni 2026 moeten webshops een
> herroepingsknop in hun online omgeving hebben waarmee een consument de koop
> eenvoudig digitaal kan ontbinden, zonder onnodige drempels en zonder verplicht
> account ([ACM](https://www.acm.nl/nl/publicaties/acm-roept-online-retailers-op-zich-voor-te-bereiden-op-herroepingsknop)).
> Ontbreekt die, dan kan de bedenktijd oplopen tot een jaar. De section staat
> klaar in `shopify-theme/sections/herroepingsknop.liquid`.

## Navigatie

### Header — mobiel (de belangrijkste)

```
┌─────────────────────────────────────────┐
│  ☎ 0XX – XXX XXXX   ma–vr 9–17 uur      │  ← aankondigingsbalk
├─────────────────────────────────────────┤
│  ☰        zichtwerk          🛒 Winkelwagen │
└─────────────────────────────────────────┘
```

Drie dingen, meer niet. Het telefoonnummer staat **boven** het logo, want dat is
het sterkste vertrouwenssignaal dat je hebt en het moet zichtbaar zijn zonder
scrollen.

Achter het menu (☰):
- De Daglamp
- Veelgestelde vragen
- Verzending en retour
- Contact
- Over ons

Vijf regels, elk minimaal 52 px hoog, met tekstlabels. Geen submenu's, geen
uitklappers.

### Header — desktop

```
☎ 0XX – XXX XXXX  ·  ma–vr 9–17 uur  ·  Gratis verzending  ·  60 dagen retour
─────────────────────────────────────────────────────────────────────────────
zichtwerk        De Daglamp   Veelgestelde vragen   Verzending   Contact   🛒
```

### Footer

Vier kolommen op desktop, onder elkaar op mobiel:

| Winkel | Klantenservice | Voorwaarden | Zichtwerk |
|---|---|---|---|
| De Daglamp | Contact | Algemene voorwaarden | Over ons |
| Bestelling volgen | Veelgestelde vragen | Privacybeleid | Ons verhaal |
| | Verzending | Cookiebeleid | |
| | Retourneren | Herroepingsformulier | |
| | Garantie | | |

Daaronder, over de volle breedte en **leesbaar** (15 px, kleur Steen):

```
Zichtwerk · [Straat + nummer], [Postcode] [Plaats], Nederland
KVK [nummer] · BTW NL[nummer]B01
info@zichtwerk.nl · 0XX – XXX XXXX (ma–vr 9–17 uur)

[iDEAL] [Mastercard] [Visa] [PayPal] [Apple Pay]
```

Die bedrijfsgegevens zijn wettelijk verplicht, maar belangrijker: volgens het
onderzoek in `06` is dit precies waar een twijfelende koper naar scrollt voordat
ze op "bestellen" drukt. Verstop ze niet onder "algemene voorwaarden" — de ACM
beschouwt dat expliciet als onvoldoende.

## Verkeersstromen

| Bron | Landt op | Waarom |
|---|---|---|
| Meta Ads — koude prospectie | `/products/zichtwerk-daglamp` | Direct naar het product. Geen tussenstap, geen homepage. |
| Meta Ads — cadeauhoek (Q4) | `/products/zichtwerk-daglamp?variant=compleet` | Zelfde pagina, bundel voorgeselecteerd |
| Meta Ads — educatieve hoek | `/products/zichtwerk-daglamp#waarom-glas` | Diep­link naar het uitlegblok |
| Retargeting winkelwagenverlaters | `/cart` | Terug waar ze stopten |
| E-mail (post-purchase) | `/pages/bestelling-volgen` | |
| Organisch / merknaam | `/` | |

**De homepage is niet je landingspagina.** Hij bestaat voor mensen die je naam
intypen omdat ze de advertentie gisteren zagen, en voor mensen die na het
product terugklikken om te kijken "wat voor bedrijf is dit eigenlijk". Dat is
een echte en belangrijke rol — zie `13-homepage.md` — maar het is niet waar je
advertentiegeld landt.

## URL-regels

- Altijd Nederlands, altijd kleine letters, woorden met koppeltekens.
- Geen Shopify-standaardpaden in de navigatie (`/collections/all` bestaat wel
  maar staat nergens in een menu).
- Eén canonieke productpagina. Varianten via querystring, niet via aparte URL's.
- Alle URL's blijven stabiel na lancering — je advertenties en e-mails wijzen
  ernaar.

## Wat er bewust níet is

| Niet | Waarom |
|---|---|
| Zoekbalk | Eén product. Een zoekbalk die niets vindt, verliest vertrouwen. |
| Blog | Kost onderhoud, levert in maand één niets op. Vanaf maand vier heroverwegen voor SEO. |
| Accountregistratie | Verplicht een account aanmaken is een conversiekiller én bij de herroepingsknop wettelijk niet toegestaan. Gastcheckout staat aan. |
| Wishlist | Niemand in deze doelgroep gebruikt het. |
| Livechat-widget | Klinkt behulpzaam, maar een chatbubbel die "Hoi! 👋" zegt leest als nep. Een telefoonnummer werkt hier beter. |
| Nieuwsbriefpopup bij binnenkomst | Onderbreekt de advertentieboodschap op het slechtst mogelijke moment. E-mailadressen verzamelen we ná de aankoop en via exit-intent op de winkelwagen. |
| Valutawisselaar / taalwisselaar | Eén markt, één taal, één valuta. |

Door naar `13-homepage.md`.
