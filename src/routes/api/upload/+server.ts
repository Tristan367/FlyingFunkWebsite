import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { validateSessionToken } from '$lib/server/auth';
import { getStorage } from '$lib/server/adapters';

export async function POST({ request, cookies }) {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const scope = formData.get('scope')?.toString() || '';

	if (!file) return json({ error: 'No file provided' }, { status: 400 });

	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-m4a'];
	if (!allowedTypes.includes(file.type)) {
		return json({ error: 'File type not allowed' }, { status: 400 });
	}

	if (file.size > 50 * 1024 * 1024) {
		return json({ error: 'File too large (max 50MB)' }, { status: 400 });
	}

	// Get member from session
	const token = cookies.get('session');
	let memberId = 'anonymous';
	if (token) {
		const result = await validateSessionToken(token);
		if (result) memberId = result.member.id;
	}

	const storage = getStorage();
	const { url, filename } = await storage.saveFile(file, memberId);

	await db.insert(schema.images).values({
		filename,
		path: url,
		scope,
		uploaderId: memberId === 'anonymous' ? null : memberId
	});

	return json({ url, filename });
}
