import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const posts = await db
		.select({
			id: schema.blogPosts.id,
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			publishedAt: schema.blogPosts.publishedAt,
			createdAt: schema.blogPosts.createdAt,
			archived: schema.blogPosts.archived,
			authorName: schema.members.name
		})
		.from(schema.blogPosts)
		.innerJoin(schema.members, eq(schema.blogPosts.authorId, schema.members.id))
		.where(eq(schema.blogPosts.archived, false))
		.orderBy(desc(schema.blogPosts.createdAt))
		.all();

	const archivedPosts = await db
		.select({
			id: schema.blogPosts.id,
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			publishedAt: schema.blogPosts.publishedAt,
			authorName: schema.members.name
		})
		.from(schema.blogPosts)
		.innerJoin(schema.members, eq(schema.blogPosts.authorId, schema.members.id))
		.where(eq(schema.blogPosts.archived, true))
		.orderBy(desc(schema.blogPosts.createdAt))
		.all();

	return { posts, archivedPosts, user: locals.user! };
}

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const content = data.get('content')?.toString() || '';
		const published = data.get('published') === 'on';
		const slug =
			data.get('slug')?.toString() ||
			title
				?.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '') ||
			'';

		if (!title || !slug) return { createError: 'Title is required.' };

		const result = await db.insert(schema.blogPosts).values({
			authorId: locals.user!.id,
			title,
			slug,
			content,
			publishedAt: published ? new Date().toISOString().split('T')[0] : ''
		}).returning({ id: schema.blogPosts.id });

		const newId = result[0]?.id;
		if (newId) throw redirect(303, '/admin/blog/' + newId);
		return { createSuccess: true };
	},
	archive: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (id) {
			await db
				.update(schema.blogPosts)
				.set({ archived: true })
				.where(eq(schema.blogPosts.id, id));
		}
		return { archiveSuccess: true };
	},
	unarchive: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (id) {
			await db
				.update(schema.blogPosts)
				.set({ archived: false })
				.where(eq(schema.blogPosts.id, id));
		}
		return { archiveSuccess: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (id) {
			await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
			await db.delete(schema.images).where(eq(schema.images.scope, 'blog-' + id));
		}
		return { deleteSuccess: true };
	}
};
