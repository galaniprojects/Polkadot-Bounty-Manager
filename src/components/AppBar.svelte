<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn, loggedAccounts, activeAccount } from '../stores';
	import BountyDialog from './BountyDialog.svelte';
	import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
	import LoginDialog from './LoginDialog.svelte';

	let loginDialogOpened = false;
	let availableExtensions: Array<string> = [];
	let selectedExtension: string | undefined;

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

<!-- <BountyDialog title="Login" bind:opened={loginDialogOpened}>
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
</BountyDialog> -->

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
