import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { computeBookableDates, type MemberAvailability } from '$lib/server/availability';
import { ymd, rangeEnd } from '$lib/utils/dates';

export async function load({ locals }) {
	const today = ymd(new Date());
	const end = ymd(rangeEnd());

	const explicitRows = await db
		.select()
		.from(schema.unavailability)
		.where(eq(schema.unavailability.memberId, locals.user!.id))
		.all();

	const recurringRows = await db
		.select()
		.from(schema.recurringUnavailability)
		.where(eq(schema.recurringUnavailability.memberId, locals.user!.id))
		.all();

	// Build lookup: explicit overrides by date
	const explicitByDate = new Map<string, boolean>();
	for (const r of explicitRows) explicitByDate.set(r.date, r.isAvailable);

	const myRecurringDays = new Set(recurringRows.map((r) => r.dayOfWeek));
	const holidaySetting = locals.user!.unavailableOnHolidays;
	const { isUSHoliday } = await import('$lib/server/availability');

	// Compute effective unavailability for each date in range
	const myUnavailableDates: string[] = [];
	const startDate = new Date(today + 'T00:00:00');
	const endDate = new Date(end + 'T00:00:00');

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = ymd(d);
		const explicit = explicitByDate.get(dateStr);

		if (explicit === true) continue;           // explicit available → skip
		if (explicit === false) {                   // explicit unavailable
			myUnavailableDates.push(dateStr);
			continue;
		}
		if (myRecurringDays.has(d.getDay())) {      // recurring rule
			myUnavailableDates.push(dateStr);
			continue;
		}
		if (holidaySetting && isUSHoliday(dateStr)) { // holiday
			myUnavailableDates.push(dateStr);
		}
	}

	// Full band bookable computation (needs other members' data too)
	const allMembers = await db.select().from(schema.members).all();
	const allExplicit = await db.select().from(schema.unavailability).all();
	const allRecurring = await db.select().from(schema.recurringUnavailability).all();

	const allMembersInfo: MemberAvailability[] = allMembers.map((m) => ({
		memberId: m.id,
		name: m.name,
		instruments: m.instruments ? m.instruments.split(',').map((s) => s.trim()) : [m.instrument],
		explicitDates: new Set(
			allExplicit.filter((r) => r.memberId === m.id && !r.isAvailable).map((r) => r.date)
		),
		recurringDays: new Set(
			allRecurring.filter((r) => r.memberId === m.id).map((r) => r.dayOfWeek)
		),
		unavailableOnHolidays: m.unavailableOnHolidays
	}));

	const fullBandBookable = computeBookableDates(today, end, allMembersInfo, true);
	const fivePieceBookable = computeBookableDates(today, end, allMembersInfo, false);

	return {
		explicitUnavailable: explicitRows.filter((r) => !r.isAvailable).map((r) => ({ id: r.id, date: r.date })),
		recurringDays: Array.from(myRecurringDays),
		unavailableOnHolidays: holidaySetting,
		bookableDates: Array.from(fullBandBookable),
		fivePieceBookable: Array.from(fivePieceBookable),
		myUnavailableDates,
		today,
		memberCount: allMembers.length
	};
}

