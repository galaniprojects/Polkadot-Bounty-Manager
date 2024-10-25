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
	import ToggleIcon from '../svg/ToggleIcon.svelte';
	import { WALLET_CONNECT_SOURCE } from '../../utils/WcSigner';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFee();
	});

	async function acceptCuratorRole() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('wallet is not connected');
				return;
			}
			let api = await getApi();

			let transaction = api.tx.bounties.acceptCurator(bounty.id);
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
		open = false;
	}

	async function calculateFee() {
		try {
			let api = await getApi();
			let transaction = api.tx.bounties.acceptCurator(bounty.id);

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

<BountyDialog bind:open title="ACCEPT CURATOR ROLE">
	<section class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<div>
			<p class="text-xs">Accept Curator role</p>
			<div class="flex justify-between items-start">
				<p>I agree</p>
				<ToggleIcon bind:checked={isToggled} />
			</div>
		</div>

		<div class="flex space-x-24">
			<div>
				<p class="text-xs">Calculated Fee</p>
				<p>{fee}</p>
			</div>
			<div>
				<p class="text-xs">Fee</p>
				<p>{fee}</p>
			</div>
		</div>
	</section>

	<button
		on:click={acceptCuratorRole}
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 button-popup {isToggled
			? 'button-popup'
			: 'opacity-50 cursor-not-allowed'}">SIGN</button
	>
</BountyDialog>
