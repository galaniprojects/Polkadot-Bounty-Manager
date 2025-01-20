<script lang="ts">
	import type { WalletInfo } from './walletInfo';
	import WalletItem from './WalletItem.svelte';
	import AccountItem from './AccountItem.svelte';
	import LogoPolkadotWallet from '../svg/wallet-logo/LogoPolkadotWallet.svg';
	import LogoWalletConnect from '../svg/wallet-logo/LogoWalletConnect.svg';
	import LogoNovaWallet from '../svg/wallet-logo/LogoNovaWallet.png';
	import LogoTalisman from '../svg/wallet-logo/LogoTalisman.svg';
	import { onDestroy, onMount } from 'svelte';
	import { activeAccount, polkadotSigner } from '../../stores';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import { getInjectedExtensions } from 'polkadot-api/pjs-signer';
	import { type AccountWithSigner } from '../../types/account';
	import { showErrorDialog } from '../../utils/loading-screen';
	import { getAccounts } from './getAccounts';

	export let title = '';
	export let open;

	let wallets: WalletInfo[] = [];
	let accounts: AccountWithSigner[] = [];
	let currentPhase: 'walletSelection' | 'waiting' | 'accountSelection' = 'walletSelection';
	let selectedWallet: WalletInfo | undefined;

	const ethereum = (window as unknown as { ethereum?: { isNovaWallet: boolean } }).ethereum;
	const novaWalletAvailable = Boolean(ethereum?.isNovaWallet);

	onMount(() => {
		const extensionNames = getInjectedExtensions();
		wallets = [
			{
				icon: LogoPolkadotWallet,
				name: 'Polkadot.js',
				source: 'polkadot-js',
				url: 'https://polkadot.js.org/extension/',
				available:
					// !novaWalletAvailable to prevent polkadot button from being enabled on Nova.
					extensionNames.includes('polkadot-js') && !novaWalletAvailable
			},
			{
				icon: LogoWalletConnect,
				name: 'WalletConnect',
				source: 'WalletConnect',
				available: true
			},
			{
				icon: LogoNovaWallet,
				name: 'Nova Wallet',
				source: 'nova',
				url: 'https://novawallet.io/',
				available: novaWalletAvailable
			},
			{
				icon: LogoTalisman,
				name: 'Talisman',
				source: 'talisman',
				url: 'https://www.talisman.xyz/',
				available: extensionNames.includes('talisman')
			}
		];
	});

	async function selectWallet(wallet: WalletInfo) {
		selectedWallet = wallet;
		currentPhase = 'waiting';

		try {
			accounts = await getAccounts(wallet.source);
		} catch (e) {
			open = false;
			showErrorDialog(
				'Wallet connection failed. Make sure the Bounty Manager has access to your wallet accounts.'
			);
			console.error(e);
			return;
		}

		if (accounts.length === 0) {
			open = false;
			showErrorDialog(
				'No accounts found. Make sure the Bounty Manager has access to your wallet accounts.'
			);
			return;
		}

		currentPhase = 'accountSelection';
	}

	function selectAccount(account: AccountWithSigner) {
		activeAccount.set(account);
		polkadotSigner.set(account.polkadotSigner);
		sessionStorage.setItem('account', JSON.stringify(account));
		setActiveAccountBounties();
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
					<button class="material-symbols-outlined text-3xl" on:click={() => (open = false)}>
						cancel
					</button>
				</div>
			</div>

			<section class="s:max-h-96 pb-3">
				<!-- Wallet Selection -->
				{#if currentPhase === 'walletSelection'}
					<p class="flex justify-center text-2xl text-white">{title}</p>
					<a
						href="https://github.com/galaniprojects/Polkadot-Bounty-Manager/wiki/Log%E2%80%90in-Instructions-for-Curators"
						target="_blank"
						rel="noopener noreferrer"
						class="flex justify-center text-white opacity-50 underline underline-offset-2 mb-2"
					>
						Follow the instructions in the new tab
					</a>
					<div class="cursor-pointer w-full space-y-3">
						{#each wallets as wallet}
							{#if wallet.available}
								<button class="w-full" on:click={() => selectWallet(wallet)}>
									<WalletItem {wallet} />
								</button>
							{:else if wallet.url}
								<a class="w-full block" href={wallet.url} target="_blank" rel="noopener noreferrer">
									<WalletItem {wallet} />
								</a>
							{/if}
						{/each}
					</div>

					<!-- Waiting for Authorization -->
				{:else if currentPhase === 'waiting'}
					<div class="p-12">
						<div class="flex items-center justify-center">
							<div class="relative">
								<div class="w-6 h-6 ml-4 mt-4">
									{#if selectedWallet?.icon}
										<img src={selectedWallet.icon} alt="Logo" />
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
							<button
								class="w-full"
								on:click={() => {
									selectAccount(account);
								}}
							>
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
								<img src={selectedWallet.icon} alt="Logo" />
							{/if}
						</div>
						<button class="flex items-center text-white px-4">
							{selectedWallet?.name} &nbsp |
						</button>
						<button on:click={backToWalletSelection} class="text-white flex items-center">
							Switch
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
