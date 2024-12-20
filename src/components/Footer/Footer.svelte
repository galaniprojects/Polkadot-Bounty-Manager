<script lang="ts">
	import LogoBountyManagerDesktop from '../svg/header-footer-logos/LogoBountyManagerDesktop.svg';
	import LogoTelegram from './LogoTelegram.svg';
	import LogoEmail from './LogoEmail.svg';
	import LogoPolkadot from './LogoPolkadot.svg';
	import { page } from '$app/state';

	const isOnImprintPage = $derived(page.url.pathname === '/imprint');
</script>

<hr class="dotted-line border border-accent border-dotted bg-primary" />

<footer class="bg-primary flex flex-col justify-center items-center pt-5 pb-6 space-y-6">
	<!-- Bounty Manager Logo -->
	<p>
		<img width="225" height="47" src={LogoBountyManagerDesktop} alt="Logo" />
	</p>

	<!-- Telecommunication links-->
	<div class="flex space-x-6">
		<a href="https://t.me/bounty_manager_feedback" target="_blank" rel="noopener noreferrer">
			<img width="40" height="40" src={LogoTelegram} alt="Telegram Logo" />
		</a>
		<a href="mailto:bountymanager@galaniprojects.com">
			<img width="40" height="40" src={LogoEmail} alt="Email Logo" />
		</a>
	</div>

	<!-- Terms and Conditions -->
	<a
		href={isOnImprintPage ? '/curator-actions' : '/imprint'}
		class="text-xs text-white underline underline-offset-2 pr-5"
	>
		{isOnImprintPage ? 'Back' : 'Imprint and Terms & Conditions'}
	</a>

	<!-- Polkadot Logo -->
	<div class="flex items-baseline space-x-1">
		<p class="text-white text-xs">powered by</p>
		<img width="49" height="11" src={LogoPolkadot} alt="Polkadot Logo" />
	</div>
</footer>
