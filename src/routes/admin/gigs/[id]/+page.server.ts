import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { calculateLineup, lineupMemberCount } from '$lib/server/lineup';

export async function load({ params, locals }) {
	const gig = await db
		.select()
		.from(schema.gigs)
		.where(eq(schema.gigs.id, params.id))
		.get();

	if (!gig) throw error(404, 'Gig not found');

	const lineup = await calculateLineup(gig.date, gig.withHorns);
	const lineupCount = lineupMemberCount(lineup);

	const votes = await db
		.select()
		.from(schema.gigVotes)
		.where(eq(schema.gigVotes.gigId, params.id))
		.all();

	const members = await db.select().from(schema.members).all();
	const voteMap = new Map(votes.map((v) => [v.memberId, v]));

	const gigUnavail = await db
		.select()
		.from(schema.unavailability)
		.where(eq(schema.unavailability.date, gig.date))
		.all();

	const allMarkedOff = gigUnavail.length >= members.length;

	return { gig, votes, members, memberVotes: voteMap, allMarkedOff, lineup, lineupCount };
}

export const actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		await db
			.update(schema.gigs)
			.set({
				date: data.get('date')?.toString() || '',
				time: data.get('time')?.toString() || '',
				venue: data.get('venue')?.toString() || '',
				venueAddress: data.get('venueAddress')?.toString() || '',
				description: data.get('description')?.toString() || '',
				customerName: data.get('customerName')?.toString() || '',
				customerEmail: data.get('customerEmail')?.toString() || '',
				customerPhone: data.get('customerPhone')?.toString() || '',
				rate: data.get('rate')?.toString() || '',
				withHorns: data.get('withHorns') === 'on',
				private: data.get('private') === 'on',
				notes: data.get('notes')?.toString() || ''
			})
			.where(eq(schema.gigs.id, params.id));

		return { saveSuccess: true };
	},
	status: async ({ request, params }) => {
		const data = await request.formData();
		const status = data.get('status')?.toString() as string;
		if (status === 'confirmed' || status === 'cancelled' || status === 'pending') {
			await db
				.update(schema.gigs)
				.set({ status })
				.where(eq(schema.gigs.id, params.id));
		}
		return { saveSuccess: true };
	},
	markAllUnavailable: async ({ params }) => {
		const gig = await db
			.select()
			.from(schema.gigs)
			.where(eq(schema.gigs.id, params.id))
			.get();

		if (!gig) return { error: 'Gig not found' };

		const members = await db.select().from(schema.members).all();

		for (const member of members) {
			const existing = await db
				.select()
				.from(schema.unavailability)
				.where(
					and(
						eq(schema.unavailability.memberId, member.id),
						eq(schema.unavailability.date, gig.date)
					)
				)
				.get();

				if (!existing) {
					await db.insert(schema.unavailability).values({
						memberId: member.id,
						date: gig.date
					});
				}
		}

		return { saveSuccess: true };
	},
	undoAllUnavailable: async ({ params }) => {
		const gig = await db
			.select()
			.from(schema.gigs)
			.where(eq(schema.gigs.id, params.id))
			.get();

		if (!gig) return { error: 'Gig not found' };

		await db
			.delete(schema.unavailability)
			.where(
				eq(schema.unavailability.date, gig.date)
			);

		return { saveSuccess: true };
	},
	delete: async ({ params }) => {
		await db.delete(schema.gigs).where(eq(schema.gigs.id, params.id));
		throw redirect(303, '/admin/gigs');
	}
};
