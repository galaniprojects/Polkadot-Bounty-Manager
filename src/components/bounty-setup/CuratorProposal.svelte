<script lang="ts">
	import { ApiRx } from '@polkadot/api';
	import { firstValueFrom } from 'rxjs';
	import type { BountyInfo } from './BountySetup.svelte';
	import { activeAccount } from '../../stores';
	import { treasuryTracks } from './ApprovalReferendum.svelte';
	import {
		convertDotToPlanck,
		convertPlanckToDot,
		dryRunAndSubmitTransaction,
		getApi,
		isValidAddress
	} from '../../utils/polkadot';
	import { isInteger } from '../../utils/common';
	import { onMount } from 'svelte';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../utils/loading-screen';
	import { goto } from '$app/navigation';

	export let bountyInfo: BountyInfo;
	let curatorFee: string | undefined = undefined;
	let curatorAddress: string | undefined;
	let selectedTreasuryTrack = treasuryTracks[0].origin;
	let step = 1;
	let fee = '-';
	let deposit = '-';

	onMount(async () => {
		await calculateDeposit();
	});

	function proceed() {
		if (step == 1) {
			step = 2;
		}
	}
	async function submit() {
		// if (!$activeAccount) {
		// 	showErrorDialog('Wallet is not connected');
		// 	return;
		// }
		// showLoadingDialog('Submitting Transaction');
		//
		// if (!curatorAddress || !isValidAddress(curatorAddress)) {
		// 	showErrorDialog('Curator address is invalid');
		// 	return;
		// }
		//
		// if (!curatorFee || !isInteger(curatorFee)) {
		// 	showErrorDialog('Invalid value of curator fee');
		// 	return;
		// }
		//
		// try {
		// 	const api = await getApi();
		// 	if (!curatorFee) {
		// 		showErrorDialog('Invalid value of curator fee');
		// 		return;
		// 	}
		//
		// 	const transaction = createProposalTransaction(api);
		// 	const { errorMessage } = await dryRunAndSubmitTransaction(api, transaction, $activeAccount);
		// 	if (errorMessage) {
		// 		showErrorDialog(errorMessage);
		// 		return;
		// 	}
		//
		// 	showSuccessDialog('Submitting Transaction', 'Operation Success');
		// 	step = 3;
		// } catch (e) {
		// 	console.error(e);
		// 	showErrorDialog(`Something went wrong, ${e}`);
		// }
	}

	function createProposalTransaction(api: ApiRx) {
		if (!curatorFee) {
			throw new Error('Curator fee is not set');
		}
		let tx = api.tx.bounties.proposeCurator(
			bountyInfo.id,
			curatorAddress,
			convertDotToPlanck(BigInt(curatorFee))
		);

		return api.tx.referenda.submit(
			{
				Origins: selectedTreasuryTrack
			},
			{ Inline: tx.method.toHex() },
			{ After: 1 }
		);
	}

	async function calculateDeposit() {
		try {
			const api = await getApi();
			const base = Number(
				(api.consts.referenda.submissionDeposit.toHuman() as string).replaceAll(',', '')
			);
			deposit = convertPlanckToDot(base) + ' DOT';
		} catch {
			deposit = '-';
		}
	}

	let inputTimeout = setTimeout(() => {}, 2000);
	async function calculateFee() {
		try {
			if (curatorAddress && curatorFee && $activeAccount) {
				const api = await getApi();
				const transaction = createProposalTransaction(api);
				let observableFee = transaction.paymentInfo($activeAccount.address);
				fee =
					convertPlanckToDot(
						(await firstValueFrom(observableFee)).partialFee.toNumber()
					).toString() + ' DOT';
			} else {
				fee = '-';
			}
		} catch {
			fee = '-';
		}
	}

	function inputChange() {
		if (curatorAddress && curatorFee && $activeAccount) {
			fee = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(calculateFee, 2000);
		} else {
			fee = '-';
		}
	}
