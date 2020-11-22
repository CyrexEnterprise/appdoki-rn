module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    ['module-resolver', {
      root: ['.'],
      alias: {
        assets: './src/assets',
        components: './src/components',
        constants: './src/constants',
        routes: './src/routes',
        screens: './src/screens',
        store: './src/store',
        util: './src/util',
      },
      extensions: ['.js', '.ts', '.tsx', '.ios.js', '.android.js', '.json'],
    }],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console', 'react-native-paper/babel'],
    },
  },
}
