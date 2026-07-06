function getUSHolidays(year: number): string[] {
	const holidays: string[] = [];
	holidays.push(`${year}-01-01`);
	const mlk = new Date(year, 0, 1); mlk.setDate(1 + ((1 - mlk.getDay() + 7) % 7) + 14);
	holidays.push(mlk.toISOString().split('T')[0]);
	const pres = new Date(year, 1, 1); pres.setDate(1 + ((1 - pres.getDay() + 7) % 7) + 14);
	holidays.push(pres.toISOString().split('T')[0]);
	const mem = new Date(year, 4, 31); mem.setDate(31 - ((mem.getDay() + 6) % 7));
	holidays.push(mem.toISOString().split('T')[0]);
	holidays.push(`${year}-06-19`);
	holidays.push(`${year}-07-04`);
	const labor = new Date(year, 8, 1); labor.setDate(1 + ((1 - labor.getDay() + 7) % 7));
	holidays.push(labor.toISOString().split('T')[0]);
	const columbus = new Date(year, 9, 1); columbus.setDate(1 + ((1 - columbus.getDay() + 7) % 7) + 7);
	holidays.push(columbus.toISOString().split('T')[0]);
	holidays.push(`${year}-11-11`);
	const thanks = new Date(year, 10, 1); thanks.setDate(1 + ((4 - thanks.getDay() + 7) % 7) + 21);
	holidays.push(thanks.toISOString().split('T')[0]);
	holidays.push(`${year}-12-25`);
	return holidays;
}

const holidayCache = new Map<number, Set<string>>();
export function isUSHoliday(dateStr: string): boolean {
	const year = parseInt(dateStr.slice(0, 4));
	if (!holidayCache.has(year)) holidayCache.set(year, new Set(getUSHolidays(year)));
	return holidayCache.get(year)!.has(dateStr);
}

export interface MemberAvailability {
	memberId: string;
	name: string;
	instruments: string[]; // all instruments this member can play
	explicitDates: Set<string>;
	recurringDays: Set<number>;
	unavailableOnHolidays: boolean;
}

const CORE_INSTRUMENTS = ['guitar', 'bass', 'drums', 'vocals', 'keys'];
const HORN_INSTRUMENTS = ['trumpet', 'saxophone', 'trombone'];

function isMemberAvailable(member: MemberAvailability, dateStr: string, dayOfWeek: number): boolean {
	if (member.explicitDates.has(dateStr)) return false;
	if (member.recurringDays.has(dayOfWeek)) return false;
	if (member.unavailableOnHolidays && isUSHoliday(dateStr)) return false;
	return true;
}

export function computeBookableDates(
	startDate: string,
	endDate: string,
	membersInfo: MemberAvailability[],
	withHorns: boolean
): Set<string> {
	const required = withHorns ? [...CORE_INSTRUMENTS, ...HORN_INSTRUMENTS] : CORE_INSTRUMENTS;
	const bookable = new Set<string>();
	const start = new Date(startDate + 'T00:00:00');
	const end = new Date(endDate + 'T00:00:00');

	// Filter to members who have set at least one instrument
	const activeMembers = membersInfo.filter((m) =>
		m.instruments.length > 0 && m.instruments[0] !== ''
	);

	// If no members have instruments yet, all dates are bookable (but still respect unavailability)
	if (activeMembers.length === 0) {
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().split('T')[0];
			const dayOfWeek = d.getDay();
			// A date is bookable unless ALL members are explicitly unavailable
			const anyoneAvailable = membersInfo.some((m) => isMemberAvailable(m, dateStr, dayOfWeek));
			if (anyoneAvailable) bookable.add(dateStr);
		}
		return bookable;
	}

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const dayOfWeek = d.getDay();

		const allCovered = required.every((reqInst) => {
			return activeMembers.some((m) => {
				if (!isMemberAvailable(m, dateStr, dayOfWeek)) return false;
				return m.instruments.some((i) => i.toLowerCase() === reqInst.toLowerCase());
			});
		});

		if (allCovered) bookable.add(dateStr);
	}

	return bookable;
}
