<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	export let bounty: Bounty;
	export let isParentExpanded: boolean;

	const statusLabels = {
		Proposed: 'proposed',
		Approved: 'approved',
		Funded: 'funded',
		CuratorProposed: 'curator proposed',
		Active: 'active',
		PendingPayout: 'pending payout',
		Claimed: 'claimed',
		Canceled: 'canceled',
		Rejected: 'rejected'
	};
</script>

<div class="max-h-fit p-5 lg:px-10 w-full">
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl lg:text-2xl">
				#{bounty.id}
				{bounty.description}
			</span>
		</div>

		<button
			on:click={() => (isParentExpanded = !isParentExpanded)}
			class="material-symbols-outlined text-3xl self-start"
		>
			{#if isParentExpanded}
				keyboard_arrow_up
			{:else}
				keyboard_arrow_down
			{/if}
		</button>
	</div>
</div>
<div
	class="flex flex-col lg:flex-row lg:justify-start text-xs lg:mt-0 items-baseline pl-10 bg-backgroundChildBountyDetails"
>
	<div class="flex flex-col justify-start lg:w-[250px]">
		<section class="flex justify-start items-center space-x-1">
			<p>Proposer:</p>
			<CopyableAddress address={bounty.proposer} />
		</section>
	</div>
	<section class="flex space-x-1">
		<p>Status:</p>
		<p>{statusLabels[bounty.status]}</p>
	</section>
</div>
