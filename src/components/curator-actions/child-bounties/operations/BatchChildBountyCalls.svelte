<script lang="ts">
	import { convertDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import Dialog from '../../../common/Dialog.svelte';
	import { activeAccount, dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog, showLoadingDialog } from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { isInteger } from '../../../../utils/common';
	import PolkaCoin from '../../../svg/PolkaCoin.svg';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = true;
	export let childBounty: ChildBounty;

	let curatorFee = '';
	let fee = '-';
	let beneficiary: string = '';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		showLoadingDialog('Submitting transaction');
		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}
		if (!isValidAddress(beneficiary)) {
			showErrorDialog('Curator address is invalid');
			return;
		}

		if (!isInteger(curatorFee)) {
			showErrorDialog('Curator fee value is invalid');
			return;
		}

		const tx1 = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			curator: MultiAddress.Id($activeAccount.address),
			fee: convertDotToPlanck(BigInt(curatorFee))
		});

		const tx2 = $dotApi.tx.ChildBounties.accept_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id
		});

		const tx3 = $dotApi.tx.ChildBounties.award_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			beneficiary: MultiAddress.Id(beneficiary)
		});

		const tx4 = $dotApi.tx.ChildBounties.claim_child_bounty({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		});

		const batch = $dotApi.tx.Utility.batch_all({
			calls: [tx1.decodedCall, tx2.decodedCall, tx3.decodedCall, tx4.decodedCall]
		});

		await submitTransaction(batch);
	}
	//
	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const tx1 = $dotApi.tx.ChildBounties.propose_curator({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id,
				curator: MultiAddress.Id($activeAccount.address),
				fee: convertDotToPlanck(BigInt(curatorFee))
			});

			const tx2 = $dotApi.tx.ChildBounties.accept_curator({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id
			});

			const tx3 = $dotApi.tx.ChildBounties.award_child_bounty({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id,
				beneficiary: MultiAddress.Id($activeAccount.address)
			});

			const tx4 = $dotApi.tx.ChildBounties.claim_child_bounty({
				child_bounty_id: childBounty.id,
				parent_bounty_id: childBounty.parentBounty
			});

			const batch = $dotApi.tx.Utility.batch_all({
				calls: [tx1.decodedCall, tx2.decodedCall, tx3.decodedCall, tx4.decodedCall]
			});
			fee = await calculateTransactionFee(batch);
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<Dialog bind:open title="BATCH CHILD BOUNTY CALLS" backgroundColor="white" textColor="primary">
	<div>
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<ol class="text-xs mt-6 ml-4 list-decimal">
			<li>Assign the connected account as sub-curator.</li>
			<li>Accept sub-curator role.</li>
			<li>Award child bounty to the provided beneficiary.</li>
			<li>Claim child bounty.</li>
		</ol>
		<div class="my-4 relative">
			<p class="text-xs">Sub-curator fee:</p>
			<input
				bind:value={curatorFee}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="0"
			/>
			<div class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"></div>
			<div class="absolute right-2 top-[26px]">
				<img src={PolkaCoin} width="20" height="20" alt="PolkaCoin" />
			</div>
		</div>

		<div class="mt-5">
			<p class="text-xs">Beneficiary account address</p>
			<input
				bind:value={beneficiary}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
				placeholder=""
			/>
		</div>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!beneficiary.length || !curatorFee.length}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{beneficiary.length === 0 || curatorFee.length === 0
			? 'basic-button opacity-50'
			: 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
