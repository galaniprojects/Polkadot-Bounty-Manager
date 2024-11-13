<script lang="ts">
	import Dialog from './common/Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	export let url: string;

	function proceed() {
		dispatch('proceed');
	}
</script>

<Dialog bind:open title="EXTERNAL LINK">
	<div class="space-y-10">
		<p>You are now leaving the Bounty Manager</p>
		<div>
			<p>URL</p>
			<p>{url}</p>
		</div>
		<button on:click={proceed} class="w-full md:w-fit mt-10 h-12 button-popup">PROCEED</button>
	</div>
</Dialog>
