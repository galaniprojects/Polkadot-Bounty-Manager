<script lang="ts" context="module">
	export let treasuryTracks = [
		{ origin: 'SmallSpender', display: 'Small Spender' },
		{ origin: 'MediumSpender', display: 'Medium Spender' },
		{ origin: 'BigSpender', display: 'Big Spender' }
	];
</script>

<script lang="ts">
	import { ApiRx } from '@polkadot/api';
	import type { BountyInfo } from './BountySetup.svelte';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import { convertPlanckToDot, dryRunAndSubmitTransaction, getApi } from '../../utils/polkadot';
	import {
		showErrorDialog,
		showLoadingDialog,
		showSuccessDialog
	} from '../../utils/loading-screen';
	import { goto } from '$app/navigation';

	export let bountyInfo: BountyInfo;

	let success = false;
	let selectedTreasuryTrack = treasuryTracks[0].origin;
	let fee = '-';
	let deposit = '-';

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Curator Proposal'
		});
	}

	onMount(async () => {
		if (!bountyInfo.value) {
			return;
		}
		if (bountyInfo.value <= 10000n) {
			selectedTreasuryTrack = treasuryTracks[0].origin;
		} else if (bountyInfo.value <= 100000n) {
			selectedTreasuryTrack = treasuryTracks[1].origin;
		} else {
			selectedTreasuryTrack = treasuryTracks[2].origin;
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
			const api = await getApi();
			const transaction = createApprovalTransaction(api);

			const { errorMessage } = await dryRunAndSubmitTransaction(api, transaction, $activeAccount);
			if (errorMessage) {
				showErrorDialog(errorMessage);
				return;
			}

			showSuccessDialog('Submitting Transaction', 'Operation Success');
			success = true;
		} catch (e) {
			console.error(e);
			showErrorDialog(`Something went wrong, ${e}`);
		}
	}

	function createApprovalTransaction(api: ApiRx) {
		let tx = api.tx.bounties.approveBounty(bountyInfo.id);
		return api.tx.referenda.submit(
			{
				Origins: selectedTreasuryTrack
			},
			{ Inline: tx.method.toHex() },
			{ After: 1 }
		);
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		if (bountyInfo.id) {
			try {
				const api = await getApi();
				const transaction = createApprovalTransaction(api);

				let observableFee = transaction.paymentInfo($activeAccount.address);
				fee =
					convertPlanckToDot(
						(await firstValueFrom(observableFee)).partialFee.toNumber()
					).toString() + ' DOT';
			} catch {
				fee = '-';
			}
		}
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
</script>

<div>
	<div class="p-3 pt-7 pb-10 md:p-6 bg-secondary">
		<p class="text-lg sm:text-2xl text-white min-h-8">
			{#if bountyInfo.id && bountyInfo.description}
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

	{#if success}
		<div class="bg-backgroundContent p-3 pt-7 pb-10 md:px-6 w-full box-border overflow-x-hidden">
			<p class="w-full md:w-2/3">
				The Referendum for the approval of Bounty <br />
				{`#${bountyInfo.id} ${bountyInfo.description}`} <br />
				has been created successfully!
				<br /><br />
				Please update the description on one of the social platforms like Polkassembly or Subsquare.
				The decision deposit must be placed within 7 days, for the referendum to be valid. (This deposit
				can be placed by any account). This can be submitted either on one of the social platforms or
				via the polkadot.js explorer.
				<br /> <br />
				You can now return to the home screen or proceed to the Curator Approval Referendum creation.
				It is strongly recommended to create the Curator Approval Referendum, after the Bounty has been
				funded and the Curator list has been informally accepted by the community in discussions on the
				platforms.
			</p>
			<div class="buttons mt-5 flex">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5"
					>RETURN HOME</button
				>
				<button on:click={submit} disabled={!bountyInfo.id} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class=" bg-backgroundContent p-3 pt-7 pb-10 md:px-6 w-full box-border overflow-x-hidden">
			<div>
				<div class="space-y-3">
					<p class="text-xs mb-1">Treasury track</p>
					<select
						class="border w-full md:w-1/3 rounded-md h-7 px-1 pt-1"
						bind:value={selectedTreasuryTrack}
						name="spenders"
						id="spenders"
					>
						<option value={treasuryTracks[0].origin}>{treasuryTracks[0].display}</option>
						<option value={treasuryTracks[1].origin}>{treasuryTracks[1].display}</option>
						<option value={treasuryTracks[2].origin}>{treasuryTracks[2].display}</option>
					</select>
					<p class="text-xs mt-1">(preselected based on Bounty value)</p>
				</div>

				<hr class="border-white mt-3 mb-3 w-full md:w-1/3" />

				<div class="my-10 mb-14 h-24 space-y-5">
					<section class="space-y-3">
						<p class="label text-xs">Deposit</p>
						<p>{deposit}</p>
					</section>
					<section class="space-y-3">
						<p class="label text-xs">Transaction fee</p>
						<p>{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
				<button on:click={() => goto('/curator-actions')} class="button-cancel">CANCEL</button>
				<button on:click={submit} disabled={!bountyInfo.id} class="button-active">SUBMIT</button>
			</div>
		</div>
	{/if}
</div>
