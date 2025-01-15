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

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleItemsPerPageChange(value: number) {
		itemsPerPage = value;
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
						<h3 class="text-2xl md:text-3xl">Log in Instructions for Curators</h3>
						<p class="text-xl md:text-2xl">
							If you are a Curator please log in with the Pure Proxy Curator Address to access the
							curator functionalities.
						</p>
						<p class="text-xl md:text-2xl">
							Currently using Multix through WalletConnect is the only supported method. Support for
							Mimir is in development and will be available soon.
						</p>
						<div>
							<p>To connect with Multix:</p>
							<ol class="list-decimal list-inside mt-2">
								<li>Click on Connect Wallet on the top right of this page.</li>
								<li>Select WalletConnect.</li>
								<li>
									Copy the key by clicking the button next to "Connect your wallet" on the top of
									the pop-up.
								</li>
								<li>
									<a href="https://multix.chainsafe.io/settings" target="_blank" rel="noreferrer" class="underline">
										Open Multix in a new tab
									</a> and ensure you have selected the correct Pure Proxy account from the dropdown.
								</li>
								<li>
									Navigate to the settings tab on Multix, expand the WalletConnect line and paste
									the key.
								</li>
								<li>Approve the connection request.</li>
								<li>Switch back to Bounty Manager.</li>
								<li>
									Identify the correct Pure Proxy account from the two available and select it to
									sign in.
								</li>
							</ol>
						</div>
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
						pageChange={handlePageChange}
						itemsPerPageChange={handleItemsPerPageChange}
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
