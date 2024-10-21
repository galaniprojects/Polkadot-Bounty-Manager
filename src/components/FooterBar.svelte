<script>
	import LogoBountyManagerDesktop from './svg/header-footer-logos/LogoBountyManagerDesktop.svelte';
	import LogoBountyManagerMobile from './svg/header-footer-logos/LogoBountyManagerMobile.svelte';
</script>

<footer class="bg-primary relative flex justify-between items-center px-3 sm:px-12 py-6">
	<button class="text-sm text-white flex-grow text-left">Imprint</button>
	<div class="absolute inset-0 flex justify-center items-center">
		<span class="hidden lg:inline-flex"><LogoBountyManagerDesktop /></span>
		<span class="lg:hidden"><LogoBountyManagerMobile /></span>
	</div>
	<p class="text-sm text-white flex-grow text-right">galaniprojects GMbH 2024 | all rights reserved</p>
</footer>
