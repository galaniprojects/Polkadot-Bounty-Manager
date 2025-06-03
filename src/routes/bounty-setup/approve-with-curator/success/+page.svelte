<script lang="ts">
	import { bountyInfo } from '../../_bountyInfo';
</script>

{#if $bountyInfo}
	<p class="w-full md:w-2/3 text-sm sm:text-base">
		The Referendum for Approval with Curator of Bounty <br />
		"#{$bountyInfo.id}
		{$bountyInfo.description}" <br />
		has been created successfully!
		<br /><br />

		Please update the description if necessary on a social platform such as Subsquare. To ensure the
		referendum is valid, place the decision deposit within 7 days. The deposit, which can be
		submitted by any account, may be made on a social platform such as Subsquare or through the
		polkadot.js explorer.
	</p>

	<div class="mt-7 sm:mt-24 mb-2 flex">
		<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center">RETURN HOME</a>
	</div>
{/if}
