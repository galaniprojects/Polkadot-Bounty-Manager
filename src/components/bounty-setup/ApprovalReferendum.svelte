<script lang="ts" context="module">
	export let treasuryTracks = [
		{ origin: 'SmallSpender', display: 'Small Spender' },
		{ origin: 'MediumSpender', display: 'Medium Spender' },
		{ origin: 'BigSpender', display: 'Big Spender' }
	];
</script>

<script lang="ts">
	import { ApiRx, WsProvider } from '@polkadot/api';
	import { web3FromAddress } from '@polkadot/extension-dapp';
	import LoadingScreen, { LoadingState } from '../LoadingScreen.svelte';
	import type { BountyInfo } from './BountySetup.svelte';
	import { firstValueFrom, filter } from 'rxjs';
	import { activeAccount } from '../../stores';
	import { createEventDispatcher } from 'svelte';

	let loadingState = LoadingState.Loading;
	let showLoadingScreen = false;
	export let bountyInfo: BountyInfo;
	let success = false;
	let selectedTreasuryTrack = treasuryTracks[0].origin;

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Curator Proposal'
		});
	}

	async function submit() {
		if (success) {
			changeTab();
			return;
		}
		showLoadingScreen = true;
		loadingState = LoadingState.Loading;
		try {
			const wsProvider = new WsProvider('ws://localhost:8000');
			const injector = await web3FromAddress($activeAccount.address);
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
			let tx = api.tx.bounties.approveBounty(bountyInfo.id);
			let observable = api.tx.referenda
				.submit(
					{
						Origins: selectedTreasuryTrack
					},
					{ Inline: tx.method.toHex() },
					{ After: 1 }
				)
				.signAndSend($activeAccount.address, { signer: injector.signer });

			let submittableResult = await firstValueFrom(
				observable.pipe(
					filter((event) => {
						return event.isFinalized || event.isError;
					})
				)
			);

			if (submittableResult.dispatchError || submittableResult.isError) {
				loadingState = LoadingState.Error;
				console.log('error catched');
				console.log(submittableResult.toHuman());
				return;
				//todo error happened.
			}

			loadingState = LoadingState.Success;
			success = true;
		} catch (e) {
			console.error(e);
			loadingState = LoadingState.Error;
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

				<p class="text-xs mb-1">Submit with account</p>
				<select class="border w-1/4 rounded-md h-7 px-1 pt-1" name="accounts" id="accounts">
					<option value="alice">Alice</option>
					<option value="bob">Bob</option>
				</select>

				<div class="mt-5 h-24 mb-10">
					<section class="mb-3">
						<p class="label text-xs">Deposit</p>
						<p class="value"><span>1,067.0000</span> DOT</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value"><span>0,000.0800</span> DOT</p>
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
<LoadingScreen bind:opened={showLoadingScreen} state={loadingState}></LoadingScreen>
