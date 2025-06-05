<script lang="ts">
	import { bountyInfo } from '../../_bountyInfo';
</script>

{#if $bountyInfo}
	<p class="w-full md:w-2/3 text-sm sm:text-base">
		The Referendum for Curator Proposal of Bounty <br />
		"#{$bountyInfo.id}
		{$bountyInfo.description}" <br />
		has been created successfully!
		<br /><br />

		Please update the description of the referendum on Subsquare or Polkassembly and submit the
		decision deposit (200 DOT) within 7 days to ensure the referendum is valid. After successful
		execution of the referendum, the curators will need to accept the role to activate the bounty.
	</p>

	<div class="mt-7 sm:mt-24 mb-2 flex">
		<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center">RETURN HOME</a>
	</div>
{/if}
