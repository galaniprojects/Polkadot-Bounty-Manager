<script lang="ts">
	import { onMount } from 'svelte';
	import {
		isLoggedIn,
		loggedAccounts,
		activeAccount,
		walletConnectProvider,
		walletConnectSession,
		walletConnectSigner
	} from '../../stores';
	import LoginDialog from './LoginDialog.svelte'
	import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
	import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
	import UniversalProvider from '@walletconnect/universal-provider';
	import { WalletConnectModal } from '@walletconnect/modal';
	import type { SessionTypes } from '@walletconnect/types';
	import { POLKADOT_CHAIN_ID, WALLET_CONNECT_SOURCE, WalletConnectSigner } from '../../utils/WcSigner';

	let loginDialogOpened = false;
	let availableExtensions: Array<string> = [];
	let selectedExtension: string | undefined;

	async function walletConnect() {
		const projectId = '75706f3e77002695ab0d89128b3e35bc';
		const provider: UniversalProvider = await UniversalProvider.init({
			projectId: projectId,
			relayUrl: 'wss://relay.walletconnect.com'
		});
		walletConnectProvider.set(provider);

		const params = {
			requiredNamespaces: {
				polkadot: {
					methods: ['polkadot_signTransaction'],
					chains: [POLKADOT_CHAIN_ID],
					events: ['chainChanged", "accountsChanged']
				}
			}
		};
		const { uri, approval } = await provider.client.connect(params);

		const walletConnectModal = new WalletConnectModal({
			projectId: projectId,
			chains: [POLKADOT_CHAIN_ID],
			enableExplorer: false
		});

		if (uri) {
			walletConnectModal.openModal({ uri });
		} else {
			//ToDo error.
		}

		const wcSession: SessionTypes.Struct = await approval();
		console.log(wcSession);
		walletConnectSession.set(wcSession);
		if (wcSession.peer.metadata.name !== 'Multix') {
			//ToDo show error message.
			return;
		}

		const walletConnectAccount = Object.values(wcSession.namespaces)
			.map((namespace) => namespace.accounts)
			.flat();

		const accountsss = walletConnectAccount.map((wcAccount) => {
			const address = wcAccount.split(':')[2];
			let accountWithMeta: InjectedAccountWithMeta = {
				address: address,
				meta: {
					source: WALLET_CONNECT_SOURCE
				}
			};
			return accountWithMeta;
		});

		let signer = new WalletConnectSigner(provider.client, wcSession);
		walletConnectSigner.set(signer);

		loggedAccounts.set(accountsss);
		activeAccount.set(accountsss[0]);
		isLoggedIn.set(true);
		walletConnectModal.closeModal();

		loginDialogOpened = false;
		return;
	}

	async function logIn() {
		const accounts = await web3Accounts({
			extensions: [selectedExtension!],
			ss58Format: 0
		});

		if (accounts.length > 0) {
			loggedAccounts.set(accounts);
			activeAccount.set(accounts[0]);
			isLoggedIn.set(true);
		} else {
			//TODO: handle no addresses.
		}

		loginDialogOpened = false;
	}

	async function showLoginDialog() {
		loginDialogOpened = true;
	}

	onMount(async () => {
		const extensions = await web3Enable('my cool dapp');
		availableExtensions =
			extensions.map((extension) => {
				return extension.name;
			}) || [];
		if (availableExtensions.length > 0) {
			selectedExtension = availableExtensions[0];
		} else {
			//TODO: handle no extensions.
		}
	});
</script>

<div class="flex justify-end h-20 bg-primary">
	{#if !$isLoggedIn}
		<button class=" text-white basic-button" on:click={() => showLoginDialog()}> signin</button>

		<w3m-button></w3m-button>
	{:else}
		<select class="w-52 h-10 rounded-md" bind:value={$activeAccount}>
			{#each $loggedAccounts as account}
				<option value={account}>
					({account.meta.name || ''}) {account.address.toWellFormed().substring(0, 15) + '...'}
				</option>
			{/each}
		</select>
	{/if}
</div>

<!-- <BountyDialog title="Login" bind:opened={loginDialogOpened}> -->
<!-- 	<div class="h-auto flex flex-col justify-between"> -->
<!-- 		<div class="grid gap-2 px-5"> -->
<!-- 			<p>Select Wallet</p> -->
<!-- 			<select class="w-52 h-10 rounded-md" bind:value={selectedExtension}> -->
<!-- 				{#each availableExtensions as extension} -->
<!-- 					<option value={extension}> -->
<!-- 						{extension} -->
<!-- 					</option> -->
<!-- 				{/each} -->
<!-- 			</select> -->
<!-- 		</div> -->
<!-- 		<div class="flex items-end justify-center"> -->
<!-- 			<button class="button-active text-white bg-accent" on:click={() => logIn()}> -->
<!-- 				connect wallet -->
<!-- 			</button> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="flex items-end justify-center">OR</div> -->
<!-- 		<div class="flex items-end justify-center"> -->
<!-- 			<button class="button-active text-white bg-accent" on:click={() => walletConnect()}> -->
<!-- 				walletConnect -->
<!-- 			</button> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- </BountyDialog> -->

<LoginDialog title="CHOOSE YOUR WALLET" bind:opened={loginDialogOpened}>
	<div class="h-auto flex flex-col justify-between">
		<div class="grid gap-2 px-5">
			<p>Select Wallet</p>
			<select class="w-52 h-10 rounded-md" bind:value={selectedExtension}>
				{#each availableExtensions as extension}
					<option value={extension}>
						{extension}
					</option>
				{/each}
			</select>
		</div>
		<div class="flex items-end justify-center">
			<button class="button-active text-white bg-accent" on:click={() => logIn()}> login </button>
		</div>
	</div>
</LoginDialog>
