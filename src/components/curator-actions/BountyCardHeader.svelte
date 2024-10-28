<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { truncateString } from '../../utils/common';

	export let bounty: Bounty;
	export let status: string;
	export let isParentExpanded: boolean;

</script>

<div class="text-white max-h-fit p-5 lg:px-10 w-full">
	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start">
			<span class="text-xl lg:text-2xl">
				#{`${bounty.id}`}
				{`${bounty.description}`}
			</span>
		</div>

		<button
			on:click={()=>isParentExpanded = !isParentExpanded}
			class="material-symbols-outlined text-white text-3xl self-start pt-3"
		>
			{#if isParentExpanded}
				keyboard_arrow_up
			{:else}
				keyboard_arrow_down
			{/if}
		</button>
	</div>

	<div class="flex justify-between">
		<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:mt-0">
			<section class="flex space-x-1 lg:w-52">
				<p>Proposer:</p>
				<p>{truncateString(bounty.proposer, 8)}</p>
			</section>
			<section class="flex space-x-1 lg:w-52">
				<p>Status:</p>
				<p>{status}</p>
			</section>
		</div>
		<span class="pr-0.5 material-symbols-rounded text-2xl text-extendButtonBackground lg:hidden">
			warning
		</span>
	</div>
</div>
