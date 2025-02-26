import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			// ToDo: remove colors under here which are no longer necessary

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
			red: '#E6003D',
			transparent: colors.transparent,
			white: colors.white,

			// colors in the new design
			charcoal: '#131313',
			cloudGray: '#C4C4C4',
			lightGray: '#E4E4E4',

			// New colors for lighter design
			backgroundApp: '#FCFCFC',
			backgroundBounty: '#DDD',
			backgroundChildBountyDetails: '#E7E7E7',
			backgroundButtonDark: '#606060',
			backgroundButtonLight: '#B2B2B2',
			borderDropdown: '#9A9A9A',
			backgroundCloseChildBounty: '#B23434',
			textPrimary: '#131313'
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
