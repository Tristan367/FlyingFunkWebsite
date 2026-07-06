<script lang="ts">
	import { player, type Song } from '$lib/stores/audio.svelte';

	let { data } = $props();

	const allSongs: Song[] = data.all;
	const displayList: Song[] = [...data.pinned, ...data.all.filter((s: Song) => !s.pinned)];

	function trackPlay(id: string) {
		fetch('/api/songs/play', { method: 'POST', body: new URLSearchParams({ id }) });
	}

	function onScrubInput(e: Event) {
		const t = (e.target as HTMLInputElement).valueAsNumber;
		player.seek(t);
	}

	function handlePlay(song: Song) {
		if (player.currentSong?.id === song.id) {
			player.togglePlayPause();
			return;
		}
		trackPlay(song.id);
		player.play(song, allSongs);
	}

	function formatTime(secs: number): string {
		if (!isFinite(secs) || secs < 0) return '0:00';
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-20">
	<h1 class="mb-6 text-4xl font-bold text-amber-400">Music</h1>

	<!-- Controls -->
	<div class="mb-4 flex flex-wrap items-center gap-3">
		<button
			onclick={() => player.shuffle = !player.shuffle}
			class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors {player.shuffle
				? 'border-amber-500 bg-amber-500/10 text-amber-400'
				: 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
		>
			Shuffle {player.shuffle ? 'ON' : 'OFF'}
		</button>
		<button
			onclick={() => player.autoPlay = !player.autoPlay}
			class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors {player.autoPlay
				? 'border-amber-500 bg-amber-500/10 text-amber-400'
				: 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
		>
			Auto-Play {player.autoPlay ? 'ON' : 'OFF'}
		</button>
	</div>

	<!-- Player -->
	{#if player.currentSong}
		<div class="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
			<div class="mb-2 flex items-center justify-between">
				<div class="min-w-0 flex-1">
					<p class="text-xs font-medium text-zinc-200 truncate">{player.currentSong.title}</p>
					<p class="text-[11px] text-zinc-500 truncate">{player.currentSong.uploaderName || 'Flying Funk'}</p>
				</div>
				<div class="ml-3 flex shrink-0 items-center gap-1">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-zinc-500">
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
					</svg>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={player.volume}
						oninput={(e) => player.setVolume((e.target as HTMLInputElement).valueAsNumber)}
						class="h-1 w-20 accent-amber-500 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
					/>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<button onclick={() => player.prev()}
					class="shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-200">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
						<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
					</svg>
				</button>
				<button onclick={() => player.togglePlayPause()}
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500 text-amber-400 hover:bg-amber-500/10">
					{#if player.isPlaying}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5">
							<rect x="6" y="4" width="4" height="16" rx="1" />
							<rect x="14" y="4" width="4" height="16" rx="1" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5">
							<path d="M8 5v14l11-7z" />
						</svg>
					{/if}
				</button>
				<button onclick={() => player.next()}
					class="shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-200">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
						<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
					</svg>
				</button>
				<div class="flex flex-1 items-center gap-2">
					<span class="text-[10px] tabular-nums text-zinc-500 w-8 text-right">
						{formatTime(player.currentTime)}
					</span>
					<input
						type="range"
						min="0"
						max={player.duration || 0}
						value={player.currentTime}
						oninput={onScrubInput}
						class="h-1 flex-1 appearance-none rounded bg-zinc-700 accent-amber-500 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-amber-400"
					/>
					<span class="text-[10px] tabular-nums text-zinc-500 w-8">
						{formatTime(player.duration)}
					</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Song list -->
	<div class="space-y-2">
		{#each displayList as song}
			{@const isCurrent = player.currentSong?.id === song.id}
			<div
				class="rounded-lg border p-3 transition-colors {isCurrent
					? 'border-amber-500/50 bg-amber-500/5'
					: 'border-zinc-800 bg-zinc-900'}"
			>
				<div class="flex items-center gap-3">
					<button
						onclick={() => handlePlay(song)}
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border {isCurrent && player.isPlaying
							? 'border-amber-500 bg-amber-500 text-zinc-900'
							: 'border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-400'}"
						aria-label={isCurrent && player.isPlaying ? 'Pause' : 'Play ' + song.title}
					>
						{#if isCurrent && player.isPlaying}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
								<rect x="6" y="4" width="4" height="16" rx="1" />
								<rect x="14" y="4" width="4" height="16" rx="1" />
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
								<path d="M8 5v14l11-7z" />
							</svg>
						{/if}
					</button>

					<div class="min-w-0 flex-1">
						<h3 class="text-sm font-bold {isCurrent ? 'text-amber-400' : ''} truncate">{song.title}</h3>
						<p class="text-xs text-zinc-500 truncate">
							{song.uploaderName}
							{song.uploaderName ? ' \u00b7 ' : ''}
							{new Date(song.uploadedAt).toLocaleDateString()}
							{#if song.pinned}
								<span class="ml-1 text-amber-500">&starf;</span>
							{/if}
						</p>
					</div>

					<a href={song.path} download
						class="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs text-amber-400 hover:border-amber-500 transition-colors">
						Download
					</a>
				</div>
				{#if song.description}
					<p class="mt-2 ml-[52px] text-xs text-zinc-500">{song.description}</p>
				{/if}
			</div>
		{/each}
		{#if displayList.length === 0}
			<p class="text-zinc-400">No music yet. Check back soon!</p>
		{/if}
	</div>
</div>
