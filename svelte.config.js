import adapter from 'amplify-adapter';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			nodeVersion: 'nodejs22.x',
			// Keep real `dependencies` in build/compute/default/package.json so that
			// `npm i --omit=dev` in amplify.yml installs postgres/drizzle-orm/@node-rs/argon2
			// (native module) correctly in the Amplify compute environment.
			keepPackageDependencies: true,
			// Do NOT copy the whole node_modules; we install in-compute instead.
			copyDevNodeModules: false,
			// Don't copy root .npmrc (engine-strict=true) into compute — it can abort
			// the in-compute install if the runtime Node differs from local engines.
			copyNpmrc: false
		})
	}
};

export default config;
