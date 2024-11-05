<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../PolkadotIcon.svelte';

	export let bounty: Bounty;
	export let status: string;
	export let isParentExpanded: boolean;

	let copiedLast = false;

	async function copyToClipboard(text: string | undefined) {
		if (!text) {
			console.error('No text to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			copiedLast = true;
			setTimeout(() => {
				copiedLast = false;
			}, 1500);
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}
</script>

<div class="text-white max-h-fit p-5 lg:px-10 w-full">
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl lg:text-2xl">
				#{`${bounty.id}`}
				{`${bounty.description}`}
			</span>
		</div>

		<button
			on:click={() => (isParentExpanded = !isParentExpanded)}
			class="material-symbols-outlined text-white text-3xl self-start pt-3"
		>
			{#if isParentExpanded}
				keyboard_arrow_up
			{:else}
				keyboard_arrow_down
			{/if}
		</button>
	</div>

	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:mt-0">
			<section class="flex justify-center items-center space-x-1 lg:w-52">
				<p>Proposer:</p>
				<button
					class="flex space-x-1"
					on:click={() => {
						copyToClipboard(bounty.proposer);
					}}
				>
					<div class="h-4 w-4">
						<PolkadotIcon address={bounty.proposer} />
					</div>
					<span>{truncateString(bounty.proposer, 8)}</span>
					<span class="material-symbols-outlined place-self-center mb-1"> content_copy </span>
					{#if copiedLast}
						<div
							class="tooltip show absolute bg-primary text-white rounded text-sm py-1 px-2 z-50 mt-5"
						>
							copied to clipboard
						</div>
					{/if}
				</button>
			</section>
			<section class="flex space-x-1 lg:w-52">
				<p>Status:</p>
				<p>{status}</p>
			</section>
		</div>
	</div>
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
