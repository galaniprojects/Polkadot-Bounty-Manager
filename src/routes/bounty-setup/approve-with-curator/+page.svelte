<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

<p class="w-full md:w-2/3 text-sm sm:text-base">
	Submitting this referendum will approve the bounty, fund the proposed amount from the treasury and
	assign the given address as curator at the same time. It is recommended to use a pure proxy
	address for curator assignment.
	<br /><br />
	If you prefer to approve the bounty now and propose the curator address at a later time, select the
	“Approval” tab above instead.
</p>

<div class="flex-col space-y-2 sm:flex-row my-5 sm:mt-20">
	<a href="/curator-actions" class="button-cancel mr-2 h-12 inline-flex items-center">
		RETURN HOME
	</a>
	{#if $bountyInfo}
		<a
			href="/bounty-setup/approve-with-curator/form"
			class="button-active h-12 inline-flex items-center"
		>
			PROCEED
		</a>
	{/if}
</div>
