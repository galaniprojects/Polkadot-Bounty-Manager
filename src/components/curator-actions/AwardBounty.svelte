<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import {
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		getApi,
		isValidAddress
	} from '../../utils/polkadot';
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

	export let open = true;
	export let bounty: Bounty;

	let showTransactionDialog = false;
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
				showErrorDialog('Wallet is not connected');
				return;
			}
			if (!isValidAddress(beneficiary)) {
				showErrorDialog('Beneficiary address is invalid.');
				return;
			}

			let api = await getApi();

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

			showSuccessDialog('Bounty closed', 'Your bounty has been awarded and can be claimed');
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}

	async function calculateFee() {
		try {
			let api = await getApi();

			let transaction = api.tx.bounties.awardBounty(bounty.id, $activeAccount.address);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}

	async function proceed() {
		showTransactionDialog = true;
	}
</script>

<BountyDialog bind:open title="AWARD BOUNTY">
	<div class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>
		{#if !showTransactionDialog}
			<section class="mt-10">
				<p class="text-xs">Bounty value</p>
				<p>
					A bounty can only be awarded in whole as long as no child bounties exist. In this case, it
					is still highly recommended to manage the funds through child bounties and not award the
					whole bounty at once.
				</p>
			</section>
			<button on:click={proceed} class="w-full md:w-fit mt-10 h-12 button-popup">PROCEED</button>
		{/if}

		{#if showTransactionDialog}
			<section class="mt-10">
				<p class="text-xs">Bounty value</p>
				<p><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
			</section>
			<div class="my-4">
				<p class="text-xs">Beneficiary account address</p>
				<input
					bind:value={beneficiary}
					class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
					placeholder="enter"
				/>
			</div>
			<section class="mt-10">
				<p class="text-xs">Calculated Fee</p>
				<p>{fee}</p>
			</section>

			<button
				on:click={submit}
				disabled={beneficiary.length === 0}
				class="w-full md:w-fit mt-10 h-12 button-popup {beneficiary.length === 0
					? 'opacity-50 cursor-not-allowed'
					: ''}">SIGN</button
			>
		{/if}
	</div>
</BountyDialog>
