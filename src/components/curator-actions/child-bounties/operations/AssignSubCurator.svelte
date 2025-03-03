<script lang="ts">
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import { dotApi } from '../../../../stores';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { isPositiveNumber } from '../../../../utils/common';
	import Input from '../../../Input/Input.module.css';
	import Dialog from '../../../common/Dialog.svelte';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import type { Bounty } from "../../../../types/bounty";

	export let open = true;
	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let curatorAddress = '';
	let curatorFee = '';
	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isValidAddress(curatorAddress) &&
			isPositiveNumber(curatorFee) &&
			batchExtendBounty(
				extend && childBounty.parentBounty,
				$dotApi.tx.ChildBounties.propose_curator({
					parent_bounty_id: childBounty.parentBounty,
					child_bounty_id: childBounty.id,
					curator: MultiAddress.Id(curatorAddress),
					fee: convertFormattedDotToPlanck(curatorFee)
				})
			)
	);

	async function submit() {
		open = false;
		if (!isValidAddress(curatorAddress)) {
			showErrorDialog('Curator address is invalid');
			return;
		}

		if (!isPositiveNumber(curatorFee)) {
			showErrorDialog('Curator fee value is invalid');
			return;
		}

		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		await submitTransaction(transaction, undefined, parentBounty);
	}
</script>

<Dialog bind:open title="ASSIGN SUB-CURATOR">
	<div>
		<p class="p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
		</p>

		<div class="my-4">
			<p class="text-xs">Sub-curator address:</p>
			<input bind:value={curatorAddress} class={Input.input} />
		</div>

		<div class="my-4">
			<p class="text-xs">Sub-curator fee:</p>
			<input bind:value={curatorFee} class={Input.polkadot} placeholder="00.00" />
		</div>

		<label class="my-4 flex gap-4 items-center cursor-pointer">
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
			<ExtendBountyLabel />
		</label>

		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!curatorAddress.length}
		class="mt-10 h-12 button-popup
		{curatorAddress.length === 0 ? 'basic-button opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
