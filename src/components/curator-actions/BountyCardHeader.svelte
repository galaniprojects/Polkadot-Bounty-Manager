<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { truncateString } from '../../utils/common';
	import { createEventDispatcher } from 'svelte';

	export let bounty: Bounty;
	export let status: string;
	export let isParentExpanded: boolean;

	const dispatch = createEventDispatcher();

	function toggleExpand() {
		dispatch('toggleExpand');
	}
</script>

<button class="text-white max-h-fit p-5 lg:px-10 w-full" on:click={toggleExpand}>
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl lg:text-2xl">
				#{`${bounty.id}`}
				{`${bounty.description}`}
			</span>
		</div>
		<button class="material-symbols-outlined text-white text-3xl">
			{#if isParentExpanded}
				keyboard_arrow_up
			{:else}
				keyboard_arrow_down
			{/if}
		</button>
	</div>

	<div class="flex flex-col lg:flex-row lg:justify-start text-xs mt-2">
		<section class="flex space-x-1 lg:w-52">
			<p>Proposer:</p>
			<p>{truncateString(bounty.proposer, 8)}</p>
		</section>
		<section class="flex space-x-1 lg:w-52">
			<p>Status:</p>
			<p>{status}</p>
		</section>
	</div>
</button>
