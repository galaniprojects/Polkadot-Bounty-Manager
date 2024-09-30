<script lang="ts">
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../stores';
</script>

<AppBar />
<LoadingScreen bind:dialogState={$loadingDialogState} />
<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
