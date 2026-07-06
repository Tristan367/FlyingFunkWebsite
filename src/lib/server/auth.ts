import { db } from './db/index';
import * as schema from './db/schema';
import { and, eq, gte } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string): Promise<string> {
	return hash(password);
}

export async function verifyPassword(member: typeof schema.members.$inferSelect, password: string): Promise<boolean> {
	if (!member.password) return false;
	return verify(member.password, password);
}

export function generateSessionToken(): string {
	return crypto.randomUUID();
}

export function generateVerificationCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createSession(
	token: string,
	userId: string
): Promise<typeof schema.sessions.$inferSelect> {
	const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
	const session = { id: token, userId, expiresAt };
	await db.insert(schema.sessions).values(session);
	return session;
}

export async function validateSessionToken(
	token: string
): Promise<{ session: typeof schema.sessions.$inferSelect; member: typeof schema.members.$inferSelect } | null> {
	const result = await db
		.select({ session: schema.sessions, member: schema.members })
		.from(schema.sessions)
		.innerJoin(schema.members, eq(schema.sessions.userId, schema.members.id))
		.where(eq(schema.sessions.id, token))
		.get();

	if (!result) return null;

	const { session, member } = result;

	if (session.expiresAt < Math.floor(Date.now() / 1000)) {
		await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id));
		return null;
	}

	if (session.expiresAt - Math.floor(Date.now() / 1000) < 60 * 60 * 24 * 15) {
		const newExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
		await db
			.update(schema.sessions)
			.set({ expiresAt: newExpiresAt })
			.where(eq(schema.sessions.id, session.id));
	}

	return { session, member };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function createVerificationCode(email: string): Promise<string> {
	const clean = email.toLowerCase().trim();
	const now = Math.floor(Date.now() / 1000);

	// Rate limit: max 2 codes per 60 seconds per email
	const recent = await db
		.select()
		.from(schema.verificationCodes)
		.where(
			and(
				eq(schema.verificationCodes.email, clean),
				gte(schema.verificationCodes.expiresAt, now - (60 * 9)) // sent within the last 60 seconds
			)
		)
		.all();

	if (recent.length >= 2) return recent[0].code; // reuse the most recent one

	// Delete old codes
	await db.delete(schema.verificationCodes).where(eq(schema.verificationCodes.email, clean));

	const code = generateVerificationCode();
	const expiresAt = now + 60 * 10; // 10 minutes

	await db.insert(schema.verificationCodes).values({ email: clean, code, expiresAt });
	return code;
}

export async function verifyCode(
	email: string,
	code: string
): Promise<boolean> {
	const now = Math.floor(Date.now() / 1000);

	const result = await db
		.select()
		.from(schema.verificationCodes)
		.where(
			and(
				eq(schema.verificationCodes.email, email.toLowerCase().trim()),
				eq(schema.verificationCodes.code, code),
				gte(schema.verificationCodes.expiresAt, now)
			)
		)
		.get();

	if (result) {
		// Delete used code
		await db.delete(schema.verificationCodes).where(eq(schema.verificationCodes.id, result.id));
		return true;
	}

	return false;
}

export async function getMemberByEmailOrPhone(
	identifier: string
): Promise<typeof schema.members.$inferSelect | null> {
	const clean = identifier.toLowerCase().trim();
	const result = await db
		.select()
		.from(schema.members)
		.where(
			clean.includes('@')
				? eq(schema.members.email, clean)
				: eq(schema.members.phone, clean)
		)
		.get();
	return result ?? null;
}

export type Session = typeof schema.sessions.$inferSelect;
export type Member = typeof schema.members.$inferSelect;
