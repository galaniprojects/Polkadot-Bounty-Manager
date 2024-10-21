<script lang="ts">
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../stores';
	import FooterBar from '../components/FooterBar.svelte';
</script>

<AppBar />
<LoadingScreen bind:dialogState={$loadingDialogState} />
<slot />
<FooterBar />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
