<script lang="ts">
	import LogoSubsquarePink from '../../svg/curator-actions-logos/LogoSubsquarePink.svelte';
	import LogoTreasuryPink from '../../svg/curator-actions-logos/LogoTreasuryPink.svelte';
	import ExternalLinksButton from '../../ExternalLinksButton.svelte';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<ExternalLinksButton
	url={`https://polkadot.dotreasury.com/#/child-bounties/${childBountyId}`}
	icon={LogoTreasuryPink}
	{dimension}
/>
<ExternalLinksButton
	url={`https://polkadot.subsquare.io/treasury/child-bounties/${childBountyId}`}
	icon={LogoSubsquarePink}
	{dimension}
/>
