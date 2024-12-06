<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

<p class="w-full md:w-2/3 text-sm sm:text-base">
	It is strongly recommended to create the Curator Proposal referendum, after the Bounty has been
	funded and the Curator list has been informally accepted by the community in discussions on the
	platforms.
	<br /><br />
	However if you want to proceed and already have a list of curators to propose, it is possible to do
	so.
	<br />
	Please note: the execution of the Curator Proposal referendum will fail, unless the bounty has been
	already funded.
</p>

<div class="flex-col space-y-2 sm:flex-row my-5 sm:mt-20">
	<a href="/curator-actions" class="button-cancel mr-5">RETURN HOME</a>
	{#if $bountyInfo}
		<a href="/bounty-setup/curator-proposal/form" class="button-active">PROCEED</a>
	{/if}
</div>
