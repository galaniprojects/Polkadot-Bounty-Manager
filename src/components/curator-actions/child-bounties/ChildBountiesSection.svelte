<script lang="ts">
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import { type Bounty } from '../../../types/bounty';
	import { type ChildBounty, childBountyStatuses, statusLabels } from '../../../types/child-bounty';
	import AddChildBounty from './operations/AddChildBounty.svelte';
	import BatchAllChildBountyCalls from './operations/BatchAllChildBountyCalls.svelte';

	import ChildBountyCard from './ChildBountyCard.svelte';
	import DropdownMenu from '../../common/DropdownMenu.svelte';
	import Pagination from '../Pagination.svelte';

	export let bounty: Bounty;

	let currentPage = 1;
	let itemsPerPage = 10;
	let createChildBountyOpen = false;
	let createChildBatchOpen = false;

	type Filter = ChildBounty['status'] | 'all';

	let filteredChildBounties: ChildBounty[] = [];
	let paginatedChildBounties: ChildBounty[] = [];
	let totalPages = 1;

	const filters: Array<{ value: Filter; label: string }> = [
		{ value: 'all', label: 'all' },
		...childBountyStatuses.map((value) => ({ value, label: statusLabels[value] }))
	];
	let selectedFilter = filters[0];

	$: {
		filteredChildBounties =
			selectedFilter.value === 'all'
				? bounty.childBounties
				: bounty.childBounties.filter(({ status }) => status === selectedFilter.value);

		totalPages = Math.max(Math.ceil(filteredChildBounties.length / itemsPerPage), 1);
		currentPage = Math.min(currentPage, totalPages);

		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		paginatedChildBounties = filteredChildBounties.slice(startIndex, endIndex);
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleItemsPerPageChange(value: number) {
		itemsPerPage = value;
		currentPage = 1;
	}
</script>

<div data-pagination-scroll="bounty-{bounty.id}" class="bg-backgroundApp p-3 m-3 w-full lg:w-full">
	<!-- Header section -->
	<section class="flex flex-col space-y-3 lg:flex-row justify-between">
		<div class="flex flex-col gap-2 lg:w-1/2 lg:px-3 text-textPrimary">
			<p class="text-xs">Child Bounties</p>
			<p class="text-2xl">
				{bounty.childBounties.length} Active Child {bounty.childBounties.length === 1
					? 'Bounty'
					: 'Bounties'}
			</p>
		</div>

		<div class="flex flex-col space-y-3 lg:space-y-1 lg:mt-0 lg:pr-3 xl:mt-4 2xl:pr-0 2xl:flex-row">
			<div class="space-y-3 lg:space-y-1">
				{#if $showAllCuratorOptions || (bounty.status === 'Active' && bounty.curator === $activeAccount?.address)}
					<div
						class="flex flex-col justify-end space-y-1 lg:flex-row lg:items-center lg:pt-3 {bounty
							.childBounties.length > 0
							? 'lg:mr-0'
							: '2xl:mr-36'}"
					>
						<p class="lg:mr-3 text-xs lg:text-base text-textPrimary">Add new child bounty</p>
						<button
							on:click={() => (createChildBountyOpen = true)}
							class="bg-backgroundButtonLight text-textPrimary rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:mr-6 lg:min-w-32"
						>
							ADD
						</button>
					</div>
					<div
						class="flex flex-col justify-end space-y-1 lg:flex-row lg:items-center lg:py-3 {bounty
							.childBounties.length > 0
							? 'lg:mr-0'
							: '2xl:mr-36'}"
					>
						<p class="lg:mr-3 text-xs lg:text-base text-textPrimary">All operations</p>
						<button
							on:click={() => (createChildBatchOpen = true)}
							class="bg-backgroundButtonLight text-textPrimary rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:mr-6 lg:min-w-32"
						>
							BATCH
						</button>
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
						>
							ADD
						</button>
					</div>
				{/if}
			</div>
			{#if bounty.childBounties.length > 0}
				<div
					class="flex flex-col justify-start space-y-1 lg:flex-row lg:justify-end lg:items-center 2xl:items-start lg:pb-3 lg:mr-6 2xl:mr-0"
				>
					<p class="text-xs 2xl:hidden lg:mr-3 lg:text-base">Filter child bounties</p>
					<div class="flex justify-between">
						<p class="mt-2 lg:hidden">by status</p>
						<div>
							<DropdownMenu
								bind:selectedItem={selectedFilter}
								items={filters}
								width="w-44 lg:w-32 2xl:w-36"
								truncate={true}
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Child bounty list section -->
	<div class="text-textPrimary">
		{#each paginatedChildBounties as childBounty}
			<ChildBountyCard {childBounty} parentBounty={bounty} />
		{/each}

		{#if bounty.childBounties.length === 0}
			<div class="childContainer bg-backgroundApp lg:w-full shadow-lg mt-6">
				<div
					class="flex flex-col bg-childBountyHeaderBackground lg:bg-backgroundApp p-4 rounded-md"
				>
					<div class="text-center space-y-3">
						<p>There are currently no active child bounties.</p>
						<p class="text-4xl">(-‿-)</p>
					</div>
				</div>
			</div>
		{:else if filteredChildBounties.length === 0}
			<p>No Child bounties for the selected filter</p>
		{/if}

		<div class="pagination py-[18px]">
			<Pagination
				{currentPage}
				{totalPages}
				{itemsPerPage}
				activeButtonColor="text-textPrimary border border-textPrimary"
				pageChange={handlePageChange}
				itemsPerPageChange={handleItemsPerPageChange}
			/>
		</div>
	</div>
</div>

<AddChildBounty {bounty} bind:open={createChildBountyOpen} />

<BatchAllChildBountyCalls {bounty} bind:open={createChildBatchOpen} />

<style>
	.childContainer {
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}

	.pagination {
		--pagination-arrow-color: theme('colors.textPrimary');
	}
</style>
