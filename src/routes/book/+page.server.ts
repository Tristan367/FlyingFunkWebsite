import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { computeBookableDates, type MemberAvailability } from '$lib/server/availability';
import { ymd, rangeEndStr } from '$lib/utils/dates';

export async function load() {
	const today = ymd(new Date());
	const threeMonthsOut = rangeEndStr();

	const members = await db.select().from(schema.members).all();
	const explicitRows = await db.select().from(schema.unavailability).all();
	const recurringRows = await db.select().from(schema.recurringUnavailability).all();

	const membersInfo: MemberAvailability[] = members.map((m) => ({
		memberId: m.id,
		name: m.name,
		instruments: m.instruments ? m.instruments.split(',').map((s) => s.trim()) : [m.instrument],
		explicitDates: new Set(
			explicitRows.filter((r) => r.memberId === m.id).map((r) => r.date)
		),
		recurringDays: new Set(
			recurringRows.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)
		),
		unavailableOnHolidays: m.unavailableOnHolidays
	}));

	const fullBandDates = computeBookableDates(today, threeMonthsOut, membersInfo, true);
	const rhythmSectionDates = computeBookableDates(today, threeMonthsOut, membersInfo, false);

	return {
		fullBandDates: Array.from(fullBandDates),
		rhythmSectionDates: Array.from(rhythmSectionDates),
		memberCount: members.length,
		today
	};
}

export const actions = {
	book: async ({ request }) => {
		const data = await request.formData();
		const datesStr = data.get('dates')?.toString();
		const time = data.get('time')?.toString() || '';
		const venue = data.get('venue')?.toString();
		const description = data.get('description')?.toString() || '';
		const customerName = data.get('customerName')?.toString();
		const customerEmail = data.get('customerEmail')?.toString();
		const withHorns = data.get('withHorns') !== 'false';
		const budget = (data.get('budget')?.toString() || '').replace(/[^0-9.]/g, '');
		const isPrivate = data.get('private') === 'on';

		if (!datesStr || !venue || !customerName || !customerEmail) {
			return { bookError: 'Name, email/phone, venue, and at least one date are required.' };
		}

		const members = await db.select().from(schema.members).all();
		const explicitRows = await db.select().from(schema.unavailability).all();
		const recurringRows = await db.select().from(schema.recurringUnavailability).all();

		const membersInfo: MemberAvailability[] = members.map((m) => ({
			memberId: m.id,
			name: m.name,
			instruments: m.instruments ? m.instruments.split(',').map((s) => s.trim()) : [m.instrument],
			explicitDates: new Set(explicitRows.filter((r) => r.memberId === m.id).map((r) => r.date)),
			recurringDays: new Set(recurringRows.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)),
			unavailableOnHolidays: m.unavailableOnHolidays
		}));

		const date = datesStr.includes(',') ? datesStr.split(',')[0].trim() : datesStr;
		const bookable = computeBookableDates(date, date, membersInfo, withHorns);
		if (!bookable.has(date)) {
			return { bookError: 'Sorry, this date is not available. Please pick another.' };
		}

		const baseRate = withHorns ? '$1000' : '$500';

		await db.insert(schema.gigs).values({
			date,
			time,
			venue,
				description,
			customerName,
				customerEmail,
				status: 'pending',
			rate: budget || baseRate,
			withHorns,
			private: isPrivate,
			notes: ''
		});

		return { bookSuccess: true };
	}
};
