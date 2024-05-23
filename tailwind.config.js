import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
/** @type {import('tailwindcss').Config} */

export default {
  important: true,
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xxs: '325px',
        // => @media (min-width: 325px) { ... }

        xs: '475px',
        // => @media (min-width: 475px) { ... }

        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        mdl: '991px',
        // => @media (min-width: 990px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xlg: '1200px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }

        '3xl': '1930px',
        // => @media (min-width: 1930px) { ... }

        1920: '1921px',
        // => @media (min-width: 1930px) { ... }

        'max-xxs': {max: '325px'},
        // => @media (max-width: 325px) { ... }

        'max-xs': {max: '475px'},
        // => @media (max-width: 475px) { ... }

        'max-sm': {max: '640px'},
        // => @media (max-width: 640px) { ... }

        'max-md': {max: '768px'},
        // => @media (max-width: 768px) { ... }

        'max-mdl': {max: '991px'},
        // => @media (max-width: 990px) { ... }

        'max-lg': {max: '1024px'},
        // => @media (max-width: 1024px) { ... }

        'max-xlg': {max: '1200px'},
        // => @media (max-width: 1024px) { ... }

        'max-xl': {max: '1280px'},
        // => @media (max-width: 1280px) { ... }

        'max-2xl': {max: '1536px'},
        // => @media (max-width: 1536px) { ... }

        'max-3xl': {max: '1930px'},
        // => @media (max-width: 1930px) { ... }

        'max-1920': {max: '1921px'},
        // => @media (max-width: 1921px) { ... }
      },
      fontFamily: {
        'Eurostile-Next-Regular': ['EurostileNextW01-Extended', 'sans-serif'],
        'Eurostile-Next-Semibold': [
          'EurostileNextW01-ExSemiBold',
          'sans-serif',
        ],
        'Eurostile-Next-Bold': ['EurostileNextW01-ExtBold', 'sans-serif'],
        'Univers-Regular': ['UniversLTW01-55Roman', 'sans-serif'],
        'Univers-Light': ['UniversLTW01-45Light', 'sans-serif'],
        'Univers-Light-Oblique': ['UniversLTW01-45LightOblique', 'sans-serif'],
        'Univers-Bold': ['UniversLTW01-65Bold', 'sans-serif'],
        'Univers-Extra-Black': ['UniversLTW01-85ExtraBlack', 'sans-serif'],
      },
    },
    colors: {
      headingBg: '#0C2F53',
      white: 'var(--color-light)',
      black: 'var(--color-dark)',
    },
    height: {
      '52px': '52px',
      '30px': '30px',
    },
    maxWidth: {
      '998px': '998px',
    },
    textColor: {
      white: 'var(--color-light)',
      black: 'var(--color-dark)',
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    formsPlugin,
    typographyPlugin,
    plugin(function ({matchUtilities, theme}) {
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        {values: theme('translate'), supportsNegativeValues: true},
      );
    }),
  ],
};
