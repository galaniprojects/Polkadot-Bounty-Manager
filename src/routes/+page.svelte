<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		replaceState('/curator-actions', {});
	});
</script>
