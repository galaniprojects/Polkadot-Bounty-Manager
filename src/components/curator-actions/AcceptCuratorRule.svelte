<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { convertPlanckToDot, dryRunAndSubmitTransaction } from '../../utils/polkadot';
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
	import ToggleIcon from '../svg/ToggleIcon.svelte';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFee();
	});

	async function acceptCuratorRule() {
		showLoadingDialog('Submitting transaction');
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
		let tx = api.tx.bounties.acceptCurator(bounty.id);
		const { errorMessage } = await dryRunAndSubmitTransaction(api, tx, $activeAccount);
		if (errorMessage) {
			showErrorDialog(errorMessage);
			return;
		}
		showSuccessDialog('Submitting Transaction', 'Operation Success');
		open = false;
	}

	async function calculateFee() {
		try {
			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
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

<BountyDialog bind:opened={open} title="ACCEPT CURATOR ROLE">
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
		on:click={acceptCuratorRule}
		class="{`w-full md:w-fit mt-10 ${isToggled ? 'button-popup' : 'opacity-50 cursor-not-allowed'}`}
  {`${!isToggled ? 'button-popup' : 'cursor-allowed'}`}">SIGN</button
	>
</BountyDialog>
