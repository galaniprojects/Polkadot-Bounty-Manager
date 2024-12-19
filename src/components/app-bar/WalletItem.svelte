<script lang="ts">
	import type { WalletInfo } from './walletInfo';

	export let wallet: WalletInfo;
	const opacity = wallet.available ? 'bg-opacity-20' : 'bg-opacity-10';
</script>

<span
	class="cursor-pointer flex flex-col p-2 s:flex-row s:justify-between s:items-center s:p-4 rounded-lg bg-white {opacity}"
>
	<!-- Wallet Icon and Name -->
	<span class="flex items-center space-x-1 sm:space-x-2">
		<span class="w-10 h-10">
			<img src={wallet.icon} alt="Logo" />
		</span>
		<span class="text-white text-2xl">{wallet.name}</span>
	</span>

	<!-- Action Button -->
	<span class="flex justify-end items-center sm:space-x-2 text-white">
		<span>
			{#if wallet.available}
				Connect
			{:else}
				Download
			{/if}
		</span>
		<span class="material-symbols-outlined mb-1"> arrow_forward_ios </span>
	</span>
</span>
