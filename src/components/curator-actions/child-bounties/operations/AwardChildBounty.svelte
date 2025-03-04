<script lang="ts">
	import { isValidAddress } from '../../../../utils/polkadot';
	import Currency from '../../../Currency.svelte';
	import Dialog from '../../../common/Dialog.svelte';
	import { dotApi } from '../../../../stores';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Input from '../../../Input/Input.module.css';
	import Fee from '../../../Fee.svelte';

	export let open = true;
	export let childBounty: ChildBounty;

	let beneficiary = '';
	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isValidAddress(beneficiary) &&
			batchExtendBounty(
				extend && childBounty.parentBounty,
				$dotApi.tx.ChildBounties.award_child_bounty({
					parent_bounty_id: childBounty.parentBounty,
					child_bounty_id: childBounty.id,
					beneficiary: MultiAddress.Id(beneficiary)
				})
			)
	);

	async function submit() {
		open = false;
		if (!isValidAddress(beneficiary)) {
			showErrorDialog('Beneficiary address is invalid');
			return;
		}
		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		await submitTransaction(
			transaction,
			undefined,
			childBounty
		);
	}
</script>

<Dialog bind:open title="AWARD CHILD BOUNTY">
	<div class="grid">
		<p class="space-x-1 mb-7 p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
		</p>
		<section>
			<p class="text-xs">Child bounty value</p>
			<p><Currency value={childBounty.value} /></p>
		</section>

		<div class="mt-5">
			<p class="text-xs">Beneficiary account address</p>
			<input bind:value={beneficiary} class={Input.input} />
		</div>

		<label class="mt-5 flex gap-4 items-center cursor-pointer">
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
			<ExtendBountyLabel />
		</label>

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
