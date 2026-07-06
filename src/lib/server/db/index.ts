import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Production: DATABASE_URL is injected at build time via amplify.yml
// Local dev:   set DATABASE_URL=postgresql://... in your .env or shell
const INJECTED_URL = 'REPLACE_WITH_DB_URL';
const dbUrl = INJECTED_URL.startsWith('postgresql://')
	? INJECTED_URL
	: process.env.DATABASE_URL || '';

if (!dbUrl && typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
	// Deliberately empty — defer error to first query at runtime
	// During SvelteKit build analysis, DATABASE_URL may not be set and we shouldn't throw
}

const pgClient = dbUrl
	? postgres(dbUrl, { ssl: { rejectUnauthorized: false }, max: 5, connect_timeout: 10 })
	: ({}) as ReturnType<typeof postgres>;

const _db = dbUrl
	? drizzle(pgClient, { schema })
	: ({} as PostgresJsDatabase<typeof schema>);

function patchBuilder(instance: PostgresJsDatabase<typeof schema>) {
	if (!dbUrl) return;
	const builder: object = instance.select().from(schema.members);
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

patchBuilder(_db);

export const db = _db;
