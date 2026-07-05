import nodemailer from 'nodemailer';
import type { EmailAdapter } from './types';

const HOST = process.env.SES_SMTP_HOST || 'email-smtp.us-west-2.amazonaws.com';
const PORT = parseInt(process.env.SES_SMTP_PORT || '587');
const USER = process.env.SES_SMTP_USER || '';
const PASS = process.env.SES_SMTP_PASS || '';
const FROM = process.env.SES_FROM_ADDRESS || 't_johnson367@outlook.com';
const SITE_NAME = 'Flying Funk';

console.log('[SES Adapter] Init — USER present:', !!USER, 'PASS present:', !!PASS, 'FROM:', FROM, 'HOST:', HOST);

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
