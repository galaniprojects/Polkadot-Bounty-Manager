<script lang="ts">
	import { onMount } from 'svelte';

	import { dotApi, nodeEndpoint, showAllBounties, showAllCuratorOptions } from '../stores';
	import { createTypedApi } from '../utils/polkadot';

	onMount(() => {
		const node = sessionStorage.getItem('node');
		if (node) {
			nodeEndpoint.set(node);
			dotApi.set(createTypedApi([node]));
		}
	});
</script>

<div class="w-100">
	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<p class="text-white">all bounties</p>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<p class="text-white">all options</p>
		</label>
	</div>
</div>
