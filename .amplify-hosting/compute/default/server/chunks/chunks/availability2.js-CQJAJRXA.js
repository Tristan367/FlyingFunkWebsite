//#region src/lib/server/availability.ts
function getUSHolidays(year) {
	const holidays = [];
	holidays.push(`${year}-01-01`);
	const mlk = new Date(year, 0, 1);
	mlk.setDate(1 + (1 - mlk.getDay() + 7) % 7 + 14);
	holidays.push(mlk.toISOString().split("T")[0]);
	const pres = new Date(year, 1, 1);
	pres.setDate(1 + (1 - pres.getDay() + 7) % 7 + 14);
	holidays.push(pres.toISOString().split("T")[0]);
	const mem = new Date(year, 4, 31);
	mem.setDate(31 - (mem.getDay() + 6) % 7);
	holidays.push(mem.toISOString().split("T")[0]);
	holidays.push(`${year}-06-19`);
	holidays.push(`${year}-07-04`);
	const labor = new Date(year, 8, 1);
	labor.setDate(1 + (1 - labor.getDay() + 7) % 7);
	holidays.push(labor.toISOString().split("T")[0]);
	const columbus = new Date(year, 9, 1);
	columbus.setDate(1 + (1 - columbus.getDay() + 7) % 7 + 7);
	holidays.push(columbus.toISOString().split("T")[0]);
	holidays.push(`${year}-11-11`);
	const thanks = new Date(year, 10, 1);
	thanks.setDate(1 + (4 - thanks.getDay() + 7) % 7 + 21);
	holidays.push(thanks.toISOString().split("T")[0]);
	holidays.push(`${year}-12-25`);
	return holidays;
}
var holidayCache = /* @__PURE__ */ new Map();
function isUSHoliday(dateStr) {
	const year = parseInt(dateStr.slice(0, 4));
	if (!holidayCache.has(year)) holidayCache.set(year, new Set(getUSHolidays(year)));
	return holidayCache.get(year).has(dateStr);
}
var CORE_INSTRUMENTS = [
	"guitar",
	"bass",
	"drums",
	"vocals",
	"keys"
];
var HORN_INSTRUMENTS = [
	"trumpet",
	"saxophone",
	"trombone"
];
function isMemberAvailable(member, dateStr, dayOfWeek) {
	if (member.explicitDates.has(dateStr)) return false;
	if (member.recurringDays.has(dayOfWeek)) return false;
	if (member.unavailableOnHolidays && isUSHoliday(dateStr)) return false;
	return true;
}
function computeBookableDates(startDate, endDate, membersInfo, withHorns) {
	const required = withHorns ? [...CORE_INSTRUMENTS, ...HORN_INSTRUMENTS] : CORE_INSTRUMENTS;
	const bookable = /* @__PURE__ */ new Set();
	const start = /* @__PURE__ */ new Date(startDate + "T00:00:00");
	const end = /* @__PURE__ */ new Date(endDate + "T00:00:00");
	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split("T")[0];
		const dayOfWeek = d.getDay();
		if (required.every((reqInst) => {
			return membersInfo.some((m) => {
				if (!isMemberAvailable(m, dateStr, dayOfWeek)) return false;
				return m.instruments.some((i) => i.toLowerCase() === reqInst.toLowerCase());
			});
		})) bookable.add(dateStr);
	}
	return bookable;
}

export { computeBookableDates as c, isUSHoliday as i };
//# sourceMappingURL=availability2.js-CQJAJRXA.js.map
