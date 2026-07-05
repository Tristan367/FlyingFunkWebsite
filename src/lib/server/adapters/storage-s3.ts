import type { StorageAdapter } from './types';

// Placeholder for AWS S3 implementation
// Will use @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
export class S3StorageAdapter implements StorageAdapter {
	private bucket: string;

	constructor(bucket: string) {
		this.bucket = bucket;
	}

	async saveFile(_file: File, _memberId: string): Promise<{ url: string; filename: string }> {
		// TODO: Upload to S3 with key = `uploads/${memberId}/${timestamp}-${filename}`
		// Return CloudFront URL
		throw new Error('S3 adapter not yet implemented — set up AWS credentials first');
	}

	async deleteFile(_path: string) {
		// TODO: Delete from S3
		throw new Error('S3 adapter not yet implemented');
	}
}
