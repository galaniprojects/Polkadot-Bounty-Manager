<script>
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import BountySetup from '../components/bounty-setup/BountySetup.svelte';
</script>

<BountySetup />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
