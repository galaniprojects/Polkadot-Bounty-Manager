<script lang="ts">
	import { activeAccount } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import type { ChildBounty } from '../../../types/child-bounty';
	import AddChildBounty from './AddChildBounty.svelte';
	import ChildBountyCard from './ChildBountyCard.svelte';

	export let bounty: Bounty;
	export let childBounties: ChildBounty[];
	let createChildBountyOpen = false;
	let dropdownOpened = false;
	let selectedFilter = 'all';

	const filters = ['all', 'created', 'sub-curator proposed', 'active', 'awarded', 'claimed'];

	function openUpFilterDropdownToggleClick() {
		dropdownOpened = !dropdownOpened;
	}

	function selectFilter(filter: string) {
		selectedFilter = filter;
		dropdownOpened = false;
	}
</script>

<div class="bg-childBountyBackground p-3 m-3 w-full lg:w-full rounded-md">
	<section class="flex flex-col space-y-3 lg:flex-row justify-between">
		<div class="flex flex-col gap-2 lg:w-1/2 lg:px-3">
			<p class="text-xs">Child Bounties</p>
			<p class="text-2xl">Child Bounties</p>
		</div>

		<div class="flex flex-col space-y-3 lg:space-y-1 lg:mt-0 lg:pr-3 xl:mt-4 2xl:pr-0 2xl:flex-row">
			<div class="space-y-3 lg:space-y-1">
				{#if typeof bounty.status === 'object' && 'Active' in bounty.status && $activeAccount && bounty.status.Active.curator === $activeAccount.address}
					<div
						class="flex flex-col justify-start lg:flex-row lg:justify-end lg:items-center lg:py-3"
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
						class="flex flex-col justify-start lg:flex-row lg:justify-end lg:items-center lg:pb-3"
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
				class="flex flex-col justify-start lg:flex-row lg:justify-end lg:items-center lg:pb-3 lg:mr-6 2xl:mr-0"
			>
				<p class="text-xs xl:hidden lg:mr-3 lg:text-base">Filter child bounties</p>
				<div class="flex justify-between gap-3">
					<p class="mt-2 hidden sm:inline-flex sm:gap-1 lg:hidden">
						by <span>{selectedFilter}</span>
					</p>
					<div class="w-full">
						<div class="w-full lg:w-32 xl:w-36">
							<button
								on:click={openUpFilterDropdownToggleClick}
								type="button"
								class="inline-flex w-full justify-between items-center rounded-md bg-white px-2 py-2 text-primary ring-1 ring-inset ring-accent"
								id="menu-button"
								aria-expanded="true"
								aria-haspopup="true"
							>
								{selectedFilter}
								<button class="material-symbols-outlined text-accent"> keyboard_arrow_down </button>
							</button>
						</div>
						{#if dropdownOpened}
							<div
								class="absolute z-10 -mt-[42px] origin-bottom-right w-52 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="menu-button"
								tabindex="-1"
							>
								<div role="none">
									{#each filters as status, index}
										<button
											class="block w-full px-4 py-2 text-sm text-primary cursor-pointer
												{selectedFilter === status ? 'bg-curatorMainBackground text-white' : 'bg-white'}
												hover:bg-curatorMainBackground focus:bg-curaorMainBackground hover:bg-opacity-30 focus:bg-opacity-30"
											role="menuitem"
											tabindex="-1"
											on:click={() => selectFilter(status)}
										>
											{status}
										</button>

										{#if index < filters.length - 1}
											<hr />
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="space-y-3">
		{#each childBounties as childBounty}
			<ChildBountyCard
				{childBounty}
				parentBounty={bounty}
				beneficiary="Nodal_point_12"
				dateCreated="MAY 09, 2024"
				dateOfPayout="AUG 21, 2024"
			/>
		{/each}
	</div>
</div>
<AddChildBounty {bounty} bind:open={createChildBountyOpen} />

<style>
	.material-symbols-outlined {
		font-size: 30px;
	}
</style>
