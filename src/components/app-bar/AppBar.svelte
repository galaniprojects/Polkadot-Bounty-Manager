<script lang="ts">
	import { isLoggedIn, loggedAccounts, activeAccount } from '../../stores';
	import LoginDialog from './LoginDialog.svelte';

	let loginDialogOpen = false;

	async function showLoginDialog() {
		loginDialogOpen = true;
	}
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

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
