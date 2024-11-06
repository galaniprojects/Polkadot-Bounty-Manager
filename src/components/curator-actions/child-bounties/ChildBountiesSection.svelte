<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import type { ChildBounty, ChildBountyStatusString } from '../../../types/child-bounty';
	import { getChildBountyStatus } from '../../../utils/bounties';
	import AddChildBounty from './AddChildBounty.svelte';
	import ChildBountyCard from './ChildBountyCard.svelte';
	import DropdownMenu from './DropdownMenu.svelte';

	export let bounty: Bounty;
	export let childBounties: ChildBounty[];
	export let parentCurator: string | undefined;

	let filteredChildBounties: ChildBounty[] = [];
	let createChildBountyOpen = false;
	let selectedFilter: ChildBountyStatusString | 'all' = 'all';

	$: {
		filteredChildBounties = childBounties.filter((childBounty) => {
			return getChildBountyStatus(childBounty) === selectedFilter || selectedFilter === 'all';
		});
	}

	const filters: Array<ChildBountyStatusString | 'all'> = [
		'all',
		'added',
		'active',
		'sub-curator proposed',
		'pending payout'
	];
</script>

<div class="bg-childBountyBackground p-3 m-3 w-full lg:w-full rounded-md">
	<section class="flex flex-col space-y-3 lg:flex-row justify-between">
		<div class="flex flex-col gap-2 lg:w-1/2 lg:px-3">
			<p class="text-xs">Child Bounties</p>
			<p class="text-2xl">{childBounties.length} Child Bounties</p>
		</div>

		<div class="flex flex-col space-y-3 lg:space-y-1 lg:mt-0 lg:pr-3 xl:mt-4 2xl:pr-0 2xl:flex-row">
			<div class="space-y-3 lg:space-y-1">
				{#if $showAllCuratorOptions || (typeof bounty.status === 'object' && 'Active' in bounty.status && $activeAccount && bounty.status.Active.curator === $activeAccount.address)}
					<div
						class="flex flex-col justify-start space-y-1 lg:flex-row lg:justify-end lg:items-center lg:py-3"
					>
						<p class="lg:mr-3 text-xs lg:text-base">Add new child bounty</p>
						<button
							on:click={() => (createChildBountyOpen = true)}
							class="bg-accent text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:mr-6 lg:min-w-32"
							>ADD</button
						>
					</div>
				{/if}
				<!-- TODO: salary child bounties -->
				{#if false}
					<div
						class="flex flex-col justify-start space-y-1 lg:flex-row lg:justify-end lg:items-center lg:pb-3"
					>
						<p class="lg:mr-3 text-xs lg:text-base">Add new salary child bounties</p>
						<button
							class="bg-accent text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:mr-6 lg:min-w-32"
							>ADD</button
						>
					</div>
				{/if}
			</div>
			{#if childBounties.length > 0}
				<div
					class="flex flex-col justify-start space-y-1 lg:flex-row lg:justify-end lg:items-center lg:pb-3 lg:mr-6 2xl:mr-0"
				>
					<p class="text-xs xl:hidden lg:mr-3 lg:text-base">Filter child bounties</p>
					<div class="flex justify-between">
						<p class="mt-2 lg:hidden">by status</p>
						<div><DropdownMenu bind:selectedItem={selectedFilter} items={filters} /></div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<div>
		{#each filteredChildBounties as childBounty}
			<ChildBountyCard {childBounty} parentBounty={bounty} {parentCurator} />
		{/each}

		{#if childBounties.length === 0}
			<div class="childContainer bg-white lg:w-full rounded-md shadow-lg mt-6">
				<div class="rounded-t-md pl-[10px] pt-2 lg:pl-4 bg-childBountyGray text-white text-sm">
					#0000 No child bounties
				</div>
				<div class="flex flex-col bg-childBountyHeaderBackground lg:bg-white p-4 rounded-md">
					<div class="text-center space-y-3">
						<p>No child bounties created yet.</p>
						<p>Create one.</p>
						<p class="text-4xl">(•‿•)</p>
					</div>
				</div>
			</div>
		{:else if filteredChildBounties.length === 0}
			<p>No Child bounties for the selected filter</p>
		{/if}
	</div>
</div>
<AddChildBounty {bounty} bind:open={createChildBountyOpen} />

<style>
	.childContainer {
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}
</style>
