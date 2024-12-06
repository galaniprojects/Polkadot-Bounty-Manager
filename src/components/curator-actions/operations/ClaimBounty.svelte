<script lang="ts">
	import Dialog from '../../common/Dialog.svelte';
	import { dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import { truncateString } from '../../../utils/common';
	import type { Bounty } from '../../../types/bounty';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import { calculateTransactionFee, submitTransaction } from '../../../utils/transaction';

	export let open = true;
	export let bounty: Bounty;

	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function claimBounty() {
		open = false;
		try {
			const transaction = $dotApi.tx.Bounties.claim_bounty({
				bounty_id: bounty.id
			});

			await submitTransaction(transaction);
		} catch (e) {
			console.error(e);
			showErrorDialog(String(e));
		}
	}

	async function calculateFee() {
		try {
			const transaction = $dotApi.tx.Bounties.claim_bounty({
				bounty_id: bounty.id
			});
			fee = (await calculateTransactionFee(transaction)) + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<Dialog bind:open title="CLAIM BOUNTY AWARD">
	<div class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description}
				<span>{bounty.description}</span>
			{/if}
		</div>
		<div class="space-y-2">
			<p class="text-xs">What is this action?</p>
			<p class="text-xs">
				This is a permissionless action and can be executed by anyone in favour of the beneficiary.
				The funds will be transferred to the beneficiary’s address.
			</p>
		</div>
		{#if bounty.beneficiary}
			<div class="space-y-2">
				<p class="text-xs">Beneficiary account</p>
				<CopyableAddress address={truncateString(bounty.beneficiary, 13)} />
			</div>
		{/if}
		<div class="space-y-2">
			<p class="text-xs">Estimated basic fee:</p>
			<p>{fee}</p>
		</div>
	</div>

	<button on:click={claimBounty} class="w-full md:w-fit mt-10 h-12 button-popup">SIGN</button>
</Dialog>
