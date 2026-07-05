import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

//#region src/lib/server/adapters/storage-local.ts
var BASE_DIR = "static/uploads";
var LocalStorageAdapter = class {
	async saveFile(file, memberId) {
		const memberDir = join(BASE_DIR, memberId);
		if (!existsSync(memberDir)) mkdirSync(memberDir, { recursive: true });
		const diskName = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
		await writeFile(join(memberDir, diskName), Buffer.from(await file.arrayBuffer()));
		return {
			url: `/uploads/${memberId}/${diskName}`,
			filename: file.name
		};
	}
	async deleteFile(_path) {}
};
//#endregion
//#region src/lib/server/adapters/email-console.ts
var ConsoleEmailAdapter = class {
	async sendVerificationCode(email, code) {
		console.log(`\n📧 VERIFICATION CODE for ${email}: ${code}\n`);
	}
	async sendNotification(email, subject, body) {
		console.log(`\n📧 NOTIFICATION to ${email}\nSubject: ${subject}\n${body}\n`);
	}
};
//#endregion
//#region src/lib/server/adapters/index.ts
var _storage = null;
var _email = null;
function getStorage() {
	if (!_storage) _storage = new LocalStorageAdapter();
	return _storage;
}
function getEmail() {
	if (!_email) _email = new ConsoleEmailAdapter();
	return _email;
}

export { getStorage as a, getEmail as g };
//# sourceMappingURL=adapters.js-CyCRUHV3.js.map
