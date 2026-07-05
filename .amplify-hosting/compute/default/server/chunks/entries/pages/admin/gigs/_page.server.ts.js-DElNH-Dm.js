import { d as db, o as gigVotes, b as and, a as eq, c as gigs, i as desc, m as members } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/gigs/+page.server.ts
async function load({ locals }) {
	const allGigs = await db.select().from(gigs).orderBy(desc(gigs.createdAt)).all();
	const allVotes = await db.select().from(gigVotes).all();
	const allMembers = await db.select().from(members).all();
	const voteMap = /* @__PURE__ */ new Map();
	for (const gig of allGigs) voteMap.set(gig.id, {
		approve: 0,
		reject: 0,
		abstain: 0,
		myVote: null
	});
	for (const v of allVotes) {
		const summary = voteMap.get(v.gigId);
		if (summary) {
			if (v.vote === "approve") summary.approve++;
			else if (v.vote === "reject") summary.reject++;
			else summary.abstain++;
			if (v.memberId === locals.user.id) summary.myVote = v.vote;
		}
	}
	return {
		gigs: allGigs.map((gig) => ({
			...gig,
			votes: voteMap.get(gig.id) || {
				approve: 0,
				reject: 0,
				abstain: 0,
				myVote: null
			}
		})),
		memberCount: allMembers.length,
		user: locals.user
	};
}
var actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const date = data.get("date")?.toString();
		const time = data.get("time")?.toString() || "";
		const venue = data.get("venue")?.toString();
		const description = data.get("description")?.toString() || "";
		const rate = data.get("rate")?.toString() || "$1000";
		if (!date || !venue) return { addError: "Date and venue are required." };
		await db.insert(gigs).values({
			date,
			time,
			venue,
			description,
			rate,
			status: "confirmed"
		});
		return { addSuccess: true };
	},
	vote: async ({ request, locals }) => {
		const data = await request.formData();
		const gigId = data.get("gigId")?.toString();
		const vote = data.get("vote")?.toString();
		if (!gigId || !vote) return { voteError: "Invalid vote" };
		const existing = await db.select().from(gigVotes).where(and(eq(gigVotes.gigId, gigId), eq(gigVotes.memberId, locals.user.id))).get();
		if (existing) await db.update(gigVotes).set({ vote }).where(eq(gigVotes.id, existing.id));
		else await db.insert(gigVotes).values({
			gigId,
			memberId: locals.user.id,
			vote
		});
		return { voteSuccess: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DElNH-Dm.js.map
