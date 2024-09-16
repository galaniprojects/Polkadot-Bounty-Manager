<script>
	import ForwardIcon from '../svg/ForwardIcon.svelte';

	export let icon;
	export let name;
	export let action;

	let bgClass = action === 'Connect' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10';
</script>

<div class={`cursor-pointer flex justify-between items-center p-4 rounded-lg mb-2 ${bgClass}`}>
	<!-- Wallet Icon and Name -->
	<div class="flex items-center space-x-3">
		<span class="w-10 h-10">
			<svelte:component this={icon} />
		</span>
		<span class="text-white text-2xl">{name}</span>
	</div>

	<!-- Action Button -->
	<button class="flex items-center space-x-1">
		<span class="text-white">{action}</span>
		<span class="mb-1"><ForwardIcon></ForwardIcon></span>
	</button>
</div>
