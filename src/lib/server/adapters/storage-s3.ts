import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { StorageAdapter } from './types';

const BUCKET = process.env.STORAGE_BUCKET || 'flyingfunk-uploads';
const REGION = process.env.APP_REGION || 'us-west-2';

const s3 = new S3Client({ region: REGION });

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

	async deleteFile(path: string) {
		// Not needed yet — images table handles tracking
	}
}