export const actions = {
	toggle: async ({ request, locals }) => {
		const data = await request.formData();
		const date = data.get('date')?.toString();
		if (!date) return { success: true };

		const existing = await db
			.select()
			.from(schema.unavailability)
			.where(
				and(
					eq(schema.unavailability.memberId, locals.user!.id),
					eq(schema.unavailability.date, date)
				)
			)
			.get();

		// Determine effective state: is this date currently unavailable?
		const dayOfWeek = new Date(date + 'T00:00:00').getDay();
		const recRows = await db
			.select()
			.from(schema.recurringUnavailability)
			.where(
				and(
					eq(schema.recurringUnavailability.memberId, locals.user!.id),
					eq(schema.recurringUnavailability.dayOfWeek, dayOfWeek)
				)
			)
			.all();
		const { isUSHoliday } = await import('$lib/server/availability');
		const isHoliday = locals.user!.unavailableOnHolidays && isUSHoliday(date);
		const ruleActive = recRows.length > 0 || isHoliday;

		if (existing) {
			// Toggle: delete if this row was the "explicit" reason for the current state,
			// otherwise flip isAvailable
			if (ruleActive) {
				// Date is ruled unavailable. The existing row was an override.
				// Toggle it: delete the override → date goes back to ruled state
				await db.delete(schema.unavailability).where(eq(schema.unavailability.id, existing.id));
			} else {
				// No rule. The existing row is the sole reason. Delete it → available.
				await db.delete(schema.unavailability).where(eq(schema.unavailability.id, existing.id));
			}
		} else {
			if (ruleActive) {
				// Date is ruled unavailable. We need an explicit "available" override.
				await db.insert(schema.unavailability).values({
					memberId: locals.user!.id,
					date,
					isAvailable: true
				});
			} else {
				// Date is available by default. Make it explicitly unavailable.
				await db.insert(schema.unavailability).values({
					memberId: locals.user!.id,
					date,
					isAvailable: false
				});
			}
		}

		return { success: true };
	},
	setRange: async ({ request, locals }) => {
		const data = await request.formData();
		const from = data.get('from')?.toString();
		const to = data.get('to')?.toString();
		if (!from || !to) return { rangeError: 'Date range required' };

		const start = new Date(from + 'T00:00:00');
		const end = new Date(to + 'T00:00:00');

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = ymd(d);
			const existing = await db
				.select()
				.from(schema.unavailability)
				.where(
					and(
						eq(schema.unavailability.memberId, locals.user!.id),
						eq(schema.unavailability.date, dateStr)
					)
				)
				.get();
			if (existing) {
				await db.delete(schema.unavailability).where(eq(schema.unavailability.id, existing.id));
			}
			await db.insert(schema.unavailability).values({
				memberId: locals.user!.id,
				date: dateStr,
				isAvailable: false
			});
		}

		return { success: true };
	},
	clearRange: async ({ request, locals }) => {
		const data = await request.formData();
		const from = data.get('from')?.toString();
		const to = data.get('to')?.toString();
		if (!from || !to) return { rangeError: 'Date range required' };

		const start = new Date(from + 'T00:00:00');
		const end = new Date(to + 'T00:00:00');

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = ymd(d);
			await db
				.delete(schema.unavailability)
				.where(
					and(
						eq(schema.unavailability.memberId, locals.user!.id),
						eq(schema.unavailability.date, dateStr)
					)
				);
		}

		return { success: true };
	},
	toggleRecurring: async ({ request, locals }) => {
		const data = await request.formData();
		const day = parseInt(data.get('day')?.toString() || '');
		const enabled = data.get('enabled') === 'true';

		if (isNaN(day) || day < 0 || day > 6) return { success: true };

		if (enabled) {
			const exists = await db
				.select()
				.from(schema.recurringUnavailability)
				.where(
					and(
						eq(schema.recurringUnavailability.memberId, locals.user!.id),
						eq(schema.recurringUnavailability.dayOfWeek, day)
					)
				)
				.get();
			if (!exists) {
				await db.insert(schema.recurringUnavailability).values({
					memberId: locals.user!.id,
					dayOfWeek: day
				});
			}
		} else {
			await db
				.delete(schema.recurringUnavailability)
				.where(
					and(
						eq(schema.recurringUnavailability.memberId, locals.user!.id),
						eq(schema.recurringUnavailability.dayOfWeek, day)
					)
				);
		}

		return { success: true };
	},
	toggleHolidays: async ({ request, locals }) => {
		const data = await request.formData();
		const enabled = data.get('enabled') === 'true';
		await db
			.update(schema.members)
			.set({ unavailableOnHolidays: enabled })
			.where(eq(schema.members.id, locals.user!.id));
		return { success: true };
	},
	removeUnavailability: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (id) {
			await db
				.delete(schema.unavailability)
				.where(
					and(
						eq(schema.unavailability.id, id),
						eq(schema.unavailability.memberId, locals.user!.id)
					)
				);
		}
		return { success: true };
	},
	wipeAll: async ({ locals }) => {
		await db
			.delete(schema.unavailability)
			.where(eq(schema.unavailability.memberId, locals.user!.id));
		return { wiped: true };
	}
};
