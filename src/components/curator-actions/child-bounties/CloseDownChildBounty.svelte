<script lang="ts">
	import { convertPlanckToDot, dryRunAndSubmitTransaction, getApi } from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../utils/loading-screen';
	import ToggleIcon from '../../svg/ToggleIcon.svelte';
	import type { ChildBounty } from '../../../types/child-bounty';
	import { WALLET_CONNECT_SOURCE } from '../../../utils/WcSigner';

	export let open = false;
	export let childBounty: ChildBounty;

	let fee = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFee();
	});

	async function acceptCuratorRule() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('wallet is not connected');
				return;
			}

			const api = await getApi();
			let transaction = api.tx.childBounties.closeChildBounty(
				childBounty.parentBounty,
				childBounty.id
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
			const api = await getApi();
			let transaction = api.tx.childBounties.closeChildBounty(
				childBounty.parentBounty,
				childBounty.id
			);

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

<BountyDialog bind:open title="Close Down Child Bounty">
	<section class="space-y-5">
		<div class="space-x-1">
			<span>#{childBounty.id}</span>
			{#if childBounty.description !== undefined}
				<span>{childBounty.description}</span>
			{/if}
		</div>
		<div class="m-y-4">
			<p>
				Only close a child bounty after communicating with the sub-curator and the projected
				beneficiary. The funds will be reallocated to the parent bounty.
			</p>
		</div>

		<div>
			<p class="text-xs">I understand</p>
			<div class="flex justify-between items-start">
				<p>Close down anyway</p>
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
		disabled={!isToggled}
		class="{`w-full md:w-fit mt-10 ${isToggled ? 'button-popup' : 'opacity-50 cursor-not-allowed'}`}
  {`${!isToggled ? 'button-popup' : 'cursor-allowed'}`}">SIGN</button
	>
</BountyDialog>
