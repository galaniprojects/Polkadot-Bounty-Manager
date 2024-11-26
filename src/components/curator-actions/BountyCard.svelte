<script lang="ts">
	import { BountyStatus, type Bounty } from '../../types/bounty';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import BountyOperations from './BountyOperations.svelte';
	import ChildBountiesSection from './child-bounties/ChildBountiesSection.svelte';
	import { parse } from 'marked';
	import { activeAccount, dotApi, showAllCuratorOptions } from '../../stores';
	import BountyCardDetails from './BountyCardDetails.svelte';
	import { formatPlanckToDot } from '../../utils/polkadot';
	import AwardBounty from './operations/AwardBounty.svelte';

	export let bounty: Bounty;
	export let expanded: boolean;

	let description: string | undefined;
	let remainingBalance: string | undefined;
	let awardBountyDialogOpen = false;

	// Handle description and balance fetch
	$: if (expanded) {
		const bountyId = bounty.id;

		(async () => {
			try {
				const url = `https://polkadot.subsquare.io/api/treasury/bounties/${bountyId}`;
				const response = await fetch(url);
				if (!response.ok) throw new Error('Failed to fetch bounty details.');

				const data = await response.json();
				try {
					description = await parse(data.content);
				} catch {
					description = undefined;
					console.error('No description found.');
				}

				try {
					const fundsAddress = data.onchainData.address;
					const account = await $dotApi.query.System.Account.getValue(fundsAddress);
					remainingBalance = formatPlanckToDot(account.data.free);
				} catch {
					console.error('Error fetching remaining balance.');
					remainingBalance = undefined;
				}
			} catch {
				description = undefined;
				remainingBalance = undefined;
			}
		})();
	}

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="bg-curatorMainBackground overflow-hidden rounded-md my-6">
	<!-- Header -->
	<BountyCardHeader {bounty} bind:isParentExpanded={expanded} />

	{#if expanded}
		<!-- Details Section -->
		<BountyCardDetails {bounty} {description} {remainingBalance} />

		<!-- Actions -->
		<BountyOperations {bounty} />

		<div class="pr-6">
			<!-- Child Bounties -->
			{#if bounty.status === BountyStatus.Active}
				<ChildBountiesSection {bounty} />
			{/if}
		</div>

		<div
			class="flex flex-col space-y-1 px-3 pt-0 lg:pt-3 lg:justify-end lg:mr-12 lg:space-y-3 2xl:pr-36"
		>
			{#if $showAllCuratorOptions || (bounty.status === BountyStatus.Active && bounty.childBounties.length === 0 && $activeAccount && bounty.curator === $activeAccount.address)}
				<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
					<p class="pt-2 text-sm text-white">Award bounty</p>
					<button
						class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-5"
						on:click={() => {
							awardBountyDialogOpen = true;
						}}>READ FIRST</button
					>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="flex justify-end px-5 my-4 lg:px-10">
			<button class="flex items-center pt-5 pb-1" on:click={toggleExpanded}>
				<p class="text-white text-xs">Close bounty view</p>
				<span class="material-symbols-outlined text-white text-3xl">keyboard_arrow_up</span>
			</button>
		</div>
	{/if}
</div>
{#if awardBountyDialogOpen}
	<AwardBounty bind:open={awardBountyDialogOpen} {bounty} />
{/if}
