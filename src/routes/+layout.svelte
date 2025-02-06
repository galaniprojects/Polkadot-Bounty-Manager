<script lang="ts">
	import { PUBLIC_HIDE_TEST_BAR } from '$env/static/public';
	import '../app.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { dotApi, loadingDialogState } from '../stores';
	import TestBar from '../components/TestBar.svelte';
	import Footer from '../components/Footer/Footer.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { initializeApi } from '../utils/initializeApi';
	import { endpoints } from '../utils/endpoints';
	import { hideLoadingDialog, showLoadingDialog } from '../utils/loading-screen';

	// prerender only the outer frame without contents
	const apiNotUsed = ['/imprint', '/404'].includes(page.url.pathname);
	const renderChildren = typeof window !== 'undefined' || apiNotUsed;

	let apiInitialized = $state(false);

	onMount(async () => {
		if (typeof $dotApi === 'undefined') {
			showLoadingDialog('Connecting to Polkadot...');
			await initializeApi(endpoints);

			hideLoadingDialog();
		}
		apiInitialized = true;
	});
</script>

{#if !PUBLIC_HIDE_TEST_BAR}
	<TestBar />
{/if}
<div class="bg-accent text-xs md:text-lg text-white flex justify-center items-center">
	<p class="m-2">This is a beta version, some features may still be incomplete.</p>
</div>
<AppBar />

<LoadingScreen bind:dialogState={$loadingDialogState} />

{#if renderChildren && apiInitialized}<slot />{/if}

<Footer />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.primary);
	}
</style>
