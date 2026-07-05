import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

let db: any;

if (isPostgres) {
	const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js');
	const postgres = (await import('postgres')).default;
	const client = postgres(dbUrl, { ssl: 'require' });
	db = pgDrizzle(client, { schema });
	patchBuilder(db);
} else {
	const { drizzle: libDrizzle } = await import('drizzle-orm/libsql');
	const { createClient } = await import('@libsql/client');
	const client = createClient({ url: dbUrl });
	db = libDrizzle(client, { schema });
}

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
function patchBuilder(instance: any) {
	// Reach the builder prototype chain via a throwaway builder instance.
	const builder: any = instance.select().from(schema.members as any);
	let proto = Object.getPrototypeOf(builder);
	while (proto && proto !== Object.prototype) {
		if (!('all' in proto)) {
			Object.defineProperty(proto, 'all', {
				value: function () {
					return Promise.resolve(this).then((rows: any[]) => rows);
				},
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
		if (!('get' in proto)) {
			Object.defineProperty(proto, 'get', {
				value: function () {
					return Promise.resolve(this).then((rows: any[]) => rows[0] ?? null);
				},
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
		proto = Object.getPrototypeOf(proto);
	}
}

export { db };
