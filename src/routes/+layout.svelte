<script lang="ts">
	import { PUBLIC_HIDE_TEST_BAR } from '$env/static/public';
	import '../app.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { loadingDialogState } from '../stores';
	import Footer from '../components/Footer.svelte';
	import TestBar from '../components/TestBar.svelte';
</script>

{#if !PUBLIC_HIDE_TEST_BAR}
	<TestBar />
{/if}
<div class="bg-accent text-xs md:text-lg text-white flex justify-center items-center">
	<p class="m-2">This is a beta version, some features may still be incomplete.</p>
</div>
<AppBar />
<LoadingScreen bind:dialogState={$loadingDialogState} />
<slot />
<Footer />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.primary);
	}
</style>
