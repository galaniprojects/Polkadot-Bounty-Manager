<script lang="ts">
	import { treasuryTracks } from '../../../components/bounty-setup/treasuryTracks';
	import { activeAccount, dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Deposit from '../../../components/Deposit.svelte';
	import { showErrorModal } from '../../../components/ErrorModal/showErrorModal';
	import {
		PolkadotRuntimeOriginCaller,
		PreimagesBounded,
		TraitsScheduleDispatchTime
	} from '@polkadot-api/descriptors';
	import Fee from '../../../components/Fee.svelte';
	import { type AnyTransaction, submitTransaction } from '../../../utils/transaction';
	import DropdownMenu from '../../../components/common/DropdownMenu.svelte';
	import { bountyInfo } from '../_bountyInfo';

	let selectedTreasuryTrack = treasuryTracks[0];

	onMount(() => {
		if (!$bountyInfo || !$bountyInfo.value) {
			return;
		}
		if ($bountyInfo.value <= 10000n) {
			selectedTreasuryTrack = treasuryTracks[0];
		} else if ($bountyInfo.value <= 100000n) {
			selectedTreasuryTrack = treasuryTracks[1];
		} else {
			selectedTreasuryTrack = treasuryTracks[2];
		}
	});

	let transaction: AnyTransaction | undefined;
	$: {
		(async () => {
			transaction = undefined;
			if (!$bountyInfo?.id) {
				return;
			}
			const approve = $dotApi.tx.Bounties.approve_bounty({ bounty_id: $bountyInfo.id });
			transaction = $dotApi.tx.Referenda.submit({
				proposal_origin: PolkadotRuntimeOriginCaller.Origins(selectedTreasuryTrack.origin),
				proposal: PreimagesBounded.Inline(await approve.getEncodedData()),
				enactment_moment: TraitsScheduleDispatchTime.After(1)
			});
		})();
	}

	async function submit() {
		try {
			if (!$activeAccount) {
				showErrorModal('Wallet is not connected');
				return;
			}
			if (!transaction) {
				showErrorModal('Unexpected error, bounty id is not set.');
				return;
			}

			const result = await submitTransaction(transaction);
			if (result) {
				await goto('/bounty-setup/approval/success');
			}
		} catch (e) {
			console.error(e);
			showErrorModal(`Something went wrong, ${String(e)}`);
		}
	}
</script>

<form on:submit={submit}>
	<div class="p-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-backgroundButtonLight">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if $bountyInfo?.id && $bountyInfo.description}
				#{$bountyInfo.id} {$bountyInfo.description}
			{/if}
		</p>
		{#if false}
			<p class="text text-sm mt-1.5">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				<a href="#info">Tap here</a>
			</p>
		{/if}
	</div>

	<div
		class="bg-backgroundApp max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
	>
		<div>
			<div class="space-y-1 sm:space-y-3">
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
				<p class="text-xs">(preselected based on Bounty value)</p>
			</div>

			<hr class="border-backgroundButtonLight my-5 sm:my-10 w-full md:w-1/3" />

			<div class="my-5 sm:my-10 sm:mb-14 h-24 space-y-2 sm:space-y-5">
				<section class="space-y-1 sm:space-y-3">
					<p class="label text-xs">Deposit</p>
					<p>
						<Deposit getter={$dotApi.constants.Referenda.SubmissionDeposit} />
					</p>
				</section>
				<section class="space-y-1 sm:space-y-3">
					<p class="label text-xs">Estimated basic fee</p>
					<p><Fee {transaction} /></p>
				</section>
			</div>
		</div>
		<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
			<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center">CANCEL</a>
			<button type="submit" disabled={!$bountyInfo || !$bountyInfo.id} class="button-active h-12">
				SUBMIT
			</button>
		</div>
	</div>
</form>
