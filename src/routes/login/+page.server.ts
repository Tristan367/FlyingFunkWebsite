import {
	getMemberByEmailOrPhone,
	createVerificationCode,
	verifyCode,
	generateSessionToken,
	createSession
} from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getEmail } from '$lib/server/adapters';

export const actions = {
	sendCode: async ({ request }) => {
		const data = await request.formData();
		const identifier = data.get('email')?.toString().trim().toLowerCase();

		if (!identifier) return { step: 'email', error: 'Email is required.' };

		const member = await getMemberByEmailOrPhone(identifier);
		if (!member) {
			return { step: 'email', error: 'No band member found with that email.' };
		}

		const code = await createVerificationCode(identifier);

		// Send via email adapter (logs to console in dev, sends via SES in prod)
		try {
			await getEmail().sendVerificationCode(member.email, code);
		} catch (e) {
			console.error('Failed to send verification code:', e);
			return { step: 'email', email: identifier, error: 'Failed to send verification email. Please try again or contact support.' };
		}

		return {
			step: 'verify',
			email: identifier,
			code: dev ? code : undefined
		};
	},

	verifyCode: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const code = data.get('code')?.toString().trim();

		if (!email || !code) {
			return { step: 'verify', email, error: 'Verification code is required.' };
		}

		const valid = await verifyCode(email, code);
		if (!valid) {
			return { step: 'verify', email, error: 'Invalid or expired verification code.' };
		}

		const member = await getMemberByEmailOrPhone(email);
		if (!member) return { step: 'verify', email, error: 'Member not found.' };

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
