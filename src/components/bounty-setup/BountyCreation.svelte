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
				showErrorDialog('wallet is not connected');
				return;
			}
			let api = await getApi();

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
				showErrorDialog('Internal error.');
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
	<div class="top-bar flex justify-between">
		{#if !success}
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="rounded-md bg-gray-100 w-1/2 pl-3 pt-1"
				placeholder="Give your Bounty a title"
			/>
			<p class="text text-sm mt-1.5 text-white">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				<a href="#moreinfo">Tap here</a>
			</p>
		{:else}
			<p class="text-white">{`#${bountyInfo.id} ${bountyInfo.description}`}</p>
		{/if}
	</div>

	{#if success}
		<div class="content">
			<p>
				{`#${bountyInfo.id} ${bountyInfo.description}`}
				created successfully!
				<br /><br />
				You can either proceed to 2 Referendum <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button on:click={changeTab} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="grid content-between content">
			<div>
				<p class="text-xs">Bounty value</p>
				<div class="flex mt-2">
					<input
						bind:value={bountyValue}
						class="border pt-1 pl-2 w-1/4 rounded-md bg-white"
						placeholder="1000"
						on:input={inputChange}
					/>
				</div>
				<hr class="border-white mt-5 mb-1 w-1/2" />

				<p class="text-xs">Bounty description</p>
				<textarea
					class="border border-borderColor pt-1 pl-2 w-1/2 h-28 rounded-md bg-white mt-2e mr-2 mt-2"
					placeholder="Your Bounty description goes here"
				/>

				<hr class=" border-white mt-5 mb-2 w-1/2" />
				<div class="mt-5 mb-10 h-24">
					<section class="mb-3">
						<p class="label text-xs">Bounty Bond</p>
						<p class="value">{bondValue}</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="buttons flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button disabled={!bountyTitle || !bountyValue} on:click={submit} class="button-active"
					>SUBMIT</button
				>
			</div>
		</div>
	{/if}
</div>
