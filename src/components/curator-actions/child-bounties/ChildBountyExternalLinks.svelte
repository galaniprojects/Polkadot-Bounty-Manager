<script lang="ts">
	import LogoPolkassemblyPink from '../../svg/curator-actions-logo/LogoPolkassemblyPink.svelte';
	import LogoSubsquarePink from '../../svg/curator-actions-logo/LogoSubsquarePink.svelte';
	import LogoTreasuryPink from '../../svg/curator-actions-logo/LogoTreasuryPink.svelte';
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
		openLinkNewTab(`https://polkadot.polkassembly.io/child_bounty/${childBountyId}`);
	}}
	class={`w-${dimension} h-${dimension}`}><LogoPolkassemblyPink /></button
>
<button
	on:click={() => {
		openLinkNewTab(`https://polkadot.subsquare.io/treasury/child-bounties/${childBountyId}`);
	}}
	class={`w-${dimension} h-${dimension}`}><LogoSubsquarePink /></button
>
