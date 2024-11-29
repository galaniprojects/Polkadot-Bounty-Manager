<script lang="ts">
	import { convertDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import { activeAccount, dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { isInteger } from '../../../../utils/common';
	import PolkaCoin from '../../../svg/PolkaCoin.svg';
	import Dialog from '../../../common/Dialog.svelte';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = true;
	export let childBounty: ChildBounty;

	let curatorAddress = '';
	let curatorFee = '';
	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		if (!isValidAddress(curatorAddress)) {
			showErrorDialog('Curator address is invalid');
			return;
		}

		if (!isInteger(curatorFee)) {
			showErrorDialog('Curator fee value is invalid');
			return;
		}

		const transaction = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			curator: MultiAddress.Id(curatorAddress),
			fee: convertDotToPlanck(BigInt(curatorFee))
		});
		await submitTransaction(transaction);
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '--';
			return;
		}
		try {
			const transaction = $dotApi.tx.ChildBounties.propose_curator({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id,
				curator: MultiAddress.Id($activeAccount.address),
				fee: convertDotToPlanck(BigInt(curatorFee))
			});
			fee = (await calculateTransactionFee(transaction)) + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<!-- ToDo: dynamically change the background colors according to the child bounty the button exists in (only exists in one: created) -->

<Dialog bind:open title="ASSIGN SUB-CURATOR" backgroundColor="white" textColor="primary">
	<div>
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>

		<div class="my-4">
			<p class="text-xs">Sub-curator address:</p>
			<input
				bind:value={curatorAddress}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
			/>
		</div>

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
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!curatorAddress.length}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{curatorAddress.length === 0 ? 'basic-button opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
