<script lang="ts">
	interface Props {
		url?: string;
		title?: string;
	}

	let { url = typeof window !== 'undefined' ? window.location.href : '', title = '' }: Props = $props();
	let copied = $state(false);

	async function share() {
		if (navigator.share) {
			await navigator.share({ title, url });
		} else {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => copied = false, 2000);
		}
	}
</script>

<button type="button" onclick={share}
	class="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors">
	{copied ? 'Copied!' : 'Share'}
</button>
