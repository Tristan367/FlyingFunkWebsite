import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

let _db: any = null;

async function createConnection() {
	if (isPostgres) {
		const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js');
		const postgres = (await import('postgres')).default;
		const client = postgres(dbUrl, { ssl: 'require' });
		return pgDrizzle(client, { schema });
	} else {
		const { drizzle: libDrizzle } = await import('drizzle-orm/libsql');
		const { createClient } = await import('@libsql/client');
		const client = createClient({ url: dbUrl });
		return libDrizzle(client, { schema });
	}
}

function getDb(): any {
	if (!_db) {
		_db = createConnection();
	}
	return _db;
}

// Lazy proxy that connects on first query
export const db = new Proxy({} as any, {
	get(_target, prop) {
		if (prop === 'then') return undefined;
		return (...args: any[]) => {
			const p = getDb();
			if (p instanceof Promise) {
				return p.then((d: any) => {
					const method = d[prop];
					return typeof method === 'function' ? method(...args) : method;
				});
			}
			const method = p[prop];
			return typeof method === 'function' ? method(...args) : method;
		};
	}
});
