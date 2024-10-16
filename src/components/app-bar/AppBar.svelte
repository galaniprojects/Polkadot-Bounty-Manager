<script lang="ts">
	import { isLoggedIn, loggedAccounts, activeAccount } from '../../stores';
	import LogoBountyManagerMobile from '../svg/header-footer-logos/LogoBountyManagerMobile.svelte';
	import LoginDialog from './LoginDialog.svelte';

	let loginDialogOpen = false;

	async function showLoginDialog() {
		loginDialogOpen = true;
	}
</script>

<header class="relative flex items-center justify-between h-20 bg-primary px-4 sm:px-12">
	<div class="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
		<LogoBountyManagerMobile/>
	</div>
	<div class="ml-auto">
		{#if !$isLoggedIn}
			<button class=" text-white" on:click={() => showLoginDialog()}> sign in</button>

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
</header>

<section class="h-10 bg-secondary w-full">

</section>

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
