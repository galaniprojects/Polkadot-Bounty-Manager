<script lang="ts">
	import ForwardIcon from '../svg/ForwardIcon.svelte';
	import type { WalletInfo } from './LoginDialog.svelte';

	export let wallet: WalletInfo;
	let bgClass = wallet.action === 'Connect' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10';
</script>

<div
	class={`cursor-pointer flex flex-col p-2 s:flex-row s:justify-between s:items-center s:p-4 rounded-lg ${bgClass}`}
>
	<!-- Wallet Icon and Name -->
	<div class="flex items-center space-x-1 sm:space-x-2">
		<span class="w-10 h-10">
			<svelte:component this={wallet.icon} />
		</span>
		<span class="text-white text-2xl">{wallet.name}</span>
	</div>

	<!-- Action Button -->
	<div class="flex justify-end items-center sm:space-x-1">
		<span class="text-white">{wallet.action}</span>
		<span class="mb-1 w-5 h-5"><ForwardIcon /></span>
	</div>
</div>
