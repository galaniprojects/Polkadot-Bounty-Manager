<script lang="ts">
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import Dialog from '../../../common/Dialog.svelte';
	import { activeAccount, dotApi } from '../../../../stores';
	import { showErrorModal } from '../../../modals';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { isPositiveNumber } from '../../../../utils/common';
	import Input from '../../../Input/Input.module.css';
	import { Binary } from 'polkadot-api';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import type { Bounty } from '../../../../types/bounty';

	export let dialog: HTMLDialogElement;
	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let extend = false;

	let curatorFee = '';
	let beneficiary: string = '';

	$: transaction = maybeTransaction(() => {
		if (!$activeAccount || !isValidAddress(beneficiary) || !isPositiveNumber(curatorFee)) return;

		const propose = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			curator: MultiAddress.Id($activeAccount.address),
			fee: convertFormattedDotToPlanck(curatorFee)
		});

		const accept = $dotApi.tx.ChildBounties.accept_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id
		});

		const award = $dotApi.tx.ChildBounties.award_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			beneficiary: MultiAddress.Id(beneficiary)
		});

		const claim = $dotApi.tx.ChildBounties.claim_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id
		});

		const extendTx = $dotApi.tx.Bounties.extend_bounty_expiry({
			bounty_id: childBounty.parentBounty,
			remark: new Binary(new Uint8Array())
		});

		return $dotApi.tx.Utility.batch_all({
			calls: [
				propose.decodedCall,
				accept.decodedCall,
				award.decodedCall,
				claim.decodedCall,
				...(extend ? [extendTx.decodedCall] : [])
			]
		});
	});

	async function submit() {
		if (!$activeAccount) {
			showErrorModal('Wallet is not connected');
			return;
		}
		if (!isValidAddress(beneficiary)) {
			showErrorModal('Beneficiary address is invalid');
			return;
		}

		if (!isPositiveNumber(curatorFee)) {
			showErrorModal('Curator fee value is invalid');
			return;
		}

		if (!transaction) {
			showErrorModal('An internal error has happened');
			return;
		}

		const successful = await submitTransaction(transaction, undefined, parentBounty);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="BATCH CHILD BOUNTY CALLS">
	<div>
		<p class="p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
		</p>
		<ol class="text-xs mt-6 ml-4 list-decimal">
			<li>Assign the connected account as sub-curator.</li>
			<li>Accept sub-curator role.</li>
			<li>Award child bounty to the provided beneficiary.</li>
			<li>Claim child bounty.</li>
		</ol>
		<div class="my-4">
			<p class="text-xs">Sub-curator fee:</p>
			<input bind:value={curatorFee} class={Input.polkadot} placeholder="00.00" />
		</div>

		<div class="mt-5">
			<p class="text-xs">Beneficiary account address</p>
			<input bind:value={beneficiary} class={Input.input} />
		</div>

		<label class="mt-5 flex gap-4 items-center cursor-pointer">
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
		disabled={!beneficiary.length || !curatorFee.length}
		class="w-full md:w-fit mt-10 h-12 button-popup
		{beneficiary.length === 0 || curatorFee.length === 0 ? 'opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
