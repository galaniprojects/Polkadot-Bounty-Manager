<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { bountyInfo } from '../_bountyInfo';

	onMount(async () => {
		// on page load reset to wizard start while persisting the query string
		const url = new URL($page.url);
		url.pathname = '/bounty-setup/curator-proposal';
		await goto(url.toString());
	});
</script>

<div>
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if $bountyInfo && $bountyInfo.id && $bountyInfo.description}
				#{$bountyInfo.id} {$bountyInfo.description}
			{/if}
		</p>
		{#if false}
			<p class="text text-sm mt-1.5">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				Tap here
			</p>
		{/if}
	</div>

	<div
		class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
	>
		<slot />
	</div>
</div>
