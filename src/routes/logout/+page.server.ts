import { invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals, cookies }) => {
		if (locals.session) {
			await invalidateSession(locals.session.id);
		}
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}
};
