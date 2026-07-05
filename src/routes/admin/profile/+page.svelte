<script lang="ts">
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import MapPicker from '$lib/components/MapPicker.svelte';

	let { data, form } = $props();

	let name = $state(data.member.name);
	let instrument = $state(data.member.instrument);
	let instruments = $state(data.member.instruments || data.member.instrument);
	let address = $state(data.member.address);
	let slug = $state(data.member.slug);
	let bio = $state(data.member.bio);
	let profilePic = $state(data.member.profilePic);
	let uploading = $state(false);
	let addrInput: HTMLInputElement | null = $state(null);

	async function uploadProfilePic(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
		uploading = true;
		const f = new FormData();
		f.append('file', file);
		try {
			const res = await fetch('/api/upload', { method: 'POST', body: f });
			const result = await res.json();
			if (result.url) profilePic = result.url;
			else alert(result.error || 'Upload failed');
		} catch { alert('Upload failed'); }
		uploading = false;
		input.value = '';
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Your Profile</h1>

{#if form?.success}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Profile saved!</p>
{/if}

<div class="mb-6 flex justify-end">
	<button type="submit" form="profile-form"
		class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">
		Save Profile
	</button>
</div>

<form method="POST" action="?/save" class="space-y-6" id="profile-form" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
	<!-- Profile Pic -->
	<div>
		<label class="mb-1 block text-sm text-zinc-400">Profile Picture</label>
		<div class="flex items-center gap-4">
			{#if profilePic}
				<img src={profilePic} alt="Profile" class="h-20 w-20 rounded-full border-2 border-zinc-700 object-cover" />
			{:else}
				<div class="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 text-zinc-600">
					<span class="text-2xl">{name[0] || '?'}</span>
				</div>
			{/if}
			<div>
				<label class="relative inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400">
					{uploading ? 'Uploading...' : 'Upload Photo'}
					<input type="file" accept="image/*" class="hidden" onchange={uploadProfilePic} disabled={uploading} />
				</label>
				<p class="mt-1 text-xs text-zinc-600">Square photos work best. Max 5MB.</p>
			</div>
		</div>
		<input type="hidden" name="profilePic" value={profilePic} />
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="name" class="mb-1 block text-sm text-zinc-400">Name</label>
			<input type="text" id="name" name="name" bind:value={name} required
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="instrument" class="mb-1 block text-sm text-zinc-400">Primary Instrument</label>
			<input type="text" id="instrument" name="instrument" bind:value={instrument}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
	</div>

	<div>
		<label for="instruments" class="mb-1 block text-sm text-zinc-400">All Instruments You Play</label>
		<input type="text" id="instruments" name="instruments" bind:value={instruments} placeholder="guitar, bass"
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
		<p class="mt-1 text-xs text-zinc-600">Comma-separated list of every instrument you can play. Used to determine if the band has enough coverage for a gig.</p>
	</div>

	<div>
		<label class="mb-1 block text-sm text-zinc-400">Your Location</label>
		<MapPicker address={address} onSelect={(_lat: number, _lng: number, addr: string) => { address = addr; if (addrInput) addrInput.value = addr; }} />
		<input type="hidden" name="address" value={address} bind:this={addrInput} />
		<p class="mt-1 text-xs text-zinc-600">Search for your city or neighborhood. Used to calculate how far you are from gigs.</p>
	</div>

	<div>
		<label for="slug" class="mb-1 block text-sm text-zinc-400">Profile Page Address</label>
		<div class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
			<span class="text-sm text-zinc-600">flyingfunk.com/</span>
			<input type="text" id="slug" name="slug" bind:value={slug} placeholder="your-name"
				class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none" />
		</div>
		<p class="mt-1 text-xs text-zinc-600">This becomes the web address for your profile. Use your first name. Leave blank to be unlisted.</p>
	</div>

	<div>
		<label class="mb-1 block text-sm text-zinc-400">Bio</label>
		<RichTextEditor content={bio} onUpdate={(html: string) => bio = html} placeholder="Tell your story..." />
		<input type="hidden" name="bio" value={bio} />
	</div>

</form>
