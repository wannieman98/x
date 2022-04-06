const pluginLoco = require('./src/plugin');

module.exports = {
  prefix: 'x-',
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {}
  },
  plugins: [pluginLoco]
};
