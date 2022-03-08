const plugin = require('./src/tailwind/plugin');
const options = require('./src/tailwind/options');
module.exports = {
  content: [
    './index.html',
    './src/components/**/*.vue',
    './src/views/**/*.vue',
    './src/x-modules/**/components/**/*.vue'
  ],
  prefix: 'x-',
  plugins: [plugin(options)]
};
