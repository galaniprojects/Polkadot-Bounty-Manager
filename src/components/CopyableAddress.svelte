<script lang="ts">
	import { truncateString } from '../utils/common';
	import PolkadotIcon from './PolkadotIcon.svelte';

	let showTooltip = false;
	export let address: string | undefined;

	async function copyToClipboard(text: string | undefined) {
		if (!text) {
			console.error('No text to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			showTooltip = true;
			setTimeout(() => {
				showTooltip = false;
			}, 1500);
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}
</script>

{#if address}
	<button
		class="flex space-x-1 justify-center items-center"
		on:click={() => {
			copyToClipboard(address);
		}}
	>
		<div class="h-4 w-4">
			<PolkadotIcon {address} />
		</div>
		<span>{truncateString(address, 8)}</span>
		<span class="material-symbols-outlined place-self-center mb-1"> content_copy </span>
	</button>
	<div class="w-80">
		<div class="flex z-50">
			{#if showTooltip}
				<div class="tooltip show absolute bg-primary text-white rounded text-sm py-1 px-2 z-50">
					Copied to clipboard
				</div>
			{/if}
		</div>

		<style>
			.tooltip {
				opacity: 0;
				transition: opacity 0.2s ease-in-out;
			}
			.tooltip.show {
				opacity: 1;
			}
		</style>
	</div>
{:else}
	<p>-</p>
{/if}
