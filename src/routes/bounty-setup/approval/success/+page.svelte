<script lang="ts">
	import { bountyInfo } from '../../_bountyInfo';
</script>

{#if $bountyInfo}
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
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
		class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
	>
		<p class="w-full md:w-2/3 text-sm sm:text-base">
			The Referendum for the approval of Bounty <br />
			#{$bountyInfo.id}
			{$bountyInfo.description} <br />
			has been created successfully!
			<br /><br />
			Please update the description on one of the social platforms such as Subsquare. The decision deposit
			must be placed within 7 days, for the referendum to be valid. (This deposit can be placed by any
			account). This can be submitted either on one of the social platforms or via the polkadot.js explorer.
			<br /> <br />
			You can now return to the home screen or proceed to the Curator Approval Referendum creation. It
			is strongly recommended to create the Curator Approval Referendum, after the Bounty has been funded
			and the Curator list has been informally accepted by the community in discussions on the platforms.
		</p>
		<div class="mt-5 flex-col space-y-2 sm:flex-row max-w-fit">
			<a href="/curator-actions" class="button-cancel sm:mr-5">RETURN HOME</a>
			<a href="/bounty-setup/curator-proposal" class="button-active">PROCEED</a>
		</div>
	</div>
{/if}
