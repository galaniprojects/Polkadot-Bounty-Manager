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
	import AccountItem from './AccountItem.svelte';
	import LogoPolkadotWallet from '../svg/wallet-logo/LogoPolkadotWallet.svelte';
	import LogoWalletConnect from '../svg/wallet-logo/LogoWalletConnect.svelte';
	import LogoNovaWallet from '../svg/wallet-logo/LogoNovaWallet.svelte';
	import LogoTalisman from '../svg/wallet-logo/LogoTalisman.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { walletConnect } from './wallet-connect';

	import {
		activeAccount,
		injectedPolkadotAccount,
		walletConnectPolkadotSigner
	} from '../../stores';
	import { SetActiveAccountBounties } from '../../utils/bounties';
	import {
		connectInjectedExtension,
		getInjectedExtensions,
		type InjectedPolkadotAccount,
		type PolkadotSigner
	} from 'polkadot-api/pjs-signer';
	import { SupportedSources, type AccountInfo } from '../../types/account';
	import { showErrorDialog } from '../../utils/loading-screen';
	import { walletConnect as wcConnection } from '../../stores';
	import { convertToPolkadotAddress } from '../../utils/polkadot';

	const APP_NAME = 'Bounty Manager';

	export let title = '';
	export let open;

	let wallets: WalletInfo[] = [];
	let injectedAccounts: InjectedPolkadotAccount[] | undefined;
	let accounts: AccountInfo[] = [];
	let currentPhase: 'walletSelection' | 'waiting' | 'accountSelection' = 'walletSelection';
	let selectedWallet: WalletInfo | undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const novaWalletAvailable = (window as any).ethereum && (window as any).ethereum.isNovaWallet;

	onMount(async () => {
		const extensionNames: string[] = getInjectedExtensions();
		wallets = [
			{
				icon: LogoPolkadotWallet,
				name: 'Polkadot.js',
				action:
					// !novaWalletAvailable to prevent polkadot button from being enabled on Nova.
					extensionNames.includes(SupportedSources.PolkadotExtension) && !novaWalletAvailable
						? 'Connect'
						: 'Download'
			},
			{ icon: LogoWalletConnect, name: 'WalletConnect', action: 'Connect' },
			{
				icon: LogoNovaWallet,
				name: 'Nova Wallet',
				action: novaWalletAvailable ? 'Connect' : 'Download'
			},
			{
				icon: LogoTalisman,
				name: 'Talisman',
				action: extensionNames.includes(SupportedSources.TalismanExtension) ? 'Connect' : 'Download'
			}
		];
	});

	onDestroy(async () => {
		if ($wcConnection) {
			await $wcConnection.disconnect();
		}
	});

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
			let selectedSource: SupportedSources;
			switch (wallet.name) {
				case 'Polkadot.js':
					selectedSource = SupportedSources.PolkadotExtension;
					break;
				case 'WalletConnect':
					selectedSource = SupportedSources.WalletConnect;
					break;
				case 'Nova Wallet':
					selectedSource = SupportedSources.PolkadotExtension;
					break;
				case 'Talisman':
					selectedSource = SupportedSources.TalismanExtension;
					break;
				default:
					throw new Error('Internal error, unsupported extension');
			}

			if (selectedSource == SupportedSources.WalletConnect) {
				accounts = await walletConnect();
			} else {
				let injectedExtension;
				try {
					injectedExtension = await connectInjectedExtension(selectedSource, APP_NAME);
				} catch (e) {
					open = false;
					showErrorDialog(
						'Wallet connection failed. Make sure the Bounty Mananger has access to your wallet accounts.'
					);
					console.error(e);
					return;
				}
				injectedAccounts = injectedExtension.getAccounts();
				accounts = injectedAccounts.map((account) => {
					return {
						name: account.name || 'Account',
						source: selectedSource,
						address: convertToPolkadotAddress(account.address)
					};
				});
			}
		}

		if (accounts.length === 0) {
			open = false;
			showErrorDialog(
				'No accounts found. Make sure the Bounty Mananger has access to your wallet accounts.'
			);
			return;
		}

		currentPhase = 'accountSelection';
	}

	function selectAccount(account: AccountInfo) {
		activeAccount.set(account);

		if (account.source !== SupportedSources.WalletConnect) {
			sessionStorage.setItem('account', JSON.stringify(account));
		} else {
			if ('signer' in account && account.signer) {
				walletConnectPolkadotSigner.set(account.signer as PolkadotSigner);
			}
		}

		if (injectedAccounts) {
			let injectedAccount = injectedAccounts.filter((acc) => {
				return acc.address === account.address;
			});
			injectedPolkadotAccount.set(injectedAccount[0]);

			SetActiveAccountBounties();
		}
		open = false;
	}

	function backToWalletSelection() {
		currentPhase = 'walletSelection';
		selectedWallet = undefined;
	}
	export let openDialog = true;

	$: if (openDialog) {
		document.body.classList.add('overflow-hidden');
	} else {
		document.body.classList.remove('overflow-hidden');
	}
	onDestroy(() => {
		document.body.classList.remove('overflow-hidden');
	});
</script>

<!-- Base Modal Layout -->
{#if openDialog}
	<div
		class="flex justify-center fixed inset-0 w-screen z-10 bg-black bg-opacity-60 overflow-y-auto"
	></div>
	<div class="flex justify-center fixed inset-0 w-screen z-20 py-52 overflow-y-auto">
		<div
			class="flex flex-col mx-2 h-fit w-[300px] xs:w-[490px] rounded-md bg-primary p-3 sm:p-5 overflow-y-auto"
		>
			<!-- Header -->
			<div class="flex justify-between items-center text-white sm:mb-0">
				{#if currentPhase !== 'walletSelection'}
					<button on:click={backToWalletSelection} class="material-symbols-outlined text-2xl mb-1">
						arrow_back_ios
					</button>
				{/if}

				<div class={currentPhase === 'walletSelection' ? 'ml-auto' : ''}>
					<button class="material-symbols-outlined text-3xl mt-3" on:click={() => (open = false)}>
						cancel
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
								<AccountItem name={account.name} address={account.address} />
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
						<button class="flex items-center text-white px-4">{selectedWallet?.name} &nbsp |</button
						>
						<button on:click={backToWalletSelection} class="text-white flex items-center"
							>Switch
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

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
		margin-top: 0.5rem;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 10px;
	}

	.account-items::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.55);
		border-radius: 10px;
	}
</style>
