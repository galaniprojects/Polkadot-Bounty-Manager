<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { convertPlanckToDot, dryRunAndSubmitTransaction } from '../../utils/polkadot';
	import BountyDialog from '../BountyDialog.svelte';
	import { ApiRx, WsProvider } from '@polkadot/api';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { onMount } from 'svelte';

	export let opened = false;
	export let bounty: Bounty;
	let fee = '-';
	let value = onMount(async () => {
		await calculateFee();
	});

	async function acceptCuratorRule() {
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
		let tx = api.tx.bounties.acceptCurator(bounty.id);
		const { errorMessage } = await dryRunAndSubmitTransaction(api, tx, $activeAccount);
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

<BountyDialog bind:opened title="Accept Curator Rule">
	<div class="flex justify-center items-center">
		<div>
			<p>bounty.id</p>
			{#if bounty.description !== undefined}
				<p>{bounty.description}</p>
			{/if}

			<p>Fee: {fee}</p>
			<button on:click={acceptCuratorRule} class="button-active">Submit</button>
		</div>
	</div>
</BountyDialog>
