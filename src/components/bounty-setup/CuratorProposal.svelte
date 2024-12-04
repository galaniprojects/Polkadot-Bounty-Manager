<script lang="ts">
	import type { BountyInfo } from '../../types/bounty';
	import { activeAccount, dotApi } from '../../stores';
	import { treasuryTracks } from './treasuryTracks';
	import { convertDotToPlanck, formatPlanckToDot, isValidAddress } from '../../utils/polkadot';
	import { isInteger } from '../../utils/common';
	import { onMount } from 'svelte';
	import { showErrorDialog, showLoadingDialog } from '../../utils/loading-screen';
	import {
		MultiAddress,
		PolkadotRuntimeOriginCaller,
		PreimagesBounded,
		TraitsScheduleDispatchTime
	} from '@polkadot-api/descriptors';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../utils/transaction';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let bountyInfo: BountyInfo | undefined;
	let curatorFee: string | undefined = undefined;
	let curatorAddress: string | undefined;
	let selectedTreasuryTrack = treasuryTracks[0];
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
		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}
		showLoadingDialog('Submitting Transaction');

		if (!curatorAddress || !isValidAddress(curatorAddress)) {
			showErrorDialog('Curator address is invalid');
			return;
		}

		if (!curatorFee || !isInteger(curatorFee)) {
			showErrorDialog('Invalid value of curator fee');
			return;
		}

		const transaction = await createProposalTransaction();
		const result = await submitTransaction(transaction);
		if (result) {
			step = 3;
		}
	}

	async function createProposalTransaction() {
		if (!curatorFee) {
			throw new Error('Curator fee is not set');
		}
		if (!curatorAddress) {
			throw new Error('Curator address is not set');
		}
		if (!bountyInfo || !bountyInfo.id) {
			throw new Error('Unexpected error, bounty id is not set');
		}
		const transaction = $dotApi.tx.Bounties.propose_curator({
			bounty_id: bountyInfo.id,
			curator: MultiAddress.Id(curatorAddress),
			fee: convertDotToPlanck(BigInt(curatorFee))
		});
		const proposal: PreimagesBounded = PreimagesBounded.Inline(
			Binary.fromBytes((await transaction.getEncodedData()).asBytes())
		);
		return $dotApi.tx.Referenda.submit({
			proposal_origin: PolkadotRuntimeOriginCaller.Origins(selectedTreasuryTrack.origin),
			proposal: proposal,
			enactment_moment: TraitsScheduleDispatchTime.After(1)
		});
	}

	async function calculateDeposit() {
		try {
			const base = await $dotApi.constants.Referenda.SubmissionDeposit();
			deposit = formatPlanckToDot(base) + ' DOT';
		} catch {
			deposit = '-';
		}
	}

	let inputTimeout = setTimeout(() => {}, 2000);
	async function calculateFee() {
		if (bountyInfo && bountyInfo.id && curatorAddress && curatorFee && $activeAccount) {
			try {
				const transaction = await createProposalTransaction();
				fee = (await calculateTransactionFee(transaction)) + ' DOT';
			} catch {
				fee = '-';
			}
		} else {
			fee = '-';
		}
	}

	function inputChange() {
		if (curatorAddress && curatorFee && $activeAccount) {
			fee = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(() => void calculateFee(), 2000);
		} else {
			fee = '-';
		}
	}
</script>

<div>
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if bountyInfo && bountyInfo.id && bountyInfo.description}
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

	<div
		class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
	>
		{#if step === 1}
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
				<a href="/curator-actions" class="button-cancel mr-5">RETURN HOME</a>
				<button
					disabled={!bountyInfo || !bountyInfo.id}
					on:click={() => {
						proceed();
					}}
					class="button-active"
				>
					PROCEED
				</button>
			</div>
		{:else if step === 2}
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
					<div class="border">
						<DropdownMenu
							bind:selectedItem={selectedTreasuryTrack}
							items={treasuryTracks}
							width="w-56 lg:w-80"
						/>
					</div>
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
						<p class="label text-xs">Estimated basic fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row my-3 sm:mt-10 sm:mb-5">
				<a href="/curator-actions" class="button-cancel mr-5">CANCEL</a>
				<button on:click={() => submit()} class="button-active">SUBMIT</button>
			</div>
		{:else if bountyInfo !== undefined}
			<p class="w-full md:w-2/3 text-sm sm:text-base">
				The Referendum for Curator Proposal of Bounty <br />
				{`"#${bountyInfo.id} ${bountyInfo.description}"`} <br />
				has been created successfully!
				<br /><br />

				Please update the description if necessary on a social platform such as Subsquare. To ensure
				the referendum is valid, place the decision deposit within 7 days. The deposit, which can be
				submitted by any account, may be made on a social platform such as Subsquare or through the
				polkadot.js explorer.
			</p>

			<div class="mt-7 sm:mt-24 mb-2 flex">
				<a href="/curator-actions" class="button-cancel mr-5">RETURN HOME</a>
			</div>
		{/if}
	</div>
</div>
