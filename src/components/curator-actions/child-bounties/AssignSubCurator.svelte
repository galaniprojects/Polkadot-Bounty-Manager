<script lang="ts">
	import {
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		isValidAddress
	} from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
	import { ApiRx, WsProvider } from '@polkadot/api';
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
				showErrorDialog('wallet is not connected');
				return;
			}
			if (!isValidAddress(curatorAddress)) {
				showErrorDialog('curator address is invalid.');
				return;
			}

			if (!isInteger(curatorFee)) {
				showErrorDialog('curator fee value is invalid');
				return;
			}

			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));

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
			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));

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

<BountyDialog bind:open title="Assign Sub-Curator">
	<div>
		<p>#{childBounty.id}</p>
		{#if childBounty.description !== undefined}
			<p>{childBounty.description}</p>
		{/if}

		<div class="my-4">
			<p>Curator address:</p>
			<input
				bind:value={curatorAddress}
				class="rounded-md bg-gray-100 pl-3 pt-1 w-80 text-black"
			/>
		</div>

		<div class="my-4">
			<p>Curator fee:</p>
			<input
				bind:value={curatorFee}
				class="rounded-md bg-gray-100 pl-3 pt-1 w-80 text-black"
				placeholder="0"
			/>
		</div>
		<p>Fee: {fee}</p>
	</div>
	<div class="flex justify-center items-center">
		<div class="grid">
			<button on:click={submit} disabled={curatorAddress.length === 0} class="button-active"
				>Submit</button
			>
		</div>
	</div>
</BountyDialog>
