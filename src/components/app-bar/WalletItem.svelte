<script lang="ts">
	import ForwardIcon from '../svg/ForwardIcon.svelte';
	import type { WalletInfo } from './LoginDialog.svelte';

	export let wallet: WalletInfo;
	let bgClass = wallet.action === 'Connect' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10';

	async function walletClicked() {}
</script>

<div class={`cursor-pointer flex justify-between items-center p-4 rounded-lg mb-2 ${bgClass}`}>
	<!-- Wallet Icon and Name -->
	<div class="flex items-center space-x-3">
		<span class="w-10 h-10">
			<svelte:component this={wallet.icon} />
		</span>
		<span class="text-white text-2xl">{wallet.name}</span>
	</div>

	<!-- Action Button -->
	<button on:click={walletClicked} class="flex items-center space-x-1">
		<span class="text-white">{wallet.action}</span>
		<span class="mb-1"><ForwardIcon></ForwardIcon></span>
	</button>
</div>
