<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import { bounties } from '../../stores';

	onMount(async () => {
		if ($bounties.length === 0) {
			await fetchBountiesAndChildBounties();
		}
	});
</script>

<slot />
