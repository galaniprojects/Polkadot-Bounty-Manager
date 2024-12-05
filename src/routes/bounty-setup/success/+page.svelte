<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

{#if $bountyInfo}
	<div class="px-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		<p class="text-white">#{$bountyInfo.id} {$bountyInfo.description}</p>
	</div>

	<div
		class="bg-backgroundContent p-3 sm:pt-7 sm:pb-12 md:px-6 w-full box-border overflow-x-hidden"
	>
		<p>
			#{$bountyInfo.id}
			{$bountyInfo.description}
			has been created successfully!
			<br /><br />
			You can either proceed to the Referendum <br />
			for Bounty Approval or return to the main page <br />
			or go back to the list of all bounties.
			<br />
		</p>

		<div class="flex-col space-y-2 sm:flex-row mt-10 sm:mt-40">
			<a href="/curator-actions" class="button-cancel mr-5">RETURN HOME</a>
			<a href="/bounty-setup/approval" class="button-active">PROCEED</a>
		</div>
	</div>
{/if}
