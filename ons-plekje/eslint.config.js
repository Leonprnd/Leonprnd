// Lintregels voor het project. Draaien met: npm run lint
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**', 'dist/**', '.expo/**'],
  },
  {
    // De scripts draaien op Node, niet in de app.
    files: ['scripts/**/*.mjs', 'scripts/**/*.js', '*.config.js'],
    languageOptions: {
      globals: { Buffer: 'readonly', process: 'readonly', console: 'readonly' },
    },
  },
];
