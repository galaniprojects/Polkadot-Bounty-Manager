<script lang="ts">
	import '../app.css';
	import AppBar from '../components/AppBar.svelte';
	import BountySetup from '../components/bounty-setup/BountySetup.svelte';
</script>


<AppBar/>
<BountySetup/>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
