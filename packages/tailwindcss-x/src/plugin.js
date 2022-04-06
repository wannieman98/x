const plugin = require('tailwindcss/plugin');
const { deepMerge } = require('../../deep-merge');

module.exports = plugin.withOptions(
  function (options) {
    return function (tailwindHelpers) {
      const className = options.className ?? 'markdown';

      tailwindHelpers.addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components(tailwindHelpers))
      );
    };
  },
  function (options) {
    return {
      theme: {
        markdown: {
          // ...
        }
      }
    };
  }
);
