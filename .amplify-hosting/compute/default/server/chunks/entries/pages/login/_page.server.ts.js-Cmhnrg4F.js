import { a as verifyCode, g as getMemberByEmailOrPhone, b as generateSessionToken, c as createSession, d as createVerificationCode } from '../../../chunks/auth.js-BVp1Xyq4.js';
import { g as getEmail } from '../../../chunks/adapters.js-CyCRUHV3.js';
import { z as redirect } from '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/login/+page.server.ts
var actions = {
	sendCode: async ({ request }) => {
		const identifier = (await request.formData()).get("email")?.toString().trim().toLowerCase();
		if (!identifier) return {
			step: "email",
			error: "Email is required."
		};
		const member = await getMemberByEmailOrPhone(identifier);
		if (!member) return {
			step: "email",
			error: "No band member found with that email."
		};
		const code = await createVerificationCode(identifier);
		try {
			await getEmail().sendVerificationCode(member.email, code);
		} catch {}
		return {
			step: "verify",
			email: identifier,
			code: void 0
		};
	},
	verifyCode: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get("email")?.toString().trim().toLowerCase();
		const code = data.get("code")?.toString().trim();
		if (!email || !code) return {
			step: "verify",
			email,
			error: "Verification code is required."
		};
		if (!await verifyCode(email, code)) return {
			step: "verify",
			email,
			error: "Invalid or expired verification code."
		};
		const member = await getMemberByEmailOrPhone(email);
		if (!member) return {
			step: "verify",
			email,
			error: "Member not found."
		};
		const token = generateSessionToken();
		await createSession(token, member.id);
		cookies.set("session", token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: false,
			maxAge: 3600 * 24 * 30
		});
		throw redirect(303, "/admin");
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Cmhnrg4F.js.map
