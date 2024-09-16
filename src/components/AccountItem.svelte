<script>
	import ForwardIcon from './svg/ForwardIcon.svelte';

	export let identicon;
	export let name;
	export let address;
	export let action;
</script>

<div
	class="cursor-pointer flex justify-between items-center bg-white bg-opacity-20 px-5 py-2 rounded-lg mt-2"
>
	<!-- Account Identicon and Name -->
	<div class="flex items-center space-x-3">
		<span class="w-10 h-10">
			<svelte:component this={identicon} />
		</span>
		<div class="grid justify-center text-white">
			<span>{name}</span>
			<span class="text-sm">{address}</span>
		</div>
	</div>

	<!-- Action Button -->
	<button class="flex items-center space-x-1">
		<span class="text-white text-base">{action}</span>
		<span class="mb-1"><ForwardIcon></ForwardIcon></span>
	</button>
</div>
