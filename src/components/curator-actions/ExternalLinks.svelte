<script lang="ts">
	import LogoTreasuryWhite from '../svg/curator-actions-logos/LogoTreasuryWhite.svg';
	import LogoSubscanWhite from '../svg/curator-actions-logos/LogoSubscanWhite.svg';
	import LogoSubsquareWhite from '../svg/curator-actions-logos/LogoSubsquareWhite.svg';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logos/LogoPolkassemblyWhite.svg';
	import ExternalLinksButton from '../ExternalLinksButton.svelte';

	export let bountyId: number;
	export let dimension = 6;
</script>

<div class="space-x-2">
	<ExternalLinksButton
		url={`https://polkadot.subscan.io/bounty/${bountyId}`}
		icon={LogoSubscanWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url={`https://polkadot.dotreasury.com/#/bounties/${bountyId}`}
		icon={LogoTreasuryWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url={`https://polkadot.subsquare.io/treasury/bounty/${bountyId}`}
		icon={LogoSubsquareWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url={`https://polkadot.polkassembly.io/bounty/${bountyId}`}
		icon={LogoPolkassemblyWhite}
		{dimension}
	/>
</div>
