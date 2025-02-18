<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { fetchMultisigSignatories } from './fetch-signatories';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import Dialog from '../common/Dialog.svelte';
	import CreateSalaryPayouts from './operations/CreateSalaryPayouts.svelte';

	export let open = false;
	export let bounty: Bounty;
	export let curatorAddress = '';

	let signatories: string[] | undefined;
	let salariesDialogOpen = false;

	onMount(async () => {
		if (curatorAddress) {
			signatories = await fetchMultisigSignatories(curatorAddress);
		} else {
			signatories = [];
		}
	});
</script>

<Dialog bind:open title="CURATORS LIST">
	<div class="modal mt-5">
		<div class="space-y-5">
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
					<button
						on:click={() => {
							salariesDialogOpen = true;
						}}
						class="w-full md:w-fit h-12 button-popup">CREATE SALARIES</button
					>
				{:else}
					<p>No signatories found.</p>
				{/if}
			</section>
		</div>
	</div>
</Dialog>

{#if signatories !== undefined}
	<CreateSalaryPayouts {bounty} bind:open={salariesDialogOpen} addresses={signatories} />
{/if}
