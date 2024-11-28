<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	export let bounty: Bounty;
	export let isParentExpanded: boolean;
</script>

<div class="text-white max-h-fit p-5 lg:px-10 w-full">
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl lg:text-2xl">
				#{bounty.id}
				{bounty.description}
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

	<div class="flex">
		<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:mt-0">
			<div class="flex flex-col justify-start lg:w-[250px]">
				<section class="flex justify-start items-center space-x-1">
					<p>Proposer:</p>
					<CopyableAddress address={bounty.proposer} />
				</section>
			</div>
			<section class="flex space-x-1">
				<p>Status:</p>
				<p>{bounty.status}</p>
			</section>
		</div>
	</div>
</div>
