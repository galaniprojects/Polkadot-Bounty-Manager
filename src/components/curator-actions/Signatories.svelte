<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { fetchMultisigSignatories } from './fetch-signatories';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import Dialog from '../common/Dialog.svelte';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;
	export let curatorAddress = '';

	let signatories: string[] | undefined;

	onMount(async () => {
		if (curatorAddress) {
			signatories = await fetchMultisigSignatories(curatorAddress);
		} else {
			signatories = [];
		}
	});
</script>

<Dialog bind:dialog title="CURATORS LIST">
	<div class="modal mt-5">
		<div class="space-y-3">
			<div class="space-y-1">
				<p class="font-bold">Curator Proxy:</p>
				<p><CopyableAddress address={bounty.curator} /></p>
			</div>
			<section class="space-y-1">
				<p class="font-bold">Signatories:</p>
				{#if signatories === undefined}
					<p>Loading...</p>
				{:else if signatories.length > 0}
					<ul>
						{#each signatories as address}
							<li><CopyableAddress {address} /></li>
						{/each}
					</ul>
				{:else}
					<p>No signatories found.</p>
				{/if}
			</section>
		</div>
	</div>
</Dialog>
