<script lang="ts" context="module">
	export type SupportedWallets = 'Polkadot.js' | 'WalletConnect' | 'Nova Wallet' | 'Talisman';
	export type WalletInfo = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		name: SupportedWallets;
		action: 'Download' | 'Connect';
	};
</script>

<script lang="ts">
	import WalletItem from './WalletItem.svelte';
	import BackIcon from '../svg/BackIcon.svelte';
	import CloseIcon from '../svg/CloseIcon.svelte';
	import AccountItem from './AccountItem.svelte';
	import LogoPolkadotWallet from '../svg/wallet-logo/LogoPolkadotWallet.svelte';
	import LogoWalletConnect from '../svg/wallet-logo/LogoWalletConnect.svelte';
	import LogoNovaWallet from '../svg/wallet-logo/LogoNovaWallet.svelte';
	import LogoTalisman from '../svg/wallet-logo/LogoTalisman.svelte';
	import { onMount } from 'svelte';
	import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
	import { walletConnect } from './wallet-connect';
	import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
	import { isLoggedIn, loggedAccounts, activeAccount } from '../../stores';
	import { SetActiveAccountBounties } from '../../utils/bounties';

	const POLKADOT_EXTENSION = 'polkadot-js';
	//TODO: check name of extension.
	const NOVA_EXTENSION = 'nova';
	const TALISMAN_EXTENSION = 'talisman';

	export let title = '';
	export let open;

	let wallets: WalletInfo[] = [];

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let extensionNames = Object.keys((window as any).injectedWeb3);
		wallets = [
			{
				icon: LogoPolkadotWallet,
				name: 'Polkadot.js',
				action: extensionNames.includes(POLKADOT_EXTENSION) ? 'Connect' : 'Download'
			},
			{ icon: LogoWalletConnect, name: 'WalletConnect', action: 'Connect' },
			{
				icon: LogoNovaWallet,
				name: 'Nova Wallet',
				action: extensionNames.includes(NOVA_EXTENSION) ? 'Connect' : 'Download'
			},
			{
				icon: LogoTalisman,
				name: 'Talisman',
				action: extensionNames.includes(TALISMAN_EXTENSION) ? 'Connect' : 'Download'
			}
		];
	});

	let accounts: InjectedAccountWithMeta[] = [];

	let currentPhase: 'walletSelection' | 'waiting' | 'accountSelection' = 'walletSelection';
	let selectedWallet: WalletInfo | undefined;

	async function selectWallet(wallet: WalletInfo) {
		selectedWallet = wallet;
		if (wallet.action === 'Download') {
			switch (wallet.name) {
				case 'Polkadot.js':
					window.open('https://polkadot.js.org/extension/', '_blank')!.focus();
					return;
				case 'WalletConnect':
					return;
				case 'Nova Wallet':
					window.open('https://novawallet.io/', '_blank')!.focus();
					return;
				case 'Talisman':
					window.open('https://www.talisman.xyz/', '_blank')!.focus();
					return;
			}
		} else {
			currentPhase = 'waiting';
			let extensionName = '';
			switch (wallet.name) {
				case 'Polkadot.js':
					extensionName = POLKADOT_EXTENSION;
					await web3Enable('Bounty Manager');
					await web3FromSource(extensionName);
					break;
				case 'WalletConnect':
					try {
						accounts = await walletConnect();
					} catch {
						//TODO: show rejection message?
						return;
					}
					break;
				case 'Nova Wallet':
					extensionName = NOVA_EXTENSION;
					await web3Enable('Bounty Manager');
					await web3FromSource(extensionName);
					break;
				case 'Talisman':
					extensionName = TALISMAN_EXTENSION;
					await web3Enable('Bounty Manager');
					await web3FromSource(extensionName);
					break;
				default:
					throw new Error('internal error, unsupported extension');
			}
			if (wallet.name !== 'WalletConnect') {
				accounts = await web3Accounts({
					extensions: [extensionName],
					ss58Format: 0
				});
			}

			for (let i = 0; i < accounts.length; i++) {
				if (!accounts[i].meta.name) {
					accounts[i].meta.name = `[${extensionName}] ${i + 1}`;
				}
			}

			loggedAccounts.set(accounts);
		}

		currentPhase = 'accountSelection';
	}

	function selectAccount(account: InjectedAccountWithMeta) {
		isLoggedIn.set(true);
		activeAccount.set(account);
		SetActiveAccountBounties();
		open = false;
	}

	function backToWalletSelection() {
		currentPhase = 'walletSelection';
		selectedWallet = undefined;
	}
