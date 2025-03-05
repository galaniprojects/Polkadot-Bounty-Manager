<script lang="ts">
	import type { Bounty } from '../../../../types/bounty';
	import { convertFormattedDotToPlanck } from '../../../../utils/polkadot';
	import { dotApi } from '../../../../stores';
	import { showErrorModal } from '../../../modals';
	import { isPositiveNumber } from '../../../../utils/common';
	import Input from '../../../Input/Input.module.css';
	import Dialog from '../../../common/Dialog.svelte';
	import { Binary } from 'polkadot-api';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;

	let bountyValue = '';
	let bountyTitle = '';
	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			bountyTitle &&
			isPositiveNumber(bountyValue) &&
			batchExtendBounty(
				extend && bounty.id,
				$dotApi.tx.ChildBounties.add_child_bounty({
					parent_bounty_id: bounty.id,
					value: convertFormattedDotToPlanck(bountyValue),
					description: Binary.fromText(bountyTitle)
				})
			)
	);

	async function submit() {
		if (bountyTitle.length === 0) {
			showErrorModal('Bounty title is empty');
			return;
		}
		if (!isPositiveNumber(bountyValue)) {
			showErrorModal('Bounty value is invalid');
			return;
		}
		if (!transaction) {
			showErrorModal('An internal error has happened');
			return;
		}

		const successful = await submitTransaction(transaction, undefined, bounty);
		if (successful) {
			dialog.close();
			bountyValue = '';
			bountyTitle = '';
			extend = false;
		}
	}

	$: isFormValid = bountyValue && bountyValue.trim() !== '' && bountyTitle.trim() !== '';
</script>

<Dialog bind:dialog title="ADD NEW CHILD BOUNTY">
	<div class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
		</div>
		<p>Please use a descriptive title.</p>
	</div>

	<div class="flex flex-col gap-6 mt-6">
		<section>
			<p class="text-xs">Value</p>
			<input bind:value={bountyValue} class={Input.polkadot} placeholder="00.00" />
		</section>
		<section>
			<p class="text-xs">Title</p>
			<input bind:value={bountyTitle} class={Input.input} placeholder="Child bounty name" />
		</section>

		<label class="flex gap-4 items-center cursor-pointer">
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
			<ExtendBountyLabel />
		</label>

		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</section>

		<p class="mt-10 flex flex-col md:flex-row-reverse gap-6 justify-between md:items-center">
			<a
				class="underline"
				href="/curator-actions/batch/create?{new URLSearchParams({
					'bounty-id': String(bounty.id),
					value: bountyValue,
					title: bountyTitle
				}).toString()}"
			>
				Add several in one transaction
			</a>
			<button
				on:click={submit}
				class={['h-12 button-popup', !isFormValid && 'opacity-50 cursor-not-allowed']}
				disabled={!isFormValid}
			>
				SIGN
			</button>
		</p>
	</div>
</Dialog>
