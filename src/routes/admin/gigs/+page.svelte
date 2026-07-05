<script lang="ts">
	let { data, form } = $props();

	let adding = $state(false);
	let addDate = $state('');
	let addTime = $state('');
	let addVenue = $state('');
	let addDesc = $state('');
	let addRate = $state('$1000');
	let expandedVote = $state<string | null>(null);

	let pendingGigs = $derived(data.gigs.filter((g: any) => g.status === 'pending'));
	let confirmedGigs = $derived(data.gigs.filter((g: any) => g.status === 'confirmed'));
	let cancelledGigs = $derived(data.gigs.filter((g: any) => g.status === 'cancelled'));

	async function castVote(gigId: string, vote: string) {
		const body = new URLSearchParams({ gigId, vote });
		await fetch('?/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body
		});
		window.location.reload();
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Manage Gigs</h1>

{#if form?.voteSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Vote recorded!</p>
{/if}

<!-- Add Gig -->
{#if adding}
	<form method="POST" action="?/add" class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h2 class="mb-3 text-lg font-bold">Add Gig</h2>
		<div class="grid gap-3 sm:grid-cols-3">
			<div>
				<label for="add-date" class="mb-1 block text-xs text-zinc-500">Date</label>
				<input type="date" id="add-date" name="date" required bind:value={addDate}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="add-time" class="mb-1 block text-xs text-zinc-500">Time</label>
				<input type="text" id="add-time" name="time" bind:value={addTime} placeholder="8:00 PM"
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="add-venue" class="mb-1 block text-xs text-zinc-500">Venue</label>
				<input type="text" id="add-venue" name="venue" required bind:value={addVenue}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="add-rate" class="mb-1 block text-xs text-zinc-500">Rate</label>
				<input type="text" id="add-rate" name="rate" bind:value={addRate}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
			<div class="sm:col-span-2">
				<label for="add-desc" class="mb-1 block text-xs text-zinc-500">Description</label>
				<input type="text" id="add-desc" name="description" bind:value={addDesc}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
			</div>
		</div>
		<div class="mt-3 flex gap-2">
			<button type="submit" class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-400">Add</button>
			<button type="button" onclick={() => (adding = false)} class="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500">Cancel</button>
		</div>
	</form>
{:else}
	<button onclick={() => (adding = true)} class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">
		Add Gig
	</button>
{/if}

<!-- Pending Requests -->
{#if pendingGigs.length > 0}
	<section class="mb-8">
		<h2 class="mb-4 text-xl font-bold text-yellow-400">Pending Requests ({pendingGigs.length})</h2>
		<div class="space-y-3">
			{#each pendingGigs as gig}
				<div class="rounded-lg border border-yellow-700/50 bg-zinc-900 transition-colors hover:border-yellow-500/50">
					<a href="/admin/gigs/{gig.id}" class="block cursor-pointer p-4">
						<div>
							<h3 class="font-bold">{gig.venue}</h3>
							<p class="text-sm text-zinc-400">
								{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
								{#if gig.time} &middot; {gig.time}{/if}
								{#if !gig.withHorns}<span class="ml-1 text-xs text-zinc-600">(no horns)</span>{/if}
							</p>
						</div>
						{#if gig.customerName}
							<p class="text-sm text-zinc-500">Requested by: {gig.customerName} ({gig.customerEmail})</p>
						{/if}
						<p class="mt-1 text-right text-sm text-yellow-400">{gig.rate.startsWith('$') ? gig.rate : '$' + gig.rate}</p>
					</a>
					<div class="border-t border-zinc-800 px-4 py-3">
						<button
							type="button"
							onclick={() => expandedVote = expandedVote === gig.id ? null : gig.id}
							class="text-xs text-amber-400 hover:underline"
						>
							{gig.votes.approve + gig.votes.reject + gig.votes.abstain} votes
							({gig.votes.approve} approve, {gig.votes.reject} reject)
							{#if gig.votes.myVote} &mdash; You voted: {gig.votes.myVote}{/if}
						</button>
						{#if expandedVote === gig.id}
							<div class="mt-3 space-y-2 rounded-lg border border-zinc-800 p-3">
								<div class="flex gap-2">
									<button type="button" onclick={() => castVote(gig.id, 'approve')}
										class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Approve</button>
									<button type="button" onclick={() => castVote(gig.id, 'abstain')}
										class="rounded bg-zinc-600 px-3 py-1 text-xs text-white hover:bg-zinc-500">Abstain</button>
									<button type="button" onclick={() => castVote(gig.id, 'reject')}
										class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Reject</button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Confirmed Gigs -->
<section class="mb-8">
	<h2 class="mb-4 text-xl font-bold text-green-400">Confirmed ({confirmedGigs.length})</h2>
	<div class="space-y-3">
		{#each confirmedGigs as gig}
			<a href="/admin/gigs/{gig.id}" class="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-amber-500/50">
				<div>
					<h3 class="font-bold">{gig.venue}</h3>
					<p class="text-sm text-zinc-400">
						{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
						{#if gig.time} &middot; {gig.time}{/if}
						{#if !gig.withHorns}<span class="ml-1 text-xs text-zinc-600">(no horns)</span>{/if}
					</p>
				</div>
				{#if gig.customerName}
					<p class="mt-1 text-sm text-zinc-500">Booked by: {gig.customerName}</p>
				{/if}
				<p class="mt-2 text-right text-sm text-green-400">{gig.rate.startsWith('$') ? gig.rate : '$' + gig.rate}</p>
			</a>
		{/each}
		{#if confirmedGigs.length === 0}
			<p class="text-sm text-zinc-500">No confirmed gigs.</p>
		{/if}
	</div>
</section>

<!-- Cancelled -->
{#if cancelledGigs.length > 0}
	<section>
		<h2 class="mb-4 text-xl font-bold text-red-400">Cancelled ({cancelledGigs.length})</h2>
		<div class="space-y-3">
			{#each cancelledGigs as gig}
				<a href="/admin/gigs/{gig.id}" class="block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-bold text-zinc-500 line-through">{gig.venue}</h3>
							<p class="text-sm text-zinc-600">
								{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
							</p>
						</div>
						<span class="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">cancelled</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}
