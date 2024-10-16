<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { truncateString } from '../../utils/common';

	export let bounty: Bounty;
	export let status: string;
</script>

<section class="text-white max-h-30 px-5 my-4 lg:px-10">
	<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center">
		<span class="text-xl lg:text-2xl">
			#{`${bounty.id}`}
			{`${bounty.description}`}
		</span>
	</div>

	<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:pl-12 lg:mt-0">
		<section class="flex space-x-1 mr-0 lg:w-52">
			<p>Proposer:</p>
			<p>{truncateString(bounty.proposer, 8)}</p>
		</section>
	</div>
</section>
