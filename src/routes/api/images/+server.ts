import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET({ url }) {
	const scope = url.searchParams.get('scope') || '';

	const images = scope
		? await db.select({ id: schema.images.id, filename: schema.images.filename, path: schema.images.path })
			.from(schema.images).where(eq(schema.images.scope, scope)).orderBy(desc(schema.images.uploadedAt)).all()
		: await db.select({ id: schema.images.id, filename: schema.images.filename, path: schema.images.path })
			.from(schema.images).orderBy(desc(schema.images.uploadedAt)).all();

	return json({ images });
}

export async function DELETE({ request }) {
	const data = await request.formData();
	const id = data.get('id')?.toString();
	if (id) {
		await db.delete(schema.images).where(eq(schema.images.id, id));
	}
	return json({ ok: true });
}
