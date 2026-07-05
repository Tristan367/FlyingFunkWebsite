<script lang="ts">
	import MapPicker from '$lib/components/MapPicker.svelte';

	let { data, form } = $props();

	let date = $state(data.gig.date);
	let time = $state(data.gig.time);
	let venue = $state(data.gig.venue);
	let venueAddress = $state(data.gig.venueAddress);
	let description = $state(data.gig.description);
	let customerName = $state(data.gig.customerName);
	let customerEmail = $state(data.gig.customerEmail);
	let customerPhone = $state(data.gig.customerPhone);
	let rate = $state(data.gig.rate);
	let notes = $state(data.gig.notes);
	let withHorns = $state(data.gig.withHorns);
	let isPrivate = $state(data.gig.private);
	let distances = $state<Array<{ name: string; address: string; miles: number | null; minutes: number | null }>>([]);
	let distancesLoading = $state(false);
	let venueAddrInput: HTMLInputElement | null = $state(null);

	let mapQuery = $derived(venueAddress || venue);
	let showDelete = $state(false);

	async function castVote(vote: string) {
		const body = new URLSearchParams({ gigId: data.gig.id, vote });
		await fetch('/admin/gigs?/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body
		});
		window.location.reload();
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Gig</h1>

{#if form?.saveSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Saved!</p>
{/if}

<div class="mb-6 flex items-center justify-between gap-2">
	<a href="/admin/gigs" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">&larr; All Gigs</a>
	<button type="submit" form="gig-edit-form"
		class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">
		Save Changes
	</button>
</div>

<form method="POST" action="?/save" class="space-y-4" id="gig-edit-form" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
	<div class="grid gap-4 sm:grid-cols-4">
		<div>
			<label for="edit-date" class="mb-1 block text-sm text-zinc-400">Date</label>
			<input type="date" id="edit-date" name="date" bind:value={date} required
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="edit-time" class="mb-1 block text-sm text-zinc-400">Time</label>
			<input type="text" id="edit-time" name="time" bind:value={time}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="edit-rate" class="mb-1 block text-sm text-zinc-400">Rate</label>
			<input type="text" id="edit-rate" name="rate" bind:value={rate}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div class="flex items-end gap-4">
			<label class="flex items-center gap-2 pb-3 text-sm">
				<input type="checkbox" name="withHorns" bind:checked={withHorns} class="accent-amber-500" />
				<span class="text-zinc-400">With horns</span>
			</label>
			<label class="flex items-center gap-2 pb-3 text-sm">
				<input type="checkbox" name="private" bind:checked={isPrivate} class="accent-amber-500" />
				<span class="text-zinc-400">Private</span>
			</label>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="edit-venue" class="mb-1 block text-sm text-zinc-400">Venue</label>
			<input type="text" id="edit-venue" name="venue" bind:value={venue} required
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label class="mb-1 block text-sm text-zinc-400">Venue Location</label>
			<MapPicker address={mapQuery} onSelect={(_lat: number, _lng: number, addr: string) => { venueAddress = addr; if (venueAddrInput) venueAddrInput.value = addr; }} />
			<input type="hidden" name="venueAddress" value={venueAddress} bind:this={venueAddrInput} />
			<div class="mt-2 flex flex-wrap items-center gap-2">
				<button type="button" onclick={() => {
					distances = [];
					distancesLoading = true;
					fetch(`/api/distances?gigId=${data.gig.id}&address=${encodeURIComponent(venueAddress || venue)}`)
						.then(r => r.json())
						.then(d => {
							distances = d.distances || [];
							distancesLoading = false;
						});
				}}
					class="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-amber-500 hover:text-amber-400">
					{distancesLoading ? 'Calculating...' : '\u2316 Calculate Drive Times'}
				</button>
				{#if distancesLoading}
					<span class="text-xs text-zinc-400">Working...</span>
				{:else if distances.length > 0}
					{@const withMiles = distances.filter((d: any) => d.miles != null)}
					{@const avgMiles = withMiles.length > 0 ? Math.round(withMiles.reduce((s: number, d: any) => s + d.miles, 0) / withMiles.length) : 0}
					{@const avgMins = withMiles.length > 0 ? Math.round(withMiles.reduce((s: number, d: any) => s + d.minutes, 0) / withMiles.length) : 0}
					<span class="text-xs text-zinc-400">
						Avg: {avgMiles} mi &middot; ~{avgMins} min
						&middot; Closest: {withMiles.reduce((a: any, b: any) => a.miles < b.miles ? a : b)?.name || 'n/a'}
						&middot; Furthest: {withMiles.reduce((a: any, b: any) => a.miles > b.miles ? a : b)?.name || 'n/a'}
					</span>
				{:else}
					<span class="text-xs text-zinc-400">Set a location on the map, then click to calculate.</span>
				{/if}
	</div>

	<div class="mt-6 border-t border-zinc-800 pt-4">
		<button type="button" onclick={() => showDelete = true}
			class="rounded border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Delete Gig</button>
	</div>
</div>

{#if showDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => showDelete = false}>
		<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="mb-2 text-lg font-bold text-red-400">Delete Gig?</h3>
			<p class="mb-4 text-sm text-zinc-400">This permanently removes the gig. This cannot be undone.</p>
			<div class="flex gap-3">
				<form method="POST" action="?/delete" class="contents">
					<button type="submit" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-500">Delete</button>
				</form>
				<button type="button" onclick={() => showDelete = false}
					class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">Cancel</button>
			</div>
		</div>
	</div>
{/if}
	</div>

	<div>
		<label for="edit-desc" class="mb-1 block text-sm text-zinc-400">Description</label>
		<textarea id="edit-desc" name="description" rows="3" bind:value={description}
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"></textarea>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="edit-customer" class="mb-1 block text-sm text-zinc-400">Customer Name</label>
			<input type="text" id="edit-customer" name="customerName" bind:value={customerName}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="edit-email" class="mb-1 block text-sm text-zinc-400">Customer Email</label>
			<input type="email" id="edit-email" name="customerEmail" bind:value={customerEmail}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
	</div>

	<div>
		<label for="edit-phone" class="mb-1 block text-sm text-zinc-400">Customer Phone</label>
		<input type="tel" id="edit-phone" name="customerPhone" bind:value={customerPhone}
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
	</div>

	<div>
		<label for="edit-notes" class="mb-1 block text-sm text-zinc-400">Internal Notes</label>
		<textarea id="edit-notes" name="notes" rows="2" bind:value={notes} placeholder="Notes for the band..."
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"></textarea>
	</div>

</form>

<!-- Status & Voting Section -->
<div class="mt-10 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
	<h2 class="mb-4 text-lg font-bold">Lineup{data.lineupCount ? ` (${data.lineupCount} needed)` : ''}</h2>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		{#each data.lineup as l}
			<div class="flex items-center gap-3 rounded border border-zinc-800 p-2 text-sm">
				<span class="text-zinc-400 w-20 shrink-0 capitalize">{l.instrument}</span>
				<span class={l.members.length > 0 ? 'text-zinc-200' : 'text-red-400'}>
					{l.members.length > 0 ? l.members.join(' / ') : 'Unfilled'}
				</span>
			</div>
		{/each}
	</div>
</div>

<!-- Status & Voting Section -->
<div class="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
	<h2 class="mb-4 text-lg font-bold">Status &amp; Voting</h2>

	<div class="mb-6 flex flex-wrap items-center gap-4">
		<span class="rounded-full px-3 py-1 text-xs font-medium
			{data.gig.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : ''}
			{data.gig.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
			{data.gig.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
		">
			{data.gig.status}
		</span>

		<form method="POST" action="?/status" class="contents">
			<input type="hidden" name="status" value="confirmed" />
			<button type="submit" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Confirm</button>
		</form>
		<form method="POST" action="?/status" class="contents">
			{#if data.gig.status === 'cancelled'}
				<input type="hidden" name="status" value="confirmed" />
				<button type="submit" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Uncancel</button>
			{:else}
				<input type="hidden" name="status" value="cancelled" />
				<button type="submit" class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Cancel</button>
			{/if}
		</form>
	</div>

	{#if data.gig.status === 'pending'}
	<div class="mb-6 border-t border-zinc-800 pt-4">
		<p class="mb-2 text-sm text-zinc-400">Cast your vote:</p>
		<div class="flex gap-2">
			<button type="button" onclick={() => castVote('approve')}
				class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Approve</button>
			<button type="button" onclick={() => castVote('abstain')}
				class="rounded bg-zinc-600 px-3 py-1 text-xs text-white hover:bg-zinc-500">Abstain</button>
			<button type="button" onclick={() => castVote('reject')}
				class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Reject</button>
		</div>
	</div>
	{/if}

	<!-- Mark all unavailable -->
	<div class="mb-6 border-t border-zinc-800 pt-4">
		{#if data.allMarkedOff}
			<form method="POST" action="?/undoAllUnavailable" class="contents">
				<button type="submit" class="rounded-lg border border-green-700 px-4 py-2 text-sm text-green-400 hover:bg-green-900/20">
					Undo: Remove auto-unavailability for all members on this date
				</button>
			</form>
			<p class="mt-1 text-xs text-zinc-600">All members are currently marked unavailable for {data.gig.date} (from this gig).</p>
		{:else}
			<form method="POST" action="?/markAllUnavailable" class="contents">
				<button type="submit" class="rounded-lg border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">
					Mark all members unavailable for this gig date
				</button>
			</form>
			<p class="mt-1 text-xs text-zinc-600">This blocks {data.gig.date} on everyone's calendar — prevents double-booking.</p>
		{/if}
	</div>

	<!-- Votes + Distances -->
	<h3 class="mb-3 text-sm font-medium text-zinc-400">Member Votes{#if distances.length}  &amp; Distances{/if}</h3>
	<div class="space-y-2">
		{#each data.members as member, i}
			{@const vote = data.memberVotes.get(member.id)}
			{@const dist = distances[i]}
			<div class="flex items-center gap-2 rounded-lg border border-zinc-800 p-2 text-sm">
				<span class="w-24 shrink-0 text-zinc-300">{member.name}</span>
				{#if vote}
					<span class="rounded-full px-2 py-0.5 text-xs
						{vote.vote === 'approve' ? 'bg-green-500/20 text-green-400' : ''}
						{vote.vote === 'reject' ? 'bg-red-500/20 text-red-400' : ''}
						{vote.vote === 'abstain' ? 'bg-zinc-500/20 text-zinc-400' : ''}
					">
						{vote.vote}
					</span>
				{:else}
					<span class="text-xs text-zinc-600">No vote</span>
				{/if}
				{#if dist?.miles != null}
					<span class="ml-auto text-xs text-zinc-400">{dist.miles} mi &middot; ~{dist.minutes} min</span>
				{:else if member.address}
					<span class="ml-auto text-xs text-zinc-500">{member.address}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
