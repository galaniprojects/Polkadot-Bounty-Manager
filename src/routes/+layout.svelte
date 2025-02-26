<script lang="ts">
	import { hideTestBar } from '../utils/hideTestBar';
	import '../app.css';
	import AppBar from '../components/app-bar/AppBar.svelte';
	import SuccessModal from '../components/SuccessModal/SuccessModal.svelte';
	import LoadingModal from '../components/LoadingModal/LoadingModal.svelte';
	import ErrorModal from '../components/ErrorModal/ErrorModal.svelte';
	import { dotApi } from '../stores';
	import TestBar from '../components/TestBar.svelte';
	import Footer from '../components/Footer/Footer.svelte';
	import { page } from '$app/state';

	// prerender only the outer frame without contents
	const apiNotUsed = ['/imprint', '/404'].includes(page.url.pathname);
	const renderChildren = typeof window !== 'undefined' || apiNotUsed;
</script>

{#if !hideTestBar}
	<TestBar />
{/if}
<div class="bg-backgroundBounty text-xs md:text-lg flex justify-center items-center">
	<p class="m-2">This is a beta version, some features may still be incomplete.</p>
</div>
<AppBar />

<LoadingModal />
<SuccessModal />
<ErrorModal />

{#if renderChildren && $dotApi}<slot />{/if}

<Footer />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.backgroundApp);
	}
</style>
