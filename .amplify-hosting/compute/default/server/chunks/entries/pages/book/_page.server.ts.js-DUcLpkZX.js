import { d as db, m as members, u as unavailability, r as recurringUnavailability, c as gigs } from '../../../chunks/db.js-zAe9iE3U.js';
import { y as ymd, a as rangeEndStr } from '../../../chunks/dates.js-WhQLpw1q.js';
import { c as computeBookableDates } from '../../../chunks/availability2.js-CQJAJRXA.js';

//#region src/routes/book/+page.server.ts
async function load() {
	const today = ymd(/* @__PURE__ */ new Date());
	const threeMonthsOut = rangeEndStr();
	const members$1 = await db.select().from(members).all();
	const explicitRows = await db.select().from(unavailability).all();
	const recurringRows = await db.select().from(recurringUnavailability).all();
	const membersInfo = members$1.map((m) => ({
		memberId: m.id,
		name: m.name,
		instruments: m.instruments ? m.instruments.split(",").map((s) => s.trim()) : [m.instrument],
		explicitDates: new Set(explicitRows.filter((r) => r.memberId === m.id).map((r) => r.date)),
		recurringDays: new Set(recurringRows.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)),
		unavailableOnHolidays: m.unavailableOnHolidays
	}));
	const fullBandDates = computeBookableDates(today, threeMonthsOut, membersInfo, true);
	const rhythmSectionDates = computeBookableDates(today, threeMonthsOut, membersInfo, false);
	return {
		fullBandDates: Array.from(fullBandDates),
		rhythmSectionDates: Array.from(rhythmSectionDates),
		memberCount: members$1.length,
		today
	};
}
var actions = { book: async ({ request }) => {
	const data = await request.formData();
	const datesStr = data.get("dates")?.toString();
	const time = data.get("time")?.toString() || "";
	const venue = data.get("venue")?.toString();
	const description = data.get("description")?.toString() || "";
	const customerName = data.get("customerName")?.toString();
	const customerEmail = data.get("customerEmail")?.toString();
	const withHorns = data.get("withHorns") !== "false";
	const budget = (data.get("budget")?.toString() || "").replace(/[^0-9.]/g, "");
	const isPrivate = data.get("private") === "on";
	if (!datesStr || !venue || !customerName || !customerEmail) return { bookError: "Name, email/phone, venue, and at least one date are required." };
	const members$2 = await db.select().from(members).all();
	const explicitRows = await db.select().from(unavailability).all();
	const recurringRows = await db.select().from(recurringUnavailability).all();
	const membersInfo = members$2.map((m) => ({
		memberId: m.id,
		name: m.name,
		instruments: m.instruments ? m.instruments.split(",").map((s) => s.trim()) : [m.instrument],
		explicitDates: new Set(explicitRows.filter((r) => r.memberId === m.id).map((r) => r.date)),
		recurringDays: new Set(recurringRows.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)),
		unavailableOnHolidays: m.unavailableOnHolidays
	}));
	const date = datesStr.includes(",") ? datesStr.split(",")[0].trim() : datesStr;
	if (!computeBookableDates(date, date, membersInfo, withHorns).has(date)) return { bookError: "Sorry, this date is not available. Please pick another." };
	const baseRate = withHorns ? "$1000" : "$500";
	await db.insert(gigs).values({
		date,
		time,
		venue,
		description,
		customerName,
		customerEmail,
		status: "pending",
		rate: budget || baseRate,
		withHorns,
		private: isPrivate,
		notes: ""
	});
	return { bookSuccess: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DUcLpkZX.js.map
