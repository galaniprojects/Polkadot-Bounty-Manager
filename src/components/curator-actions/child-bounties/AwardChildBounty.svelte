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

	export let open = true;
	export let childBounty: ChildBounty;

	const WS_URL = 'ws://localhost:8000';
	let api: ApiRx;
	let beneficiary = '';
	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function getApi(): Promise<ApiRx> {
		if (api) return api;
		const wsProvider = new WsProvider(WS_URL);
		api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
		return api;
	}

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

			const api = await getApi();

			let transaction = api.tx.bounties.awardBounty(childBounty.id, beneficiary);

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
			const api = await getApi();

			let transaction = api.tx.bounties.awardBounty(childBounty.id, $activeAccount.address);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<BountyDialog bind:open title="AWARD CHILD BOUNTY" backgroundColor="white" textColor="primary">
	<div class="grid">
		<p class="space-x-1 mb-7 p-1 text-white bg-childBountyGreen">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<section>
			<p class="text-xs">Child bounty value</p>
			<p><span>{convertPlanckToDot(childBounty.value)}</span> DOT</p>
		</section>
		<div class="mt-5">
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
			class="w-full md:w-fit mt-10 h-12 bg-childBountyGreen basic-button {beneficiary.length === 0
				? 'opacity-50 cursor-not-allowed'
				: ''}">SIGN</button
		>
	</div>
</BountyDialog>
