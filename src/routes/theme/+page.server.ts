import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const theme = data.get('theme')?.toString();
		const allowed = ['funk', 'christmas', 'dark'];
		if (theme && allowed.includes(theme)) {
			cookies.set('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 });
		}
		throw redirect(303, request.headers.get('referer') || '/');
	}
};
