<script lang="ts">
	import {
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		getApi,
		isValidAddress
	} from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
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

	let curatorAddress = '';
	let curatorFee = '';
	let fee = '-';

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
			if (!isValidAddress(curatorAddress)) {
				showErrorDialog('Curator address is invalid.');
				return;
			}

			if (!isInteger(curatorFee)) {
				showErrorDialog('Curator fee value is invalid.');
				return;
			}

			const api = await getApi();

			let transaction = api.tx.childBounties.proposeCurator(
				childBounty.parentBounty,
				childBounty.id,
				curatorAddress,
				Number(curatorFee)
			);

			const { errorMessage, result } = await dryRunAndSubmitTransaction(
				api,
				transaction,
				$activeAccount
			);

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
				showErrorDialog('Internal error.');
				return;
			}

			showSuccessDialog('Submitting Transaction', 'Operation Success');
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}

	async function calculateFee() {
		try {
			const api = await getApi();
			let transaction = api.tx.childBounties.proposeCurator(
				childBounty.parentBounty,
				childBounty.id,
				$activeAccount.address,
				33
			);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<!-- ToDo: dynamically change the background colors according to the child bounty the button exists in (only exists in one: created) -->

<BountyDialog bind:open title="ASSIGN SUB-CURATOR" backgroundColor="white" textColor="primary">
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
			<div class="absolute right-2 top-[26px]"><PolkaCoin /></div>
		</div>
		<section class="mt-10">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={submit}
		disabled={!curatorAddress.length}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{curatorAddress.length === 0 ? 'basic-button opacity-50' : 'cursor-allowed'}">SIGN</button
	>
</BountyDialog>
