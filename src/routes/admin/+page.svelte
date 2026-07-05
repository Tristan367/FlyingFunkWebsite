<script lang="ts">
	let { data } = $props();
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Dashboard</h1>

{#if data.pending?.length > 0}
	<div class="mb-10">
		<h2 class="mb-4 text-lg font-bold text-yellow-400">Pending Requests</h2>
		<div class="space-y-3">
			{#each data.pending as gig}
				<a href="/admin/gigs/{gig.id}" class="block rounded-lg border border-yellow-700/50 bg-zinc-900 p-4 transition-colors hover:border-yellow-500/50">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-bold">{gig.venue}</h3>
							<p class="text-xs text-zinc-400">
								{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
								{#if gig.time} &middot; {gig.time}{/if}
							</p>
						</div>
						<span class="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">pending</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}

{#if data.upcoming?.length > 0}
	<div class="mb-10">
		<h2 class="mb-4 text-lg font-bold text-zinc-300">Upcoming Gigs</h2>
		<div class="space-y-3">
			{#each data.upcoming as gig}
				<a href="/admin/gigs/{gig.id}" class="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-amber-500/50">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-bold">{gig.venue}</h3>
							<p class="text-xs text-zinc-400">
								{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
								{#if gig.time} &middot; {gig.time}{/if}
							</p>
						</div>
						<span class="rounded-full px-2 py-0.5 text-xs font-medium
							{gig.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : ''}
							{gig.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}">
							{gig.status}
						</span>
					</div>
				</a>
			{/each}
		</div>
		<hr class="mt-8 border-zinc-800" />
	</div>
{/if}

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	<a href="/admin/profile" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">My Profile</h2>
		<p class="text-xs text-zinc-400">Edit your bio, profile pic, instruments, and location.</p>
	</a>
	<a href="/admin/availability" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Availability</h2>
		<p class="text-xs text-zinc-400">Set dates you can't play. Bulk tools for recurring days and ranges.</p>
	</a>
	<a href="/admin/blog" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Blog Posts</h2>
		<p class="text-xs text-zinc-400">Write and publish blog posts with the rich text editor.</p>
	</a>
	<a href="/admin/gigs" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Gigs</h2>
		<p class="text-xs text-zinc-400">Manage bookings, vote on pending requests, edit gig details.</p>
	</a>
	<a href="/admin/songs" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Songs</h2>
		<p class="text-xs text-zinc-400">Upload recordings, pin favorites to the public music page.</p>
	</a>
	<a href="/admin/members" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Members</h2>
		<p class="text-xs text-zinc-400">View and add band members. Everyone has equal admin access.</p>
	</a>
	<a href="/admin/report" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Year Report</h2>
		<p class="text-xs text-zinc-400">Annual gig summary with total revenue, monthly breakdowns.</p>
	</a>
	<a href="/admin/notifications" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Notifications</h2>
		<p class="text-xs text-zinc-400">Choose which events you get emailed about.</p>
	</a>
	<a href="/admin/config" class="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/50">
		<h2 class="mb-1 font-bold">Site Settings</h2>
		<p class="text-xs text-zinc-400">Customize the homepage title, subtitle, and background image.</p>
	</a>
</div>

<div class="mt-10">
	<form method="POST" action="/logout">
		<button type="submit" class="rounded border border-zinc-700 px-4 py-2 text-sm text-red-400 transition-colors hover:border-red-700 hover:bg-red-900/20">Log Out</button>
	</form>
</div>
