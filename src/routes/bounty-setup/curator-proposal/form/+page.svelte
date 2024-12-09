<script lang="ts">
	import { goto } from '$app/navigation';
	import { activeAccount, dotApi } from '../../../../stores';
	import { treasuryTracks } from '../../../../components/bounty-setup/treasuryTracks';
	import {
		convertFormattedDotToPlanck,
		formatPlanckToDot,
		isValidAddress
	} from '../../../../utils/polkadot';
	import { isPositiveNumber } from '../../../../utils/common';
	import { onMount } from 'svelte';
	import { showErrorDialog, showLoadingDialog } from '../../../../utils/loading-screen';
	import {
		MultiAddress,
		PolkadotRuntimeOriginCaller,
		PreimagesBounded,
		TraitsScheduleDispatchTime
	} from '@polkadot-api/descriptors';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';
	import DropdownMenu from '../../../../components/common/DropdownMenu.svelte';
	import { bountyInfo } from '../../_bountyInfo';

	let curatorFee: string | undefined = undefined;
	let curatorAddress: string | undefined;
	let selectedTreasuryTrack = treasuryTracks[0];
	let fee = '-';
	let deposit = '-';

	onMount(async () => {
		await calculateDeposit();
	});

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

		if (!curatorFee || !isPositiveNumber(curatorFee)) {
			showErrorDialog('Invalid value of curator fee');
			return;
		}

		const transaction = await createProposalTransaction();
		const result = await submitTransaction(transaction);
		if (result) {
			await goto('/bounty-setup/curator-proposal/success');
		}
	}

	async function createProposalTransaction() {
		if (!curatorFee) {
			throw new Error('Curator fee is not set');
		}
		if (!curatorAddress) {
			throw new Error('Curator address is not set');
		}
		if (!$bountyInfo || !$bountyInfo.id) {
			throw new Error('Unexpected error, bounty id is not set');
		}
		const transaction = $dotApi.tx.Bounties.propose_curator({
			bounty_id: $bountyInfo.id,
			curator: MultiAddress.Id(curatorAddress),
			fee: convertFormattedDotToPlanck(curatorFee)
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
		if ($bountyInfo?.id && curatorAddress && curatorFee && $activeAccount) {
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

<form on:submit={submit} on:input={inputChange}>
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
				/>
			</div>
			<div class="space-y-1 sm:space-y-3">
				<p class="text-xs my-1">Curator Fee</p>
				<input
					bind:value={curatorFee}
					placeholder="00.00"
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
		<button type="submit" class="button-active">SUBMIT</button>
	</div>
</form>
