<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

<p class="w-full md:w-2/3 text-sm sm:text-base">
	Submitting this referendum will propose the given address as curator to the bounty. It is
	recommended to use a pure proxy address for curator assignment. Select the same or higher spending
	track as used in the bounty approval referendum.
	<br /><br />
	Please note: unless the bounty has been funded, the execution of the curator proposal referendum will
	fail and the process will need to be repeated.
	<br />
	To avoid waiting until the entire bounty approval referendum is finished, you can submit this referendum
	a few days after the bounty approval referendum is sufficient, as that will allow sufficient time for
	the first referendum to be executed.
</p>

<div class="flex-col space-y-2 sm:flex-row my-5 sm:mt-20">
	<a href="/curator-actions" class="button-cancel mr-2 h-12 inline-flex items-center">RETURN HOME</a
	>
	{#if $bountyInfo}
		<a
			href="/bounty-setup/curator-proposal/form"
			class="button-active h-12 inline-flex items-center">PROCEED</a
		>
	{/if}
</div>
