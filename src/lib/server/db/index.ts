import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

let db: any;

if (isPostgres) {
	const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js');
	const postgres = (await import('postgres')).default;
	const client = postgres(dbUrl); // postgres.js auto-enables SSL for RDS endpoints
	db = pgDrizzle(client, { schema });
} else {
	const { drizzle: libDrizzle } = await import('drizzle-orm/libsql');
	const { createClient } = await import('@libsql/client');
	const client = createClient({ url: dbUrl });
	db = libDrizzle(client, { schema });
}

export { db };
