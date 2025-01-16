<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { fetchMultisigSignatories } from './fetch-signatories';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import Dialog from '../common/Dialog.svelte';

	export let open = false;
	export let bounty: Bounty;
	export let curatorAddress = '';

	let signatories: string[] = [];
	let isLoading = true;

	onMount(async () => {
		if (curatorAddress) {
			signatories = await fetchMultisigSignatories(curatorAddress);
		}
		isLoading = false;
	});
</script>

<Dialog bind:open title="CURATORS LIST">
	<div class="modal mt-5">
		<div class="space-y-3">
			<div class="space-y-1">
				<p class="font-bold">Curator Proxy:</p>
				<p><CopyableAddress address={bounty.curator} /></p>
			</div>
			<section class="space-y-1">
				<p class="font-bold">Signatories:</p>
				{#if isLoading}
					<p>Loading...</p>
				{:else if signatories.length > 0}
					<ul>
						{#each signatories as signatory}
							<li><CopyableAddress address={signatory} /></li>
						{/each}
					</ul>
				{:else}
					<p>No signatories found.</p>
				{/if}
			</section>
		</div>
	</div>
</Dialog>
