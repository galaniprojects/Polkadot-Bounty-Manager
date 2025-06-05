<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { bountyInfo } from '../_bountyInfo';

	onMount(async () => {
		// on page load reset to wizard start while persisting the query string
		const url = new URL(page.url);
		url.pathname = '/bounty-setup/approval';
		await goto(url.toString());
	});
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
		<slot />
	</div>
{/if}
