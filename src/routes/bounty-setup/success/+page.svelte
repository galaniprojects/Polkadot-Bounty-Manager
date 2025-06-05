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
			To submit the combined bounty and curator approval referendum, click “Proceed”. You can also choose
			to submit only the bounty approval referendum by selecting the approval tab above, or return to
			the main page instead.
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
