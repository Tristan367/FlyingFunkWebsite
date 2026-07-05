import type { EmailAdapter } from './types';

export class ConsoleEmailAdapter implements EmailAdapter {
	async sendVerificationCode(email: string, code: string) {
		console.log(`\n📧 VERIFICATION CODE for ${email}: ${code}\n`);
	}

	async sendNotification(email: string, subject: string, body: string) {
		console.log(`\n📧 NOTIFICATION to ${email}\nSubject: ${subject}\n${body}\n`);
	}
}
