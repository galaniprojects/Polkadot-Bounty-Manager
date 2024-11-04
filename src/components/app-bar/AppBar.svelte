<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		activeAccount,
		activeAccountBounties,
		showAllBounties,
		showAllCuratorOptions
	} from '../../stores';
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../PolkadotIcon.svelte';
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svelte';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svelte';
	import LogoutIcon from '../svg/header-footer-logos/LogoutIcon.svelte';
	import LoginDialog from './LoginDialog.svelte';
	import { SetActiveAccountBounties } from '../../utils/bounties';
	import { web3Enable } from '@polkadot/extension-dapp';

	let loginDialogOpen = false;

	async function showLoginDialog() {
		loginDialogOpen = true;
	}

	onMount(async () => {
		// Connect wallet automatically on the same tab.
		let account = sessionStorage.getItem('account');

		if (account) {
			activeAccount.set(JSON.parse(account));
			await web3Enable('Bounty Manager');
			SetActiveAccountBounties();
		}
	});

	async function logOut() {
		activeAccount.set(undefined);
		sessionStorage.clear();
		activeAccountBounties.set([]);
	}
</script>

<header
	class="relative flex items-center justify-between h-20 bg-primary px-4 sm:px-12 overflow-clip"
>
	<label class="flex gap-3 mx-4">
		<input type="checkbox" bind:checked={$showAllBounties} />
		<p class="text-white">all bounties</p>
	</label>
	<label class="flex gap-3">
		<input type="checkbox" bind:checked={$showAllCuratorOptions} />
		<p class="text-white">all options</p>
	</label>
	<div class="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 pt-2">
		<button on:click={() => goto('/curator-actions')} class="hidden md:inline-flex"
			><LogoBountyManagerDesktop /></button
		>
		<button on:click={() => goto('/curator-actions')} class="md:hidden"
			><LogoBountyManagerMobile /></button
		>
	</div>
	<div class="ml-auto">
		{#if !$activeAccount}
			<button class=" text-white" on:click={() => showLoginDialog()}>Connect Wallet</button>

			<w3m-button></w3m-button>
		{:else}
			<div class="flex items-center space-x-3">
				<div class=" flex gap-2 items-center text-white">
					<div class="w-6 h-6">
						<PolkadotIcon address={$activeAccount.address} />
					</div>
					{$activeAccount.meta.name || 'Account'}
					<span class="text-darkgray text-sm">[{truncateString($activeAccount.address, 4)}]</span>
				</div>
				<button on:click={() => logOut()}>
					<LogoutIcon />
				</button>
			</div>
		{/if}
	</div>
</header>

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
