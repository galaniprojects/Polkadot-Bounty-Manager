<script lang="ts">
	import { truncateString } from '../../utils/common';
	import PeopleChainName from '../PeopleChainName.svelte';
	import PolkadotIcon from './PolkadotIcon.svelte';

	export let address: string | undefined;
	export let name = '';
	export let showCopyIcon = true;

	let showTooltip = false;
	let tooltipX = 0;
	let tooltipY = 0;

	async function copyToClipboard(text: string | undefined, event: MouseEvent) {
		if (!text) {
			console.error('No text to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			tooltipX = event.clientX;
			tooltipY = event.clientY;

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
		class="account"
		type="button"
		onclick={async (event) => {
			await copyToClipboard(address, event);
		}}
	>
		<span class="identicon">
			<PolkadotIcon {address} />
		</span>

		<span>
			{#if name}
				{name}
			{:else}
				<PeopleChainName {address}>{truncateString(address, 8)}</PeopleChainName>
			{/if}
		</span>

		{#if showCopyIcon}
			<span class="material-symbols-outlined"> content_copy </span>
		{/if}

		{#if showTooltip}
			<div class="tooltip show" style="top: {tooltipY + 10}px; left: {tooltipX}px;">
				Copied to clipboard
			</div>
		{/if}
	</button>
{:else}
	<p>-</p>
{/if}

<style>
	.account {
		position: relative;
		display: flex;
		gap: 0.25rem;
	}

	.identicon {
		height: 1rem;
		width: 1rem;
	}

	.material-symbols-outlined {
		place-self: center;
		margin-bottom: 0.25rem;
		font-size: 14px;
	}

	.tooltip {
		position: fixed;
		z-index: 10;
		padding: 4px 8px;
		background-color: theme('colors.backgroundButtonDark');
		border-radius: 0.25rem;
		color: white;
		font-size: 14px;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
		pointer-events: none;
	}

	.tooltip.show {
		opacity: 1;
	}
</style>
