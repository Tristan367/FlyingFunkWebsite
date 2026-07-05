import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { EmailAdapter } from './types';

const REGION = process.env.AWS_REGION || 'us-west-2';
const FROM_ADDRESS = process.env.SES_FROM_ADDRESS || 't_johnson367@outlook.com';
const SITE_NAME = 'Flying Funk';

const ses = new SESClient({ region: REGION });

export class SESEmailAdapter implements EmailAdapter {
	async sendVerificationCode(email: string, code: string) {
		await ses.send(
			new SendEmailCommand({
				FromEmailAddress: FROM_ADDRESS,
				Destination: { ToAddresses: [email] },
				Content: {
					Simple: {
						Subject: { Data: `Your ${SITE_NAME} verification code: ${code}` },
						Body: {
							Text: { Data: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.` },
							Html: { Data: `<p>Your verification code is:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>` }
						}
					}
				}
			})
		);
	}

	async sendNotification(email: string, subject: string, body: string) {
		await ses.send(
			new SendEmailCommand({
				FromEmailAddress: FROM_ADDRESS,
				Destination: { ToAddresses: [email] },
				Content: {
					Simple: {
						Subject: { Data: subject },
						Body: {
							Text: { Data: body },
							Html: { Data: body.replace(/\n/g, '<br>') }
						}
					}
				}
			})
		);
	}
}
