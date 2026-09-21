// Alles wat de app over zichzelf moet weten. De sleutels komen uit .env zodat
// ze niet in de code (en dus niet op GitHub) belanden.
const googleMapsAndroid = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY || '';
const googleMapsIos = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY || '';

export default {
  expo: {
    name: 'OurSpots',
    slug: 'ourspots',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'ourspots',
    userInterfaceStyle: 'light',
    icon: './assets/icon.png',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ourspots.app',
      config: {
        googleMapsApiKey: googleMapsIos,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Zo zien jullie elkaar op de kaart en kun je een plekje vastleggen waar je nu bent.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Zo zien jullie elkaar op de kaart en kun je een plekje vastleggen waar je nu bent.',
        NSPhotoLibraryUsageDescription:
          'Om foto’s bij een herinnering te kunnen zetten.',
        NSCameraUsageDescription:
          'Om meteen een foto te maken bij een herinnering.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.ourspots.app',
      predictiveBackGestureEnabled: false,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFE3EC',
      },
      config: {
        googleMaps: { apiKey: googleMapsAndroid },
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'READ_MEDIA_IMAGES',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
      // Zodat "Zet op beginscherm" een echt app-icoon en een schermvullend
      // venster geeft in plaats van een browsertab.
      name: 'OurSpots',
      shortName: 'OurSpots',
      display: 'standalone',
      orientation: 'portrait',
      themeColor: '#FF6F91',
      backgroundColor: '#FFF1F5',
      startUrl: '/',
      scope: '/',
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 180,
          resizeMode: 'contain',
          backgroundColor: '#FFF1F5',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'So you and your partner can see each other on the map, and mark a spot where you are now.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Om foto’s bij een herinnering te kunnen zetten.',
          cameraPermission: 'Om meteen een foto te maken bij een herinnering.',
        },
      ],
    ],
    extra: {
      heeftGoogleMapsSleutel: Boolean(googleMapsAndroid || googleMapsIos),
      // Het project bij Expo waar de builds heen gaan. Normaal zet `eas init`
      // dit er zelf in, maar dat lukt niet bij een config die JavaScript is —
      // vandaar met de hand.
      eas: {
        projectId: 'e5e9d9c1-6974-432a-b063-3d265adf7620',
      },
    },
    owner: 'leonprnd',
  },
};
