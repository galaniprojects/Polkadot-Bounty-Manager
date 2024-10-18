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

	async function acceptCuratorRole() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('Wallet is not connected');
				return;
			}
			const api = await getApi();

			let transaction = api.tx.childBounties.acceptCurator(
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
		open = false;
	}

	async function calculateFee() {
		try {
			const api = await getApi();
			let transaction = api.tx.childBounties.acceptCurator(
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

<BountyDialog bind:open title="ACCEPT SUB-CURATOR ROLE" backgroundColor="white" textColor="primary">
	<section class="space-y-5">
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>

		<div>
			<p class="text-xs">Accept Sub-curator role</p>
			<div class="flex justify-between items-start">
				<p>I agree</p>
				<span class="custom-toggle"><ToggleIcon bind:checked={isToggled} /></span>
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
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{!isToggled ? 'basic-button opacity-50' : 'cursor-allowed'}">SIGN</button
	>
</BountyDialog>

<style>
	.custom-toggle {
		--toggle-background: rgba(101, 112, 139, 0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.childBountyGray');
	}
</style>
