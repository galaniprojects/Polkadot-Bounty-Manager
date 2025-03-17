<script lang="ts">
	import { type Bounty } from '../../types/bounty';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import ChildBountiesSection from './child-bounties/ChildBountiesSection.svelte';
	import { showAllCuratorOptions } from '../../stores';
	import BountyCardDetails from './BountyCardDetails.svelte';
	import AwardBounty from './operations/AwardBounty.svelte';
	import { isCurator } from '../../utils/isCurator';
	import { getRemainingBalance } from '../../utils/getRemainingBalance';
	import { onMount } from 'svelte';

	export let bounty: Bounty;

	let description: string | undefined;
	let remainingBalance: bigint | undefined;
	let awardBountyDialog: HTMLDialogElement;

	onMount(async () => {
		remainingBalance = await getRemainingBalance(bounty.id);
	});
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
		class="flex flex-col space-y-1 px-3 pt-0 lg:pt-3 lg:justify-end lg:mr-12 lg:space-y-3 2xl:pr-36 pb-3"
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
