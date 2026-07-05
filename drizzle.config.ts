import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL || 'file:local.db';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: isPostgres ? 'postgresql' : 'sqlite',
	dbCredentials: { url: dbUrl },
	verbose: true,
	strict: true
});
