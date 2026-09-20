// Een eigen kleurenjasje voor Google Maps: room, zacht roze en mint in plaats
// van het standaard grijs. Dit werkt alleen met de Google-kaart (dus op
// Android altijd, en op iOS in een eigen build — zie de README).

export const kaartStijl = [
  { elementType: 'geometry', stylers: [{ color: '#FFF7F2' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9A7A86' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFBF8' }, { weight: 3 }] },

  // Land en wijken
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#F4DCE4' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#B5657E' }],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#C9A2B1' }],
  },

  // Groen en parken
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#F3F9F1' }],
  },
  { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#DFF3E4' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [{ color: '#FBEFE2' }],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [{ color: '#FDE9EC' }],
  },

  // Wegen
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#FAE6EC' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#C4A2AD' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#FFE9D6' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#FBD9BC' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#FFFDFC' }],
  },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  // Openbaar vervoer
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#F6E7EE' }],
  },
  { featureType: 'transit.station', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },

  // Water
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#CFE8F3' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8FB9CC' }],
  },
];
