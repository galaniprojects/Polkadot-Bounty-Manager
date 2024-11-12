<script lang="ts">
	import LogoSubsquarePink from '../../svg/curator-actions-logos/LogoSubsquarePink.svelte';
	import LogoTreasuryPink from '../../svg/curator-actions-logos/LogoTreasuryPink.svelte';
	import { openLinkNewTab } from '../ExternalLinks.svelte';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.dotreasury.com/#/child-bounties/${childBountyId}`);
	}}
	class={`w-${dimension} h-${dimension}`}><LogoTreasuryPink /></button
>
<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.subsquare.io/treasury/child-bounties/${childBountyId}`);
	}}
	class={`w-${dimension} h-${dimension}`}><LogoSubsquarePink /></button
>
