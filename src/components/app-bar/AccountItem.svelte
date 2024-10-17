<script>
	import { truncateString } from '../../utils/common';
	import ForwardIcon from '../svg/ForwardIcon.svelte';
	import { polkadotIcon } from '@polkadot/ui-shared';

	export let name;
	export let address;
</script>

<div
	class="cursor-pointer flex justify-between items-center bg-white bg-opacity-20 px-2 s:px-5 py-2 rounded-lg mt-2"
>
	<!-- Account Identicon and Name -->
	<div class="flex items-center space-x-3">
		<span class="w-10 h-10">
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 64 64"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
			>
				{#each polkadotIcon(address, { isAlternative: false }) as icon}
					<circle cx={icon.cx} cy={icon.cy} fill={icon.fill} r={icon.r}></circle>
				{/each}
			</svg>
		</span>
		<div class="grid justify-center text-white">
			<span>{name}</span>
			<span class="text-sm">{truncateString(address, 20)}</span>
		</div>
	</div>

	<!-- Action Button -->
	<button class="flex items-center space-x-1">
		<span class="text-white text-base">Select</span>
		<span class="mb-1"><ForwardIcon /></span>
	</button>
</div>