</script>

<div>
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if bountyInfo.id && bountyInfo.description}
				{`#${bountyInfo.id} ${bountyInfo.description}`}
			{/if}
		</p>
		{#if false}
			<p class="text text-sm mt-1.5">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				Tap here
			</p>
		{/if}
	</div>

	{#if step === 1}
		<div
			class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
		>
			<p class="w-full md:w-2/3 text-sm sm:text-base">
				It is strongly recommended to create the Curator Proposal referendum, after the Bounty has
				been funded and the Curator list has been informally accepted by the community in
				discussions on the platforms.
				<br /><br />
				However if you want to proceed and already have a list of curators to propose, it is possible
				to do so.
				<br />
				Please note: the execution of the Curator Proposal referendum will fail, unless the bounty has
				been already funded.
			</p>

			<div class="flex-col space-y-2 sm:flex-row my-5 sm:mt-20">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5"
					>RETURN HOME</button
				>
				<button disabled={!bountyInfo.id} on:click={() => proceed()} class="button-active"
					>PROCEED</button
				>
			</div>
		</div>
	{:else if step === 2}
		<div
			class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
		>
			<div>
				<div class="space-y-2 sm:space-y-5">
					<p class="w-full md:1/3 mb-2 text-sm sm:text-base">
						It is highly recommended to use a pure proxy multisig address for the curators!
					</p>
					<div class="space-y-1 sm:space-y-3">
						<p class="text-xs my-1">Curator Address</p>
						<input
							bind:value={curatorAddress}
							class="w-full md:w-1/2 pt-1 pl-2 rounded-md bg-white mr-2"
							on:input={inputChange}
						/>
					</div>
					<div class="space-y-1 sm:space-y-3">
						<p class="text-xs my-1">Curator Fee</p>
						<input
							bind:value={curatorFee}
							placeholder="0"
							on:input={inputChange}
							class="pt-1 pl-2 rounded-md bg-white mr-2 w-full md:w-1/3"
						/>
					</div>
				</div>

				<div class="mt-5 space-y-1 sm:space-y-3">
					<p class="text-xs mb-1">Treasury track</p>
					<select
						class="border w-full md:w-1/4 rounded-md h-7 px-1 pt-1"
						bind:value={selectedTreasuryTrack}
						name="spenders"
						id="spenders"
						on:input={inputChange}
					>
						<option value={treasuryTracks[0].origin}>{treasuryTracks[0].display}</option>
						<option value={treasuryTracks[1].origin}>{treasuryTracks[1].display}</option>
						<option value={treasuryTracks[2].origin}>{treasuryTracks[2].display}</option>
					</select>
					<p class="text-xs mt-1">
						(please select the same or higher treasury track that was used in the Bounty Approval
						referendum)
					</p>
				</div>

				<hr class="border-white w-full sm:w-1/2 my-5 sm:my-10" />

				<div class="my-5 h-24 space-y-2 sm:space-y-5">
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Deposit</p>
						<p class="value">{deposit}</p>
					</section>
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Transaction fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row my-3 sm:mt-10 sm:mb-5">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5">CANCEL</button>
				<button on:click={() => submit()} class="button-active">SUBMIT</button>
			</div>
		</div>
	{:else}
		<div
			class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
		>
			<p class="w-full md:w-2/3 text-sm sm:text-base">
				The Referendum for Curator Proposal of Bounty <br />
				{`"#${bountyInfo.id} ${bountyInfo.description}"`} <br />
				has been created successfully!
				<br /><br />

				To ensure the referendum is valid, please update the description if necessary and place the
				decision deposit within 7 days. The deposit, which can be submitted by any account, may be
				made on a social platform such as Subsquare or through the polkadot.js explorer.
			</p>

			<div class="mt-7 sm:mt-24 mb-2 flex">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5"
					>RETURN HOME</button
				>
			</div>
		</div>
	{/if}
</div>
