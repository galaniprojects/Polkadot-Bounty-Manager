<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { convertPlanckToDot, dryRunAndSubmitTransaction, getApi } from '../../utils/polkadot';
	import BountyDialog from '../BountyDialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../utils/loading-screen';
	import { WALLET_CONNECT_SOURCE } from '../../utils/WcSigner';
	import { calculateExpirationDate, formatDate } from '../../utils/common';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let expiryDate: string;

	onMount(async () => {
		await calculateFee();
		let calculatedExpiryDate = await calculateExpirationDate(bounty);
		if (calculatedExpiryDate) {
			expiryDate = formatDate(calculatedExpiryDate);
		} else {
			expiryDate = '-';
		}
	});

	async function submit() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('Wallet is not connected');
				return;
			}

			let api = await getApi();

			let transaction = api.tx.bounties.extendBountyExpiry(bounty.id, undefined);

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

			showSuccessDialog('Bounty Extended','Your bounty has been extended');
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
			let api = await getApi();
			let transaction = api.tx.bounties.extendBountyExpiry(bounty.id, undefined);

			let observableFee = transaction.paymentInfo($activeAccount.address);
			fee =
				convertPlanckToDot((await firstValueFrom(observableFee)).partialFee.toNumber()).toString() +
				' DOT';
		} catch (e) {
			console.error(e);
			fee = '-';
		}
	}
</script>

<BountyDialog bind:open title="EXTEND BOUNTY">
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
</BountyDialog>
