<script lang="ts">
	import { showAllBounties, showAllCuratorOptions } from '../stores';
</script>

<div class="w-100">
	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<p>all bounties</p>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<p>all options</p>
		</label>
	</div>
</div>
