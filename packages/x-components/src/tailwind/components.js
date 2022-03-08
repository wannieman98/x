module.exports = function ({ theme }) {
  return {
    '.btn': {
      '--x-size-height': theme('spacing.32'),
      display: 'flex',
      alignItems: 'baseline',
      alignContent: 'center',
      justifyContent: 'center',
      flexFlow: 'row wrap',
      backgroundColor: theme('colors.neutral.500'),
      color: theme('colors.neutral.100'),
      height: 'var(--x-size-height)',
      gap: theme('spacing.4'),
      paddingInlineStart: theme('spacing.16'),
      paddingInlineEnd: theme('spacing.16'),
      borderRadius: theme('button.borderRadius'),
      fontSize: theme('fontSize.base'),
      '&-lg': {
        '--x-size-height': theme('spacing.48'),
        fontSize: theme('fontSize.lg')
      },
      '&-md': {
        '--x-size-height': theme('spacing.32'),
        fontSize: theme('fontSize.lg')
      },
      '&-sm': {
        '--x-size-height': theme('spacing.24'),
        fontSize: theme('fontSize.sm')
      },
      '&-square': {
        width: 'var(--x-size-height)',
        paddingInlineStart: 0,
        paddingInlineEnd: 0
      },
      '& > .icon': {
        alignSelf: 'center',
        color: 'white'
      }
    },
    '.icon': {
      width: theme('spacing.16'),
      height: theme('spacing.16'),
      color: 'currentColor'
    }
  };
};
