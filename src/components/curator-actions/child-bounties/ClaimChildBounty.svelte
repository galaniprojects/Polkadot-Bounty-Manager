<script lang="ts">
	import { convertPlanckToDot, dryRunAndSubmitTransaction, getApi } from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
	import type { ChildBounty } from '../../../types/child-bounty';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../utils/loading-screen';
	import { WALLET_CONNECT_SOURCE } from '../../../utils/WcSigner';
	import PolkadotIcon from '../../PolkadotIcon.svelte';
	import { truncateString } from '../../../utils/common';

	export let open = true;
	export let childBounty: ChildBounty;

	let beneficiary: string | undefined;
	let fee = '-';

	onMount(async () => {
		await calculateFee();
		if (typeof childBounty.status === 'object') {
			if ('PendingPayout' in childBounty.status) {
				beneficiary = childBounty.status.PendingPayout.beneficiary;
			}
		}
	});

	async function submit() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('Wallet is not connected');
				return;
			}

			const api = await getApi();
			let transaction = api.tx.childBounties.claimChildBounty(
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

			showSuccessDialog('Bounty Claimed', 'Your bounty has been claimed');
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const api = await getApi();

			let transaction = api.tx.childBounties.claimChildBounty(
				childBounty.parentBounty,
				childBounty.id
			);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<BountyDialog
	bind:open
	title="CLAIM CHILD BOUNTY AWARD"
	backgroundColor="white"
	textColor="primary"
>
	<div class="space-y-8">
		<p class="p-1 text-white bg-curatorMainBackground">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<div class="space-y-2">
			<p class="text-xs">What is this action?</p>
			<p class="text-xs">
				This is a permissionless action and can be executed by anyone in favour of the beneficiary.
				The funds will be transferred to the beneficiary’s address.
			</p>
		</div>
		{#if beneficiary}
			<div class="space-y-2">
				<p class="text-xs">Beneficiary account</p>
				<div class="flex">
					<div class="w-5 h-5">
						<PolkadotIcon address={beneficiary} />
					</div>
					<p>{truncateString(beneficiary, 13)}</p>
				</div>
			</div>
		{/if}
		<div class="space-y-2">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</div>
	</div>

	<button on:click={submit} class="w-full md:w-fit mt-10 h-12 basic-button bg-curatorMainBackground"
		>SIGN</button
	>
</BountyDialog>
