import { d as db, u as unavailability, a as eq, b as and, m as members, r as recurringUnavailability } from '../../../../chunks/db.js-zAe9iE3U.js';
import { y as ymd, r as rangeEnd } from '../../../../chunks/dates.js-WhQLpw1q.js';
import { c as computeBookableDates } from '../../../../chunks/availability2.js-CQJAJRXA.js';

//#region src/routes/admin/availability/+page.server.ts
async function load({ locals }) {
	const today = ymd(/* @__PURE__ */ new Date());
	const end = ymd(rangeEnd());
	const explicitRows = await db.select().from(unavailability).where(eq(unavailability.memberId, locals.user.id)).all();
	const recurringRows = await db.select().from(recurringUnavailability).where(eq(recurringUnavailability.memberId, locals.user.id)).all();
	const explicitByDate = /* @__PURE__ */ new Map();
	for (const r of explicitRows) explicitByDate.set(r.date, r.isAvailable);
	const myRecurringDays = new Set(recurringRows.map((r) => r.dayOfWeek));
	const holidaySetting = locals.user.unavailableOnHolidays;
	const { isUSHoliday } = await import('../../../../chunks/availability.js-BNCd3Qz1.js');
	const myUnavailableDates = [];
	const startDate = /* @__PURE__ */ new Date(today + "T00:00:00");
	const endDate = /* @__PURE__ */ new Date(end + "T00:00:00");
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = ymd(d);
		const explicit = explicitByDate.get(dateStr);
		if (explicit === true) continue;
		if (explicit === false) {
			myUnavailableDates.push(dateStr);
			continue;
		}
		if (myRecurringDays.has(d.getDay())) {
			myUnavailableDates.push(dateStr);
			continue;
		}
		if (holidaySetting && isUSHoliday(dateStr)) myUnavailableDates.push(dateStr);
	}
	const allMembers = await db.select().from(members).all();
	const allExplicit = await db.select().from(unavailability).all();
	const allRecurring = await db.select().from(recurringUnavailability).all();
	const allMembersInfo = allMembers.map((m) => ({
		memberId: m.id,
		name: m.name,
		instruments: m.instruments ? m.instruments.split(",").map((s) => s.trim()) : [m.instrument],
		explicitDates: new Set(allExplicit.filter((r) => r.memberId === m.id && !r.isAvailable).map((r) => r.date)),
		recurringDays: new Set(allRecurring.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)),
		unavailableOnHolidays: m.unavailableOnHolidays
	}));
	const fullBandBookable = computeBookableDates(today, end, allMembersInfo, true);
	const fivePieceBookable = computeBookableDates(today, end, allMembersInfo, false);
	return {
		explicitUnavailable: explicitRows.filter((r) => !r.isAvailable).map((r) => ({
			id: r.id,
			date: r.date
		})),
		recurringDays: Array.from(myRecurringDays),
		unavailableOnHolidays: holidaySetting,
		bookableDates: Array.from(fullBandBookable),
		fivePieceBookable: Array.from(fivePieceBookable),
		myUnavailableDates,
		today,
		memberCount: allMembers.length
	};
}
var actions = {
	toggle: async ({ request, locals }) => {
		const date = (await request.formData()).get("date")?.toString();
		if (!date) return { success: true };
		const existing = await db.select().from(unavailability).where(and(eq(unavailability.memberId, locals.user.id), eq(unavailability.date, date))).get();
		const dayOfWeek = (/* @__PURE__ */ new Date(date + "T00:00:00")).getDay();
		const recRows = await db.select().from(recurringUnavailability).where(and(eq(recurringUnavailability.memberId, locals.user.id), eq(recurringUnavailability.dayOfWeek, dayOfWeek))).all();
		const { isUSHoliday } = await import('../../../../chunks/availability.js-BNCd3Qz1.js');
		const isHoliday = locals.user.unavailableOnHolidays && isUSHoliday(date);
		const ruleActive = recRows.length > 0 || isHoliday;
		if (existing) if (ruleActive) await db.delete(unavailability).where(eq(unavailability.id, existing.id));
		else await db.delete(unavailability).where(eq(unavailability.id, existing.id));
		else if (ruleActive) await db.insert(unavailability).values({
			memberId: locals.user.id,
			date,
			isAvailable: true
		});
		else await db.insert(unavailability).values({
			memberId: locals.user.id,
			date,
			isAvailable: false
		});
		return { success: true };
	},
	setRange: async ({ request, locals }) => {
		const data = await request.formData();
		const from = data.get("from")?.toString();
		const to = data.get("to")?.toString();
		if (!from || !to) return { rangeError: "Date range required" };
		const start = /* @__PURE__ */ new Date(from + "T00:00:00");
		const end = /* @__PURE__ */ new Date(to + "T00:00:00");
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = ymd(d);
			const existing = await db.select().from(unavailability).where(and(eq(unavailability.memberId, locals.user.id), eq(unavailability.date, dateStr))).get();
			if (existing) await db.delete(unavailability).where(eq(unavailability.id, existing.id));
			await db.insert(unavailability).values({
				memberId: locals.user.id,
				date: dateStr,
				isAvailable: false
			});
		}
		return { success: true };
	},
	clearRange: async ({ request, locals }) => {
		const data = await request.formData();
		const from = data.get("from")?.toString();
		const to = data.get("to")?.toString();
		if (!from || !to) return { rangeError: "Date range required" };
		const start = /* @__PURE__ */ new Date(from + "T00:00:00");
		const end = /* @__PURE__ */ new Date(to + "T00:00:00");
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = ymd(d);
			await db.delete(unavailability).where(and(eq(unavailability.memberId, locals.user.id), eq(unavailability.date, dateStr)));
		}
		return { success: true };
	},
	toggleRecurring: async ({ request, locals }) => {
		const data = await request.formData();
		const day = parseInt(data.get("day")?.toString() || "");
		const enabled = data.get("enabled") === "true";
		if (isNaN(day) || day < 0 || day > 6) return { success: true };
		if (enabled) {
			if (!await db.select().from(recurringUnavailability).where(and(eq(recurringUnavailability.memberId, locals.user.id), eq(recurringUnavailability.dayOfWeek, day))).get()) await db.insert(recurringUnavailability).values({
				memberId: locals.user.id,
				dayOfWeek: day
			});
		} else await db.delete(recurringUnavailability).where(and(eq(recurringUnavailability.memberId, locals.user.id), eq(recurringUnavailability.dayOfWeek, day)));
		return { success: true };
	},
	toggleHolidays: async ({ request, locals }) => {
		const enabled = (await request.formData()).get("enabled") === "true";
		await db.update(members).set({ unavailableOnHolidays: enabled }).where(eq(members.id, locals.user.id));
		return { success: true };
	},
	removeUnavailability: async ({ request, locals }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (id) await db.delete(unavailability).where(and(eq(unavailability.id, id), eq(unavailability.memberId, locals.user.id)));
		return { success: true };
	},
	wipeAll: async ({ locals }) => {
		await db.delete(unavailability).where(eq(unavailability.memberId, locals.user.id));
		return { wiped: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-6ANicrAy.js.map
