import type { EmailAdapter } from './types';

// Placeholder for AWS SES implementation
// Will use @aws-sdk/client-ses
export class SESEmailAdapter implements EmailAdapter {
	private fromAddress: string;

	constructor(fromAddress: string) {
		this.fromAddress = fromAddress;
	}

	async sendVerificationCode(_email: string, _code: string) {
		// TODO: Send via SES
		throw new Error('SES adapter not yet implemented — set up AWS credentials first');
	}

	async sendNotification(_email: string, _subject: string, _body: string) {
		// TODO: Send via SES
		throw new Error('SES adapter not yet implemented');
	}
}
