<script lang="ts">
	import { isLoggedIn, loggedAccounts, activeAccount } from '../../stores';
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svelte';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svelte';
	import LogoutIcon from '../svg/header-footer-logos/LogoutIcon.svelte';
	import LoginDialog from './LoginDialog.svelte';

	let loginDialogOpen = false;

	async function showLoginDialog() {
		loginDialogOpen = true;
	}

	async function logOut() {
		loggedAccounts.set([]);
		// ToDo: reset active account as well
		// activeAccount;
		isLoggedIn.set(false);
	}
</script>

<header class="relative flex items-center justify-between h-20 bg-primary px-4 sm:px-12">
	<div class="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 pt-2">
		<span class="hidden md:inline-flex"><LogoBountyManagerDesktop /></span>
		<span class="md:hidden"><LogoBountyManagerMobile /></span>
	</div>
	<div class="ml-auto">
		{#if !$isLoggedIn}
			<button class=" text-white" on:click={() => showLoginDialog()}>sign in</button>

			<w3m-button></w3m-button>
		{:else}
			<div class="flex items-center space-x-3">
				<select class="w-fit h-10 bg-primary text-white rounded-md" bind:value={$activeAccount}>
					{#each $loggedAccounts as account}
						<option value={account}>
							{account.meta.name || ''}
						</option>
					{/each}
				</select>
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
