import { d as db, p as removalVotes, b as and, a as eq, m as members } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/members/+page.server.ts
async function load({ locals }) {
	const allMembers = await db.select().from(members).all();
	const votes = await db.select().from(removalVotes).all();
	const voteCounts = /* @__PURE__ */ new Map();
	for (const v of votes) {
		if (!voteCounts.has(v.targetId)) voteCounts.set(v.targetId, {
			proposer: v.proposerId,
			voters: /* @__PURE__ */ new Set()
		});
		voteCounts.get(v.targetId).voters.add(v.voterId);
	}
	return {
		members: allMembers,
		userId: locals.user.id,
		totalMembers: allMembers.length,
		voteCounts: Array.from(voteCounts.entries()).map(([targetId, data]) => ({
			targetId,
			proposerId: data.proposer,
			count: data.voters.size
		}))
	};
}
var actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const name = data.get("name")?.toString();
		const email = data.get("email")?.toString();
		const phone = data.get("phone")?.toString() || "";
		const instrument = data.get("instrument")?.toString() || "";
		if (!name || !email) return { addError: "Name and email are required." };
		if (await db.select().from(members).where(eq(members.email, email.toLowerCase().trim())).get()) return { addError: "A member with that email already exists." };
		await db.insert(members).values({
			name,
			email: email.toLowerCase().trim(),
			phone,
			instrument
		});
		return { addSuccess: true };
	},
	proposeRemove: async ({ request, locals }) => {
		const targetId = (await request.formData()).get("targetId")?.toString();
		if (!targetId) return { removeError: "Invalid target." };
		const existing = await db.select().from(removalVotes).where(eq(removalVotes.targetId, targetId)).all();
		if (existing.some((v) => v.voterId === locals.user.id)) return { removeError: "You already voted to remove this member." };
		const proposerId = existing.length > 0 ? existing[0].proposerId : locals.user.id;
		await db.insert(removalVotes).values({
			proposerId,
			targetId,
			voterId: locals.user.id
		});
		const updated = await db.select().from(removalVotes).where(eq(removalVotes.targetId, targetId)).all();
		if (new Set(updated.map((v) => v.voterId)).size >= 3) await db.delete(members).where(eq(members.id, targetId));
		return { removeSuccess: true };
	},
	undoRemoveVote: async ({ request, locals }) => {
		const targetId = (await request.formData()).get("targetId")?.toString();
		if (!targetId) return { error: "Invalid target." };
		await db.delete(removalVotes).where(and(eq(removalVotes.targetId, targetId), eq(removalVotes.voterId, locals.user.id)));
		return { removeSuccess: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-CMjIDCgl.js.map
