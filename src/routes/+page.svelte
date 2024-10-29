<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/curator-actions');
		let a = sessionStorage.getItem("account")
		console.log(a)
		console.log(">>>>>>>>>>>>>>>")
	});
</script>
