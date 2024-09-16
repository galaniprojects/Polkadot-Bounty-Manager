<script lang="ts">
	import WalletItem from './WalletItem.svelte';
	import BackIcon from '../svg/BackIcon.svelte';
	import CloseIcon from '../svg/CloseIcon.svelte';
	import TempIdenticon from '../svg/TempIdenticon.svelte';
	import AccountItem from './AccountItem.svelte';
	import LogoPolkadotWallet from '../svg/wallet-logo/LogoPolkadotWallet.svelte';
	import LogoWalletConnect from '../svg/wallet-logo/LogoWalletConnect.svelte';
	import LogoNovaWallet from '../svg/wallet-logo/LogoNovaWallet.svelte';
	import LogoTalisman from '../svg/wallet-logo/LogoTalisman.svelte';

	export let opened = true;
	export let title = '';
	export let dismissable = true;

	let wallets = [
		{ icon: LogoPolkadotWallet, name: 'Polkadot.js', action: 'Connect' },
		{ icon: LogoWalletConnect, name: 'WalletConnect', action: 'Connect' },
		{ icon: LogoNovaWallet, name: 'Nova Wallet', action: 'Download' },
		{ icon: LogoTalisman, name: 'Talisman', action: 'Download' }
	];

	let accounts = [
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 1',
			address: '12BQrr99NdNz',
			action: 'Select'
		},
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 3',
			address: '12BQrr99NdNz',
			action: 'Select'
		},
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 4',
			address: '12BQrr99NdNz',
			action: 'Select'
		},
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 5',
			address: '12BQrr99NdNz',
			action: 'Select'
		},
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 6',
			address: '12BQrr99NdNz',
			action: 'Select'
		},
		{
			identicon: TempIdenticon,
			name: 'Polkadot Account 7',
			address: '12BQrr99NdNz',
			action: 'Select'
		}
	];

	let currentPhase: 'walletSelection' | 'waiting' | 'accountSelection' = 'walletSelection';
	let selectedWallet: any = null;
	let selectedAccount: any = null;

	function selectWallet(wallet: any) {
		selectedWallet = wallet;
		currentPhase = 'waiting';

		setTimeout(() => {
			currentPhase = 'accountSelection';
		}, 3000);
	}

	function selectAccount(account: any) {
		selectedAccount = account;
	}

	function backToWalletSelection() {
		currentPhase = 'walletSelection';
		selectedWallet = null;
	}
</script>

<!-- Base Modal Layout -->
{#if opened}
	<div class="flex justify-center fixed inset-0 w-screen z-10 bg-black bg-opacity-60"></div>
	<div class="flex justify-center fixed inset-0 w-screen z-20 py-52">
		<div class="flex flex-col w-[300px] md:w-[490px] h-fit rounded-md bg-primary pt-5 px-5 pb-3">
			<!-- Header -->
			<div class="flex justify-between items-center">
				{#if currentPhase !== 'walletSelection'}
					<button on:click={backToWalletSelection}>
						<BackIcon />
					</button>
				{/if}

				<div class={currentPhase === 'walletSelection' ? 'ml-auto' : ''}>
					{#if dismissable}
						<button on:click={() => (opened = false)}>
							<CloseIcon />
						</button>
					{/if}
				</div>
			</div>

			<section class="max-h-96 pb-3">
				<!-- Wallet Selection -->
				{#if currentPhase === 'walletSelection'}
					<p class="flex justify-center text-2xl text-white">{title}</p>
					<hr class="border-white opacity-35 w-full mt-4 mb-3" />
					<div class="cursor-pointer">
						{#each wallets as wallet}
							<div on:click={() => selectWallet(wallet)}>
								<WalletItem icon={wallet.icon} name={wallet.name} action={wallet.action} />
							</div>
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
					<div class="account-items max-h-64 overflow-y-auto pr-3">
						{#each accounts as account}
							<div on:click={() => selectAccount(account)}>
								<AccountItem
									identicon={account.identicon}
									name={account.name}
									address={account.address}
									action={account.action}
								/>
							</div>
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
		@apply mt-2;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 10px;
	}

	.account-items::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.55);
		border-radius: 10px;
	}
</style>
