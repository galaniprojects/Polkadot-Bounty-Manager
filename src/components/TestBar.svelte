<script lang="ts">
	import { showAllBounties, showAllCuratorOptions } from '../stores';
</script>

<div class="w-100">
	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<span class="text-white">all bounties</span>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<span class="text-white">all options</span>
		</label>
	</div>
</div>
