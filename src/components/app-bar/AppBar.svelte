<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, dotApi, polkadotSigner } from '../../stores';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerHeader from './LogoBountyManagerHeader.svg';
	import LoginDialog from './LoginDialog.svelte';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import PeopleChainName from '../PeopleChainName.svelte';
	import { getAccounts } from './getAccounts';
	import { type AccountInfo } from '../../types/account';
	import BurgerMenu from './BurgerMenu.svelte';
	import { page } from '$app/state';
	import { hideLoadingDialog, showLoadingDialog } from '../../utils/loading-screen';
	import { initializeApi } from '../../utils/initializeApi';
	import { endpoints } from '../../utils/endpoints';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import ChainMenu from './ChainMenu.svelte';

	let loginDialogOpen = false;

	function showLoginDialog() {
		loginDialogOpen = true;
	}

	onMount(async () => {
		if (typeof $dotApi === 'undefined') {
			showLoadingDialog('Connecting to Polkadot...');
			await initializeApi(endpoints);
			await connectStoredAccount();
			hideLoadingDialog();
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
			sessionStorage.clear();
			console.error('something went wrong while trying to restore session.');
			return;
		}
		polkadotSigner.set(account.polkadotSigner);
	}
</script>

<header class="relative flex items-center justify-between min-h-20 bg-primary px-4 sm:px-12 py-4">
	<div class="flex flex-col items-center space-y-3">
		<a href="/curator-actions">
			<img width="46" height="30" src={LogoBountyManagerHeader} alt="Logo Bounty Manager" />
		</a>
		<ChainMenu />
	</div>

	<div>
		{#if !$activeAccount}
			{#if !page.url.pathname.startsWith('/docs/')}
				<button class="text-white align-top" on:click={showLoginDialog}>Connect Wallet</button>
			{/if}
			<w3m-button></w3m-button>
		{:else}
			<!-- User Address -->
			<div class="flex flex-col items-center align-top space-y-5">
				<div class="flex gap-2 items-center text-white">
					<div class="w-5 h-5">
						<PolkadotIcon address={$activeAccount.address} />
					</div>
					<PeopleChainName address={$activeAccount.address}>
						{$activeAccount.name || 'Account'}
					</PeopleChainName>
				</div>
				<BurgerMenu />
			</div>
		{/if}
	</div>
</header>

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
