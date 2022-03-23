import { TailwindHelpers } from './types';

export default {
  components({ theme }: TailwindHelpers) {
    return {
      '.btn': {
        backgroundColor: 'blue',
        color: theme('colors.neutral.500'),
        '&-lg': {
          '--x-size-height': theme('spacing.64')
        },
        height: '40px'
      },
      '.btn-carrefour': {
        backgroundColor: 'red'
      }
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
