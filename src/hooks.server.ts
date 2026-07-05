import { validateSessionToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (token) {
		const result = await validateSessionToken(token);
		if (result) {
			event.locals.user = result.member;
			event.locals.session = result.session;
		} else {
			event.cookies.delete('session', { path: '/' });
		}
	}

	return resolve(event);
};
