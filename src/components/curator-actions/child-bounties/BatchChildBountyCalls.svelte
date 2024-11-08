<script lang="ts">
	import {
		convertDotToPlanck,
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		getApi,
		isValidAddress
	} from '../../../utils/polkadot';
	import Dialog from '../../Dialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../utils/loading-screen';
	import { WALLET_CONNECT_SOURCE } from '../../../utils/WcSigner';
	import type { ChildBounty } from '../../../types/child-bounty';
	import { isInteger } from '../../../utils/common';
	import PolkaCoin from '../../svg/PolkaCoin.svelte';

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
		try {
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

			const api = await getApi();
			let tx1 = api.tx.childBounties.proposeCurator(
				childBounty.parentBounty,
				childBounty.id,
				$activeAccount.address,
				convertDotToPlanck(BigInt(curatorFee))
			);

			let tx2 = api.tx.childBounties.acceptCurator(childBounty.parentBounty, childBounty.id);

			let tx3 = api.tx.childBounties.awardChildBounty(
				childBounty.parentBounty,
				childBounty.id,
				beneficiary
			);

			let tx4 = api.tx.childBounties.claimChildBounty(childBounty.parentBounty, childBounty.id);

			let batch = api.tx.utility.batchAll([tx1, tx2, tx3, tx4]);

			const { errorMessage, result } = await dryRunAndSubmitTransaction(api, batch, $activeAccount);

			if (errorMessage) {
				showErrorDialog(errorMessage);
				return;
			}

			// We don't get transaction result using Multix.
			if ($activeAccount.meta.source === WALLET_CONNECT_SOURCE) {
				//todo show another success screen.

				showSuccessDialog('Continue on Multix', 'Transaction was created and sent to Multix');
				return;
			}

			if (result == undefined) {
				showErrorDialog('Internal error');
				return;
			}

			showSuccessDialog('Submitting Transaction', 'Operation Success');
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const api = await getApi();

			let tx1 = api.tx.childBounties.proposeCurator(
				childBounty.parentBounty,
				childBounty.id,
				$activeAccount.address,
				convertDotToPlanck(BigInt(60))
			);

			let tx2 = api.tx.childBounties.acceptCurator(childBounty.parentBounty, childBounty.id);

			let tx3 = api.tx.childBounties.awardChildBounty(
				childBounty.parentBounty,
				childBounty.id,
				$activeAccount.address
			);

			let tx4 = api.tx.childBounties.claimChildBounty(childBounty.parentBounty, childBounty.id);

			let batch = api.tx.utility.batchAll([tx1, tx2, tx3, tx4]);
			let observableFee = batch.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
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
			<div class="absolute right-2 top-[26px]"><PolkaCoin /></div>
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
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!beneficiary.length || !curatorFee.length}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{beneficiary.length === 0 || curatorFee.length === 0
			? 'basic-button opacity-50'
			: 'cursor-allowed'}">SIGN</button
	>
</Dialog>
