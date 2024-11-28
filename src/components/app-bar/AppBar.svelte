<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		walletConnect as wcConnection,
		activeAccount,
		injectedPolkadotAccount,
		activeAccountBounties,
		walletConnectPolkadotSigner,
		walletConnect
	} from '../../stores';
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svg';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svg';
	import LoginDialog from './LoginDialog.svelte';
	import { SetActiveAccountBounties } from '../../utils/bounties';
	import {
		connectInjectedExtension,
		type InjectedExtension,
		type InjectedPolkadotAccount,
		type PolkadotSigner
	} from 'polkadot-api/pjs-signer';
	import { SupportedSources, type AccountInfo } from '../../types/account';
	import { convertToPolkadotAddress } from '../../utils/polkadot';
	import { createWCConnection } from '../../utils/wallet-connect';

	let loginDialogOpen = false;

	function showLoginDialog() {
		loginDialogOpen = true;
	}

	onMount(async () => {
		// Connect wallet automatically on the same tab.
		let account = sessionStorage.getItem('account');

		if (account) {
			let parsedAccount = JSON.parse(account) as AccountInfo;
			activeAccount.set(parsedAccount);

			if (parsedAccount.source === SupportedSources.WalletConnect) {
				// Handle WalletConnect case.
				let connection = createWCConnection();
				await connection.initialize();
				walletConnect.set(connection);

				let accounts = await connection.getAccounts();
				let filteredAccounts = accounts.filter((acc) => {
					const address = acc.id.split(':')[2];
					return convertToPolkadotAddress(address) === parsedAccount.address;
				});
				if (filteredAccounts.length !== 1) {
					activeAccount.set(undefined);
					sessionStorage.clear();
				} else {
					walletConnectPolkadotSigner.set(filteredAccounts[0].polkadotSigner as PolkadotSigner);
				}
			} else {
				// Handle extension case.
				const selectedExtension: InjectedExtension = await connectInjectedExtension(
					parsedAccount.source
				);
				const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();
				let injectedAccounts = accounts.filter((acc) => {
					return convertToPolkadotAddress(acc.address) === parsedAccount.address;
				});
				if (injectedAccounts.length !== 1) {
					activeAccount.set(undefined);
					console.error('something went wrong while trying to restore session.');
					return;
				} else {
					injectedPolkadotAccount.set(injectedAccounts[0]);
				}
			}

			// Set the relevant bounties for the signed in account.
			SetActiveAccountBounties();
		}
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
		<button on:click={() => goto('/curator-actions')} class="hidden md:inline-flex">
			<img width="307" height="62" src={LogoBountyManagerDesktop} alt="Logo" />
		</button>
		<button on:click={() => goto('/curator-actions')} class="md:hidden">
			<img width="71" height="54" src={LogoBountyManagerMobile} alt="Logo" />
		</button>
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
