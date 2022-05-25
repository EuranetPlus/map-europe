import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
		paths: {
			// base: "/build"
		},

	}
};