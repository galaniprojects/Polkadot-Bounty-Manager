<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { fetchMultisigSignatories } from './fetch-signatories';
	import { isCurator } from '../../utils/isCurator';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import Dialog from '../common/Dialog.svelte';
	import CreateSalaryPayouts from './operations/CreateSalaryPayouts.svelte';
	import { activeAccount } from '../../stores';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;
	export let curatorAddress = '';

	let signatories: string[] | undefined;
	let salariesDialog: HTMLDialogElement;

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
						{#each signatories as address (address)}
							<li><CopyableAddress {address} /></li>
						{/each}
					</ul>
					{#if isCurator(bounty, $activeAccount)}
						<button
							on:click={() => {
								dialog.close();
								salariesDialog.showModal();
							}}
							class="w-full md:w-fit h-12 button-popup"
						>
							CREATE SALARIES
						</button>
					{/if}
				{:else}
					<p>No signatories found.</p>
				{/if}
			</section>
		</div>
	</div>
</Dialog>

{#if signatories !== undefined}
	<CreateSalaryPayouts {bounty} {signatories} bind:dialog={salariesDialog} />
{/if}
