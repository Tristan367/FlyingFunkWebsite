// Storage adapter interface — swap implementations for local vs S3
export interface StorageAdapter {
	saveFile(file: File, memberId: string): Promise<{ url: string; filename: string }>;
	deleteFile(path: string): Promise<void>;
}

// Email adapter interface — swap implementations for console vs SES
export interface EmailAdapter {
	sendVerificationCode(email: string, code: string): Promise<void>;
	sendNotification(email: string, subject: string, body: string): Promise<void>;
}
