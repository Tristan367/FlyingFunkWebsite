import { json } from '@sveltejs/kit';

export function GET() {
	return json({ status: 'ok', env: process.env.DATABASE_URL ? 'has-db-url' : 'no-db-url' });
}
