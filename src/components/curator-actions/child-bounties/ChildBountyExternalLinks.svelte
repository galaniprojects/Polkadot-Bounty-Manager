<script lang="ts">
	import ExternalLinksButton from '../../ExternalLinksButton.svelte';
	import LogoTreasuryWhite from '../../svg/curator-actions-logos/LogoTreasuryWhite.svg';
	import LogoSubsquareWhite from '../../svg/curator-actions-logos/LogoSubsquareWhite.svg';
	import LogoPolkassemblyWhite from '../../svg/curator-actions-logos/LogoPolkassemblyWhite.svg';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<div class="space-x-3.5">
	<ExternalLinksButton
		url={`https://polkadot.dotreasury.com/#/child-bounties/${childBountyId}`}
		icon={LogoTreasuryWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url={`https://polkadot.subsquare.io/treasury/child-bounties/${childBountyId}`}
		icon={LogoSubsquareWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url={`https://polkadot.polkassembly.io/child_bounty/${childBountyId}`}
		icon={LogoPolkassemblyWhite}
		{dimension}
	/>
</div>
