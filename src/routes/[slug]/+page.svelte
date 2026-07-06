<script lang="ts">
	import { executeScripts } from '$lib/actions/scripts';

	let { data } = $props();
</script>

<article use:executeScripts class="prose prose-invert prose-amber max-w-none">
	{@html data.member.bio}
</article>
