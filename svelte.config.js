import adapterStatic from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		adapter: adapter(),
		// adapter: adapter({
		// 	// default options are shown
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null,
		// 	precompress: false
		// }),
		prerender: {
			default: true
		},
		paths: {
			// base: "/build"
		},

	}
};