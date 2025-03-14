<script lang="ts">
	import Dialog from './common/Dialog.svelte';

	export let dialog: HTMLDialogElement;
	export let url: string;
	export let proceed: () => void;
</script>

<Dialog bind:dialog title="EXTERNAL LINK">
	<div class="space-y-10">
		<p>You are now leaving the Bounty Manager</p>
		<div>
			<p>URL</p>
			<p class="w-full break-words whitespace-normal">{url}</p>
		</div>
		<button
			on:click={proceed}
			class="w-full md:w-fit mt-10 h-12 px-10 rounded-md bg-backgroundButtonDark text-white"
		>
			PROCEED
		</button>
	</div>
</Dialog>
