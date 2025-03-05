<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import ChildBountiesSection from './child-bounties/ChildBountiesSection.svelte';
	import { dotApi, showAllCuratorOptions } from '../../stores';
	import { currentBlockchain } from '../app-bar/blockchains';
	import BountyCardDetails from './BountyCardDetails.svelte';
	import AwardBounty from './operations/AwardBounty.svelte';
	import { isCurator } from '../../utils/isCurator';

	export let bounty: Bounty;
	export let expanded: boolean;

	let description: string | undefined;
	let remainingBalance: bigint | undefined;
	let awardBountyDialog: HTMLDialogElement;

	// Handle description and balance fetch
	$: if (expanded) getRemainingBalance(bounty.id).catch(() => {});

	async function getRemainingBalance(bountyId: number) {
		try {
			const url = `${$currentBlockchain.baseUrls.subSquare}/api/treasury/bounties/${bountyId}`;
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch bounty details.');

			const data = (await response.json()) as { onchainData: { address: string } };
			// TODO: don't show description for now.
			// import { parse } from 'marked';
			// try {
			// 	description = await parse(data.content);
			// } catch {
			// 	description = undefined;
			// 	console.error('No description found.');
			// }

			try {
				const fundsAddress = data.onchainData.address;
				const account = await $dotApi.query.System.Account.getValue(fundsAddress);
				remainingBalance = account.data.free;
			} catch {
				console.error('Error fetching remaining balance.');
				remainingBalance = undefined;
			}
		} catch {
			description = undefined;
			remainingBalance = undefined;
		}
	}

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="bg-backgroundBounty overflow-hidden rounded-md my-6">
	<!-- Header -->
	<BountyCardHeader {bounty} bind:isParentExpanded={expanded} />

	{#if expanded}
		<!-- Details Section -->
		<BountyCardDetails {bounty} {description} {remainingBalance} />

		<div class="p-[5px]">
			<!-- Child Bounties -->
			{#if bounty.status === 'Active'}
				<ChildBountiesSection {bounty} />
			{/if}
		</div>

		<div
			class="flex flex-col space-y-1 px-3 pt-0 lg:pt-3 lg:justify-end lg:mr-12 lg:space-y-3 2xl:pr-36"
		>
			{#if $showAllCuratorOptions || (bounty.status === 'Active' && bounty.childBounties.filter(({ status }) => !['Claimed', 'Canceled'].includes(status)).length === 0 && isCurator(bounty))}
				<div class="flex flex-col">
					<p class="text-xs">Award bounty</p>
					<button
						class="w-1/2 h-10 text-white bg-backgroundButtonDark rounded-[10px]"
						on:click={() => {
							awardBountyDialog.showModal();
						}}
					>
						READ FIRST
					</button>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="flex justify-center items-center rounded-b-md">
			<button class="flex items-center py-2" on:click={toggleExpanded}>
				<p class="text-xs">close bounty view</p>
				<span class="material-symbols-outlined">keyboard_arrow_up</span>
			</button>
		</div>
	{/if}
</div>

<AwardBounty bind:dialog={awardBountyDialog} {bounty} />
