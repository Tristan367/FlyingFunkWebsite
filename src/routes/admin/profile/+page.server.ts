import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	const member = await db
		.select()
		.from(schema.members)
		.where(eq(schema.members.id, locals.user!.id))
		.get();

	return { member: member! };
}

export const actions = {
	save: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const address = data.get('address')?.toString() || '';
		const instrument = data.get('instrument')?.toString() || '';
		const instruments = data.get('instruments')?.toString() || instrument;
		const bio = data.get('bio')?.toString() || '';
		const slug = data.get('slug')?.toString() || '';
		const pic = data.get('profilePic')?.toString() || '';

		await db
			.update(schema.members)
			.set({ name, address, instrument, instruments, bio, slug, profilePic: pic })
			.where(eq(schema.members.id, locals.user!.id));

		return { success: true };
	}
};
