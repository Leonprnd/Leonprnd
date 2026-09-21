// Het uiterlijk van de hele app op een plek: kleuren, rondingen, schaduwen
// en lettertypes. Pas je hier iets aan, dan verandert het overal mee.

export const kleuren = {
  roze: '#FF6F91',
  rozeDiep: '#E04E74',
  rozeZacht: '#FFE3EC',
  rozeWolk: '#FFF1F5',
  creme: '#FFF8F3',
  perzik: '#FFB199',
  lavendel: '#C9A7EB',
  mint: '#8FD3C7',
  goud: '#F3B03C',
  goudZacht: '#FFF0D2',
  inkt: '#422B34',
  inktZacht: '#9A7A86',
  inktFluister: '#C9B2BA',
  wit: '#FFFFFF',
  lijn: '#F4DCE4',
  rood: '#E2574C',
};

export const ruimte = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

export const rond = {
  s: 12,
  m: 18,
  l: 26,
  xl: 34,
  vol: 999,
};

// Lettertypes worden geladen in app/_layout.js. Valt dat om welke reden dan
// ook om, dan gebruikt React Native gewoon het systeemlettertype.
export const letters = {
  licht: 'Quicksand_400Regular',
  normaal: 'Quicksand_500Medium',
  halfvet: 'Quicksand_600SemiBold',
  vet: 'Quicksand_700Bold',
  hand: 'Caveat_600SemiBold',
  handVet: 'Caveat_700Bold',
};

export const schaduw = {
  zacht: {
    shadowColor: '#C4788F',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  kaart: {
    shadowColor: '#B5657E',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  pin: {
    shadowColor: '#7A3A50',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};

export const verlopen = {
  roze: ['#FF8FAB', '#FF6F91'],
  zonsondergang: ['#FFC3A0', '#FF8FAB'],
  lucht: ['#FFF1F5', '#FFE3EC'],
  goud: ['#FFD99B', '#F3B03C'],
};
