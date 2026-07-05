import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// For PostgreSQL in production, replace the above 2 lines with:
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';

// For PostgreSQL: const client = postgres(dbUrl);
const client = createClient({ url: dbUrl });

export const db = drizzle(client, { schema });
