<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { convertPlanckToDot, dryRunAndSubmitTransaction, getApi } from '../../utils/polkadot';
	import BountyDialog from '../BountyDialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { onMount } from 'svelte';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFee();
	});

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

<BountyDialog bind:open title="BENEFICIARY CLAIM FORM">
	<section class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<p class="text-sm">
			This will write your communication form on the Blockchain as a remark and cost a small
			transaction fee. <br>
            <br> It will then be fetched and displayed to other users as information for your
			bounty, by associating it with the Bounty ID and Curator Address. Using a remark is a way to
			store the URL in a decentralized way and avoid a database. <br>
            <br> You will be able to update and
			change this link in the future, by repeating the action.
		</p>

		<div class="my-4">
			<input
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
				placeholder="enter URL"
			/>
		</div>

		<div>
			<p class="text-xs">Calculated Fee</p>
			<p>{fee}</p>
		</div>
	</section>

	<button
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 button-popup {isToggled
			? 'button-popup'
			: 'opacity-50 cursor-not-allowed'}">SIGN</button
	>
</BountyDialog>
