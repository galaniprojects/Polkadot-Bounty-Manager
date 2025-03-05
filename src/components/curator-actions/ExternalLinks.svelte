<script lang="ts">
	import LogoTreasuryWhite from '../svg/curator-actions-logos/LogoTreasuryWhite.svg';
	import LogoSubscanWhite from '../svg/curator-actions-logos/LogoSubscanWhite.svg';
	import LogoSubsquareWhite from '../svg/curator-actions-logos/LogoSubsquareWhite.svg';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logos/LogoPolkassemblyWhite.svg';
	import ExternalLinksButton from '../ExternalLinksButton.svelte';
	import { currentBlockchain } from '../app-bar/blockchains';

	export let bountyId: number;
	export let dimension: number;
</script>

<div class="space-x-2">
	<ExternalLinksButton
		url="{$currentBlockchain.baseUrls.subScan}/bounty/{bountyId}"
		icon={LogoSubscanWhite}
		{dimension}
	/>

	{#if $currentBlockchain.baseUrls.doTreasury}
		<ExternalLinksButton
			url="{$currentBlockchain.baseUrls.doTreasury}/#/bounties/{bountyId}"
			icon={LogoTreasuryWhite}
			{dimension}
		/>
	{/if}

	<ExternalLinksButton
		url="{$currentBlockchain.baseUrls.subSquare}/treasury/bounty/{bountyId}"
		icon={LogoSubsquareWhite}
		{dimension}
	/>
	<ExternalLinksButton
		url="{$currentBlockchain.baseUrls.polkAssembly}/bounty/{bountyId}"
		icon={LogoPolkassemblyWhite}
		{dimension}
	/>
</div>
