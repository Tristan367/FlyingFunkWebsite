import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

let _db: any = null;

async function getDb() {
	if (!_db) {
		if (isPostgres) {
			const client = postgres(dbUrl, { ssl: 'require' });
			const pgDb = drizzle(client, { schema });
			// Wrap to add SQLite-compatible .get() and .all()
			_db = new Proxy(pgDb, {
				get(target, prop) {
					const orig = target[prop];
					if (typeof orig === 'function') {
						return (...args: any[]) => {
							const result = orig.apply(target, args);
							if (result && typeof result.then === 'function') {
								return result.then((rows: any) => {
									rows.get = () => rows[0] ?? null;
									rows.all = () => rows;
									return rows;
								});
							}
							return result;
						};
					}
					return orig;
				}
			});
		} else {
			// Local dev: dynamically import SQLite (won't be scanned by SvelteKit analyse)
			const { drizzle: lDrizzle } = await Function('return import("drizzle-orm/libsql")')() as any;
			const { createClient } = await Function('return import("@libsql/client")')() as any;
			const client = createClient({ url: dbUrl });
			_db = lDrizzle.drizzle(client, { schema });
		}
	}
	return _db;
}

export const db = new Proxy({} as any, {
	get(_t, prop) {
		if (prop === 'then') return undefined;
		return (...args: any[]) =>
			getDb().then((d: any) => {
				const m = d[prop];
				return typeof m === 'function' ? m(...args) : m;
			});
	}
});
