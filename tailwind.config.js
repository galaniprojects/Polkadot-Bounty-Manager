import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			accent: '#E6007A',
			backgroundContent: '#E5E3EE',
			backgroundContentWrapper: '#BFACBF',
			borderColor: '#7F639B',
			black: colors.black,
			childBountyHeader: '#9781AF',
			childBountyStatus: '#695592',
			darkgray: '#94889F',
			gray: colors.gray,
			notifications: '#FFAA35',
			primary: '#28123E',
			secondary: '#431B5E',
			transparent: colors.transparent,
			white: colors.white
		}
	},
	plugins: []
};
