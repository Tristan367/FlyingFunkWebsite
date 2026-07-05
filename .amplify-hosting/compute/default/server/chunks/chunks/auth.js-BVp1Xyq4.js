import { e as entityKind, d as db, m as members, s as sessions, a as eq, v as verificationCodes, b as and, g as gte } from './db.js-zAe9iE3U.js';

class ConsoleLogWriter {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
}
class DefaultLogger {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
}
class NoopLogger {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
}

//#region src/lib/server/auth.ts
function generateSessionToken() {
	return crypto.randomUUID();
}
function generateVerificationCode() {
	return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function createSession(token, userId) {
	const session = {
		id: token,
		userId,
		expiresAt: Math.floor(Date.now() / 1e3) + 3600 * 24 * 30
	};
	await db.insert(sessions).values(session);
	return session;
}
async function validateSessionToken(token) {
	const result = await db.select({
		session: sessions,
		member: members
	}).from(sessions).innerJoin(members, eq(sessions.userId, members.id)).where(eq(sessions.id, token)).get();
	if (!result) return null;
	const { session, member } = result;
	if (session.expiresAt < Math.floor(Date.now() / 1e3)) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return null;
	}
	if (session.expiresAt - Math.floor(Date.now() / 1e3) < 3600 * 24 * 15) {
		const newExpiresAt = Math.floor(Date.now() / 1e3) + 3600 * 24 * 30;
		await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, session.id));
	}
	return {
		session,
		member
	};
}
async function invalidateSession(sessionId) {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}
async function createVerificationCode(email) {
	const clean = email.toLowerCase().trim();
	const now = Math.floor(Date.now() / 1e3);
	const recent = await db.select().from(verificationCodes).where(and(eq(verificationCodes.email, clean), gte(verificationCodes.expiresAt, now - 540))).all();
	if (recent.length >= 2) return recent[0].code;
	await db.delete(verificationCodes).where(eq(verificationCodes.email, clean));
	const code = generateVerificationCode();
	const expiresAt = now + 600;
	await db.insert(verificationCodes).values({
		email: clean,
		code,
		expiresAt
	});
	return code;
}
async function verifyCode(email, code) {
	const now = Math.floor(Date.now() / 1e3);
	const result = await db.select().from(verificationCodes).where(and(eq(verificationCodes.email, email.toLowerCase().trim()), eq(verificationCodes.code, code), gte(verificationCodes.expiresAt, now))).get();
	if (result) {
		await db.delete(verificationCodes).where(eq(verificationCodes.id, result.id));
		return true;
	}
	return false;
}
async function getMemberByEmailOrPhone(identifier) {
	const clean = identifier.toLowerCase().trim();
	return await db.select().from(members).where(clean.includes("@") ? eq(members.email, clean) : eq(members.phone, clean)).get() ?? null;
}

export { DefaultLogger as D, NoopLogger as N, verifyCode as a, generateSessionToken as b, createSession as c, createVerificationCode as d, getMemberByEmailOrPhone as g, invalidateSession as i, validateSessionToken as v };
//# sourceMappingURL=auth.js-BVp1Xyq4.js.map
