import { drizzle } from 'drizzle-orm/postgres-js';
import postgresFn from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Production: DATABASE_URL is injected at build time via amplify.yml
// Local dev:   reads DATABASE_URL from .env file or process.env
const INJECTED_URL = 'REPLACE_WITH_DB_URL';

function loadEnv(): string {
	if (INJECTED_URL.startsWith('postgresql://')) return INJECTED_URL;
	if (typeof process !== 'undefined' && process.env?.DATABASE_URL) return process.env.DATABASE_URL;
	try {
		const envPath = resolve(process.cwd(), '.env');
		const raw = readFileSync(envPath, 'utf-8');
		const match = raw.match(/^DATABASE_URL=(.+)$/m);
		if (match) return match[1].trim();
	} catch { /* no .env file */ }
	return '';
}

const dbUrl = loadEnv();

const pgClient = dbUrl
	? postgresFn(dbUrl, { ssl: { rejectUnauthorized: false }, max: 5, connect_timeout: 10 })
	: ({} as ReturnType<typeof postgresFn>);

const _db: PostgresJsDatabase<typeof schema> = dbUrl
	? drizzle(pgClient, { schema })
	: ({} as PostgresJsDatabase<typeof schema>);

if (dbUrl) {
	const builder: object = _db.select().from(schema.members);
	let proto = Object.getPrototypeOf(builder);
	while (proto && proto !== Object.prototype) {
		if (!('all' in proto)) {
			Object.defineProperty(proto, 'all', {
				value: function () {
					return Promise.resolve(this).then((rows: unknown[]) => rows);
				},
				writable: true, configurable: true, enumerable: false
			});
		}
		if (!('get' in proto)) {
			Object.defineProperty(proto, 'get', {
				value: function () {
					return Promise.resolve(this).then((rows: unknown[]) => rows[0] ?? null);
				},
				writable: true, configurable: true, enumerable: false
			});
		}
		proto = Object.getPrototypeOf(proto);
	}
}

export const db = _db;
