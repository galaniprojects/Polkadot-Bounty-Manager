<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	export let bounty: Bounty;

	const statusLabels = {
		Proposed: 'proposed',
		Approved: 'approved',
		Funded: 'funded',
		CuratorProposed: 'curator proposed',
		Active: 'active',
		PendingPayout: 'pending payout',
		Claimed: 'claimed',
		Canceled: 'canceled',
		Rejected: 'rejected',
		ApprovedWithCurator: 'approved with curator'
	};
</script>

<div class="header">
	<section class="title">
		<h2 class="bountyTitle">
			<span class="bountyId">#{bounty.id}</span>
			<span class="bountyName"> {bounty.description}</span>
		</h2>
	</section>

	<div class="statusContainer">
		<div class="proposer">
			<p>Proposer:</p>
			<CopyableAddress address={bounty.proposer} />
		</div>
		<p class="status" data-status={bounty.status}>
			{statusLabels[bounty.status]}
		</p>
	</div>
</div>

<style>
	.header {
		display: flex;
		flex-direction: column;
		padding: 18px 12px 25px;
		gap: 6px;
	}
	.title {
		display: flex;
		justify-content: space-between;
	}
	.bountyTitle {
		font-size: 20px;
		word-break: break-word;
	}
	.bountyId {
		font-weight: 300;
	}

	.bountyName {
		font-weight: 800;
	}

	.proposer {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.statusContainer {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		padding-left: 2px;
		background-color: theme('colors.backgroundChildBountyDetails');
		height: 20px;
	}
	.status {
		font-size: 10px;
		color: theme('colors.textPrimary');
		flex-shrink: 0;
		width: 120px;
		padding: 3px 8px;
	}

	[data-status='Proposed'],
	[data-status='CuratorProposed'],
	[data-status='ApprovedWithCurator'],
	[data-status='Funded'] {
		background-color: theme('colors.statusDarkYellow');
		color: white;
	}

	[data-status='Active'],
	[data-status='PendingPayout'] {
		background-color: theme('colors.statusLightGreen');
		color: white;
	}

	[data-status='Approved'],
	[data-status='Claimed'],
	[data-status='Canceled'],
	[data-status='Rejected'] {
		background-color: theme('colors.statusDarkGreen');
		color: white;
	}
</style>
