<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { activeAccount, activeAccountBounties, bounties, showAllBounties } from '../../stores';
	import Pagination from './Pagination.svelte';
	import { goto } from '$app/navigation';
	import BountyCardSmall from './BountyCardSmall.svelte';

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
</script>

<div class="flex justify-center items-center overflow-y-hidden min-h-[70vh]" data-pagination-scroll>
	<div class="w-full md:w-[754px] p-2 md:p-0">
		{#if !$activeAccount}
			<div class="flex justify-center my-20">
				<div class="justify-start space-y-8 max-w-4xl">
					<h3 class="text-2xl md:text-3xl">Log in Instructions for Curators</h3>
					<p class="text-xl md:text-2xl">
						If you are a Curator please log in with the Pure Proxy Curator Address to access the
						curator functionalities.
					</p>
					<p class="text-xl md:text-2xl">
						Currently available options are Multix through WalletConnect and Mimir. A solution to
						log in directly with your private account is in development and will be available soon.
					</p>
					<section>
						<h4>To connect with Multix:</h4>
						<ol class="list-decimal list-inside mt-2">
							<li>Click on Connect Wallet on the top right of this page.</li>
							<li>Select WalletConnect.</li>
							<li>
								Copy the key by clicking the button next to “Connect your wallet” on the top of the
								pop-up.
							</li>
							<li>
								<a
									href="https://multix.chainsafe.io/settings"
									target="_blank"
									rel="noreferrer"
									class="underline"
								>
									Open Multix in a new tab
								</a> and ensure you have selected the correct Pure Proxy account from the dropdown.
							</li>
							<li>
								Navigate to the settings tab on Multix, expand the WalletConnect line and paste the
								key.
							</li>
							<li>Approve the connection request.</li>
							<li>Switch back to Bounty Manager.</li>
							<li>
								Identify the correct Pure Proxy account from the two available and select it to sign
								in.
							</li>
						</ol>
					</section>
					<section>
						<h4>To connect with Mimir:</h4>
						<ol class="list-decimal list-inside mt-2">
							<li>
								Navigate to <a
									href="https://app.mimir.global/welcome?network=polkadot"
									target="_blank"
									rel="noreferrer"
									class="underline"
								>
									Mimir
								</a>.
							</li>
							<li>Connect your wallet and select the correct proxy address.</li>
							<li>Select Apps on the side bar.</li>
							<li>Select the Bounty Manager app.</li>
							<li>Click on Connect Wallet and select Mimir.</li>
						</ol>
					</section>
				</div>
			</div>
		{:else}
			<div class="cards">
				{#each paginatedBounties as bounty (bounty.id)}
					<button
						type="button"
						onclick={async () => {
							await goto(`/bounty?id=${bounty.id}`);
						}}
					>
						<BountyCardSmall {bounty} />
					</button>
				{/each}
			</div>

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
				<div class="lg:mt-40 mt-10 flex justify-center">
					Connected Address does not have any bounties or child bounties
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 25px;
		margin: 25px 0px;
		align-items: start;
		cursor: pointer;
	}

	@media (max-width: 640px) {
		.cards {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
