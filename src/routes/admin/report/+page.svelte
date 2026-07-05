<script lang="ts">
	let { data } = $props();
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">{data.year} Report</h1>

<div class="mb-10 grid gap-4 sm:grid-cols-2">
	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
		<p class="text-sm text-zinc-400">Total Gigs</p>
		<p class="text-3xl font-black text-amber-400">{data.totalGigs}</p>
	</div>
	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
		<p class="text-sm text-zinc-400">Total Revenue</p>
		<p class="text-3xl font-black text-green-400">${data.totalRevenue.toLocaleString()}</p>
	</div>
</div>

{#if data.byMonth.length > 0}
	<h2 class="mb-4 text-lg font-bold text-zinc-300">By Month</h2>
	<div class="mb-10 overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead>
				<tr class="border-b border-zinc-800 text-zinc-400">
					<th class="py-2 pr-4">Month</th>
					<th class="py-2 pr-4 text-right">Gigs</th>
					<th class="py-2 text-right">Revenue</th>
				</tr>
			</thead>
			<tbody>
				{#each data.byMonth as m}
					<tr class="border-b border-zinc-800/50">
						<td class="py-2 pr-4">{new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
						<td class="py-2 pr-4 text-right">{m.count}</td>
						<td class="py-2 text-right">${m.revenue.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<h2 class="mb-4 text-lg font-bold text-zinc-300">All Gigs</h2>
<div class="space-y-2">
	{#each data.gigs as gig}
		<a href="/admin/gigs/{gig.id}" class="block rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-amber-500/50">
			<div class="flex items-center justify-between">
				<div>
					<span class="font-medium">{gig.venue}</span>
					<span class="ml-2 text-xs text-zinc-400">{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
				</div>
				<span class="text-sm text-amber-400">{gig.rate}</span>
			</div>
		</a>
	{/each}
	{#if data.gigs.length === 0}
		<p class="text-zinc-400">No gigs this year yet.</p>
	{/if}
</div>
