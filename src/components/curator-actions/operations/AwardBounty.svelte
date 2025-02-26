<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { isValidAddress } from '../../../utils/polkadot';
	import { dotApi } from '../../../stores';
	import { showErrorModal } from '../../ErrorModal/showErrorModal';
	import Dialog from '../../common/Dialog.svelte';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../utils/transaction';
	import Fee from '../../Fee.svelte';
	import Input from '../../Input/Input.module.css';
	import Currency from '../../Currency.svelte';

	export let open = true;
	export let bounty: Bounty;

	let beneficiary = '';

	$: transaction = maybeTransaction(
		() =>
			isValidAddress(beneficiary) &&
			$dotApi.tx.Bounties.award_bounty({
				bounty_id: bounty.id,
				beneficiary: MultiAddress.Id(beneficiary)
			})
	);

	async function submit() {
		open = false;
		try {
			if (!isValidAddress(beneficiary)) {
				showErrorModal('Beneficiary address is invalid');
				return;
			}
			if (!transaction) {
				showErrorModal('An internal error has happened');
				return;
			}

			await submitTransaction(transaction, 'Your bounty has been awarded and can now be claimed');
		} catch (e) {
			console.error(e);
			showErrorModal(String(e));
		}
	}
</script>

<Dialog bind:open title="AWARD BOUNTY">
	<div class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
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
			<p><Currency value={bounty.value} /></p>
		</section>
		<div class="my-4">
			<p class="text-xs">Beneficiary account address</p>
			<input bind:value={beneficiary} class={Input.input} />
		</div>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee</p>
			<p><Fee {transaction} /></p>
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
