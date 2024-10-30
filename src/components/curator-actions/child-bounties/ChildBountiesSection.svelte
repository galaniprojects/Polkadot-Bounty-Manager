<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import type { ChildBounty } from '../../../types/child-bounty';
	import AddChildBounty from './AddChildBounty.svelte';
	import ChildBountyCard from './ChildBountyCard.svelte';
	import DropdownItem from './DropdownItem.svelte';

	export let bounty: Bounty;
	export let childBounties: ChildBounty[];

	let createChildBountyOpen = false;
	let selectedFilter = 'all';

	const filters = ['all', 'active', 'awarded', 'claimed', 'created', 'sub-curator proposed'];
</script>

<div class="bg-childBountyBackground p-3 m-3 w-full lg:w-full rounded-md">
	<section class="flex flex-col space-y-3 lg:flex-row justify-between">
		<div class="flex flex-col gap-2 lg:w-1/2 lg:px-3">
			<p class="text-xs">Child Bounties</p>
			<p class="text-2xl">Child Bounties</p>
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
			<div
				class="flex flex-col justify-start space-y-1 lg:flex-row lg:justify-end lg:items-center lg:pb-3 lg:mr-6 2xl:mr-0"
			>
				<p class="text-xs xl:hidden lg:mr-3 lg:text-base">Filter child bounties</p>
				<div class="flex justify-between">
					<p class="mt-2 lg:hidden">by status</p>
					<div><DropdownItem bind:selectedFilter {filters} /></div>
				</div>
			</div>
		</div>
	</section>

	<div>
		{#each childBounties as childBounty}
			<ChildBountyCard {childBounty} parentBounty={bounty} />
		{/each}
	</div>
</div>
<AddChildBounty {bounty} bind:open={createChildBountyOpen} />
