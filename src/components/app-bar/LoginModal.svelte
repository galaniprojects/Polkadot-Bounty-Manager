<script lang="ts">
	import type { WalletInfo } from './walletInfo';
	import WalletItem from './WalletItem.svelte';
	import AccountItem from './AccountItem.svelte';
	import LogoPolkadotWallet from '../svg/wallet-logo/LogoPolkadotWallet.svg';
	import LogoWalletConnect from '../svg/wallet-logo/LogoWalletConnect.svg';
	import LogoNovaWallet from '../svg/wallet-logo/LogoNovaWallet.svg';
	import LogoTalisman from '../svg/wallet-logo/LogoTalisman.svg';
	import LogoMimir from '../svg/wallet-logo/LogoMimir.svg';
	import { onMount } from 'svelte';
	import CloseModalButton from '../Modal/CloseModalButton.svelte';
	import { clickAway, modalStyles } from '../Modal/tools';
	import { activeAccount, polkadotSigner } from '../../stores';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import { getInjectedExtensions } from 'polkadot-api/pjs-signer';
	import { type AccountWithSigner } from '../../types/account';
	import { updateAccountMultisigsOnBlockchain } from '../curator-actions/updateAccountMultisigsOnBlockchain';
	import { showErrorModal } from '../modals';
	import { getAccounts } from './getAccounts';
	import { maybeInjectMimir } from './maybeInjectMimir';
	import { dialog as ref } from './loginModalStores';

	let wallets: WalletInfo[] = [];
	let accounts: AccountWithSigner[] = [];
	let currentPhase: 'walletSelection' | 'waiting' | 'accountSelection' = 'walletSelection';
	let selectedWallet: WalletInfo | undefined;

	interface Nova {
		ethereum?: { isNovaWallet: boolean };
	}

	const novaWalletAvailable =
		(typeof window !== 'undefined' && (window as unknown as Nova).ethereum?.isNovaWallet) || false;

	onMount(async () => {
		await maybeInjectMimir();
		const extensionNames = getInjectedExtensions();
		wallets = [
			{
				icon: LogoWalletConnect,
				name: 'WalletConnect',
				source: 'WalletConnect',
				available: true
			},
			{
				icon: LogoMimir,
				name: 'Mimir',
				source: 'mimir',
				url: 'https://app.mimir.global/',
				available: extensionNames.includes('mimir')
			},
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
				icon: LogoNovaWallet,
				name: 'Nova Wallet',
				source: 'polkadot-js',
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
			const observer = new MutationObserver((events) => {
				const hasWCModal = events.find(({ addedNodes }) =>
					[...addedNodes].some(({ nodeName }) => nodeName === 'WCM-MODAL')
				);
				if (hasWCModal) {
					// do not cover Wallet Connect "modal"
					$ref.close();
				}
			});

			const { source } = wallet;
			const isWalletConnect = source === 'WalletConnect';

			if (isWalletConnect) {
				observer.observe(document.body, { childList: true, subtree: true });
			}

			accounts = await getAccounts(source);

			if (isWalletConnect) {
				observer.disconnect();
				$ref.showModal();
			}
		} catch (e) {
			$ref.close();
			currentPhase = 'walletSelection';
			showErrorModal(
				'Wallet connection failed. Make sure the Bounty Manager has access to your wallet accounts.'
			);
			console.error(e);
			return;
		}

		if (accounts.length === 0) {
			$ref.close();
			currentPhase = 'walletSelection';
			showErrorModal(
				'No accounts found. Make sure the Bounty Manager has access to your wallet accounts.'
			);
			return;
		}

		currentPhase = 'accountSelection';
	}

	async function selectAccount(account: AccountWithSigner) {
		$ref.close();
		activeAccount.set(account);
		polkadotSigner.set(account.polkadotSigner);
		sessionStorage.setItem('account', JSON.stringify(account));
		setActiveAccountBounties();
		await updateAccountMultisigsOnBlockchain();
	}

	function backToWalletSelection() {
		currentPhase = 'walletSelection';
		selectedWallet = undefined;
	}
</script>

<!-- Base Modal Layout -->
<dialog bind:this={$ref} use:clickAway class={modalStyles.dialog}>
	<!-- Header -->
	<div class="flex flex-row-reverse justify-between items-center sm:mb-0">
		<CloseModalButton />

		{#if currentPhase !== 'walletSelection'}
			<button on:click={backToWalletSelection} class="material-symbols-outlined text-2xl mb-1">
				arrow_back_ios
			</button>
		{/if}
	</div>

	<section class="s:max-h-96 pb-3">
		<!-- Wallet Selection -->
		{#if currentPhase === 'walletSelection'}
			<p class="flex justify-center text-2xl">CHOOSE YOUR WALLET</p>
			<a
				href="/docs/multix-walletconnect"
				target="_blank"
				class="flex justify-center opacity-50 underline underline-offset-2 mb-2"
			>
				Follow the instructions in the new tab
			</a>
			<div class="cursor-pointer w-full space-y-3 pb-3">
				{#each wallets as wallet (wallet.name)}
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
							class="absolute top-0 left-0 w-14 h-14 border-4 border-t-backgroundButtonDark border-backgroundButtonLight rounded-full animate-spin"
						></div>
					</div>
				</div>

				<div class="grid items-center text-center gap-2 text-md mt-14">
					<p>WAITING FOR AUTHORIZATION</p>
					<p>
						Please authorize your {selectedWallet?.name} wallet extension to connect to Bounty Manager.
					</p>
				</div>
			</div>

			<!-- Account Selection -->
		{:else if currentPhase === 'accountSelection'}
			<p class="flex justify-center text-2xl">SELECT ACCOUNT</p>
			<hr class="border-backgroundButtonDark opacity-35 mt-4 w-full" />
			<div class="account-items w-full max-h-64 overflow-y-auto pr-3">
				{#each accounts as account (account.address)}
					<button
						class="w-full"
						on:click={async () => {
							await selectAccount(account);
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
			<hr class="border-backgroundButtonDark opacity-35 mb-3 w-full" />
			<div class="flex justify-end items-center">
				<div class="w-6 h-6">
					{#if selectedWallet?.icon}
						<img src={selectedWallet.icon} alt="Logo" />
					{/if}
				</div>
				<button class="flex items-center px-4">
					{selectedWallet?.name} &nbsp |
				</button>
				<button on:click={backToWalletSelection} class="flex items-center"> Switch </button>
			</div>
		</div>
	{/if}
</dialog>

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
