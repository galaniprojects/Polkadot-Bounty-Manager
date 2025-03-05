<script lang="ts">
	import ExternalLinksButton from '../../ExternalLinksButton.svelte';
	import LogoTreasuryWhite from '../../svg/curator-actions-logos/LogoTreasuryWhite.svg';
	import LogoSubsquareWhite from '../../svg/curator-actions-logos/LogoSubsquareWhite.svg';
	import LogoPolkassemblyWhite from '../../svg/curator-actions-logos/LogoPolkassemblyWhite.svg';
	import { currentBlockchain } from '../../app-bar/blockchains';

	export let dimension = 5;
	export let childBountyId: number;
</script>

<div class="space-x-3.5">
	{#if $currentBlockchain.baseUrls.doTreasury}
		<ExternalLinksButton
			url="{$currentBlockchain.baseUrls.doTreasury}/#/child-bounties/{childBountyId}"
			icon={LogoTreasuryWhite}
			{dimension}
		/>
	{/if}

	<ExternalLinksButton
		url="{$currentBlockchain.baseUrls.subSquare}/treasury/child-bounties/{childBountyId}"
		icon={LogoSubsquareWhite}
		{dimension}
	/>

	<ExternalLinksButton
		url="{$currentBlockchain.baseUrls.polkAssembly}/child_bounty/{childBountyId}"
		icon={LogoPolkassemblyWhite}
		{dimension}
	/>
</div>
