<script lang="ts">
	import { bountyInfo } from '../_bountyInfo';
</script>

<p class="w-full md:w-2/3 text-sm sm:text-base">
	Submitting this referendum will only approve the bounty and fund the proposed amount from the
	treasury. The curator proposal will need to be done at a later time. Once funded, the bounty will
	linger for three months. If a curator address has not been selected and assigned in that time, the
	bounty will be cancelled.
	<br /><br />
	If a curator group has already been identified, you can submit the approval with curator referendum
	instead.
</p>

<div class="flex-col space-y-2 sm:flex-row my-5 sm:mt-20">
	<a href="/curator-actions" class="button-cancel mr-2 h-12 inline-flex items-center">
		RETURN HOME
	</a>
	{#if $bountyInfo}
		<a href="/bounty-setup/approval/form" class="button-active h-12 inline-flex items-center">
			PROCEED
		</a>
	{/if}
</div>
