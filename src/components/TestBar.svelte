<script>
	import { onMount } from 'svelte';

	import { nodeEndpoint } from '../stores';
	onMount(() => {
		let node = sessionStorage.getItem('node');
		if (node) {
			nodeEndpoint.set(node);
		}
	});
</script>

<div class="relative z-50">
	<select
		class="border full rounded-md h-7 px-1 pt-1"
		bind:value={$nodeEndpoint}
		on:change={() => {
			sessionStorage.setItem('node', $nodeEndpoint);
			window.location.reload();
		}}
		name="spenders"
		id="spenders"
	>
		<option value="wss://chopsticks.rust-2.kilt.io">wss://chopsticks.rust-2.kilt.io</option>
		<option value="ws://localhost:8000">ws://localhost:8000</option>
	</select>
</div>
