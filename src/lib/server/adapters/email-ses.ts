import nodemailer from 'nodemailer';
import type { EmailAdapter } from './types';

// Injected at build time by amplify.yml (same pattern as DATABASE_URL)
const INJECTED_USER = 'REPLACE_WITH_SES_USER';
const INJECTED_PASS = 'REPLACE_WITH_SES_PASS';
const INJECTED_FROM = 'REPLACE_WITH_SES_FROM_ADDRESS';

const HOST = process.env.SES_SMTP_HOST || 'email-smtp.us-west-2.amazonaws.com';
const PORT = parseInt(process.env.SES_SMTP_PORT || '587');
const USER = INJECTED_USER.startsWith('REPLACE_') ? '' : INJECTED_USER;
const PASS = INJECTED_PASS.startsWith('REPLACE_') ? '' : INJECTED_PASS;
const FROM = INJECTED_FROM.startsWith('REPLACE_') ? 't_johnson367@outlook.com' : INJECTED_FROM;
const SITE_NAME = 'Flying Funk';

const transporter = nodemailer.createTransport({
	host: HOST,
	port: PORT,
	secure: false,
	auth: USER ? { user: USER, pass: PASS } : undefined
});

export class SESEmailAdapter implements EmailAdapter {
	async sendVerificationCode(email: string, code: string) {
		await transporter.sendMail({
			from: FROM,
			to: email,
			subject: `Your ${SITE_NAME} verification code: ${code}`,
			text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`,
			html: `<p>Your verification code is:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>`
		});
	}

	async sendNotification(email: string, subject: string, body: string) {
		await transporter.sendMail({
			from: FROM,
			to: email,
			subject,
			text: body,
			html: body.replace(/\n/g, '<br>')
		});
	}
}
