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

	let description: string | undefined;
	let remainingBalance: bigint | undefined;
	let awardBountyDialog: HTMLDialogElement;

	// Handle description and balance fetch
	$: getRemainingBalance(bounty.id).catch(() => {});

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
</script>

<div class="bg-backgroundBounty overflow-hidden rounded-md my-6">
	<!-- Header -->
	<BountyCardHeader {bounty} />

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
</div>

<AwardBounty bind:dialog={awardBountyDialog} {bounty} />
