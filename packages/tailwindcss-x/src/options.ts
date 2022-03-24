import { ComponentsDefinition } from './components';
import { TailwindHelpers } from './types';

export default {
  components({ theme }: TailwindHelpers): ComponentsDefinition {
    return {
      '.btn': {
        backgroundColor: 'blue',
        color: theme('colors.neutral.500'),
        '&-lg': {}
      },
      '.icon': {}
    };
  },
  dynamicComponents(_tailwindHelpers: TailwindHelpers) {
    return {
      btn: (value: any) => ({
        backgroundColor: value['75']
      })
    };
  },
  extra({ matchComponents, theme }: TailwindHelpers) {
    matchComponents(
      {
        btn: (value: any) => ({
          borderRadius: value
        })
      },
      { values: theme('borderRadius') }
    );
  },
  theme: {
    colors: {
      neutral: { 500: 'red', 100: 'orange' }
    }
  }
};
