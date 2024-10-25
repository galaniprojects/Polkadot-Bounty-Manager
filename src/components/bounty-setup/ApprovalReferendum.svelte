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
	<div class="top-bar flex justify-between text-white">
		<p class="title text-2xl leading-7">
			{#if bountyInfo.id && bountyInfo.description}
				{`#${bountyInfo.id} ${bountyInfo.description}`}
			{/if}
		</p>
		<p class="text text-sm mt-1.5">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			<a href="#info">Tap here</a>
		</p>
	</div>

	{#if success}
		<div class="content">
			<p class="description">
				The Referendum for the approval of Bounty <br />
				{`#${bountyInfo.id} ${bountyInfo.description}`} <br />
				has been created successfully!
				<br /><br />
				Please update the description on
				<a href="/bs" class="link underline underline-offset-2">Polkassembly</a>. The decision
				deposit needs to be placed within 7 days, for the referendum to be valid. (This deposit can
				be placed from another account).
				<br /> <br />
				You can now return to the home screen or proceed to the Curator Approval Referendum creation.
				It is strongly recommended to create the Curator Approval Referendum, after the Bounty has been
				funded and the Curator list has been informally accepted by the community in discussions on the
				platforms. Please read the information about the Curator Approval process on our
				<a href="/guide" class="link underline underline-offset-2">Guide</a>.
			</p>
			<div class="buttons mt-5 flex">
				<button class="button-cancel mr-5">RETURN HOME</button>
				<button on:click={submit} disabled={!bountyInfo.id} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="content">
			<div>
				<div>
					<p class="text-xs mb-1">Treasury track</p>
					<select
						class="border w-1/4 rounded-md h-7 px-1 pt-1"
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

				<hr class="border-white mt-5 mb-3 w-96" />

				<div class="mt-5 h-24 mb-10">
					<section class="mb-3">
						<p class="label text-xs">Deposit</p>
						<p class="value">{deposit}</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="buttons flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={submit} disabled={!bountyInfo.id} class="button-active">SUBMIT</button>
			</div>
		</div>
	{/if}
</div>
