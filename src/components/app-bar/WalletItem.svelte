<script lang="ts">
	import type { WalletInfo } from './walletInfo';

	export let wallet: WalletInfo;
</script>

<span
	class="walletContainer"
	class:walletAvailable={wallet.available}
	class:walletUnavailable={!wallet.available}
>
	<!-- Wallet Icon and Name -->
	<span class="walletInfo">
		<span class="walletIcon">
			<img src={wallet.icon} alt="Logo" />
		</span>
		<span class="walletName">{wallet.name}</span>
	</span>

	<!-- Action Button -->
	<span class="walletAction">
		<span>
			{#if wallet.available}
				Connect
			{:else}
				Download
			{/if}
		</span>
		<span class="material-symbols-outlined walletIconArrow"> arrow_forward_ios </span>
	</span>
</span>

<style>
	.walletContainer {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		padding: 8px;
		border-radius: 8px;
	}

	.walletAvailable {
		background-color: theme('colors.backgroundButtonLight');
	}

	.walletUnavailable {
		background-color: theme('colors.backgroundButtonDark');
		color: theme('colors.backgroundApp');
	}

	@media (min-width: 375px) {
		.walletContainer {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 16px;
		}
	}

	.walletInfo {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	@media (min-width: 375px) {
		.walletInfo {
			gap: 8px;
		}
	}

	.walletIcon {
		width: 40px;
		height: 40px;
	}

	.walletName {
		font-size: 1.5rem;
	}

	.walletAction {
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 8px;
	}

	.walletIconArrow {
		margin-bottom: 4px;
		font-size: 16px;
	}
</style>
