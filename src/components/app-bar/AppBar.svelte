<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, dotApi, polkadotSigner } from '../../stores';
	import LogoBountyManagerHeader from './LogoBountyManagerHeader.svg';
	import LoginModal from './LoginModal.svelte';
	import { showLoginModal } from './loginModalStores';
	import { updateAccountMultisigsOnBlockchain } from '../curator-actions/updateAccountMultisigsOnBlockchain';
	import { getAccounts } from './getAccounts';
	import { type AccountInfo } from '../../types/account';
	import BurgerMenu from './BurgerMenu.svelte';
	import { page } from '$app/state';
	import { initializeApi } from '../../utils/initializeApi';
	import { currentBlockchain } from './blockchains';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import ChainMenu from './ChainMenu.svelte';
	import LoadingModal from '../LoadingModal/LoadingModal.svelte';
	import AllBountiesToggle from './AllBountiesToggle.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';

	onMount(async () => {
		if (typeof $dotApi === 'undefined') {
			await initializeApi($currentBlockchain.endpoints);
			await connectStoredAccount();
		}

		await fetchBountiesAndChildBounties();
	});

	async function connectStoredAccount() {
		// Connect wallet automatically on the same tab.
		const storedAccount = sessionStorage.getItem('account');
		if (!storedAccount) return;

		const { address, source } = JSON.parse(storedAccount) as AccountInfo;

		const accounts = await getAccounts(source);
		const account = accounts.find((account) => account.address === address);
		if (!account) {
			sessionStorage.removeItem('account');
			throw new Error('Something went wrong while trying to restore session.');
		}

		await updateAccountMultisigsOnBlockchain(account);
		activeAccount.set(account);
		polkadotSigner.set(account.polkadotSigner);
	}
</script>

<header class="header">
	<div class="logoAccountContainer">
		<a href="/curator-actions">
			<img width="46" height="30" src={LogoBountyManagerHeader} alt="Logo Bounty Manager" />
		</a>

		{#if !$activeAccount}
			{#if !page.url.pathname.startsWith('/docs/')}
				<button class="walletConnectButton" onclick={showLoginModal}>CONNECT WALLET</button>
			{/if}
		{:else}
			<CopyableAddress
				address={$activeAccount.address}
				name={$activeAccount.name}
				showCopyIcon={false}
			/>
		{/if}
	</div>

	<div class="actionsContainer">
		<ChainMenu />
		{#if page.url.pathname === '/curator-actions'}
			<AllBountiesToggle />
		{/if}
		<BurgerMenu />
	</div>
</header>

<LoadingModal />
<LoginModal />

<style>
	.header {
		position: relative;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 80px;
		padding: 8px;
		width: 100%;
		margin-top: 10px;
		gap: 11px;

		@media (width >= 768px) {
			width: 754px;
			padding: 0px;
		}
	}

	.logoAccountContainer {
		display: flex;
		justify-content: space-between;
	}

	.walletConnectButton {
		color: #e6007a;
		font-weight: 600;
		border-radius: 10px;
		border: 1px solid #e6007a;
		padding: 0.2rem 0.3rem 0.1rem;
	}

	.actionsContainer {
		display: flex;
		justify-content: space-between;
	}
</style>
