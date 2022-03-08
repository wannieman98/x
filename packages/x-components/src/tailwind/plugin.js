const plugin = require('tailwindcss/plugin');
const { deepMerge } = require('@empathyco/x-deep-merge');
const theme = require('./theme');
const components = require('./components');

module.exports = plugin.withOptions(
  function (options) {
    return function (tailwindHelpers) {
      const {
        addUtilities,
        addComponents,
        matchComponents,
        e,
        prefix,
        config,
        addVariant,
        matchUtilities,
        theme
      } = tailwindHelpers;
      addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components(tailwindHelpers))
      );

      matchComponents(
        {
          btn: value => ({
            backgroundColor: value.BACKGROUND || value.DEFAULT || value['200'],
            color: value.FOREGROUND || value['50'] || theme('white')
          })
        },
        { values: theme('colors') }
      );
    };
  },
  function (options) {
    return {
      theme: deepMerge({}, theme, options?.theme)
    };
  }
);
