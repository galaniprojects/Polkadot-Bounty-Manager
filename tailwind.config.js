import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      accent: '#FF41A6',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      darkgray: '#8a7c9780',
      primary: '#28123E',
      secondary: 'rgba(73,33,113,0.8)',
      background: 'rgba(155,133,177,0.2)' 
    }
  },
  plugins: []
};
