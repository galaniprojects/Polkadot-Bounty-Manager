<script lang="ts">
	import { onMount } from 'svelte';
	import { activeAccount, dotApi, polkadotSigner } from '../../stores';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import LogoBountyManagerHeader from './LogoBountyManagerHeader.svg';
	import LoginModal from './LoginModal.svelte';
	import { showLoginModal } from './loginModalStores';
	import { updateAccountMultisigsOnBlockchain } from '../curator-actions/updateAccountMultisigsOnBlockchain';
	import PeopleChainName from '../PeopleChainName.svelte';
	import { getAccounts } from './getAccounts';
	import { type AccountInfo } from '../../types/account';
	import BurgerMenu from './BurgerMenu.svelte';
	import { page } from '$app/state';
	import { initializeApi } from '../../utils/initializeApi';
	import { currentBlockchain } from './blockchains';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import ChainMenu from './ChainMenu.svelte';
	import LoadingModal from '../LoadingModal/LoadingModal.svelte';

	onMount(async () => {
		if (typeof $dotApi === 'undefined') {
			await initializeApi($currentBlockchain.endpoints);
			await connectStoredAccount();
		}

		await fetchBountiesAndChildBounties();
	});

	async function connectStoredAccount() {
		// Connect wallet automatically on the same tab.
		const storedAccount = sessionStorage.getItem('account');
		if (!storedAccount) return;

		const { address, source } = JSON.parse(storedAccount) as AccountInfo;

		const accounts = await getAccounts(source);
		const account = accounts.find((account) => account.address === address);
		if (!account) {
			sessionStorage.removeItem('account');
			throw new Error('Something went wrong while trying to restore session.');
		}

		await updateAccountMultisigsOnBlockchain(account);
		activeAccount.set(account);
		polkadotSigner.set(account.polkadotSigner);
	}

	let isCuratorViewActive = false;

	function toggleView() {
		isCuratorViewActive = !isCuratorViewActive;
	}
</script>

<header class="header">
	<!-- First Element -->
	<div class="first">
		<a href="/curator-actions">
			<img width="46" height="30" src={LogoBountyManagerHeader} alt="Logo Bounty Manager" />
		</a>
		<ChainMenu />
	</div>

	<!-- Second Element -->
	<button class="toggleContainer" on:click={toggleView}>
		<div class="toggleSlider {isCuratorViewActive ? 'curatorViewActive' : ''}"></div>
		<div class="toggleOption {isCuratorViewActive ? 'inactive' : 'active'}">All Bounties</div>
		<div class="toggleOption {isCuratorViewActive ? 'active' : 'inactive'}">Curator view</div>
	</button>

	<!-- Third Element -->
	<div>
		{#if !$activeAccount}
			{#if !page.url.pathname.startsWith('/docs/')}
				<button on:click={showLoginModal}>Connect Wallet</button>
			{/if}
			<w3m-button></w3m-button>
		{:else}
			<div class="third">
				<button
					type="button"
					class="account"
					on:click={async () => {
						await navigator.clipboard.writeText($activeAccount.address);
					}}
				>
					<span class="w-5 h-5">
						<PolkadotIcon address={$activeAccount.address} />
					</span>
					<PeopleChainName address={$activeAccount.address}>
						{$activeAccount.name || 'Account'}
					</PeopleChainName>
				</button>
				<BurgerMenu />
			</div>
		{/if}
	</div>
</header>

<LoadingModal />
<LoginModal />

<style>
	.header {
		position: relative;
		display: flex;
		justify-self: center;
		justify-content: space-between;
		align-items: end;
		min-height: 80px;
		padding: 8px;
		width: 100%;
		margin-top: 10px;
	}
	.first {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.toggleContainer {
		position: relative;
		display: flex;
		background: theme('colors.backgroundButtonLight');
		border-radius: 12px;
		width: 218px;
		height: 50px;
		align-items: center;
		cursor: pointer;
	}

	.toggleSlider {
		position: absolute;
		top: 5px;
		left: 5px;
		width: 110px;
		height: 40px;
		background: theme('colors.backgroundButtonDark');
		border-radius: 12px;
		transition: transform 0.3s ease-in-out;
	}

	.toggleOption {
		flex: auto;
		text-align: center;
		user-select: none;
		position: relative;
		transition: color 0.3s ease-in-out 0.05s;
	}

	.curatorViewActive {
		transform: translateX(98px);
	}

	.active {
		color: white;
	}

	.inactive {
		color: theme('colors.textPrimary');
		font-size: 14px;
	}

	.third {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.account {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	@media (min-width: 768px) {
		.header {
			width: 754px;
			padding: 0px;
		}
	}
	@media (max-width: 375px) {
		.toggleContainer {
			width: 150px;
			padding: 2px;
		}
		.toggleSlider {
			width: 70px;
		}
		.curatorViewActive {
			transform: translateX(70px);
		}
		.active,
		.inactive {
			font-size: 12px;
		}
	}
</style>
