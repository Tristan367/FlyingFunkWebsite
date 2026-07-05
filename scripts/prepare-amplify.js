#!/usr/bin/env node
// Post-build script: restructure adapter-node output for Amplify SSR
import { writeFileSync, cpSync, mkdirSync, existsSync, rmSync } from 'fs';

const BUILD_DIR = 'build';
const AMPLIFY_DIR = '.amplify-hosting';

// Clean and create Amplify output
if (existsSync(AMPLIFY_DIR)) rmSync(AMPLIFY_DIR, { recursive: true });
mkdirSync(`${AMPLIFY_DIR}/compute/default`, { recursive: true });
mkdirSync(`${AMPLIFY_DIR}/static`, { recursive: true });

// Copy server code to compute
cpSync(`${BUILD_DIR}/index.js`, `${AMPLIFY_DIR}/compute/default/index.js`);
cpSync(`${BUILD_DIR}/handler.js`, `${AMPLIFY_DIR}/compute/default/handler.js`);
cpSync(`${BUILD_DIR}/env.js`, `${AMPLIFY_DIR}/compute/default/env.js`);
cpSync(`${BUILD_DIR}/shims.js`, `${AMPLIFY_DIR}/compute/default/shims.js`);
if (existsSync(`${BUILD_DIR}/server`)) {
	cpSync(`${BUILD_DIR}/server`, `${AMPLIFY_DIR}/compute/default/server`, { recursive: true });
}
if (existsSync(`${BUILD_DIR}/index.js.map`)) {
	cpSync(`${BUILD_DIR}/index.js.map`, `${AMPLIFY_DIR}/compute/default/index.js.map`);
}
if (existsSync(`${BUILD_DIR}/handler.js.map`)) {
	cpSync(`${BUILD_DIR}/handler.js.map`, `${AMPLIFY_DIR}/compute/default/handler.js.map`);
}
if (existsSync(`${BUILD_DIR}/env.js.map`)) {
	cpSync(`${BUILD_DIR}/env.js.map`, `${AMPLIFY_DIR}/compute/default/env.js.map`);
}
if (existsSync(`${BUILD_DIR}/shims.js.map`)) {
	cpSync(`${BUILD_DIR}/shims.js.map`, `${AMPLIFY_DIR}/compute/default/shims.js.map`);
}

// Copy client static files
if (existsSync(`${BUILD_DIR}/client`)) {
	cpSync(`${BUILD_DIR}/client`, `${AMPLIFY_DIR}/static`, { recursive: true });
}

// Create deploy manifest
const manifest = {
	version: 1,
	routes: [
		{
			path: '/_app/*',
			target: { kind: 'Static' }
		},
		{
			path: '/favicon.ico',
			target: { kind: 'Static' }
		},
		{
			path: '/uploads/*',
			target: { kind: 'Static' }
		},
		{
			path: '/*',
			target: { kind: 'Compute', src: 'default' }
		}
	],
	computeResources: [
		{
			name: 'default',
			runtime: 'nodejs22.x',
			entrypoint: 'index.js'
		}
	]
};

writeFileSync(`${AMPLIFY_DIR}/deploy-manifest.json`, JSON.stringify(manifest, null, 2));
console.log('✓ Amplify deployment structure created in .amplify-hosting/');
