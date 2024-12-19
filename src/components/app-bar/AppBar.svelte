<script lang="ts">
	import { onMount } from 'svelte';
	import {
		activeAccount,
		activeAccountBounties,
		polkadotSigner,
		walletConnect,
		walletConnect as wcConnection
	} from '../../stores';
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svg';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svg';
	import LoginDialog from './LoginDialog.svelte';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import { connectInjectedExtension, type PolkadotSigner } from 'polkadot-api/pjs-signer';
	import { type AccountInfo } from '../../types/account';
	import { convertToPolkadotAddress } from '../../utils/polkadot';
	import { createWCConnection } from '../../utils/wallet-connect';

	let loginDialogOpen = false;

	function showLoginDialog() {
		loginDialogOpen = true;
	}

	onMount(async () => {
		// Connect wallet automatically on the same tab.
		const account = sessionStorage.getItem('account');
		if (!account) return;

		const parsedAccount = JSON.parse(account) as AccountInfo;
		activeAccount.set(parsedAccount);

		const { address, source } = parsedAccount;
		if (source === 'WalletConnect') {
			const connection = createWCConnection();
			await connection.initialize();
			walletConnect.set(connection);

			const accounts = await connection.getAccounts();
			const filteredAccounts = accounts.filter(
				({ id }) => convertToPolkadotAddress(id.split(':')[2]) === address
			);
			if (filteredAccounts.length !== 1) {
				activeAccount.set(undefined);
				sessionStorage.clear();
			} else {
				polkadotSigner.set(filteredAccounts[0].polkadotSigner as PolkadotSigner);
			}
		} else {
			const selectedExtension = await connectInjectedExtension(source);
			const accounts = selectedExtension.getAccounts();
			const injectedAccounts = accounts.filter(
				(account) => convertToPolkadotAddress(account.address) === address
			);
			if (injectedAccounts.length !== 1) {
				activeAccount.set(undefined);
				console.error('something went wrong while trying to restore session.');
				return;
			} else {
				polkadotSigner.set(injectedAccounts[0].polkadotSigner);
			}
		}

		setActiveAccountBounties();
	});

	async function logOut() {
		activeAccount.set(undefined);
		sessionStorage.clear();
		activeAccountBounties.set([]);
		if ($wcConnection) {
			await $wcConnection.disconnect();
		}
	}
</script>

<header
	class="relative flex items-center justify-between h-20 bg-primary px-4 sm:px-12 overflow-clip"
>
	<div class="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 pt-2">
		<a href="/curator-actions" class="hidden md:inline-flex">
			<img width="307" height="62" src={LogoBountyManagerDesktop} alt="Logo" />
		</a>
		<a href="/curator-actions" class="md:hidden">
			<img width="71" height="54" src={LogoBountyManagerMobile} alt="Logo" />
		</a>
	</div>

	<div class="ml-auto">
		{#if !$activeAccount}
			<button class=" text-white" on:click={showLoginDialog}>Connect Wallet</button>

			<w3m-button></w3m-button>
		{:else}
			<div class="flex items-center space-x-3">
				<div class=" flex gap-2 items-center text-white">
					<div class="w-6 h-6">
						<PolkadotIcon address={$activeAccount.address} />
					</div>
					{$activeAccount.name || 'Account'}
					<span class="text-darkgray text-sm">[{truncateString($activeAccount.address, 4)}]</span>
				</div>
				<button on:click={() => logOut()} class="mt-2">
					<span class="material-symbols-outlined text-white text-2xl">logout</span>
				</button>
			</div>
		{/if}
	</div>
</header>

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
