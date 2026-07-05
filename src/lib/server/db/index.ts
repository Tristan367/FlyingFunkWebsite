import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// For PostgreSQL in production, swap to:
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// const client = postgres(process.env.DATABASE_URL!);
// export const db = drizzle(client, { schema });

const dbUrl = process.env.DATABASE_URL || 'file:local.db';

const client = createClient({ url: dbUrl });

export const db = drizzle(client, { schema });
