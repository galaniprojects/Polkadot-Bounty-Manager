<script lang="ts">
	import LogoSubsquarePink from '../../svg/curator-actions-logos/LogoSubsquarePink.svg';
	import LogoTreasuryPink from '../../svg/curator-actions-logos/LogoTreasuryPink.svg';
	import LogoPolkassemblyPink from '../../svg/curator-actions-logos/LogoPolkassemblyPink.svg';
	import ExternalLinksButton from '../../ExternalLinksButton.svelte';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<div class="space-x-3.5">
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

	<ExternalLinksButton
		url={`https://polkadot.polkassembly.io/child_bounty/${childBountyId}`}
		icon={LogoPolkassemblyPink}
		{dimension}
	/>
</div>
