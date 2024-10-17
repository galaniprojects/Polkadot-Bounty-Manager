<script lang="ts">
	import { isLoggedIn, loggedAccounts, activeAccount } from '../../stores';
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svelte';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svelte';
	import LogoutIcon from '../svg/header-footer-logos/LogoutIcon.svelte';
	import LoginDialog from './LoginDialog.svelte';

	let loginDialogOpen = false;

	//Milestone 2 feature, hidden for now
	// let isToggled = false;

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
			<!-- <select class="w-52 h-10 rounded-md" bind:value={$activeAccount}>
				{#each $loggedAccounts as account}
					<option value={account}>
						({account.meta.name || ''}) {account.address.toWellFormed().substring(0, 15) + '...'}
					</option>
				{/each}
			</select> -->
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

<!-- Milestone 2 feature, hidden for now -->
<!-- <section class="h-10 bg-secondary w-full flex items-center justify-center space-x-2">
	<p class="text-sm text-white {!isToggled ? '' : 'text-opacity-50'}">All bounties</p>
	<span class="custom-toggle"><ToggleIcon bind:checked={isToggled} /> </span>
	<p class="text-white text-sm {isToggled ? '' : 'text-opacity-50'}">Curator view</p>
</section> -->

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}

<!-- Milestone 2 feature, hidden for now -->
<!-- <style>
	.custom-toggle {
		--toggle-background: rgba(255,255,255,0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.white');
	}
</style> -->
