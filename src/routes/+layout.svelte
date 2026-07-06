<script lang="ts">
	import './layout.css';
	import SocialIcon from '$lib/components/SocialIcon.svelte';

	let { children, data } = $props();

	let navOpen = $state(false);
	let navNode: HTMLElement | null = $state(null);

	function closeNav() {
		navOpen = false;
	}

	// Close on any click outside the dropdown
	$effect(() => {
		if (!navOpen) return;
		function onClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (target.closest('[data-nav-toggle]')) return;
			if (navNode && !navNode.contains(target)) {
				navOpen = false;
			}
		}
		// Delay to avoid capturing the same click that opened it
		const id = setTimeout(() => document.addEventListener('click', onClick), 0);
		return () => {
			clearTimeout(id);
			document.removeEventListener('click', onClick);
		};
	});

	// Close on Escape
	$effect(() => {
		if (!navOpen) return;
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') navOpen = false;
		}
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<svelte:head>
	<title>Flying Funk — 70s Funk Cover Band</title>
	<meta name="description" content="Flying Funk — Bringing the groove of 70s funk to your event. Available for bookings!" />
</svelte:head>

<div data-theme={data.theme} class="flex min-h-screen flex-col bg-zinc-950 text-zinc-200">
	<nav class="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<a href="/" class="font-display text-xl sm:text-2xl tracking-tight text-amber-400">FLYING FUNK</a>

			<!-- Desktop nav -->
			<div class="hidden items-center gap-6 text-sm font-semibold sm:flex">
				<a href="/" class="transition-colors hover:text-amber-400">Home</a>
				<a href="/book" class="transition-colors hover:text-amber-400">Book Us</a>
				<a href="/blog" class="transition-colors hover:text-amber-400">Blog</a>
				<a href="/songs" class="transition-colors hover:text-amber-400">Music</a>
				{#if data.user}
					<a href="/admin" class="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-md">Admin</a>
				{:else}
					<a href="/login" class="transition-colors hover:text-amber-400">Login</a>
				{/if}
			</div>

			<!-- Mobile hamburger -->
			<button data-nav-toggle onclick={() => navOpen = !navOpen} class="text-3xl text-zinc-300 transition-transform duration-300 sm:hidden" style="transform:{navOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
				{navOpen ? '✕' : '☰'}
			</button>
		</div>

		<!-- Mobile dropdown -->
		{#if navOpen}
			<div class="fixed inset-0 z-40 bg-black/50"></div>
			<div bind:this={navNode} class="relative z-50 flex flex-col gap-3 border-t border-zinc-800 bg-zinc-950 px-4 py-4 text-base font-semibold sm:hidden">
				<a href="/" onclick={closeNav} class="transition-colors hover:text-amber-400">Home</a>
				<a href="/book" onclick={closeNav} class="transition-colors hover:text-amber-400">Book Us</a>
				<a href="/blog" onclick={closeNav} class="transition-colors hover:text-amber-400">Blog</a>
				<a href="/songs" onclick={closeNav} class="transition-colors hover:text-amber-400">Music</a>
				{#if data.user}
					<a href="/admin" onclick={closeNav} class="rounded-full bg-amber-500 px-4 py-1.5 text-center text-sm font-bold text-zinc-900">Admin</a>
				{:else}
					<a href="/login" onclick={closeNav} class="transition-colors hover:text-amber-400">Login</a>
				{/if}
			</div>
		{/if}
	</nav>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-zinc-800 bg-zinc-950 py-8">
		<div class="mx-auto max-w-6xl px-4 text-center">
			<p class="text-sm text-zinc-500">Flying Funk &copy; {new Date().getFullYear()} &mdash; Bringing the funk. Built by <span class="text-zinc-400">Tristan Johnson</span>.</p>
			{#if data.social?.instagram || data.social?.facebook || data.social?.youtube || data.social?.spotify}
			<div class="mt-3 flex justify-center gap-4">
				{#if data.social?.instagram}
					<a href={data.social.instagram} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Instagram"><SocialIcon platform="instagram" /></a>
				{/if}
				{#if data.social?.facebook}
					<a href={data.social.facebook} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Facebook"><SocialIcon platform="facebook" /></a>
				{/if}
				{#if data.social?.youtube}
					<a href={data.social.youtube} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="YouTube"><SocialIcon platform="youtube" /></a>
				{/if}
				{#if data.social?.spotify}
					<a href={data.social.spotify} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Spotify"><SocialIcon platform="spotify" /></a>
				{/if}
			</div>
			{/if}
		</div>
	</footer>
</div>
