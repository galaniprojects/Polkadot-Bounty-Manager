<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, activeAccountBounties, bounties, showAllBounties } from '../../stores';
	import { goto } from '$app/navigation';
	import BountyCard from './BountyCard.svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';

	onMount(async () => {
		if ($bounties.length === 0) {
			await fetchBountiesAndChildBounties();
		}
	});
</script>

<div class="main bg-primary flex justify-center items-center overflow-x-hidden">
	<div class="w-full rounded-md px-3 py-6 sm:px-12 sm:pt-2 sm:pb-2">
		<div class="actions-container flex justify-between lg:px-8 lg:py-6 items-center rounded-md">
			<div class="hidden space-x-5 items-center lg:inline-flex">
				<h2 class="title mt-1 text-3xl text-white">Create new bounty here</h2>
				<span class="material-symbols-outlined text-white text-xl"> arrow_forward_ios </span>
			</div>
			<button
				on:click={() => {
					goto('/bounty-setup');
				}}
				class="border-accent bg-accent rounded-md w-full h-12 lg:max-w-64 text-white font-bold self-center"
				>NEW BOUNTY</button
			>
		</div>
		<div class="min-h-[70vh]">
			{#each $showAllBounties ? $bounties : $activeAccountBounties as bounty, index}
				<div>
					<BountyCard {bounty} expanded={index === 0 ? true : false} />
				</div>
			{/each}
		</div>
		{#if $activeAccountBounties.length === 0}
			<div class="h-[70vh]">
				{#if $activeAccount}
					<div class="lg:mt-40 mt-10 flex justify-center text-white">
						Connected Address does not have any bounties or child bounties.
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.actions-container {
		background-color: #836fac40;
	}

	.title {
		font-family: 'Overpass';
	}
</style>
