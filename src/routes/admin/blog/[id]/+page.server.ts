import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
	const post = await db
		.select()
		.from(schema.blogPosts)
		.where(eq(schema.blogPosts.id, params.id))
		.get();

	if (!post) throw error(404, 'Post not found');

	return { post };
}

export const actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const content = data.get('content')?.toString() || '';
		const slug = data.get('slug')?.toString();
		const published = data.get('published') === 'on';
		const publishNow = data.get('publishNow') === 'on';

		if (!title || !slug) {
			return { saveError: 'Title and slug are required.' };
		}

		const currentPost = await db
			.select()
			.from(schema.blogPosts)
			.where(eq(schema.blogPosts.id, params.id))
			.get();

		const publishedAt =
			publishNow
				? new Date().toISOString().split('T')[0]
				: published
					? currentPost?.publishedAt || new Date().toISOString().split('T')[0]
					: '';

		await db
			.update(schema.blogPosts)
			.set({
				title,
				slug,
				content,
				publishedAt,
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.blogPosts.id, params.id));

		return { saveSuccess: true };
	},
	unpublish: async ({ params }) => {
		await db
			.update(schema.blogPosts)
			.set({ publishedAt: '', updatedAt: new Date().toISOString() })
			.where(eq(schema.blogPosts.id, params.id));
		return { saveSuccess: true };
	}
};
