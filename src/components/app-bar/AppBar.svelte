<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, dotApi, polkadotSigner } from '../../stores';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerHeader from './LogoBountyManagerHeader.svg';
	import LoginModal from './LoginModal.svelte';
	import { showLoginModal } from './loginModalStores';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import PeopleChainName from '../PeopleChainName.svelte';
	import { getAccounts } from './getAccounts';
	import { type AccountInfo } from '../../types/account';
	import BurgerMenu from './BurgerMenu.svelte';
	import { page } from '$app/state';
	import { initializeApi } from '../../utils/initializeApi';
	import { currentBlockchain } from './blockchains';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import ChainMenu from './ChainMenu.svelte';
	import LoadingModal from '../LoadingModal/LoadingModal.svelte';

	onMount(async () => {
		if (typeof $dotApi === 'undefined') {
			await initializeApi($currentBlockchain.endpoints);
			await connectStoredAccount();
		}

		await fetchBountiesAndChildBounties();
		setActiveAccountBounties();
	});

	async function connectStoredAccount() {
		// Connect wallet automatically on the same tab.
		const storedAccount = sessionStorage.getItem('account');
		if (!storedAccount) return;

		const parsedAccount = JSON.parse(storedAccount) as AccountInfo;
		activeAccount.set(parsedAccount);

		const { address, source } = parsedAccount;

		const accounts = await getAccounts(source);
		const account = accounts.find((account) => account.address === address);
		if (!account) {
			activeAccount.set(undefined);
			sessionStorage.removeItem('account');
			console.error('something went wrong while trying to restore session.');
			return;
		}
		polkadotSigner.set(account.polkadotSigner);
	}
</script>

<header class="relative flex justify-between items-center min-h-20 p-2 md:p-0 md:w-[754px] mx-auto">
	<!-- First Element -->
	<div class="flex flex-col items-center space-y-3">
		<a href="/curator-actions">
			<img width="46" height="30" src={LogoBountyManagerHeader} alt="Logo Bounty Manager" />
		</a>
		<ChainMenu />
	</div>

	<!-- Second Element -->
	<div>
		{#if !$activeAccount}
			{#if !page.url.pathname.startsWith('/docs/')}
				<button on:click={showLoginModal}>Connect Wallet</button>
			{/if}
			<w3m-button></w3m-button>
		{:else}
			<!-- User Address -->
			<div class="flex flex-col items-center space-y-[23px] mt-1">
				<button
					type="button"
					class="flex gap-2 items-center"
					on:click={async () => {
						await navigator.clipboard.writeText($activeAccount.address);
					}}
				>
					<span class="w-5 h-5">
						<PolkadotIcon address={$activeAccount.address} />
					</span>
					<PeopleChainName address={$activeAccount.address}>
						{$activeAccount.name || 'Account'}
					</PeopleChainName>
				</button>
				<BurgerMenu />
			</div>
		{/if}
	</div>
</header>

<LoadingModal />
<LoginModal />
