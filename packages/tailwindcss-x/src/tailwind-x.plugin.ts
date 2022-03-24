import plugin from 'tailwindcss/plugin';
import { deepMerge } from '@empathyco/x-deep-merge';
import theme from './theme';
import components from './components';
import { TailwindHelpers } from './types';

export default plugin.withOptions(
  function (options) {
    return function (tailwindHelpers: TailwindHelpers) {
      const { addComponents, matchComponents, theme } = tailwindHelpers;
      addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components(tailwindHelpers))
      );

      matchComponents(
        {
          btn: (value: any) =>
            deepMerge(
              {},
              {
                backgroundColor: value['50'],
                color: value['25'] || theme('white')
              },
              options.dynamicComponents?.(tailwindHelpers)?.btn(value)
            )
        },
        { values: theme('colors') }
      );
      options.custom?.(tailwindHelpers);
    };
  },
  function (options) {
    return {
      theme: deepMerge({}, theme, options?.theme)
    };
  }
);
