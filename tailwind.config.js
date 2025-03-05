import * as colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			// ToDo: substitute and remove colors under here which are no longer necessary
			primary: '#28123E',
			accent: '#E6007A',
			black: colors.black,
			childBountyOrange: '#DD700D',
			extendButtonBackground: '#660000',
			gray: colors.gray,
			red: '#E6003D',
			transparent: colors.transparent,
			white: colors.white,

			// colors in the new design
			cloudGray: '#C4C4C4',
			lightGray: '#E4E4E4',
			backgroundApp: '#FCFCFC',
			backgroundBounty: '#DDD',
			backgroundChildBountyDetails: '#E7E7E7',
			backgroundChildBountyExpand: '#EEE',
			backgroundChildBountyCloseDown: '#CCC',
			backgroundButtonDark: '#606060',
			backgroundButtonLight: '#B2B2B2',
			borderDropdown: '#9A9A9A',
			backgroundCloseChildBountyButton: '#B23434',
			statusActive: '#009C5D',
			statusApprovedRejected: '#00746A',
			statusProposedFunded: '#B4A900',
			statusPendingPayout: '#836FAC',
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
