import { d as db, c as gigs, a as eq, u as unavailability, m as members, b as and, o as gigVotes, r as recurringUnavailability } from '../../../../../chunks/db.js-zAe9iE3U.js';
import { z as redirect, x as error } from '../../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/lib/server/lineup.ts
var CORE = [
	"guitar",
	"bass",
	"drums",
	"vocals",
	"keys"
];
var HORNS = [
	"trumpet",
	"saxophone",
	"trombone"
];
async function calculateLineup(date, withHorns) {
	const required = withHorns ? [...CORE, ...HORNS] : CORE;
	const allMembers = await db.select().from(members).all();
	const availableMembers = [];
	for (const m of allMembers) {
		const instList = (m.instruments || m.instrument || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
		if (instList.length === 0) continue;
		if (await db.select().from(unavailability).where(and(eq(unavailability.memberId, m.id), eq(unavailability.date, date), eq(unavailability.isAvailable, false))).get()) continue;
		const dayOfWeek = (/* @__PURE__ */ new Date(date + "T00:00:00")).getDay();
		if (await db.select().from(recurringUnavailability).where(and(eq(recurringUnavailability.memberId, m.id), eq(recurringUnavailability.dayOfWeek, dayOfWeek))).get()) continue;
		if (m.unavailableOnHolidays) {
			const { isUSHoliday } = await import('../../../../../chunks/availability.js-BNCd3Qz1.js');
			if (isUSHoliday(date)) continue;
		}
		availableMembers.push({
			id: m.id,
			name: m.name,
			instruments: instList
		});
	}
	const lineup = [];
	for (const inst of required) {
		const candidates = availableMembers.filter((m) => m.instruments.includes(inst)).sort((a, b) => a.instruments.length - b.instruments.length);
		if (candidates.length > 0) lineup.push({
			instrument: inst,
			members: candidates.map((c) => c.name),
			primary: candidates[0].name
		});
		else lineup.push({
			instrument: inst,
			members: [],
			primary: "Unfilled"
		});
	}
	return lineup;
}
function lineupMemberCount(lineup) {
	return new Set(lineup.filter((l) => l.members.length > 0).map((l) => l.primary)).size;
}
//#endregion
//#region src/routes/admin/gigs/[id]/+page.server.ts
async function load({ params, locals }) {
	const gig = await db.select().from(gigs).where(eq(gigs.id, params.id)).get();
	if (!gig) throw error(404, "Gig not found");
	const lineup = await calculateLineup(gig.date, gig.withHorns);
	const lineupCount = lineupMemberCount(lineup);
	const votes = await db.select().from(gigVotes).where(eq(gigVotes.gigId, params.id)).all();
	const members$2 = await db.select().from(members).all();
	return {
		gig,
		votes,
		members: members$2,
		memberVotes: new Map(votes.map((v) => [v.memberId, v])),
		allMarkedOff: (await db.select().from(unavailability).where(eq(unavailability.date, gig.date)).all()).length >= members$2.length,
		lineup,
		lineupCount
	};
}
var actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		await db.update(gigs).set({
			date: data.get("date")?.toString() || "",
			time: data.get("time")?.toString() || "",
			venue: data.get("venue")?.toString() || "",
			venueAddress: data.get("venueAddress")?.toString() || "",
			description: data.get("description")?.toString() || "",
			customerName: data.get("customerName")?.toString() || "",
			customerEmail: data.get("customerEmail")?.toString() || "",
			customerPhone: data.get("customerPhone")?.toString() || "",
			rate: data.get("rate")?.toString() || "",
			withHorns: data.get("withHorns") === "on",
			private: data.get("private") === "on",
			notes: data.get("notes")?.toString() || ""
		}).where(eq(gigs.id, params.id));
		return { saveSuccess: true };
	},
	status: async ({ request, params }) => {
		const status = (await request.formData()).get("status")?.toString();
		if (status === "confirmed" || status === "cancelled" || status === "pending") await db.update(gigs).set({ status }).where(eq(gigs.id, params.id));
		return { saveSuccess: true };
	},
	markAllUnavailable: async ({ params }) => {
		const gig = await db.select().from(gigs).where(eq(gigs.id, params.id)).get();
		if (!gig) return { error: "Gig not found" };
		const members$1 = await db.select().from(members).all();
		for (const member of members$1) if (!await db.select().from(unavailability).where(and(eq(unavailability.memberId, member.id), eq(unavailability.date, gig.date))).get()) await db.insert(unavailability).values({
			memberId: member.id,
			date: gig.date
		});
		return { saveSuccess: true };
	},
	undoAllUnavailable: async ({ params }) => {
		const gig = await db.select().from(gigs).where(eq(gigs.id, params.id)).get();
		if (!gig) return { error: "Gig not found" };
		await db.delete(unavailability).where(eq(unavailability.date, gig.date));
		return { saveSuccess: true };
	},
	delete: async ({ params }) => {
		await db.delete(gigs).where(eq(gigs.id, params.id));
		throw redirect(303, "/admin/gigs");
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DitdX1tZ.js.map
