<script lang="ts">
	import { bountyInfo } from '../../_bountyInfo';
	import Deposit from '../../../../components/Deposit.svelte';
</script>

{#if $bountyInfo}
	<p class="w-full md:w-2/3 text-sm sm:text-base">
		The Referendum for the approval of Bounty <br />
		#{$bountyInfo.id}
		{$bountyInfo.description} <br />
		has been created successfully!
		<br /><br />
		Please update the description of the referendum on Subsquare or Polkassembly and submit the decision
		deposit
		{#if $bountyInfo.track}(<Deposit getter={$bountyInfo.track.depositGetter} />){/if}
		within 7 days to ensure the referendum is valid. After successful execution of the referendum, the
		curators will need to accept the role to activate the bounty.
		<br /> <br />
		You can now return to the home screen or proceed to submit the curator approval referendum. It is
		recommended to submit the curator approval referendum after the presently submitted referendum has
		been executed.
	</p>
	<div class="mt-5 flex-col space-y-2 sm:flex-row max-w-fit">
		<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center mr-2"
			>RETURN HOME</a
		>
		<a href="/bounty-setup/curator-proposal" class="button-active h-12 inline-flex items-center"
			>PROCEED</a
		>
	</div>
{/if}
