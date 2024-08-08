import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			accent: '#FF41A6',
			backgroundContent: '#E5E3EE',
			backgroundContentWrapper: '#BFACBF',
			border: '#7F639B',
			black: colors.black,
			white: colors.white,
			gray: colors.gray,
			darkgray: '#94889F',
			primary: '#28123E',
			secondary: '#431B5E'
		}
	},
	plugins: []
};
