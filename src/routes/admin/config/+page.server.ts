import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load() {
	let config = await db.select().from(schema.siteConfig).get();
	if (!config) {
		config = { id: 1, heroTitle: 'FLYING FUNK', heroSubtitle: 'A funk cover band playing the best...', heroImage: '', instagram: '', facebook: '', youtube: '', spotify: '' };
	}
	return { config };
}

export const actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const heroTitle = data.get('heroTitle')?.toString() || 'FLYING FUNK';
		const heroSubtitle = data.get('heroSubtitle')?.toString() || '';
		const heroImage = data.get('heroImage')?.toString() || '';

		const instagram = data.get('instagram')?.toString() || '';
		const facebook = data.get('facebook')?.toString() || '';
		const youtube = data.get('youtube')?.toString() || '';
		const spotify = data.get('spotify')?.toString() || '';

		const existing = await db.select().from(schema.siteConfig).get();
		if (existing) {
			await db.update(schema.siteConfig).set({ heroTitle, heroSubtitle, heroImage, instagram, facebook, youtube, spotify }).where(eq(schema.siteConfig.id, 1));
		} else {
			await db.insert(schema.siteConfig).values({ id: 1, heroTitle, heroSubtitle, heroImage });
		}
		return { success: true };
	}
};
