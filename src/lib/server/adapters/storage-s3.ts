import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { StorageAdapter } from './types';

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

export class S3StorageAdapter implements StorageAdapter {
	async saveFile(file: File, memberId: string) {
		const suffix = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const key = `${memberId}/${suffix}-${safeName}`;
		const buffer = Buffer.from(await file.arrayBuffer());

		await s3.send(
			new PutObjectCommand({
				Bucket: BUCKET,
				Key: key,
				Body: buffer,
				ContentType: file.type
			})
		);

		const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
		return { url, filename: file.name };
	}

	async deleteFile(_path: string) {}
}
