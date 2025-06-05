<script lang="ts">
	import { bountyInfo } from '../../_bountyInfo';
</script>

{#if $bountyInfo}
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-backgroundButtonLight">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if $bountyInfo.description}
				#{$bountyInfo.id} {$bountyInfo.description}
			{/if}
		</p>
		{#if false}
			<p class="text text-sm mt-1.5">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				<a href="#info">Tap here</a>
			</p>
		{/if}
	</div>

	<div
		class="bg-backgroundApp max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
	>
		<p class="w-full md:w-2/3 text-sm sm:text-base">
			The Referendum for the approval of Bounty <br />
			#{$bountyInfo.id}
			{$bountyInfo.description} <br />
			has been created successfully!
			<br /><br />
			Please update the description of the referendum on Subsquare or Polkassembly and submit the decision
			deposit (200 DOT) within 7 days to ensure the referendum is valid. After successful execution of
			the referendum, the curators will need to accept the role to activate the bounty.
			<br /> <br />
			You can now return to the home screen or proceed to submit the curator approval referendum. It
			is recommended to submit the curator approval referendum after the presently submitted referendum
			has been executed.
		</p>
		<div class="mt-5 flex-col space-y-2 sm:flex-row max-w-fit">
			<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center mr-2"
				>RETURN HOME</a
			>
			<a href="/bounty-setup/curator-proposal" class="button-active h-12 inline-flex items-center"
				>PROCEED</a
			>
		</div>
	</div>
{/if}
