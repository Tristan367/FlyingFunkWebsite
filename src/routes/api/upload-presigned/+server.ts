import { json } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';

const INJECTED_KEY = 'REPLACE_WITH_S3_KEY';
const INJECTED_SECRET = 'REPLACE_WITH_S3_SECRET';

const BUCKET = process.env.STORAGE_BUCKET || 'flyingfunk-uploads';
const REGION = process.env.APP_REGION || 'us-west-2';
const ACCESS_KEY = INJECTED_KEY.startsWith('REPLACE_') ? (process.env.S3_ACCESS_KEY || '') : INJECTED_KEY;
const SECRET_KEY = INJECTED_SECRET.startsWith('REPLACE_') ? (process.env.S3_SECRET_KEY || '') : INJECTED_SECRET;

const s3 = new S3Client({
	region: REGION,
	credentials: ACCESS_KEY ? { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY } : undefined
});

export async function POST({ request, cookies }) {
	try {
		const { fileName, contentType } = await request.json();

		if (!fileName || !contentType) {
			return json({ error: 'fileName and contentType required' }, { status: 400 });
		}

		const token = cookies.get('session');
		let memberId = 'anonymous';
		if (token) {
			const result = await validateSessionToken(token);
			if (result) memberId = result.member.id;
		}

		const suffix = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
		const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
		const key = `${memberId}/${suffix}-${safeName}`;

		const { url, fields } = await createPresignedPost(s3, {
			Bucket: BUCKET,
			Key: key,
			Fields: { 'Content-Type': contentType },
			Expires: 120
		});

		return json({
			url,
			fields,
			key,
			publicUrl: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
		});
	} catch (e) {
		console.error('[upload-presigned] Error:', e);
		return json({ error: 'Failed to generate upload URL' }, { status: 500 });
	}
}
