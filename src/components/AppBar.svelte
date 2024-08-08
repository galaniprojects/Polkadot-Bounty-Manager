<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn, loggedAddresses, activeAddress } from '../stores';
	import { connectInjectedExtension, getInjectedExtensions } from 'polkadot-api/pjs-signer';
	import BountyDialog from './BountyDialog.svelte';

	let loginDialogOpened = false;
	let availableExtensions: Array<string> = [];
	let selectedExtension = '';

	async function getAccounts() {
		const extension = await connectInjectedExtension(selectedExtension);
		let accounts = extension.getAccounts();
		const addresses = accounts.map((account) => account.address);

		if (accounts.length > 0) {
			loggedAddresses.set(addresses);
			activeAddress.set(addresses[0]);
			isLoggedIn.set(true);
		}
		loginDialogOpened = false;
	}

	async function logIn() {
		loginDialogOpened = true;
	}

	onMount(() => {
		availableExtensions = getInjectedExtensions() || [];
		if (availableExtensions.length > 0) {
			selectedExtension = availableExtensions[0];
		}
	});
</script>

<div class="flex justify-end h-20 bg-primary">
	{#if !$isLoggedIn}
		<button class=" text-white basic-button" on:click={() => logIn()}> signin</button>
	{:else}
		<select class="w-52 h-10 rounded-md" bind:value={$activeAddress}>
			{#each $loggedAddresses as address}
				<option value={address}>
					{address}
				</option>
			{/each}
		</select>
	{/if}
</div>

<BountyDialog title="Login" bind:opened={loginDialogOpened}>
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
			<button class="button-active text-white bg-accent" on:click={() => getAccounts()}>
				login
			</button>
		</div>
	</div>
</BountyDialog>
