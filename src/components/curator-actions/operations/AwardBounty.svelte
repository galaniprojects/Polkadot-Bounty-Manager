<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { formatPlanckToDot, isValidAddress } from '../../../utils/polkadot';
	import { dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import Dialog from '../../common/Dialog.svelte';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { calculateTransactionFee, submitTransaction } from '../../../utils/transaction';

	export let open = true;
	export let bounty: Bounty;

	let beneficiary = '';
	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		try {
			if (!isValidAddress(beneficiary)) {
				showErrorDialog('Beneficiary address is invalid');
				return;
			}

			const transaction = $dotApi.tx.Bounties.award_bounty({
				bounty_id: bounty.id,
				beneficiary: MultiAddress.Id(beneficiary)
			});
			await submitTransaction(transaction, 'Your bounty has been awarded and can now be claimed');
		} catch (e) {
			console.error(e);
			showErrorDialog(String(e));
		}
	}

	async function calculateFee() {
		try {
			const transaction = $dotApi.tx.Bounties.award_bounty({
				bounty_id: bounty.id,
				beneficiary: MultiAddress.Id(beneficiary)
			});

			fee = (await calculateTransactionFee(transaction)) + ' Dot';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<Dialog bind:open title="AWARD BOUNTY">
	<div class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<section class="mt-10 space-y-1">
			<p class="text-xs">Please note</p>
			<p class="text-red bg-white rounded-sm p-2">
				A bounty can only be awarded in whole as long as no child bounties exist. In this case, it
				is still highly recommended to manage the funds through child bounties and not award the
				whole bounty at once.
			</p>
		</section>
		<section class="mt-10">
			<p class="text-xs">Bounty value</p>
			<p><span>{formatPlanckToDot(bounty.value)}</span> DOT</p>
		</section>
		<div class="my-4">
			<p class="text-xs">Beneficiary account address</p>
			<input
				bind:value={beneficiary}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
			/>
		</div>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee</p>
			<p>{fee}</p>
		</section>

		<button
			on:click={submit}
			disabled={beneficiary.length === 0}
			class="w-full md:w-fit mt-10 h-12 button-popup {beneficiary.length === 0
				? 'opacity-50 cursor-not-allowed'
				: ''}"
		>
			SIGN
		</button>
	</div>
</Dialog>
