<script lang="ts">
	import { onMount } from 'svelte';

	import { nodeEndpoint, showAllBounties, showAllCuratorOptions } from '../stores';
	import { initializeApi } from '../utils/initializeApi';

	onMount(async () => {
		const node = sessionStorage.getItem('node');
		if (node) {
			nodeEndpoint.set(node);
			await initializeApi([node]);
		}
	});
</script>

<div class="w-100">
	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<p class="text-textPrimary">all bounties</p>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<p class="text-textPrimary">all options</p>
		</label>
	</div>
</div>
