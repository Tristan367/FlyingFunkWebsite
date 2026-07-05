import type { StorageAdapter, EmailAdapter } from './types';
import { LocalStorageAdapter } from './storage-local';
import { ConsoleEmailAdapter } from './email-console';

// In production, swap these to S3StorageAdapter and SESEmailAdapter
let _storage: StorageAdapter | null = null;
let _email: EmailAdapter | null = null;

export function getStorage(): StorageAdapter {
	if (!_storage) _storage = new LocalStorageAdapter();
	return _storage;
}

export function getEmail(): EmailAdapter {
	if (!_email) _email = new ConsoleEmailAdapter();
	return _email;
}
