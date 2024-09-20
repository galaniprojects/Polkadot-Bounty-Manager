import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			accent: '#E6007A',
			backgroundContent: '#E5E3EE',
			backgroundContentWrapper: '#BFACBF',
			borderColor: '#695592',
			black: colors.black,
			childBountyHeaderOrange: '#DD700D',
			childBountyHeaderGray: '#65708B',
			childBountyHeaderGreen: '#087C2B',
			childBountyBackground: '#C4C0D5',
			curatorMainBackground: '#836FAC',
			curatorCarousel: '#7A66A0',
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
