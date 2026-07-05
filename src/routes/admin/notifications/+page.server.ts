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
		const notifyGigs = data.get('notifyGigs') === 'on';
		const notifyBlog = data.get('notifyBlog') === 'on';

		await db
			.update(schema.members)
			.set({ emailNotifyGigs: notifyGigs, emailNotifyBlog: notifyBlog })
			.where(eq(schema.members.id, locals.user!.id));

		return { success: true };
	}
};
