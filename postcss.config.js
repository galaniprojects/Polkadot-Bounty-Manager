export default {
	plugins: {
		tailwindcss: {},
		'@csstools/postcss-global-data': { files: ['./src/components/Breakpoints.css'] },
		'postcss-preset-env': {
			features: {
				'custom-media-queries': true
			}
		}
	}
};
