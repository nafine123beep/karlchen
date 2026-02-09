module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
          alias: {
            '@': './src',
            '@/engine': './src/engine',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/store': './src/store',
            '@/data': './src/data',
            '@/utils': './src/utils',
            '@/types': './src/types',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
