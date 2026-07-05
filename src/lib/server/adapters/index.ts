import { dev } from '$app/environment';
import type { StorageAdapter, EmailAdapter } from './types';
import { LocalStorageAdapter } from './storage-local';
import { ConsoleEmailAdapter } from './email-console';
import { SESEmailAdapter } from './email-ses';

let _storage: StorageAdapter | null = null;
let _email: EmailAdapter | null = null;

export function getStorage(): StorageAdapter {
	if (!_storage) _storage = new LocalStorageAdapter();
	return _storage;
}

export function getEmail(): EmailAdapter {
	if (!_email) {
		_email = dev ? new ConsoleEmailAdapter() : new SESEmailAdapter();
	}
	return _email;
}
