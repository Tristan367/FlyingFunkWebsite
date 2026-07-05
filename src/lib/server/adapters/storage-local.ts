import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import type { StorageAdapter } from './types';

const BASE_DIR = 'static/uploads';

export class LocalStorageAdapter implements StorageAdapter {
	async saveFile(file: File, memberId: string) {
		const memberDir = join(BASE_DIR, memberId);
		if (!existsSync(memberDir)) mkdirSync(memberDir, { recursive: true });

		const suffix = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
		const diskName = suffix + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const filepath = join(memberDir, diskName);

		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filepath, buffer);

		return {
			url: `/uploads/${memberId}/${diskName}`,
			filename: file.name
		};
	}

	async deleteFile(_path: string) {
		// File cleanup is handled by DB cascade — files remain on disk for simplicity in mock
	}
}
