<script lang="ts">
	import { isValidAddress } from '../../../../utils/polkadot';
	import { getAllChildBountyCalls } from '../../../../utils/getAllChildBountyCalls';
	import Dialog from '../../../common/Dialog.svelte';
	import { activeAccount, dotApi } from '../../../../stores';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { isPositiveNumber } from '../../../../utils/common';
	import Input from '../../../Input/Input.module.css';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import { Binary } from 'polkadot-api';
	import type { Bounty } from '../../../../types/bounty';

	export let open = true;
	export let bounty: Bounty;

	let bountyValue = '';
	let bountyTitle = '';
	let curatorFee = '';
	let beneficiary = '';
	let extend = false;

	let childBountyId: number;
	let nextAvailableChildBountyId: number;

	(async () => {
		void $dotApi.query.ChildBounties.ChildBountyCount.watchValue().forEach((value) => {
			nextAvailableChildBountyId = value;
			childBountyId = Math.max(childBountyId, nextAvailableChildBountyId);
		});
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: transaction = maybeTransaction(() => {
		if (!$activeAccount || !isValidAddress(beneficiary) || !isPositiveNumber(curatorFee)) return;

		const batch = getAllChildBountyCalls({
			parent_bounty_id: bounty.id,
			child_bounty_id: childBountyId,
			title: bountyTitle,
			value: bountyValue,
			curator: $activeAccount.address,
			beneficiary: beneficiary,
			fee: curatorFee
		});

		const extendCall = $dotApi.tx.Bounties.extend_bounty_expiry({
			bounty_id: bounty.id,
			remark: new Binary(new Uint8Array())
		}).decodedCall;

		const calls = [...batch, ...(extend ? [extendCall] : [])];
		return $dotApi.tx.Utility.batch_all({ calls });
	});

	async function submit() {
		open = false;
		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}
		if (!isValidAddress(beneficiary)) {
			showErrorDialog('Beneficiary address is invalid');
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

		await submitTransaction(transaction, undefined, bounty.curator, bounty.curatorMultisigAccount);

		bountyValue = '';
		bountyTitle = '';
		curatorFee = '';
		beneficiary = '';
		extend = false;
	}
</script>

<Dialog bind:open title="BATCH ALL CHILD BOUNTY CALLS">
	<div>
		<p class="p-1">
			#{bounty.id}
			{bounty.description ?? ''}
		</p>

		<section class="mt-6">
			<p class="text-xs">Executed actions:</p>

			<ol class="text-xs mt-2 ml-4 list-decimal">
				<li>Create a new child bounty.</li>
				<li>Assign the connected account as sub-curator.</li>
				<li>Accept the sub-curator role.</li>
				<li>Award the child bounty to the provided beneficiary.</li>
				<li>Claim the child bounty.</li>
			</ol>
		</section>

		<p class="text-xs mt-6 border border-red text-red rounded-[3px] p-2">
			Currently, the child bounty’s index is estimated by incrementing the highest available on the
			blockchain. <br /> Please note: if multiple child bounties are assigned the same index, or if another
			bounty creates a child between this transaction’s creation and confirmation, this transaction will
			fail.
		</p>
		<div class="mt-5">
			<p class="text-xs">Child Bounty Index</p>
			<input
				type="number"
				min={nextAvailableChildBountyId}
				bind:value={childBountyId}
				class={Input.input}
			/>
		</div>

		<div class="my-4">
			<p class="text-xs">Value</p>
			<input bind:value={bountyValue} class={Input.polkadot} placeholder="00.00" />
		</div>

		<div class="mt-5">
			<p class="text-xs">Title</p>
			<input bind:value={bountyTitle} class={Input.input} placeholder="Child bounty name" />
		</div>
		<div class="mt-5">
			<p class="text-xs">Sub-curator fee</p>
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

	<p class="text-xs mt-6">
		For the highest likelihood of success, ensure that the signatories confirm the transaction as
		soon as possible
	</p>

	<p class="mt-10 flex flex-col md:flex-row-reverse gap-6 justify-between md:items-center">
		<a
			class="underline"
			href="/curator-actions/batch/everything?{new URLSearchParams({
				'bounty-id': String(bounty.id),
				'child-bounty-id': String(childBountyId),
				value: bountyValue,
				title: bountyTitle,
				fee: curatorFee,
				beneficiary
			}).toString()}"
		>
			Run several in one transaction
		</a>
		<button
			on:click={submit}
			disabled={!beneficiary.length || !curatorFee.length}
			class="h-12 button-popup
		{beneficiary.length === 0 || curatorFee.length === 0
				? 'cursor-not-allowed opacity-50'
				: 'cursor-allowed'}"
		>
			SIGN
		</button>
	</p>
</Dialog>
