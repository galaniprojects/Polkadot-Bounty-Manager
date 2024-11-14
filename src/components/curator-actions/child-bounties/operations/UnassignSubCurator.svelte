<script lang="ts">
	import {
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
	} from '../../../../utils/polkadot';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import Dialog from '../../../common/Dialog.svelte';
	import ToggleIcon from '../../../svg/ToggleIcon.svelte';

	export let open = true;
	export let childBounty: ChildBounty;

	let fee = '-';
	let isToggled = false;
	let curatorAddress = '';

	onMount(async () => {
		await calculateFee();
	});

	async function unassignSubCurator() {
		// open = false;
		// showLoadingDialog('Submitting transaction');
		// try {
		// 	if (!$activeAccount) {
		// 		showErrorDialog('Wallet is not connected');
		// 		return;
		// 	}
		//
		// 	const api = await getApi();
		//
		// 	let transaction = api.tx.childBounties.unassignCurator(
		// 		childBounty.parentBounty,
		// 		childBounty.id
		// 	);
		//
		// 	const { errorMessage, result } = await dryRunAndSubmitTransaction(
		// 		api,
		// 		transaction,
		// 		$activeAccount
		// 	);
		//
		// 	if (errorMessage) {
		// 		showErrorDialog(errorMessage);
		// 		return;
		// 	}
		//
		// 	if ($activeAccount.meta.source === WALLET_CONNECT_SOURCE) {
		// 		showSuccessDialog('Continue on Multix', 'Transaction was created and sent to Multix');
		// 		return;
		// 	}
		//
		// 	if (result == undefined) {
		// 		showErrorDialog('Internal error');
		// 		return;
		// 	}
		//
		// 	showSuccessDialog('Submitting Transaction', 'Operation Success');
		// } catch (e) {
		// 	console.error(e);
		// 	showErrorDialog(`${e}`);
		// }
	}

	async function calculateFee() {
		// if (!$activeAccount) {
		// 	fee = '-';
		// 	return;
		// }
		// try {
		// 	const api = await getApi();
		// 	let transaction = api.tx.childBounties.unassignCurator(
		// 		childBounty.parentBounty,
		// 		childBounty.id
		// 	);
		// 	let observableFee = transaction.paymentInfo($activeAccount.address);
		//
		// 	const paymentInfo = await firstValueFrom(observableFee);
		// 	fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		// } catch (e) {
		// 	console.error(e);
		// 	fee = '--';
		// }
	}
</script>

<Dialog bind:open title="UNASSIGN SUB-CURATOR" backgroundColor="white" textColor="primary">
	<div>
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<section class="mt-10 space-y-1">
			<p class="text-xs">Please note</p>
			<p class="text-red bg-white rounded-sm p-2 border border-red">
				Un-assigning a sub-curator should only happen if it is deemed necessary or flagged by the
				community.
			</p>
			<p>You will be able to assign a new sub-curator soon after the un-assignment is executed.</p>
		</section>

		<div class="my-4">
			<p class="text-xs">Unassign sub-curator</p>
			{curatorAddress}
		</div>

		<div class="my-4">
			<p class="text-xs">I understand</p>
			<div class="flex justify-between items-start">
				<p>Unassign anyway</p>
				<span class="custom-toggle"><ToggleIcon bind:checked={isToggled} /></span>
			</div>
		</div>
		<section class="mt-10">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={unassignSubCurator}
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{!isToggled ? 'basic-button opacity-50' : 'cursor-allowed'}">SIGN</button
	>
</Dialog>

<style>
	.custom-toggle {
		--toggle-background: rgba(101, 112, 139, 0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.childBountyGray');
	}
</style>
