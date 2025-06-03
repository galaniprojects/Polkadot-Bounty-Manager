<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

{#if $bountyInfo}
	<div class="px-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-backgroundButtonLight">
		<p class="text-white text-lg sm:text-2xl">#{$bountyInfo.id} {$bountyInfo.description}</p>
	</div>

	<div class="bg-backgroundApp p-3 sm:pt-7 sm:pb-12 md:px-6 w-full box-border overflow-x-hidden">
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
			<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center mr-2">
				RETURN HOME
			</a>
			<a
				href="/bounty-setup/approve-with-curator"
				class="button-active h-12 inline-flex items-center"
			>
				PROCEED
			</a>
		</div>
	</div>
{/if}
