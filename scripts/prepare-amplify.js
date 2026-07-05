#!/usr/bin/env node
import { writeFileSync, cpSync, mkdirSync, existsSync, rmSync } from 'fs';

const BUILD = 'build';
const OUT = 'deploy';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/compute/default`, { recursive: true });
mkdirSync(`${OUT}/static`, { recursive: true });

// Copy server
cpSync(`${BUILD}/index.js`, `${OUT}/compute/default/index.js`);
for (const f of ['handler.js', 'env.js', 'shims.js']) {
	if (existsSync(`${BUILD}/${f}`)) cpSync(`${BUILD}/${f}`, `${OUT}/compute/default/${f}`);
	if (existsSync(`${BUILD}/${f}.map`)) cpSync(`${BUILD}/${f}.map`, `${OUT}/compute/default/${f}.map`);
}
if (existsSync(`${BUILD}/server`)) cpSync(`${BUILD}/server`, `${OUT}/compute/default/server`, { recursive: true });
if (existsSync(`${BUILD}/client`)) cpSync(`${BUILD}/client`, `${OUT}/static`, { recursive: true });

writeFileSync(`${OUT}/deploy-manifest.json`, JSON.stringify({
	version: 1,
	framework: { name: 'sveltekit' },
	routes: [
		{ path: '/_app/*', target: { kind: 'Static' } },
		{ path: '/uploads/*', target: { kind: 'Static' } },
		{ path: '/favicon.ico', target: { kind: 'Static' } },
		{ path: '/robots.txt', target: { kind: 'Static' } },
		{ path: '/*', target: { kind: 'Compute', src: 'default' } }
	],
	computeResources: [{ name: 'default', runtime: 'nodejs20.x', entrypoint: 'index.js' }]
}, null, 2));

console.log('Deploy structure created in deploy/');
