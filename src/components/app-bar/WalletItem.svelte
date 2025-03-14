<script lang="ts">
	import type { WalletInfo } from './walletInfo';

	export let wallet: WalletInfo;
</script>

<span class="container" class:available={wallet.available} class:unavailable={!wallet.available}>
	<!-- Wallet Icon and Name -->
	<span class="info">
		<span class="icon">
			<img src={wallet.icon} alt="Logo" />
		</span>
		<span class="name">{wallet.name}</span>
	</span>

	<!-- Action Button -->
	<span class="action">
		<span>
			{#if wallet.available}
				Connect
			{:else}
				Download
			{/if}
		</span>
		<span class="material-symbols-outlined arrow"> arrow_forward_ios </span>
	</span>
</span>

<style>
	.container {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		padding: 8px;
		border-radius: 8px;
	}

	.available {
		background-color: theme('colors.backgroundButtonLight');
	}

	.unavailable {
		background-color: theme('colors.backgroundButtonDark');
		color: theme('colors.backgroundApp');
	}

	@media (min-width: 375px) {
		.container {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 16px;
		}
	}

	.info {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	@media (min-width: 375px) {
		.info {
			gap: 8px;
		}
	}

	.icon {
		width: 40px;
		height: 40px;
	}

	.name {
		font-size: 1.5rem;
	}

	.action {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.arrow {
		margin-bottom: 4px;
		font-size: 16px;
	}
</style>
