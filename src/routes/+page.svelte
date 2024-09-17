<script lang="ts">
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import BountySetup from '../components/bounty-setup/BountySetup.svelte';
	import AppBar from '../components/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../stores';
</script>

<AppBar />
<BountySetup />
<LoadingScreen bind:dialogState={$loadingDialogState} />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
