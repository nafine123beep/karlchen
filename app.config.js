module.exports = {
  name: 'Karlchen',
  slug: 'karlchen',
  version: '0.1.0',
  orientation: 'portrait',
  // icon: './assets/icon.png', // TODO: Add app icon
  userInterfaceStyle: 'light',
  // splash: {
  //   image: './assets/splash.png',
  //   resizeMode: 'contain',
  //   backgroundColor: '#ffffff'
  // }, // TODO: Add splash screen
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.karlchen.app'
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: './assets/adaptive-icon.png',
    //   backgroundColor: '#ffffff'
    // }, // TODO: Add adaptive icon
    package: 'com.karlchen.app'
  },
  web: {
    // favicon: './assets/favicon.png' // TODO: Add favicon
  },
  plugins: [
    'expo-font'
  ],
  extra: {
    description: 'Lerne Doppelkopf spielen mit interaktivem Tutorial und KI-Gegnern'
  }
};
