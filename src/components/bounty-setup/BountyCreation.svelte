<script lang="ts">
	import { firstValueFrom } from 'rxjs';
	import { createEventDispatcher } from 'svelte';
	import type { BountyInfo } from './BountySetup.svelte';
	import { activeAccount } from '../../stores';
	import {
		dryRunAndSubmitTransaction,
		convertDotToPlanck,
		convertPlanckToDot,
		getApi
	} from '../../utils/polkadot';
	import { isInteger } from '../../utils/common';
	import { WALLET_CONNECT_SOURCE } from '../../utils/WcSigner';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../utils/loading-screen';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Approval'
		});
	}

	export let bountyInfo: BountyInfo;
	let success = false;
	let bountyValue: string | undefined;
	let bountyTitle = '';
	let fee = '-';
	let bondValue = '-';

	async function submit() {
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('Wallet is not connected');
				return;
			}
			let api = await getApi();

			if (bountyTitle.length === 0) {
				showErrorDialog('Bounty title is empty');
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
			let description = bountyTitle;
			let transaction = api.tx.bounties.proposeBounty(value, description);

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
				showErrorDialog('Internal error');
				return;
			}

			let bountyEvent = result.findRecord('bounties', 'BountyProposed');
			let bountyIndex = bountyEvent?.event.data[0].toJSON();
			bountyInfo = {
				id: bountyIndex as number,
				description: bountyTitle,
				value: BigInt(bountyValue)
			};

			// Set bounty-id in query parameters.
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set('bounty-id', String(bountyIndex));
			const url = new URL(window.location.toString());
			history.pushState({}, '', `${url.pathname}?${urlParams.toString()}`);

			showSuccessDialog('Submitting Transaction', 'Operation Success');
			success = true;
		} catch (e) {
			console.error(e);
			showErrorDialog(`${e}`);
		}
	}
	let inputTimeout = setTimeout(() => {}, 4000);

	async function calculateBondAndFee() {
		calculateBond();
		calculateFee();
	}

	async function calculateFee() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let api = await getApi();
				let value = convertDotToPlanck(BigInt(bountyValue));
				let transaction = api.tx.bounties.proposeBounty(value, bountyTitle);

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

	async function calculateBond() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let api = await getApi();
				let value = convertDotToPlanck(BigInt(bountyValue));
				const transaction = api.tx.bounties.proposeBounty(value, bountyTitle);
				const base = Number(
					(api.consts.bounties.bountyDepositBase.toHuman() as string).replaceAll(',', '')
				);
				const perByte = Number(
					(api.consts.bounties.dataDepositPerByte.toHuman() as string).replaceAll(',', '')
				);
				let bytesLen = transaction.args[1].encodedLength;
				bondValue = String(convertPlanckToDot(base + (bytesLen - 1) * perByte)) + ' DOT';
			} else {
				bondValue = '-';
			}
		} catch {
			bondValue = '-';
		}
	}

	function inputChange() {
		if (bountyValue && bountyTitle && $activeAccount) {
			fee = 'Calculating...';
			bondValue = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(calculateBondAndFee, 2000);
		} else {
			fee = '-';
			bondValue = '-';
		}
	}
</script>

<div>
	<div class="px-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		{#if !success}
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="rounded-md bg-gray-100 w-full md:w-1/2 pl-3 pt-1"
				placeholder="Give your Bounty a title"
			/>
			{#if false}
				<p class="text text-sm mt-1.5 text-white">
					<span class="opacity-50">Need more information about the Bounty Setup process? </span>
					<a href="#moreinfo">Tap here</a>
				</p>
			{/if}
		{:else}
			<p class="text-white">{`#${bountyInfo.id} ${bountyInfo.description}`}</p>
		{/if}
	</div>

	{#if success}
		<div
			class="bg-backgroundContent p-3 sm:pt-7 sm:pb-12 md:px-6 w-full box-border overflow-x-hidden"
		>
			<p>
				{`#${bountyInfo.id} ${bountyInfo.description}`}
				has been created successfully!
				<br /><br />
				You can either proceed to the Referendum <br />
				for Bounty Approval or return to the main page <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="flex-col space-y-2 sm:flex-row mt-10 sm:mt-40">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5"
					>RETURN HOME</button
				>
				<button on:click={changeTab} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div
			class="grid content-between sm:space-y-10 bg-backgroundContent p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden"
		>
			<div>
				<section class="space-y-1 sm:space-y-3">
					<p class="text-xs">Bounty value</p>
					<input
						bind:value={bountyValue}
						class="border pt-1 pl-2 w-full md:w-1/3 rounded-md bg-white"
						placeholder="1000"
						on:input={inputChange}
					/>
				</section>
				<hr class="border-white my-5 sm:my-10 w-full md:w-1/2" />

				<div class="my-5 sm:my-10 h-24 space-y-2 sm:space-y-5">
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Bounty Bond</p>
						<p class="value">{bondValue}</p>
					</section>
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Transaction fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
				<button on:click={() => goto('/curator-actions')} class="button-cancel">CANCEL</button>
				<button disabled={!bountyTitle || !bountyValue} on:click={submit} class="button-active"
					>SUBMIT</button
				>
			</div>
		</div>
	{/if}
</div>
