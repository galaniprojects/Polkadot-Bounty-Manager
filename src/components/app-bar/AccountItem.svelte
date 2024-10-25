<script>
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../PolkadotIcon.svelte';
	import ForwardIcon from '../svg/ForwardIcon.svelte';

	export let name;
	export let address;
</script>

<div
	class="cursor-pointer flex justify-between items-center bg-white bg-opacity-20 px-2 s:px-5 py-2 rounded-lg mt-2"
>
	<!-- Account Identicon and Name -->
	<div class="flex items-center space-x-3">
		<div class="w-10 h-10">
			<PolkadotIcon {address} />
		</div>
		<div class="grid justify-center text-white">
			<span>{name}</span>
			<span class="text-sm">{truncateString(address, 20)}</span>
		</div>
	</div>

	<!-- Action Button -->
	<div class="flex items-center space-x-1">
		<span class="text-white text-base">Select</span>
		<span class="mb-1"><ForwardIcon /></span>
	</div>
</div>
