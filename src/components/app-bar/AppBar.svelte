<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, polkadotSigner } from '../../stores';
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerHeader from './LogoBountyManagerHeader.svg';
	import LoginDialog from './LoginDialog.svelte';
	import { setActiveAccountBounties } from '../../utils/bounties';
	import { getPeopleChainName } from '../../utils/people';
	import { getAccounts } from './getAccounts';
	import { type AccountInfo } from '../../types/account';
	import BurgerMenu from './BurgerMenu.svelte';

	let loginDialogOpen = false;

	function showLoginDialog() {
		loginDialogOpen = true;
	}

	let label: string | undefined;

	onMount(async () => {
		// Connect wallet automatically on the same tab.
		const storedAccount = sessionStorage.getItem('account');
		if (!storedAccount) return;

		const parsedAccount = JSON.parse(storedAccount) as AccountInfo;
		activeAccount.set(parsedAccount);

		const { address, source } = parsedAccount;

		const accounts = await getAccounts(source);
		const account = accounts.find((account) => account.address === address);
		if (!account) {
			activeAccount.set(undefined);
			sessionStorage.clear();
			console.error('something went wrong while trying to restore session.');
			return;
		}

		polkadotSigner.set(account.polkadotSigner);
		setActiveAccountBounties();
	});

	$: {
		label = undefined;
		(async () => {
			if (!$activeAccount) return;
			label = await getPeopleChainName($activeAccount.address);
		})();
	}
</script>

<header class="relative flex items-center justify-between min-h-20 bg-primary px-4 sm:px-12">
	<div>
		<a href="/curator-actions">
			<img width="71" height="54" src={LogoBountyManagerHeader} alt="Logo Bounty Manager" />
		</a>
	</div>

	<div>
		{#if !$activeAccount}
			<button class=" text-white" on:click={showLoginDialog}>Connect Wallet</button>

			<w3m-button></w3m-button>
		{:else}
			<!-- User Address -->
			<div class="flex items-center align-top space-x-3">
				<div class=" flex gap-2 items-center text-white">
					<div class="w-6 h-6">
						<PolkadotIcon address={$activeAccount.address} />
					</div>
					{label || $activeAccount.name || 'Account'}
					<span class="text-darkgray text-sm">[{truncateString($activeAccount.address, 4)}]</span>
				</div>
				<BurgerMenu />
			</div>
		{/if}
	</div>
</header>

{#if loginDialogOpen}
	<LoginDialog title="CHOOSE YOUR WALLET" bind:open={loginDialogOpen} />
{/if}
