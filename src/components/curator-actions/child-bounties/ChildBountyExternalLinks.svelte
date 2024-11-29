<script lang="ts">
	import LogoSubsquarePink from '../../svg/curator-actions-logos/LogoSubsquarePink.svg';
	import LogoTreasuryPink from '../../svg/curator-actions-logos/LogoTreasuryPink.svg';
	import ExternalLinksButton from '../../ExternalLinksButton.svelte';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<div class="mr-4">
	<ExternalLinksButton
		url={`https://polkadot.dotreasury.com/#/child-bounties/${childBountyId}`}
		icon={LogoTreasuryPink}
		{dimension}
		backgroundColor="white"
		textColor="primary"
		buttonStyle="bg-accent text-white"
	/>
</div>
<div class="mr-4">
	<ExternalLinksButton
		url={`https://polkadot.subsquare.io/treasury/child-bounties/${childBountyId}`}
		icon={LogoSubsquarePink}
		{dimension}
		backgroundColor="white"
		textColor="primary"
		buttonStyle="bg-accent text-white"
	/>
</div>
