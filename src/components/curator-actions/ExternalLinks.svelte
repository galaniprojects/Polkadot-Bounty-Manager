<script lang="ts">
	import LogoTreasuryWhite from '../svg/curator-actions-logos/LogoTreasuryWhite.svg';
	import LogoSubscanWhite from '../svg/curator-actions-logos/LogoSubscanWhite.svg';
	import LogoSubsquareWhite from '../svg/curator-actions-logos/LogoSubsquareWhite.svg';
	import ExternalLinksButton from '../ExternalLinksButton.svelte';

	export let bountyId: number;
	export let dimension = 6;
</script>

<div class="mr-4">
	<ExternalLinksButton
		url={`https://polkadot.subscan.io/bounty/${bountyId}`}
		icon={LogoSubscanWhite}
		{dimension}
	/>
</div>
<div class="mr-4">
	<ExternalLinksButton
		url={`https://polkadot.dotreasury.com/#/bounties/${bountyId}`}
		icon={LogoTreasuryWhite}
		{dimension}
	/>
</div>
<div class="mr-4">
	<ExternalLinksButton
		url={`https://polkadot.subsquare.io/treasury/bounty/${bountyId}`}
		icon={LogoSubsquareWhite}
		{dimension}
	/>
</div>
