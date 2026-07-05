<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();
</script>

<div class="mx-auto max-w-4xl px-4 py-6 lg:py-10">
	{#if $page.route.id !== '/admin'}
		<a href="/admin" class="mb-6 inline-block text-sm text-amber-400 hover:underline">&larr; Back to Dashboard</a>
	{/if}
	<main>
		{@render children()}
	</main>
</div>
