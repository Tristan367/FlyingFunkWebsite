import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

let db: any;

if (isPostgres) {
	const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js');
	const postgres = (await import('postgres')).default;
	const client = postgres(dbUrl, { ssl: 'require' });
	db = pgDrizzle(client, { schema });
} else {
	const { drizzle: libDrizzle } = await import('drizzle-orm/libsql');
	const { createClient } = await import('@libsql/client');
	const client = createClient({ url: dbUrl });
	db = libDrizzle(client, { schema });
}

// Add SQLite-compatible .get() and .all() to query results
const origQuery = db.query;
if (origQuery) {
	for (const key of Object.keys(origQuery)) {
		const fn = origQuery[key];
		if (typeof fn === 'function') {
			origQuery[key] = (...args: any[]) => {
				const result = fn.apply(origQuery, args);
				if (result && typeof result.then === 'function') {
					(result as any).get = async function () { const rows = await result; return rows[0] ?? null; };
					(result as any).all = async function () { return await result; };
				}
				return result;
			};
		}
	}
}

export { db };
