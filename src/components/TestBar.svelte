<script lang="ts">
	import { onMount } from 'svelte';

	import { dotApi, nodeEndpoint, showAllBounties, showAllCuratorOptions } from '../stores';
	import { createTypedApi } from '../utils/polkadot';

	onMount(() => {
		let node = sessionStorage.getItem('node');
		if (node) {
			nodeEndpoint.set(node);
			dotApi.set(createTypedApi(node));
		}
	});

	function onChange(this: HTMLSelectElement) {
		sessionStorage.setItem('node', this.value);
		window.location.reload();
	}
</script>

<div class="w-100">
	<select
		class="border full rounded-md h-7 px-1 pt-1"
		bind:value={$nodeEndpoint}
		on:change={onChange}
		name="spenders"
		id="spenders"
	>
		<option value="wss://chopsticks.rust-2.kilt.io">wss://chopsticks.rust-2.kilt.io</option>
		<option value="ws://localhost:8000">ws://localhost:8000</option>
	</select>
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
