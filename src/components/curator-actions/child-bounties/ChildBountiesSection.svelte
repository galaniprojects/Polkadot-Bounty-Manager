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
		{ value: 'all', label: 'all statuses' },
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

<div data-pagination-scroll class="bg-backgroundApp px-[7px] py-[10px] space-y-[18px]">
	<!-- Header section -->

	<p class="text-lg">
		{bounty.childBounties.length} Active Child {bounty.childBounties.length === 1
			? 'Bounty'
			: 'Bounties'}
	</p>

	{#if $showAllCuratorOptions || (bounty.status === 'Active' && bounty.curator === $activeAccount?.address)}
		<div class="flex flex-col space-y-[25px] sm:flex-row sm:space-x-[25px] sm:space-y-0">
			<div class="flex flex-col w-full sm:w-1/2">
				<p class="text-xs">Add new child bounty</p>
				<button
					on:click={() => (createChildBountyOpen = true)}
					class="bg-backgroundButtonLight rounded-[10px] h-10"
				>
					NEW CHILD BOUNTY
				</button>
			</div>
			<div class="flex flex-col w-full sm:w-1/2">
				<p class="text-xs">All child bounty operations</p>
				<button
					on:click={() => (createChildBatchOpen = true)}
					class="bg-backgroundButtonLight rounded-[10px] h-10"
				>
					COMPLETE PAYOUT
				</button>
			</div>
		</div>
	{/if}
	{#if bounty.childBounties.length > 0}
		<div class="w-1/2">
			<p class="text-xs">Show</p>
			<div>
				<DropdownMenu
					bind:selectedItem={selectedFilter}
					items={filters}
					widthContainer="w-[250px] sm:w-[350px]"
					widthDropdown="w-[250p] sm:w-[350px]"
					textAlign="text-center"
					truncate={false}
					bgColor="grey"
					backgroundColorContainer="border border-backgroundButtonDark bg-backgroundApp"
					height="h-10"
					positionOverlay="-mt-[40px]"
				/>
			</div>
		</div>
	{/if}

	<!-- Child bounty list section -->
	<div>
		<div class="cards">
			{#each paginatedChildBounties as childBounty (childBounty.id)}
				<ChildBountyCard {childBounty} parentBounty={bounty} />
			{/each}
		</div>

		{#if bounty.childBounties.length === 0}
			<div class="childContainer lg:w-full shadow-lg mt-6">
				<div class="flex flex-col p-4 rounded-md">
					<div class="text-center space-y-3">
						<p>There are currently no child bounties.</p>
						<p class="text-4xl">(-‿-)</p>
					</div>
				</div>
			</div>
		{:else if filteredChildBounties.length === 0}
			<p>There are no child bounties for the selected filter.</p>
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

	.cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30px;
		padding: 0px 3px;
		align-items: start;
	}

	@media (max-width: 640px) {
		.cards {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
