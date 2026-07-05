<script lang="ts">
	import { page } from '$app/stores';

	let { data, form } = $props();
	let title = $state(data.config.heroTitle);
	let subtitle = $state(data.config.heroSubtitle);
	let heroImage = $state(data.config.heroImage);
	let instagram = $state(data.config.instagram || '');
	let facebook = $state(data.config.facebook || '');
	let youtube = $state(data.config.youtube || '');
	let spotify = $state(data.config.spotify || '');
	let uploading = $state(false);
	let theme = $state($page.data.theme || 'funk');

	async function uploadBg(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
		uploading = true;
		const f = new FormData();
		f.append('file', file);
		try {
			const res = await fetch('/api/upload', { method: 'POST', body: f });
			const result = await res.json();
			if (result.url) heroImage = result.url;
		} catch {}
		uploading = false;
		input.value = '';
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Site Settings</h1>

{#if form?.success}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Saved!</p>
{/if}

<form method="POST" action="?/save" class="space-y-6">
	<div>
		<label for="heroTitle" class="mb-1 block text-sm text-zinc-400">Hero Title</label>
		<input type="text" id="heroTitle" name="heroTitle" bind:value={title}
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
	</div>
	<div>
		<label for="heroSubtitle" class="mb-1 block text-sm text-zinc-400">Hero Subtitle</label>
		<textarea id="heroSubtitle" name="heroSubtitle" rows="3" bind:value={subtitle}
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"></textarea>
	</div>
	<div>
		<label class="mb-1 block text-sm text-zinc-400">Hero Background Image</label>
		<div class="flex items-center gap-3">
			{#if heroImage}
				<img src={heroImage} alt="Hero bg" class="h-16 w-24 rounded object-cover" />
			{/if}
			<label class="relative inline-flex cursor-pointer rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400">
				{uploading ? 'Uploading...' : heroImage ? 'Change Image' : 'Upload Image'}
				<input type="file" accept="image/*" class="absolute inset-0 opacity-0" onchange={uploadBg} />
			</label>
			{#if heroImage}
				<button type="button" onclick={() => heroImage = ''}
					class="rounded border border-red-700 px-3 py-1 text-sm text-red-400 hover:bg-red-900/20">Remove</button>
			{/if}
		</div>
		<input type="hidden" name="heroImage" value={heroImage} />
		<p class="mt-1 text-xs text-zinc-500">Leave blank for the default gradient background.</p>
	</div>

	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h3 class="mb-3 text-sm font-medium text-zinc-400">Social Media Links</h3>
		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<label for="instagram2" class="mb-1 block text-xs text-zinc-500">Instagram URL</label>
				<input type="text" id="instagram2" name="instagram" bind:value={instagram} placeholder="https://instagram.com/..."
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="facebook2" class="mb-1 block text-xs text-zinc-500">Facebook URL</label>
				<input type="text" id="facebook2" name="facebook" bind:value={facebook} placeholder="https://facebook.com/..."
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="youtube2" class="mb-1 block text-xs text-zinc-500">YouTube URL</label>
				<input type="text" id="youtube2" name="youtube" bind:value={youtube} placeholder="https://youtube.com/..."
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
			</div>
			<div>
				<label for="spotify2" class="mb-1 block text-xs text-zinc-500">Spotify URL</label>
				<input type="text" id="spotify2" name="spotify" bind:value={spotify} placeholder="https://spotify.com/..."
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
			</div>
		</div>
		<p class="mt-1 text-xs text-zinc-500">Leave blank to hide a link from the footer.</p>
	</div>

	<button type="submit"
		class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400">
		Save Settings
	</button>
</form>

<div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
	<label class="mb-1 block text-sm text-zinc-400">Site Theme</label>
	<form method="POST" action="/theme" class="flex items-center gap-2 mt-2">
		<select name="theme" bind:value={theme} onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.submit()}
			class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500 focus:outline-none">
			<option value="funk">&#127927; 70s Funk</option>
			<option value="christmas">&#127876; Christmas</option>
			<option value="dark">&#127769; Dark Mode</option>
		</select>
	</form>
</div>
