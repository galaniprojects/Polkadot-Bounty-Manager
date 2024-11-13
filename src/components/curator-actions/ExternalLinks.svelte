<script lang="ts">
	import LogoTreasuryWhite from '../svg/curator-actions-logos/LogoTreasuryWhite.svelte';
	import LogoSubscanWhite from '../svg/curator-actions-logos/LogoSubscanWhite.svelte';
	import LogoSubsquareWhite from '../svg/curator-actions-logos/LogoSubsquareWhite.svelte';
	import ExternalLinksButton from '../ExternalLinksButton.svelte';

	export let bountyId: number;
</script>

<ExternalLinksButton
	url={`https://polkadot.dotreasury.com/#/bounties/${bountyId}`}
	icon={LogoTreasuryWhite}
	dimension={6}
/>
<ExternalLinksButton
	url={`https://polkadot.subscan.io/bounty/${bountyId}`}
	icon={LogoSubscanWhite}
	dimension={6}
/>
<ExternalLinksButton
	url={`https://polkadot.subsquare.io/treasury/bounty/${bountyId}`}
	icon={LogoSubsquareWhite}
	dimension={6}
/>
