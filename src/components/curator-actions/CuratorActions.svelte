<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { onMount } from 'svelte';
	import { activeAccount, activeAccountBounties, bounties, showAllBounties } from '../../stores';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import BountyCard from './BountyCard.svelte';
	import Pagination from './Pagination.svelte';

	let currentPage = 1;
	let itemsPerPage = 10;
	let totalPages = 1;
	let paginatedBounties: Bounty[] = [];

	$: activeBounties = $showAllBounties ? $bounties : $activeAccountBounties;

	$: {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = currentPage * itemsPerPage;
		paginatedBounties = activeBounties.slice(startIndex, endIndex);
		totalPages = Math.ceil(activeBounties.length / itemsPerPage);
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		currentPage = event.detail.page;
	}

	function handleItemsPerPageChange(event: CustomEvent<{ itemsPerPage: number }>) {
		itemsPerPage = event.detail.itemsPerPage;
		currentPage = 1;
	}

	onMount(async () => {
		if ($bounties.length === 0) {
			await fetchBountiesAndChildBounties();
		}
	});
</script>

<div
	class="main bg-primary flex justify-center items-center overflow-x-hidden"
	data-pagination-scroll="parent-bounty-list"
>
	<div class="w-full rounded-md px-3 py-6 sm:px-12 sm:pt-2 sm:pb-2">
		<div class="min-h-[70vh]">
			{#if !$activeAccount}
				<div class="text-white flex justify-center mt-20">
					<div class="justify-start space-y-8">
						<p class="text-xl md:text-2xl">
							Please connect your wallet with a curator address to view and interact with your
							bounties.
						</p>
						<div>
							<p>To connect a pure proxy curator address through Multix:</p>
							<ol class="list-decimal list-inside mt-2">
								<li>Select WalletConnect.</li>
								<li>Copy the key by clicking on the button next to Connect your Wallet.</li>
								<li>
									Navigate to the settings tab on Multix, expand the WalletConnect line and paste
									the key.
								</li>
								<li>Approve the connection request.</li>
								<li>
									Navigate to the bounty manager and select your pure proxy account to sign in.
								</li>
							</ol>
						</div>
						<p class="">
							Please note: <br /> WalletConnect doesn’t support reading the account names out of Multix
							at the moment. Select the pure proxy account by its address
						</p>
					</div>
				</div>
			{:else}
				{#each paginatedBounties as bounty, index}
					<div data-pagination-scroll={`bounty-${bounty.id}`}>
						<BountyCard {bounty} expanded={index === 0} />
					</div>
				{/each}
				{#if activeBounties.length !== 0}
					<Pagination
						{currentPage}
						{totalPages}
						{itemsPerPage}
						on:pageChange={handlePageChange}
						on:itemsPerPageChange={handleItemsPerPageChange}
					/>
				{/if}
				{#if $activeAccountBounties.length === 0}
					<div class="lg:mt-40 mt-10 flex justify-center text-white">
						Connected Address does not have any bounties or child bounties
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
