import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			primary: '#28123E',
			secondary: '#431B5E',
			accent: '#E6007A',
			backgroundContent: '#E5E3EE',
			backgroundContentWrapper: '#BFACBF',
			borderColor: '#695592',
			black: colors.black,
			childBountyOrange: '#DD700D',
			childBountyGray: '#65708B',
			childBountyGreen: '#087C2B',
			childBountyBackground: '#D7D5E2',
			childBountyHeaderBackground: '#F4F4F4',
			curatorMainBackground: '#836FAC',
			curatorCarousel: '#6B598C',
			darkgray: '#94889F',
			extendButtonBackground: '#660000',
			gray: colors.gray,
			notifications: '#FFAA35',
			transparent: colors.transparent,
			white: colors.white
		},
		extend: {
			screens: {
				// Extended and overridden values to match the specific design requirements for screen sizes.
				// These adjustments were made based on the design specs to ensure consistent layout across
				// different viewports as per the latest design mockups.
				xs: '320px',
				s: '375px',
				lg: '1080px',
				'2xl': '1440px',
				'3xl': '1920px'
			}
		}
	},
	plugins: []
};
