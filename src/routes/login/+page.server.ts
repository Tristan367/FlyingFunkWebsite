import {
	getMemberByEmailOrPhone,
	verifyPassword,
	generateSessionToken,
	createSession
} from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString() || '';

		if (!email || !password) {
			return { error: 'Email and password are required.', email };
		}

		const member = await getMemberByEmailOrPhone(email);
		if (!member) {
			return { error: 'No band member found with that email.', email };
		}

		const valid = await verifyPassword(member, password);
		if (!valid) {
			return { error: 'Invalid password.', email };
		}

		const token = generateSessionToken();
		await createSession(token, member.id);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, '/admin');
	}
};
