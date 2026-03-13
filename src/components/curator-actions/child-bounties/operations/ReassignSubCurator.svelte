<script lang="ts">
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import { dotApi } from '../../../../stores';
	import { showErrorModal } from '../../../modals';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { isPositiveNumber } from '../../../../utils/common';
	import Input from '../../../Input/Input.module.css';
	import Dialog from '../../../common/Dialog.svelte';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import type { Bounty } from '../../../../types/bounty';
	import CopyableAddress from '../../../common/CopyableAddress.svelte';
	import { Binary } from 'polkadot-api';

	export let dialog: HTMLDialogElement;
	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let curatorAddress = '';
	let curatorFee = '';
	let extend = false;

	$: transaction = maybeTransaction(() => {
		if (!parentBounty.curator || !isValidAddress(curatorAddress) || !isPositiveNumber(curatorFee))
			return;

		const propose = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			curator: MultiAddress.Id(curatorAddress),
			fee: convertFormattedDotToPlanck(curatorFee)
		});

		const unassign = $dotApi.tx.ChildBounties.unassign_curator({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		});

		const extendTx = $dotApi.tx.Bounties.extend_bounty_expiry({
			bounty_id: childBounty.parentBounty,
			remark: new Binary(new Uint8Array())
		});

		return $dotApi.tx.Utility.batch_all({
			calls: [unassign.decodedCall, propose.decodedCall, ...(extend ? [extendTx.decodedCall] : [])]
		});
	});

	async function submit() {
		if (!isValidAddress(curatorAddress)) {
			showErrorModal('Curator address is invalid.');
			return;
		}

		if (!isPositiveNumber(curatorFee)) {
			showErrorModal('Curator fee value is invalid.');
			return;
		}

		if (!transaction) {
			showErrorModal('Transaction failed.');
			return;
		}

		const successful = await submitTransaction(transaction, parentBounty);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="REASSIGN SUB-CURATOR">
	<div>
		<p class="title">
			#{childBounty.id}
			{childBounty.description ?? ''}
		</p>

		<p>
			The currently proposed sub-curator <span class="curator"
				><CopyableAddress address={childBounty.curator} /></span
			>
			will be replaced by the new sub-curator's address
			<span class="curator"><CopyableAddress address={curatorAddress} /></span> provided below:
		</p>

		<div class="element">
			<p class="text">Sub-curator address:</p>
			<input bind:value={curatorAddress} class={Input.input} />
		</div>

		<div class="element">
			<p class="text">Sub-curator fee:</p>
			<input bind:value={curatorFee} class={Input.polkadot} placeholder="00.00" />
		</div>

		<label class="extend">
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
			<ExtendBountyLabel />
		</label>

		<section class="element">
			<p class="text">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!curatorAddress.length || !curatorFee.length}
		class="signButton"
	>
		SIGN
	</button>
</Dialog>

<style>
	.title {
		padding: 0.25rem;
	}

	.curator {
		display: inline-flex;
		align-items: center;
	}

	.element,
	.extend {
		margin: 16px 0px;
	}

	.text {
		font-size: 12px;
	}

	.extend {
		display: flex;
		gap: 1rem;
		align-items: center;
		cursor: pointer;
	}

	.signButton {
		margin-top: 2.5rem;
		height: 3rem;
		padding: 0 2.5rem;
		border-radius: 0.375rem;
		background-color: theme('colors.backgroundButtonDark');
		color: white;
		cursor: pointer;
	}

	.signButton:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}
</style>
