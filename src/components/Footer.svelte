<script lang="ts">
	import LogoBountyManagerDesktop from './svg/header-footer-logos/LogoBountyManagerDesktop.svg';
	import { page } from '$app/stores';

	$: isOnImprintPage = $page.url.pathname === '/imprint';
</script>

<hr class="dotted-line border border-accent border-dotted bg-primary" />
<footer class="bg-primary flex flex-col justify-center items-center pt-5 pb-6 space-y-6">
	<p>
		<img width="307" height="62" src={LogoBountyManagerDesktop} alt="Logo" />
	</p>
	<a
		href={isOnImprintPage ? '/curator-actions' : '/imprint'}
		class="text-sm text-white underline underline-offset-2 pr-5"
	>
		{isOnImprintPage ? 'Back' : 'Imprint and Terms & Conditions'}
	</a>
</footer>
