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
			gray: colors.gray,
			notifications: '#FFAA35',
			transparent: colors.transparent,
			white: colors.white
		},
		extend: {
			screens: {
			  'xs': '320px',      // Phones
			  'sm': '640px',      // Tablets
			  'md': '768px',      // Landscape Tablets
			  'lg': '1080px',     // Laptops
			  'xl': '1280px',     // Desktops
			  '2xl': '1440px',    // Larger desktops
			  '3xl': '1920px',    // Full HD and large desktops
			}
		  }
	},
	plugins: []
};
