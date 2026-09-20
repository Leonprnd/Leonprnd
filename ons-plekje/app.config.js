// Alles wat de app over zichzelf moet weten. De sleutels komen uit .env zodat
// ze niet in de code (en dus niet op GitHub) belanden.
const googleMapsAndroid = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY || '';
const googleMapsIos = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY || '';

export default {
  expo: {
    name: 'Ons Plekje',
    slug: 'ons-plekje',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'onsplekje',
    userInterfaceStyle: 'light',
    icon: './assets/icon.png',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.onsplekje.app',
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
      package: 'com.onsplekje.app',
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
      output: 'static',
      favicon: './assets/favicon.png',
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
            'Zo zien jullie elkaar op de kaart en kun je een plekje vastleggen waar je nu bent.',
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
    },
  },
};
