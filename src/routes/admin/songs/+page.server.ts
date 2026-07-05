import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function load({ locals }) {
	const songs = await db
		.select({
			id: schema.songs.id,
			title: schema.songs.title,
			description: schema.songs.description,
			pinned: schema.songs.pinned,
			plays: schema.songs.plays,
			path: schema.songs.path,
			uploadedAt: schema.songs.uploadedAt,
			uploaderName: schema.members.name
		})
		.from(schema.songs)
		.innerJoin(schema.members, eq(schema.songs.uploaderId, schema.members.id))
		.orderBy(desc(schema.songs.uploadedAt))
		.all();

	return { songs, user: locals.user! };
}

export const actions = {
	upload: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString() || '';
		const file = data.get('file') as File | null;

		if (!title || !file) return { uploadError: 'Title and file are required.' };
		if (!file.type.startsWith('audio/')) return { uploadError: 'Please upload an audio file.' };

		const suffix = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
		const filename = suffix + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const { mkdirSync, existsSync } = await import('node:fs');
		const { writeFile } = await import('node:fs/promises');
		if (!existsSync('static/uploads')) mkdirSync('static/uploads', { recursive: true });

		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile('static/uploads/' + filename, buffer);

		await db.insert(schema.songs).values({
			uploaderId: locals.user!.id,
			title,
			description,
			filename,
			path: '/uploads/' + filename
		});

		return { uploadSuccess: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (id) await db.delete(schema.songs).where(eq(schema.songs.id, id));
		return { deleteSuccess: true };
	},
	togglePin: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return { pinSuccess: true };
		const song = await db.select().from(schema.songs).where(eq(schema.songs.id, id)).get();
		if (song) {
			await db.update(schema.songs).set({ pinned: !song.pinned }).where(eq(schema.songs.id, id));
		}
		return { pinSuccess: true };
	},
	edit: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString() || '';
		if (!id || !title) return { editError: 'Title is required.' };
		await db.update(schema.songs).set({ title, description }).where(eq(schema.songs.id, id));
		return { editSuccess: true };
	}
};
