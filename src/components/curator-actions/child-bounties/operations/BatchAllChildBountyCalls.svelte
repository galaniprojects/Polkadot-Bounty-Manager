<script lang="ts">
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import Dialog from '../../../common/Dialog.svelte';
	import { activeAccount, dotApi } from '../../../../stores';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { isPositiveNumber } from '../../../../utils/common';
	import PolkaCoin from '../../../svg/PolkaCoin.svg';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import Fee from '../../../Fee.svelte';
	import { Binary } from 'polkadot-api';
	import type { Bounty } from '../../../../types/bounty';

	export let open = true;
	export let bounty: Bounty;

	let bountyValue = '';
	let bountyTitle = '';
	let curatorFee = '';
	let beneficiary = '';

	let childBountyId: number;
	let nextAvailabeChildBountyId: number;

	(async () => {
		nextAvailabeChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailabeChildBountyId;
	})();

	$: transaction = maybeTransaction(() => {
		if (!$activeAccount || !isValidAddress(beneficiary) || !isPositiveNumber(curatorFee)) return;

		const add = $dotApi.tx.ChildBounties.add_child_bounty({
			parent_bounty_id: bounty.id,
			value: convertFormattedDotToPlanck(bountyValue),
			description: Binary.fromText(bountyTitle)
		});

		const propose = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: bounty.id,
			child_bounty_id: childBountyId,
			curator: MultiAddress.Id($activeAccount.address),
			fee: convertFormattedDotToPlanck(curatorFee)
		});

		const accept = $dotApi.tx.ChildBounties.accept_curator({
			parent_bounty_id: bounty.id,
			child_bounty_id: childBountyId
		});

		const award = $dotApi.tx.ChildBounties.award_child_bounty({
			parent_bounty_id: bounty.id,
			child_bounty_id: childBountyId,
			beneficiary: MultiAddress.Id(beneficiary)
		});

		const claim = $dotApi.tx.ChildBounties.claim_child_bounty({
			parent_bounty_id: bounty.id,
			child_bounty_id: childBountyId
		});

		return $dotApi.tx.Utility.batch_all({
			calls: [
				add.decodedCall,
				propose.decodedCall,
				accept.decodedCall,
				award.decodedCall,
				claim.decodedCall
			]
		});
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

		await submitTransaction(transaction);
	}
</script>

<Dialog bind:open title="BATCH ALL CHILD BOUNTY CALLS" backgroundColor="white" textColor="primary">
	<div>
		<p class="p-1 text-white bg-childBountyGray">
			#{bounty.id}
			{bounty.description ?? ''}
		</p>
		<ol class="text-xs mt-6 ml-4 list-decimal">
			<li>Add new child bounty.</li>
			<li>Assign the connected account as sub-curator.</li>
			<li>Accept sub-curator role.</li>
			<li>Award child bounty to the provided beneficiary.</li>
			<li>Claim child bounty.</li>
		</ol>

		<p class="text-xs mt-6 border border-red text-red rounded-[3px] p-2">
			Currently, the child bounty's index needs to be guessed in order to execute a batch call. To
			create multiple batch transactions, increment the child bounty's index by 1 for each new
			transaction after the first to avoid conflicts. <br /> Please note: If multiple batch transactions
			are assigned the same index or if another bounty creates a child bounty in the time between the
			transaction creation and confirmation on Multix, the transaction will fail.
		</p>
		<div class="mt-5">
			<p class="text-xs">Child Bounty Index</p>
			<input
				type="number"
				min={nextAvailabeChildBountyId}
				bind:value={childBountyId}
				class="border border-black rounded-[3px] bg-childBountyHeaderBackground pl-2 pt-1 h-10 w-full"
				placeholder=""
			/>
		</div>

		<div class="my-4 relative">
			<p class="text-xs">Value</p>
			<input
				bind:value={bountyValue}
				class="border border-black pt-1 pl-2 rounded-[3px] bg-white h-10 w-full"
				placeholder="00.00"
			/>
			<div class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"></div>
			<div class="absolute right-2 top-[26px]">
				<img src={PolkaCoin} width="20" height="20" alt="PolkaCoin" />
			</div>
		</div>

		<div class="mt-5">
			<p class="text-xs">Title</p>
			<input
				bind:value={bountyTitle}
				class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="Child bounty name"
			/>
		</div>
		<div class="mt-5 relative">
			<p class="text-xs">Sub-curator fee:</p>
			<input
				bind:value={curatorFee}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="00.00"
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
			<p><Fee {transaction} /></p>
		</section>
	</div>

	<p class="text-xs mt-6">
		For the highest likelihood of success, ensure that the signatories confirm the transaction as
		soon as possible
	</p>

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
