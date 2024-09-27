<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import type { ChildBounty } from '../../types/child-bounty';
	import MagnifyingIcon from '../svg/MagnifyingIcon.svelte';
	import AddChildBounty from './AddChildBounty.svelte';
	import ChildBountyCard from './ChildBountyCard.svelte';

	export let bounty: Bounty;
	export let childBounties: ChildBounty[];
	let createChildBountyOpen = false;
</script>

<div class="bg-childBountyBackground p-3 m-3">
	<section class="flex flex-col lg:flex-row justify-between px-5 pb-6">
		<div class="grid gap-2 w-1/2">
			<p class="text-xs">Child Bounties</p>
			<p class="text-2xl">Child Bounties</p>
			<div class="relative w-full h-10">
				<input
					class="border border-borderColor pt-1 w-full rounded-md bg-white pl-2"
					placeholder="Bounty Search"
				/>
				<div
					class="border border-accent absolute right-8 top-4 transform -translate-y-1/2 h-5"
				></div>
				<MagnifyingIcon></MagnifyingIcon>
			</div>
		</div>

		<div class="grid mt-6 lg:mt-0 space-y-3 lg:pr-0 xl:pr-24">
			<div class="flex justify-end items-center py-3">
				<p class="mr-3 text-md">New Child Bounty</p>
				<button
					on:click={() => (createChildBountyOpen = true)}
					class="bg-accent text-white rounded-md font-bold pt-1 min-w-32 mr-3">ADD</button
				>
			</div>
			<div class="flex justify-end items-center pb-3">
				<p class="mr-3 text-md">Salary Child Bounties</p>
				<button class="bg-accent text-white rounded-md font-bold pt-1 min-w-32 mr-3">ADD</button>
			</div>
		</div>
	</section>

	{#each childBounties as childBounty}
		<ChildBountyCard
			{childBounty}
			beneficiary="Nodal_point_12"
			dateCreated="MAY 09, 2024"
			dateOfPayout="AUG 21, 2024"
			timeUntilPayout="1d : 8h : 42min : 18sec"
		/>
	{/each}
</div>
<AddChildBounty {bounty} bind:open={createChildBountyOpen} />
