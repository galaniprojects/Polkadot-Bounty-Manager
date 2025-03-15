<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import { dotApi } from '../../stores';
	import { currentBlockchain } from '../app-bar/blockchains';
	import Currency from '../Currency.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';

	export let bounty: Bounty;

	let remainingBalance: bigint | undefined;

	$: getRemainingBalance(bounty.id).catch(() => {});

	async function getRemainingBalance(bountyId: number) {
		try {
			const url = `${$currentBlockchain.baseUrls.subSquare}/api/treasury/bounties/${bountyId}`;
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch bounty details.');

			const data = (await response.json()) as { onchainData: { address: string } };

			try {
				const fundsAddress = data.onchainData.address;
				const account = await $dotApi.query.System.Account.getValue(fundsAddress);
				remainingBalance = account.data.free;
			} catch {
				console.error('Error fetching remaining balance.');
				remainingBalance = undefined;
			}
		} catch {
			remainingBalance = undefined;
		}
	}
</script>

<div class="card">
	<BountyCardHeader {bounty} />
	<div class="details">
		<div>
			<p class="text">Remaining Balance</p>
			<p class="value">
				{#if remainingBalance}
					<Currency value={remainingBalance} />
				{:else}
					-
				{/if}
			</p>
		</div>
		<div>
			<p class="text">Curator</p>
			<CopyableAddress address={bounty.curator} />
		</div>
		<div class="childBountiesWrapper">
			<p class="childBountiesText">
				{bounty.childBounties.length} Child {bounty.childBounties.length === 1
					? 'Bounty'
					: 'Bounties'}
			</p>
			<span class="material-symbols-outlined"> arrow_forward_ios </span>
		</div>
	</div>
</div>

<style>
	.card {
		background-color: theme('colors.backgroundBountyCards');
		width: 363px;
		min-height: 240px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		text-align: left;
		border: 1px solid theme('colors.backgroundBountyCards');
	}

	.details {
		display: flex;
		flex-direction: column;
		padding: 0px 12px 15px;
		gap: 12px;
	}

	.text {
		font-size: 12px;
	}

	.value {
		font-weight: 700;
	}

	.childBountiesWrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 13px;
	}

	.childBountiesText {
		background-color: theme('colors.backgroundApp');
		flex-grow: 1;
		padding: 0px 8px;
		font-size: 18px;
		font-weight: 700;
	}
	.card:hover {
		border: 1px solid theme('colors.borderDropdown');
		box-shadow:
			0px 4px 4px 0px rgba(0, 0, 0, 0.12),
			0px 6px 12px 3px rgba(0, 0, 0, 0.1);
	}

	@media (width <= 756px) {
		.card {
			width: 100%;
		}
	}
</style>
