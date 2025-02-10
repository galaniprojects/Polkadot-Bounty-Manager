<script lang="ts">
	import { goto } from '$app/navigation';
	import { activeAccount, dotApi } from '../../../../stores';
	import { treasuryTracks } from '../../../../components/bounty-setup/treasuryTracks';
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../../utils/polkadot';
	import { isPositiveNumber } from '../../../../utils/common';
	import Deposit from '../../../../components/Deposit.svelte';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import {
		MultiAddress,
		PolkadotRuntimeOriginCaller,
		PreimagesBounded,
		TraitsScheduleDispatchTime
	} from '@polkadot-api/descriptors';
	import { type AnyTransaction, submitTransaction } from '../../../../utils/transaction';
	import Fee from '../../../../components/Fee.svelte';
	import DropdownMenu from '../../../../components/common/DropdownMenu.svelte';
	import { bountyInfo } from '../../_bountyInfo';
	import Input from '../../../../components/Input/Input.module.css';

	let curatorFee = '';
	let curatorAddress = '';
	let selectedTreasuryTrack = treasuryTracks[0];

	let transaction: AnyTransaction | undefined;
	$: {
		(async () => {
			transaction = undefined;

			if (!isPositiveNumber(curatorFee) || !isValidAddress(curatorAddress) || !$bountyInfo?.id) {
				return;
			}

			const propose = $dotApi.tx.Bounties.propose_curator({
				bounty_id: $bountyInfo.id,
				curator: MultiAddress.Id(curatorAddress),
				fee: convertFormattedDotToPlanck(curatorFee)
			});
			transaction = $dotApi.tx.Referenda.submit({
				proposal_origin: PolkadotRuntimeOriginCaller.Origins(selectedTreasuryTrack.origin),
				proposal: PreimagesBounded.Inline(await propose.getEncodedData()),
				enactment_moment: TraitsScheduleDispatchTime.After(1)
			});
		})();
	}

	async function submit() {
		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}

		if (!curatorAddress || !isValidAddress(curatorAddress)) {
			showErrorDialog('Curator address is invalid');
			return;
		}

		if (!curatorFee || !isPositiveNumber(curatorFee)) {
			showErrorDialog('Invalid value of curator fee');
			return;
		}

		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		const result = await submitTransaction(transaction);
		if (result) {
			await goto('/bounty-setup/curator-proposal/success');
		}
	}
</script>

<form on:submit={submit}>
	<div>
		<div class="space-y-2 sm:space-y-5">
			<p class="w-full md:1/3 mb-2 text-sm sm:text-base">
				It is highly recommended to use a pure proxy multisig address for the curators!
			</p>
			<div class="space-y-1 sm:space-y-3">
				<p class="text-xs my-1">Curator Address</p>
				<input bind:value={curatorAddress} class="{Input.input} address" />
			</div>
			<div class="space-y-1 sm:space-y-3">
				<p class="text-xs my-1">Curator Fee</p>
				<input bind:value={curatorFee} placeholder="00.00" class="{Input.input} fee" />
			</div>
		</div>

		<div class="mt-5 space-y-1 sm:space-y-3">
			<p class="text-xs mb-1">Treasury track</p>
			<div class="border">
				<DropdownMenu
					bind:selectedItem={selectedTreasuryTrack}
					items={treasuryTracks}
					widthContainer="w-56 lg:w-80"
					widthDropdown="w-56 lg:w-80"
					textAlign="text-center"
					bgColor="lilac"
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
				<p class="value">
					<Deposit getter={$dotApi.constants.Referenda.SubmissionDeposit} />
				</p>
			</section>
			<section class="space-y-1 sm:space-y-3">
				<p class="label text-xs">Estimated basic fee</p>
				<p class="value"><Fee {transaction} /></p>
			</section>
		</div>
	</div>
	<div class="flex-col space-y-2 sm:flex-row my-3 sm:mt-10 sm:mb-5">
		<a href="/curator-actions" class="button-cancel mr-5">CANCEL</a>
		<button type="submit" class="button-active">SUBMIT</button>
	</div>
</form>

<style>
	@media (width > 768px /* md */) {
		.address {
			max-width: 50%;
		}
		.fee {
			max-width: 33%;
		}
	}
</style>
