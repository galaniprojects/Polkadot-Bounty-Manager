<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { convertPlanckToDot, dryRunAndSubmitTransaction } from '../../../utils/polkadot';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../utils/loading-screen';
	import { formatDate } from '../../../utils/common';
	import Dialog from '../../common/Dialog.svelte';
	import { SupportedSources } from '../../../types/account';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let expiryDate: string;

	onMount(async () => {
		await calculateFee();
		if (bounty.expiryDate) {
			expiryDate = formatDate(bounty.expiryDate);
		} else {
			expiryDate = '-';
		}
	});

	async function submit() {
		// open = false;
		// showLoadingDialog('Submitting transaction');
		// try {
		// 	if (!$activeAccount) {
		// 		showErrorDialog('Wallet is not connected');
		// 		return;
		// 	}
		//
		// 	let api = await getApi();
		//
		// 	let transaction = api.tx.bounties.extendBountyExpiry(bounty.id, undefined);
		//
		// 	const { errorMessage, result } = await dryRunAndSubmitTransaction(
		// 		api,
		// 		transaction,
		// 		$activeAccount
		// 	);
		//
		// 	if (errorMessage) {
		// 		showErrorDialog(errorMessage);
		// 		return;
		// 	}
		//
		// 	// We don't get transaction result using Multix.
		// 	if ($activeAccount.source === SupportedSources.WalletConnect) {
		// 		//todo show another success screen.
		//
		// 		showSuccessDialog('Continue on Multix', 'Transaction was created and sent to Multix');
		// 		return;
		// 	}
		//
		// 	if (result == undefined) {
		// 		showErrorDialog('Internal error');
		// 		return;
		// 	}
		//
		// 	showSuccessDialog('Bounty Extended', 'Your bounty has been extended');
		// } catch (e) {
		// 	console.error(e);
		// 	showErrorDialog(`${e}`);
		// }
	}

	async function calculateFee() {
	// 	if (!$activeAccount) {
	// 		fee = '-';
	// 		return;
	// 	}
	// 	try {
	// 		let api = await getApi();
	// 		let transaction = api.tx.bounties.extendBountyExpiry(bounty.id, undefined);
	//
	// 		let observableFee = transaction.paymentInfo($activeAccount.address);
	// 		fee =
	// 			convertPlanckToDot((await firstValueFrom(observableFee)).partialFee.toNumber()).toString() +
	// 			' DOT';
	// 	} catch (e) {
	// 		console.error(e);
	// 		fee = '-';
	// 	}
	}
</script>

<Dialog bind:open title="EXTEND BOUNTY">
	<section class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<div class="flex justify-between">
			<div>
				<p class="text-xs">Expiration date</p>
				<p>
					{expiryDate}
				</p>
			</div>

			<div>
				<p class="text-xs">New expected expiration date</p>
				<span>
					{(() => {
						var today = new Date();
						var tomorrow = new Date();
						tomorrow.setDate(today.getDate() + 90);
						return formatDate(tomorrow);
					})()}
				</span>
			</div>
		</div>

		<div>
			<p class="text-xs">Calculated Fee</p>
			<p>{fee}</p>
		</div>
	</section>

	<button
		on:click={submit}
		class="w-full md:w-fit mt-10 h-12 px-10 rounded-md text-white bg-extendButtonBackground"
		>SIGN</button
	>
</Dialog>
