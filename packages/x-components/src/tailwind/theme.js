const Color = require('color');

module.exports = {
  colors: {
    neutral: {
      50: '#F5F5F5',
      100: '#E0E0E0',
      200: '#CBCBCB',
      400: '#ACACAC',
      500: '#5E5E5E',
      600: '#131313'
    },
    lead: {
      50: '#E5F3F7',
      100: '#46768B',
      200: '#36515B',
      400: '#243D48',
      DEFAULT: '#36515B'
    },
    auxiliary: {
      50: '#D6F5FF',
      100: '#06C1FF',
      200: '#0086B2',
      400: '#006485',
      DEFAULT: '#006485',
      BACKGROUND: '#D6F5FF',
      FOREGROUND: '#000000'
    },
    accent: {
      50: '#FCEEEB',
      100: '#EC9B89',
      200: '#E67962',
      400: '#D44122',
      BACKGROUND: '#E67962',
      FOREGROUND: '#243D48'
    },
    accent2: {
      50: '#FCEEEB',
      100: '#EC9B89',
      200: '#E67962',
      400: '#D44122',
      BACKGROUND: '#E67962',
      FOREGROUND: '#243D48'
    },
    highlight: {
      50: '#FDF7E7',
      100: '#F5DEA3',
      200: '#F2CF6C',
      400: '#CB9C13'
    },
    white: '#FFFFFF',
    black: '#000000',
    success: {
      50: '#E5F3F7',
      100: '#46768B',
      200: '#36515B',
      400: '#243D48'
    },
    warning: {
      50: '#E5F3F7',
      100: '#46768B',
      200: '#36515B',
      400: '#243D48'
    },
    error: {
      50: '#E5F3F7',
      100: '#46768B',
      200: '#36515B',
      400: '#243D48'
    }
  },
  spacing: {
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    56: '56px',
    64: '64px',
    72: '72px',
    80: '80px',
    88: '88px',
    96: '96px',
    104: '104px',
    112: '112px',
    144: '144px',
    176: '176px',
    208: '208px'
  },
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '16px',
    lg: '24px',
    pill: '99999px'
  },
  button: ({ theme }) => ({
    borderRadius: theme('borderRadius.sm')
  }),
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '28px',
    '3xl': '33px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '57px',
    '7xl': '69px',
    '8xl': '82px'
  },
  screens: {
    tablet: '800px',
    desktop: '1200px',
    large: '2800px'
  },
  extend: {}
};
