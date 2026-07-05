import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function load({ locals }) {
	const allMembers = await db.select().from(schema.members).all();

	// Get removal votes for all active proposals
	const votes = await db.select().from(schema.removalVotes).all();

	// Build vote counts per target
	const voteCounts = new Map<string, { proposer: string; voters: Set<string> }>();
	for (const v of votes) {
		if (!voteCounts.has(v.targetId)) voteCounts.set(v.targetId, { proposer: v.proposerId, voters: new Set() });
		voteCounts.get(v.targetId)!.voters.add(v.voterId);
	}

	return {
		members: allMembers,
		userId: locals.user!.id,
		totalMembers: allMembers.length,
		voteCounts: Array.from(voteCounts.entries()).map(([targetId, data]) => ({
			targetId,
			proposerId: data.proposer,
			count: data.voters.size
		}))
	};
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const email = data.get('email')?.toString();
		const phone = data.get('phone')?.toString() || '';
		const instrument = data.get('instrument')?.toString() || '';

		if (!name || !email) return { addError: 'Name and email are required.' };

		const existing = await db
			.select()
			.from(schema.members)
			.where(eq(schema.members.email, email.toLowerCase().trim()))
			.get();
		if (existing) return { addError: 'A member with that email already exists.' };

		await db.insert(schema.members).values({
			name,
			email: email.toLowerCase().trim(),
			phone,
			instrument
		});

		return { addSuccess: true };
	},
	proposeRemove: async ({ request, locals }) => {
		const data = await request.formData();
		const targetId = data.get('targetId')?.toString();
		if (!targetId) return { removeError: 'Invalid target.' };

		const existing = await db
			.select()
			.from(schema.removalVotes)
			.where(eq(schema.removalVotes.targetId, targetId))
			.all();

		const alreadyVoted = existing.some((v) => v.voterId === locals.user!.id);
		if (alreadyVoted) return { removeError: 'You already voted to remove this member.' };

		const proposerId = existing.length > 0 ? existing[0].proposerId : locals.user!.id;

		await db.insert(schema.removalVotes).values({
			proposerId,
			targetId,
			voterId: locals.user!.id
		});

		// Check if 2 other members voted (threshold = 2)
		const updated = await db
			.select()
			.from(schema.removalVotes)
			.where(eq(schema.removalVotes.targetId, targetId))
			.all();
		const uniqueVoters = new Set(updated.map((v) => v.voterId));

		if (uniqueVoters.size >= 3) { // proposer + 2 others
			await db.delete(schema.members).where(eq(schema.members.id, targetId));
		}

		return { removeSuccess: true };
	},
	undoRemoveVote: async ({ request, locals }) => {
		const data = await request.formData();
		const targetId = data.get('targetId')?.toString();
		if (!targetId) return { error: 'Invalid target.' };

		await db
			.delete(schema.removalVotes)
			.where(
				and(
					eq(schema.removalVotes.targetId, targetId),
					eq(schema.removalVotes.voterId, locals.user!.id)
				)
			);

		return { removeSuccess: true };
	}
};
