#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync, cpSync, mkdirSync } from 'fs';

const computeDir = 'build/compute/default';
const pkgPath = `${computeDir}/package.json`;

if (!existsSync(pkgPath)) process.exit(0);

// Copy node_modules that the SSR server needs at runtime
const modules = ['postgres', 'drizzle-orm', '@libsql', '@neon-rs'];
const nmSource = 'node_modules';
const nmDest = `${computeDir}/node_modules`;

for (const mod of modules) {
	const src = `${nmSource}/${mod}`;
	const dest = `${nmDest}/${mod}`;
	if (existsSync(src)) {
		mkdirSync(dest.split('/').slice(0, -1).join('/'), { recursive: true });
		cpSync(src, dest, { recursive: true });
		console.log(`Copied ${mod}`);
	}
}

// Update package.json with dependency info
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
pkg.dependencies = pkg.dependencies || {};
for (const mod of modules) {
	pkg.dependencies[mod] = '*';
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('Amplify SSR package prepared');
