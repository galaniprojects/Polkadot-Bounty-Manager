<script lang="ts">
	import Dialog from './common/Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	export let url: string;
	export let backgroundColor: string = 'curatorMainBackground';
	export let textColor: string = 'white';
	export let buttonStyle: string = 'bg-white text-accent';

	function proceed() {
		dispatch('proceed');
	}
</script>

<Dialog bind:open title="EXTERNAL LINK" {backgroundColor} {textColor}>
	<div class="space-y-10">
		<p>You are now leaving the Bounty Manager</p>
		<div>
			<p>URL</p>
			<p class="w-full break-words whitespace-normal">{url}</p>
		</div>
		<button on:click={proceed} class="w-full md:w-fit mt-10 h-12 px-10 rounded-md {buttonStyle}"
			>PROCEED</button
		>
	</div>
</Dialog>
