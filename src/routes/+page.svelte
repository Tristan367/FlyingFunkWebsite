<script lang="ts">
	import { instrumentEmoji } from '$lib/utils/instruments';
	import { onMount } from 'svelte';

	let { data } = $props();

	let copiedGig = $state<string | null>(null);
	let scrollY = $state(0);
	let heroVisible = $state(false);

	onMount(() => {
		heroVisible = true;

		function onScroll() {
			scrollY = window.scrollY;
		}
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});

	async function copyAddress(addr: string, gigId: string) {
		await navigator.clipboard.writeText(addr);
		copiedGig = gigId;
		setTimeout(() => copiedGig = null, 2000);
	}
</script>

<svelte:head>
	{@html `<!-- home-animations -->`}
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden {data.config.heroImage ? 'bg-zinc-950' : 'bg-gradient-to-b from-amber-500/10 to-zinc-950'} py-32 sm:py-48">
	<div class="absolute inset-0 opacity-20" style="background:linear-gradient(135deg,#f59e0b22 0%,transparent 25%,#f59e0b11 50%,transparent 75%,#f59e0b22 100%);background-size:400% 400%;animation:heroShift 12s ease-in-out infinite"></div>
	{#if data.config.heroImage}
		<div class="absolute inset-0 flex items-center justify-center">
			<div style="width:1200px;height:100%;position:relative">
				<img src={data.config.heroImage} alt="" style="width:1200px;height:120%;object-fit:cover;display:block;transform:translateY({-scrollY * 0.15}px);will-change:transform" />
				<div style="position:absolute;inset:-1px;background:linear-gradient(to right,var(--bg-color,#09090b) 0%,transparent 15%,transparent 85%,var(--bg-color,#09090b) 100%),linear-gradient(to bottom,var(--bg-color,#09090b) 0%,transparent 15%,transparent 85%,var(--bg-color,#09090b) 100%)"></div>
			</div>
		</div>
	{/if}
	<div class="relative mx-auto max-w-4xl px-4 text-center {heroVisible ? 'opacity-100' : 'opacity-0'}" style="transition:opacity 0.8s ease-out">
		<h1 class="mb-4 text-6xl font-black tracking-tight text-amber-400 {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}" style="text-shadow:0 0 16px rgba(0,0,0,1),0 0 4px rgba(0,0,0,1);transition:all 0.6s ease-out 0.1s">{data.config.heroTitle}</h1>
		<p class="mb-10 max-w-xl mx-auto text-base leading-relaxed text-zinc-300 {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}" style="text-shadow:0 0 8px rgba(0,0,0,1),0 0 4px rgba(0,0,0,1);transition:all 0.6s ease-out 0.25s">
			{data.config.heroSubtitle}
		</p>
		<div class="flex justify-center {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}" style="transition:all 0.6s ease-out 0.4s">
			<a href="/book" class="rounded-lg bg-amber-500 px-8 py-3 font-bold text-zinc-900 shadow-lg shadow-black/60 transition-all hover:bg-amber-400 hover:shadow-amber-500/25 hover:scale-105">Book Us</a>
		</div>
	</div>
</section>

<!-- Music -->
{#if data.pinnedSongs.length > 0}
<section class="mx-auto max-w-4xl px-4 py-16">
	<h2 class="mb-8 text-center text-3xl font-bold text-amber-400">Music</h2>
	<div class="space-y-3">
		{#each data.pinnedSongs as song}
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
				<h3 class="font-bold mb-2">{song.title}</h3>
				<audio controls class="w-full" src={song.path}></audio>
			</div>
		{/each}
	</div>
	<a href="/songs" class="mt-4 inline-block text-sm text-amber-400 hover:underline">All songs &rarr;</a>
</section>
{:else}
<section class="mx-auto max-w-4xl px-4 py-16">
	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
		<h2 class="mb-2 text-3xl font-bold text-amber-400">Music</h2>
		<p class="mb-4 text-zinc-400">Check out our recordings and live performances.</p>
		<a href="/songs" class="inline-block rounded-lg bg-amber-500 px-8 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400 hover:scale-105">Listen</a>
	</div>
</section>
{/if}

<!-- Upcoming Gigs -->
{#if data.upcomingGigs.length > 0}
	<section class="mx-auto max-w-4xl px-4 py-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-amber-400">Upcoming Gigs</h2>
		<div class="space-y-4">
			{#each data.upcomingGigs as gig}
				<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<div class="mb-2">
						<h3 class="text-lg font-bold">{gig.venue}</h3>
						<p class="text-sm font-bold text-amber-400">
							{new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
							{#if gig.time} &middot; {gig.time}{/if}
							{#if !gig.withHorns} &middot; rhythm section{/if}
						</p>
					</div>
					{#if gig.description}
						<p class="text-zinc-400">{gig.description}</p>
					{/if}
					{#if gig.venueAddress}
						<div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<span class="text-sm text-zinc-400">{gig.venueAddress}</span>
							<div class="flex items-center justify-end gap-2 sm:justify-start">
								<button type="button" onclick={() => copyAddress(gig.venueAddress, gig.id)}
									class="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors">
									{copiedGig === gig.id ? 'Copied!' : 'Copy Address'}
								</button>
								<a href={'https://www.google.com/maps/search/' + encodeURIComponent(gig.venueAddress)} target="_blank"
									class="rounded border border-zinc-700 px-4 py-2 text-sm text-amber-400 hover:border-amber-500 transition-colors">Map</a>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- The Band -->
<section class="mx-auto max-w-6xl px-4 py-16">
	<h2 class="mb-8 text-center text-3xl font-bold text-amber-400">The Band</h2>
	<div class="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
		{#each data.members as member}
			{@const hasProfile = member.slug && member.bio}
			<a href={hasProfile ? '/' + member.slug : '#'}
				onclick={hasProfile ? undefined : (e: Event) => e.preventDefault()}
				class="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center transition-all duration-200 {hasProfile ? 'hover:border-amber-500/50 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/5' : 'cursor-default'}"
			>
				<div class="mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-amber-500/20">
					{#if member.profilePic}
						<img src={member.profilePic} alt={member.name} class="h-full w-full object-cover" />
					{:else}
						<span class="text-2xl">{member.name[0]}</span>
					{/if}
				</div>
				<p class="font-semibold">{member.name}</p>
				<p class="text-xs text-zinc-500">{member.instrument} {instrumentEmoji(member.instrument)}</p>
			</a>
		{/each}
	</div>
</section>

<!-- Latest Blog -->
{#if data.blogPosts.length > 0}
	<section class="mx-auto max-w-4xl px-4 py-16">
		<div class="mb-8">
			<h2 class="text-3xl font-bold text-amber-400">Latest from the Blog</h2>
			<a href="/blog" class="mt-2 inline-block text-sm text-amber-400 hover:underline">View all posts &rarr;</a>
		</div>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.blogPosts as post}
				<a href="/blog/{post.slug}" class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:border-amber-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/5">
					<h3 class="mb-2 font-bold text-amber-400">{post.title}</h3>
					<p class="text-sm text-zinc-500">
						by {post.authorName} &middot;
						{new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
					</p>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	@keyframes heroShift {
		0%, 100% { background-position: 0% 50%; }
		25% { background-position: 100% 0%; }
		50% { background-position: 100% 100%; }
		75% { background-position: 0% 100%; }
	}
</style>
