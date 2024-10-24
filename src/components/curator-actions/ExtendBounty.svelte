<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { convertPlanckToDot, getApi } from '../../utils/polkadot';
	import BountyDialog from '../BountyDialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { onMount } from 'svelte';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function calculateFee() {
		try {
			let api = await getApi();
			let transaction = api.tx.bounties.extendBounty(bounty.id);

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
				<span>25th Sep 2024</span>
			</div>

			<div>
				<p class="text-xs">New expiration date</p>
				<span>25th Dec 2024</span>
			</div>
		</div>

		<div>
			<p class="text-xs">Calculated Fee</p>
			<p>{fee}</p>
		</div>
	</section>

	<button class="w-full md:w-fit mt-10 h-12 px-10 rounded-md text-white bg-extendButtonBackground"
		>SIGN</button
	>
</BountyDialog>
