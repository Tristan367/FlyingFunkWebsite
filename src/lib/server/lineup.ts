import { db } from './db/index';
import * as schema from './db/schema';
import { and, eq } from 'drizzle-orm';

const CORE = ['guitar', 'bass', 'drums', 'vocals', 'keys'];
const HORNS = ['trumpet', 'saxophone', 'trombone'];

export interface LineupAssignment {
	instrument: string;
	members: string[];
	primary: string;
}

export async function calculateLineup(date: string, withHorns: boolean): Promise<LineupAssignment[]> {
	const required = withHorns ? [...CORE, ...HORNS] : CORE;
	const allMembers = await db.select().from(schema.members).all();

	const availableMembers: Array<{ id: string; name: string; instruments: string[] }> = [];

	for (const m of allMembers) {
		const instList = (m.instruments || m.instrument || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
		if (instList.length === 0) continue;

		const unavail = await db
			.select()
			.from(schema.unavailability)
			.where(and(eq(schema.unavailability.memberId, m.id), eq(schema.unavailability.date, date), eq(schema.unavailability.isAvailable, false)))
			.get();
		if (unavail) continue;

		const dayOfWeek = new Date(date + 'T00:00:00').getDay();
		const rec = await db
			.select()
			.from(schema.recurringUnavailability)
			.where(and(eq(schema.recurringUnavailability.memberId, m.id), eq(schema.recurringUnavailability.dayOfWeek, dayOfWeek)))
			.get();
		if (rec) continue;

		if (m.unavailableOnHolidays) {
			const { isUSHoliday } = await import('./availability');
			if (isUSHoliday(date)) continue;
		}

		availableMembers.push({ id: m.id, name: m.name, instruments: instList });
	}

	const lineup: LineupAssignment[] = [];

	for (const inst of required) {
		const candidates = availableMembers
			.filter((m) => m.instruments.includes(inst))
			.sort((a, b) => a.instruments.length - b.instruments.length);

		if (candidates.length > 0) {
			lineup.push({
				instrument: inst,
				members: candidates.map((c) => c.name),
				primary: candidates[0].name
			});
		} else {
			lineup.push({ instrument: inst, members: [], primary: 'Unfilled' });
		}
	}

	return lineup;
}

export function lineupMemberCount(lineup: LineupAssignment[]): number {
	return new Set(lineup.filter((l) => l.members.length > 0).map((l) => l.primary)).size;
}
