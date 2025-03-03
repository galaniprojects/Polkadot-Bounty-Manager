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

<div class="max-h-fit px-3 pt-[18px] pb-[25px] w-full">
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl break-word">
				<span class="font-light">#{bounty.id}</span>
				<span class="font-extrabold"> {bounty.description}</span>
			</span>
		</div>

		<button
			on:click={() => (isParentExpanded = !isParentExpanded)}
			class="material-symbols-outlined text-2xl self-start"
		>
			{#if isParentExpanded}
				keyboard_arrow_up
			{:else}
				keyboard_arrow_down
			{/if}
		</button>
	</div>
	<div class="flex justify-between text-xs items-baseline px-[2px] bg-backgroundChildBountyDetails">
		<section class="flex items-center space-x-1">
			<p>Proposer:</p>
			<CopyableAddress address={bounty.proposer} />
		</section>
		<p class="w-1/6 text-white py-1 rounded-md text-center" data-status={bounty.status}>
			{statusLabels[bounty.status]}
		</p>
	</div>
</div>

<style>
	/* ToDo: double check if the colors are updated, or any changes are necessary  */
	[data-status='Proposed'] {
		background-color: theme('colors.statusProposedFunded');
	}
	[data-status='CuratorProposed'] {
		background-color: theme('colors.statusProposedFunded');
	}

	[data-status='Active'] {
		background-color: theme('colors.statusActive');
	}

	[data-status='PendingPayout'] {
		background-color: theme('colors.statusPendingPayout');
	}

	[data-status='Approved'] {
		background-color: theme('colors.statusApprovedRejected');
	}

	[data-status='Funded'] {
		background-color: theme('colors.statusProposedFunded');
	}
	[data-status='Claimed'] {
		background-color: theme('colors.statusApprovedRejected');
	}
	[data-status='Canceled'] {
		background-color: theme('colors.statusApprovedRejected');
	}
	[data-status='Rejected'] {
		background-color: theme('colors.statusApprovedRejected');
	}

	.break-word {
		word-break: break-word;
	}
</style>