</script>

<!-- Base Modal Layout -->
<div class="flex justify-center fixed inset-0 w-screen z-10 bg-black bg-opacity-60"></div>
<div class="flex justify-center fixed inset-0 w-screen z-20 py-52">
	<div class="flex flex-col mx-2 h-fit w-[300px] xs:w-[490px] rounded-md bg-primary p-3 sm:p-5">
		<!-- Header -->
		<div class="flex justify-between items-center mb-1 sm:mb-0">
			{#if currentPhase !== 'walletSelection'}
				<button on:click={backToWalletSelection}>
					<BackIcon />
				</button>
			{/if}

			<div class={currentPhase === 'walletSelection' ? 'ml-auto' : ''}>
				<button class="fill-white" on:click={() => (open = false)}>
					<CloseIcon />
				</button>
			</div>
		</div>

		<section class="s:max-h-96 pb-3">
			<!-- Wallet Selection -->
			{#if currentPhase === 'walletSelection'}
				<p class="flex justify-center text-2xl text-white">{title}</p>
				<hr class="border-white opacity-35 w-full mt-4 mb-3" />
				<div class="cursor-pointer w-full space-y-3">
					{#each wallets as wallet}
						<button class="w-full" on:click={() => selectWallet(wallet)}>
							<WalletItem {wallet} />
						</button>
					{/each}
				</div>

				<!-- Waiting for Authorization -->
			{:else if currentPhase === 'waiting'}
				<div class="p-12">
					<div class="flex items-center justify-center">
						<div class="relative">
							<div class="w-6 h-6 ml-4 mt-4">
								{#if selectedWallet?.icon}
									<svelte:component this={selectedWallet.icon} />
								{/if}
							</div>
							<div
								class="absolute top-0 left-0 w-14 h-14 border-4 border-t-gray-500 border-white rounded-full animate-spin"
							></div>
						</div>
					</div>

					<div class="grid items-center text-center gap-2 text-white text-md mt-14">
						<p>WAITING FOR AUTHORIZATION</p>
						<p>
							Please authorize your {selectedWallet?.name} wallet extension to connect to Bounty Manager.
						</p>
					</div>
				</div>

				<!-- Account Selection -->
			{:else if currentPhase === 'accountSelection'}
				<p class="flex justify-center text-2xl text-white">SELECT ACCOUNT</p>
				<hr class="border-white opacity-35 mt-4 w-full" />
				<div class="account-items w-full max-h-64 overflow-y-auto pr-3">
					{#each accounts as account}
						<button class="w-full" on:click={() => selectAccount(account)}>
							<AccountItem name={account.meta.name} address={account.address} />
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Footer -->
		{#if currentPhase !== 'walletSelection'}
			<div class="mt-auto">
				<hr class="border-white opacity-35 mb-3 w-full" />
				<div class="flex justify-end items-center">
					<div class="w-6 h-6">
						{#if selectedWallet?.icon}
							<svelte:component this={selectedWallet.icon} />
						{/if}
					</div>
					<button class="flex items-center text-white px-4">{selectedWallet?.name} &nbsp |</button>
					<button on:click={backToWalletSelection} class="text-white flex items-center"
						>Switch
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.account-items::-webkit-scrollbar {
		width: 5px;
	}

	.account-items::-webkit-scrollbar-track {
		@apply mt-2;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 10px;
	}

	.account-items::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.55);
		border-radius: 10px;
	}
</style>
