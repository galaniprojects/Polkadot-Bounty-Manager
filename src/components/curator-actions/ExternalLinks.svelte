<script lang="ts" context="module">
	export function openLinkNewTab(link: string) {
		let newTab = window.open(link, '_blank');
		if (newTab) {
			newTab.focus();
		}
	}
</script>

<script lang="ts">
	import LogoTreasuryWhite from '../svg/curator-actions-logo/LogoTreasuryWhite.svelte';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logo/LogoPolkassemblyWhite.svelte';
	import LogoSubscanWhite from '../svg/curator-actions-logo/LogoSubscanWhite.svelte';
	import LogoSubsquareWhite from '../svg/curator-actions-logo/LogoSubsquareWhite.svelte';

	export let bountyId: number;
</script>

<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.dotreasury.com/#/bounties/${bountyId}`);
	}}
	class="w-10 h-10 lg:w-6 lg:h-6"
>
	<LogoTreasuryWhite />
</button>
<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.polkassembly.io/bounty/${bountyId}`);
	}}
	class="w-10 h-10 lg:w-6 lg:h-6"
>
	<LogoPolkassemblyWhite />
</button>
<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.subscan.io/bounty/${bountyId}`);
	}}
	class="w-10 h-10 lg:w-6 lg:h-6"
>
	<LogoSubscanWhite />
</button>
<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.subsquare.io/treasury/bounty/${bountyId}`);
	}}
	class="w-10 h-10 lg:w-6 lg:h-6"
>
	<LogoSubsquareWhite />
</button>
