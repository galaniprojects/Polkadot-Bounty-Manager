<script lang="ts">
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import ForwardIcon from '../svg/ForwardIcon.svg';
	import { getPeopleChainName } from '../../utils/people';
	import Checkmark from '../common/Checkmark.svg';

	export let name;
	export let address: string;

	let label: string | undefined;
	$: {
		label = undefined;
		(async () => {
			label = await getPeopleChainName(address);
		})();
	}
</script>

<div
	class="cursor-pointer flex justify-between items-center bg-white bg-opacity-20 px-2 s:px-5 py-2 rounded-lg mt-2"
>
	<!-- Account Identicon and Name -->
	<div class="flex items-center space-x-3">
		<div class="w-10 h-10">
			<PolkadotIcon {address} />
		</div>
		<div class="flex flex-col text-white">
			<span class="self-start">{name}</span>
			<span class="text-sm whitespace-nowrap">
				{#if label !== undefined}
					<img
						class="w-4 h-4 inline-block align-sub"
						src={Checkmark}
						alt="Account name from People Blockchain"
					/>
				{/if}
				{label || truncateString(address, 20)}
			</span>
		</div>
	</div>

	<!-- Action Button -->
	<div class="flex items-center space-x-1">
		<span class="text-white text-base">Select</span>
		<span class="mb-1"><img src={ForwardIcon} alt="Forward" /></span>
	</div>
</div>
