import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function load({ locals }) {
	const allGigs = await db
		.select()
		.from(schema.gigs)
		.orderBy(desc(schema.gigs.createdAt))
		.all();

	// Get votes for all gigs
	const allVotes = await db.select().from(schema.gigVotes).all();

	// Get all members for vote counting
	const allMembers = await db.select().from(schema.members).all();

	// Build vote summaries per gig
	const voteMap = new Map<string, { approve: number; reject: number; abstain: number; myVote: string | null }>();
	for (const gig of allGigs) {
		voteMap.set(gig.id, { approve: 0, reject: 0, abstain: 0, myVote: null });
	}
	for (const v of allVotes) {
		const summary = voteMap.get(v.gigId);
		if (summary) {
			if (v.vote === 'approve') summary.approve++;
			else if (v.vote === 'reject') summary.reject++;
			else summary.abstain++;
			if (v.memberId === locals.user!.id) summary.myVote = v.vote;
		}
	}

	const gigsWithVotes = allGigs.map((gig) => ({
		...gig,
		votes: voteMap.get(gig.id) || { approve: 0, reject: 0, abstain: 0, myVote: null }
	}));

	return {
		gigs: gigsWithVotes,
		memberCount: allMembers.length,
		user: locals.user!
	};
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const date = data.get('date')?.toString();
		const time = data.get('time')?.toString() || '';
		const venue = data.get('venue')?.toString();
		const description = data.get('description')?.toString() || '';
		const rate = data.get('rate')?.toString() || '$1000';

		if (!date || !venue) return { addError: 'Date and venue are required.' };

		await db.insert(schema.gigs).values({
			date,
			time,
			venue,
			description,
			rate,
			status: 'confirmed'
		});

		return { addSuccess: true };
	},
	vote: async ({ request, locals }) => {
		const data = await request.formData();
		const gigId = data.get('gigId')?.toString();
		const vote = data.get('vote')?.toString() as 'approve' | 'reject' | 'abstain';

		if (!gigId || !vote) return { voteError: 'Invalid vote' };

		const existing = await db
			.select()
			.from(schema.gigVotes)
			.where(
				and(
					eq(schema.gigVotes.gigId, gigId),
					eq(schema.gigVotes.memberId, locals.user!.id)
				)
			)
			.get();

		if (existing) {
			await db
				.update(schema.gigVotes)
				.set({ vote })
				.where(eq(schema.gigVotes.id, existing.id));
		} else {
			await db.insert(schema.gigVotes).values({
				gigId,
				memberId: locals.user!.id,
				vote
			});
		}

		return { voteSuccess: true };
	}
};
