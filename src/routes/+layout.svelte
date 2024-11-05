<script lang="ts">
	import '../app.css';
	import '../components/bounty-setup/style.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../stores';
	import Footer from '../components/Footer.svelte';
	import TestBar from '../components/TestBar.svelte';
</script>

<div class="bg-accent text-white h-10 flex justify-center items-center">
	<p>This is a beta version, some features may not work correctly.</p>
</div>
<TestBar />
<AppBar />
<LoadingScreen bind:dialogState={$loadingDialogState} />
<slot />
<Footer />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.primary);
	}
</style>
