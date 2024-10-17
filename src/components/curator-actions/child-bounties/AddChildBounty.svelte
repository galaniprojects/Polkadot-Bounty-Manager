<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import {
		convertDotToPlanck,
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		getApi
	} from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../../utils/loading-screen';
	import { isInteger } from '../../../utils/common';
	import { WALLET_CONNECT_SOURCE } from '../../../utils/WcSigner';
	import PolkaCoin from '../../svg/PolkaCoin.svelte';

	export let open = true;
	export let bounty: Bounty;

	let bountyValue: string | undefined;
	let bountyTitle = '';
	let bountyDescription = '';

	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('wallet is not connected');
				return;
			}

			const api = await getApi();
			if (bountyTitle.length === 0) {
				showErrorDialog('bounty title is empty');
				return;
			}
			if (!bountyValue) {
				showErrorDialog('Bounty value is invalid');
				return;
			}
			if (!isInteger(bountyValue)) {
				showErrorDialog('Bounty value is invalid');
				return;
			}

			let value = convertDotToPlanck(BigInt(bountyValue));
			let transaction = api.tx.childBounties.addChildBounty(bounty.id, value, bountyTitle);

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

			//TODO: refetch child bounties.

			showSuccessDialog('Submitting Transaction', 'Operation Success');
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}

	async function calculateFee() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let api = await getApi();
				let value = convertDotToPlanck(BigInt(bountyValue));
				let transaction = api.tx.childBounties.addChildBounty(bounty.id, value, bountyTitle);

				let observableFee = transaction.paymentInfo($activeAccount.address);

				const paymentInfo = await firstValueFrom(observableFee);
				fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
			} else {
				fee = '-';
			}
		} catch {
			fee = '-';
		}
	}

	let inputTimeout = setTimeout(() => {}, 4000);
	function inputChange() {
		if (bountyValue && bountyTitle && $activeAccount) {
			fee = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(calculateFee, 2000);
		} else {
			fee = '-';
		}
	}

	$: isFormValid = bountyValue && bountyValue.trim() !== '' && bountyTitle.trim() !== '';
</script>

<BountyDialog
	bind:open
	title="ADD NEW CHILD BOUNTY"
	backgroundColor="childBountyBackground"
	textColor="primary"
>
	<div class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description}
				<span>{bounty.description}</span>
			{/if}
		</div>
		<p>
			Please use a descriptive title and add info about the task and beneficiary in the description.
		</p>
	</div>

	<div class="flex flex-col gap-6 mt-6">
		<section class="relative">
			<p class="text-xs">Value</p>
			<input
				bind:value={bountyValue}
				class="border border-black pt-1 pl-2 rounded-[3px] bg-white h-10 w-full"
				placeholder="1000000000"
				on:input={inputChange}
			/>
			<div class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"></div>
			<div class="absolute right-2 top-[26px]"><PolkaCoin /></div>
		</section>
		<section>
			<p class="text-xs">Title</p>
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="Child bounty name"
			/>
		</section>

		<section class="scrollbar">
			<p class="text-xs">Description</p>
			<textarea
				bind:value={bountyDescription}
				on:input={inputChange}
				class="scrollbar border border-black rounded-[3px] bg-white h-40 w-full p-2"
				placeholder="Description"
			/>
		</section>
		<section class="mt-10">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</section>

		<button
			on:click={submit}
			class="{`w-full md:w-fit mt-10 h-12 ${isFormValid ? 'button-active' : 'cursor-not-allowed'}`}
		{`${!isFormValid ? 'button-active' : 'cursor-allowed'}`}"
			disabled={!isFormValid}>SIGN</button
		>
	</div>
</BountyDialog>

<style>
	.scrollbar::-webkit-scrollbar {
		@apply w-[5px];
	}

	.scrollbar::-webkit-scrollbar-track {
		@apply mt-2 bg-accent bg-opacity-50 rounded-lg;
	}

	.scrollbar::-webkit-scrollbar-thumb {
		@apply bg-accent rounded-lg;
	}
</style>
