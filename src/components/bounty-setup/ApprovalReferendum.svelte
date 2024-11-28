<script lang="ts">
	import { treasuryTracks } from './treasuryTracks';
	import type { BountyInfo } from '../../types/bounty';
	import { activeAccount, dotApi } from '../../stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import { formatPlanckToDot } from '../../utils/polkadot';
	import { showErrorDialog, showLoadingDialog } from '../../utils/loading-screen';
	import { goto } from '$app/navigation';
	import {
		PolkadotRuntimeOriginCaller,
		PreimagesBounded,
		TraitsScheduleDispatchTime
	} from '@polkadot-api/descriptors';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../utils/transaction';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let bountyInfo: BountyInfo | undefined;

	let success = false;
	let selectedTreasuryTrack = treasuryTracks[0];
	let fee = '-';
	let deposit = '-';

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Curator Proposal'
		});
	}

	onMount(async () => {
		if (!bountyInfo || !bountyInfo.value) {
			return;
		}
		if (bountyInfo.value <= 10000n) {
			selectedTreasuryTrack = treasuryTracks[0];
		} else if (bountyInfo.value <= 100000n) {
			selectedTreasuryTrack = treasuryTracks[1];
		} else {
			selectedTreasuryTrack = treasuryTracks[2];
		}
		await calculateFee();
		await calculateDeposit();
	});

	async function submit() {
		if (success) {
			changeTab();
			return;
		}
		showLoadingDialog('Submitting transaction');
		try {
			if (!$activeAccount) {
				showErrorDialog('Wallet is not connected');
				return;
			}
			const transaction = await createApprovalTransaction();
			if (!transaction) {
				showErrorDialog('Unexpected error, bounty id is not set.');
				return;
			}

			const result = await submitTransaction(transaction);

			if (result) {
				success = true;
			}
		} catch (e) {
			console.error(e);
			showErrorDialog(`Something went wrong, ${String(e)}`);
		}
	}

	async function createApprovalTransaction() {
		if (!bountyInfo || !bountyInfo.id) {
			return;
		}
		const transaction = $dotApi.tx.Bounties.approve_bounty({ bounty_id: bountyInfo.id });
		const proposal: PreimagesBounded = PreimagesBounded.Inline(
			Binary.fromBytes((await transaction.getEncodedData()).asBytes())
		);
		return $dotApi.tx.Referenda.submit({
			proposal_origin: PolkadotRuntimeOriginCaller.Origins(selectedTreasuryTrack.origin),
			proposal: proposal,
			enactment_moment: TraitsScheduleDispatchTime.After(1)
		});
	}

	async function calculateFee() {
		if ($activeAccount && bountyInfo && bountyInfo.id) {
			try {
				const transaction = await createApprovalTransaction();
				if (!transaction) {
					fee = '-';
					return;
				}
				fee = (await calculateTransactionFee(transaction)) + ' DOT';
			} catch {
				fee = '-';
			}
		} else {
			fee = '-';
		}
	}

	async function calculateDeposit() {
		try {
			const base = await $dotApi.constants.Referenda.SubmissionDeposit();
			deposit = formatPlanckToDot(base) + ' DOT';
		} catch {
			deposit = '-';
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
				<a href="#info">Tap here</a>
			</p>
		{/if}
	</div>

	{#if success && bountyInfo}
		<div
			class="bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
		>
			<p class="w-full md:w-2/3 text-sm sm:text-base">
				The Referendum for the approval of Bounty <br />
				{`#${bountyInfo.id} ${bountyInfo.description}`} <br />
				has been created successfully!
				<br /><br />
				Please update the description on one of the social platforms such as Subsquare. The decision
				deposit must be placed within 7 days, for the referendum to be valid. (This deposit can be placed
				by any account). This can be submitted either on one of the social platforms or via the polkadot.js
				explorer.
				<br /> <br />
				You can now return to the home screen or proceed to the Curator Approval Referendum creation.
				It is strongly recommended to create the Curator Approval Referendum, after the Bounty has been
				funded and the Curator list has been informally accepted by the community in discussions on the
				platforms.
			</p>
			<div class="mt-5 flex-col space-y-2 sm:flex-row max-w-fit">
				<button on:click={() => goto('/curator-actions')} class="button-cancel sm:mr-5"
					>RETURN HOME</button
				>
				<button on:click={submit} disabled={!bountyInfo.id} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div
			class=" bg-backgroundContent max-h-[400px] sm:min-h-[500px] p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden overflow-y-auto"
		>
			<div>
				<div class="space-y-1 sm:space-y-3">
					<p class="text-xs mb-1">Treasury track</p>
					<div class="border">
						<DropdownMenu
							bind:selectedItem={selectedTreasuryTrack}
							items={treasuryTracks}
							width="w-56 lg:w-80"
						/>
					</div>
					<p class="text-xs">(preselected based on Bounty value)</p>
				</div>

				<hr class="border-white my-5 sm:my-10 w-full md:w-1/3" />

				<div class="my-5 sm:my-10 sm:mb-14 h-24 space-y-2 sm:space-y-5">
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Deposit</p>
						<p>{deposit}</p>
					</section>
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Estimated basic fee</p>
						<p>{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
				<button on:click={() => goto('/curator-actions')} class="button-cancel">CANCEL</button>
				<button on:click={submit} disabled={!bountyInfo || !bountyInfo.id} class="button-active"
					>SUBMIT</button
				>
			</div>
		</div>
	{/if}
</div>
