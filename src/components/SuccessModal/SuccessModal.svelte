<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { modalStyles } from '../Modal/tools';
	import { dialog, title, message, callData } from './showSuccessModal';

	let showTooltip = false;
</script>

<Dialog bind:dialog={$dialog} title={$title}>
	<output class={modalStyles.output}>
		{$message}
	</output>

	{#if $callData}
		<p class="my-3 text-sm">
			Copy and share the call data with the other signatories of the curator multisig. They can then
			confirm the transaction by pasting it in a multisig management tool, like Multix or Mimir.
		</p>
		<div class="flex items-center">
			<p>Call Data:</p>
			<button
				onclick={async () => {
					await navigator.clipboard.writeText($callData);
					showTooltip = true;
					setTimeout(() => {
						showTooltip = false;
					}, 1500);
				}}
				class="ml-2"
			>
				<span class="material-symbols-outlined place-self-center mb-1 text-lg">content_copy</span>
			</button>

			<div class="flex z-50">
				{#if showTooltip}
					<div
						class="tooltip show absolute bg-backgroundButtonDark text-white rounded text-sm py-1 px-2 z-50"
					>
						Copied to clipboard
					</div>
				{/if}
			</div>
		</div>
		<div
			class="mt-1 bg-lightGray max-w-[400px] max-h-[100px] overflow-y-scroll break-all rounded-md p-2"
		>
			<p>{$callData}</p>
		</div>
	{/if}
</Dialog>

<style>
	.tooltip {
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	.tooltip.show {
		opacity: 1;
	}
</style>
