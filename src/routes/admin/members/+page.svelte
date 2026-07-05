<script lang="ts">
	import { instrumentEmoji } from '$lib/utils/instruments';

	let { data, form } = $props();
	let showAdd = $state(false);
	let newName = $state('');
	let newEmail = $state('');
	let newPhone = $state('');
	let newInstrument = $state('');
	let confirmRemove = $state<string | null>(null);

	function votesFor(memberId: string): { count: number; proposerId: string } | undefined {
		const v = data.voteCounts.find((vc: any) => vc.targetId === memberId);
		return v ? { count: v.count, proposerId: v.proposerId } : undefined;
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Band Members</h1>

{#if form?.addSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Member added!</p>
{/if}
{#if form?.removeSuccess || form?.removeError}
	<p class="mb-6 rounded-lg border {form?.removeError ? 'border-red-700 bg-red-900/20 text-red-400' : 'border-green-700 bg-green-900/20 text-green-400'} p-3 text-sm">{form?.removeError || 'Vote recorded! If threshold is met, the member will be removed.'}</p>
{/if}

{#if !showAdd}
	<button onclick={() => showAdd = true}
		class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Add Member</button>
{:else}
	<form method="POST" action="?/add" class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h2 class="mb-3 text-sm font-medium text-zinc-400">New Band Member</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<label for="mn-name" class="mb-1 block text-xs text-zinc-400">Name</label>
				<input type="text" id="mn-name" name="name" required bind:value={newName}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="mn-email" class="mb-1 block text-xs text-zinc-400">Email</label>
				<input type="email" id="mn-email" name="email" required bind:value={newEmail}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="mn-phone" class="mb-1 block text-xs text-zinc-400">Phone</label>
				<input type="text" id="mn-phone" name="phone" bind:value={newPhone}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="mn-instrument" class="mb-1 block text-xs text-zinc-400">Instrument</label>
				<input type="text" id="mn-instrument" name="instrument" bind:value={newInstrument}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
		</div>
		{#if form?.addError}
			<p class="mt-2 text-sm text-red-400">{form.addError}</p>
		{/if}
		<div class="mt-3 flex gap-2">
			<button type="submit" class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-400">Add</button>
			<button type="button" onclick={() => showAdd = false}
				class="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500">Cancel</button>
		</div>
	</form>
{/if}

<div class="space-y-2">
	{#each data.members as member}
		{@const vt = votesFor(member.id)}
		<div class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
			<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-500/20 text-sm font-bold shrink-0">
				{#if member.profilePic}
					<img src={member.profilePic} alt={member.name} class="h-full w-full object-cover" />
				{:else}
					{member.name[0]}
				{/if}
			</div>
			<div class="min-w-0 flex-1">
				<p class="font-medium truncate">{member.name}</p>
				<p class="text-xs text-zinc-400 truncate">{member.instrument} {instrumentEmoji(member.instrument)}{#if member.phone} &middot; {member.phone}{/if}</p>
			</div>
			{#if vt}
				<div class="flex items-center gap-2 shrink-0">
						<span class="text-xs text-zinc-400">{vt.count} vote{vt.count !== 1 ? 's' : ''}</span>
						<form method="POST" action="?/undoRemoveVote" class="contents">
							<input type="hidden" name="targetId" value={member.id} />
							<button type="submit" class="text-xs text-zinc-400 hover:text-amber-400 transition-colors">Undo</button>
						</form>
					</div>
				{:else}
					<button type="button" onclick={() => confirmRemove = member.id}
						class="text-xs text-red-400 hover:underline shrink-0">Remove</button>
				{/if}
		</div>
	{/each}
</div>

{#if confirmRemove}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => confirmRemove = null}>
		<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="mb-2 text-lg font-bold text-red-400">Vote to Remove?</h3>
			<p class="mb-4 text-sm text-zinc-400">You are voting to remove this band member. If {Math.max(2, data.totalMembers - 2)} other member{Math.max(2, data.totalMembers - 2) !== 1 ? 's' : ''} also vote, they will be removed.</p>
			<div class="flex gap-3">
				<form method="POST" action="?/proposeRemove" class="contents">
					<input type="hidden" name="targetId" value={confirmRemove} />
					<button type="submit" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-500">Vote to Remove</button>
				</form>
				<button type="button" onclick={() => confirmRemove = null}
					class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">Cancel</button>
			</div>
		</div>
	</div>
{/if}
