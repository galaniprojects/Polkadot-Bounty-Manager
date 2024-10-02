<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import {
		convertPlanckToDot,
		dryRunAndSubmitTransaction,

		isValidAddress

	} from '../../utils/polkadot';
	import BountyDialog from '../BountyDialog.svelte';
	import { ApiRx, WsProvider } from '@polkadot/api';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../utils/loading-screen';
	import { WALLET_CONNECT_SOURCE } from '../../utils/WcSigner';

	export let open = true;
	export let bounty: Bounty;

	let beneficiary = '';

	let fee = '-';
	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
	  open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('wallet is not connected');
				return;
			}
			if (!isValidAddress(beneficiary)) {
				showErrorDialog('beneficiary address is invalid.');
				return;
			}

			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));

			let transaction = api.tx.bounties.awardBounty(bounty.id, beneficiary);

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
			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));

			let transaction = api.tx.bounties.awardBounty(bounty.id, $activeAccount.address);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<BountyDialog bind:open title="Award Bounty">
	<div>
		<p>#{bounty.id}</p>
		{#if bounty.description !== undefined}
			<p>{bounty.description}</p>
		{/if}

		<div class="my-4">
			<p>Beneficiary:</p>
			<input
				bind:value={beneficiary}
				class="rounded-md bg-gray-100 pl-3 pt-1 w-80 text-black"
				placeholder="beneficiary address"
			/>
		</div>
		<p>Fee: {fee}</p>
	</div>
	<div class="flex justify-center items-center">
		<div class="grid">
			<button on:click={submit} disabled={beneficiary.length === 0} class="button-active">Submit</button>
		</div>
	</div>
</BountyDialog>
