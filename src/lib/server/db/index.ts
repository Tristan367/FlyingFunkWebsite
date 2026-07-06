import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Production: DATABASE_URL is injected at build time via amplify.yml
// Local dev:   set DATABASE_URL=postgresql://... in your .env or shell
const INJECTED_URL = 'REPLACE_WITH_DB_URL';
const dbUrl = INJECTED_URL.startsWith('postgresql://')
	? INJECTED_URL
	: process.env.DATABASE_URL || '';

if (!dbUrl) {
	throw new Error('DATABASE_URL not set. Local dev: export DATABASE_URL=postgresql://user:pass@host/db');
}

const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js');
const postgres = (await import('postgres')).default;
const client = postgres(dbUrl, { ssl: { rejectUnauthorized: false }, max: 5, connect_timeout: 10 });
const _db = pgDrizzle(client, { schema });
patchBuilder(_db);

/**
 * The app was written against libsql/SQLite, whose query builder exposes
 * synchronous terminal methods `.get()` (first row) and `.all()` (all rows).
 * drizzle-orm's postgres-js builder is a thenable that resolves to an array
 * and has NO `.get()`/`.all()`. To avoid rewriting ~100 call sites, augment
 * the postgres-js query-builder prototype with compatible `.get()`/`.all()`.
 *
 * The builder MUST stay synchronous so chaining works
 * (`db.select().from(x).where(...)`); we only add terminal helpers.
 */
function patchBuilder(instance: PostgresJsDatabase<typeof schema>) {
	// Reach the builder prototype chain via a throwaway builder instance.
	const builder: object = instance.select().from(schema.members);
	let proto = Object.getPrototypeOf(builder);
	while (proto && proto !== Object.prototype) {
		if (!('all' in proto)) {
			Object.defineProperty(proto, 'all', {
				value: function () {
					return Promise.resolve(this).then((rows: unknown[]) => rows);
				},
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
		if (!('get' in proto)) {
			Object.defineProperty(proto, 'get', {
				value: function () {
					return Promise.resolve(this).then((rows: unknown[]) => rows[0] ?? null);
				},
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
		proto = Object.getPrototypeOf(proto);
	}
}

export const db = _db;
