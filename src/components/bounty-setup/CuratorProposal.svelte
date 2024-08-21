<script lang="ts">
	import { ApiRx, WsProvider } from '@polkadot/api';
	import { web3FromAddress } from '@polkadot/extension-dapp';
	import { firstValueFrom, filter } from 'rxjs';
	import LoadingScreen, { LoadingState } from '../LoadingScreen.svelte';
	import type { BountyInfo } from './BountySetup.svelte';
	import { activeAccount } from '../../stores';
	import { treasuryTracks } from './ApprovalReferendum.svelte';

	export let bountyInfo: BountyInfo;
	let loadingState = LoadingState.Loading;
	let showLoadingScreen = false;
	let curatorFee: string | undefined = undefined;
	let curatorAddress: string | undefined;
	let selectedTreasuryTrack = treasuryTracks[0].origin;
	let step = 1;

	function proceed() {
		if (step == 1) {
			step = 2;
		}
	}
	async function submit() {
		showLoadingScreen = true;
		loadingState = LoadingState.Loading;
		try {
			const wsProvider = new WsProvider('ws://localhost:8000');
			const injector = await web3FromAddress($activeAccount.address);
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
			if (!curatorFee) {
				loadingState = LoadingState.Error;
				//todo
				console.log('invalid curator fee');
				return;
			}
			let tx = api.tx.bounties.proposeCurator(
				bountyInfo.id,
				curatorAddress,
				BigInt(curatorFee) * BigInt(10000000000)
			);

			let observable = api.tx.referenda
				.submit(
					{
						Origins: selectedTreasuryTrack
					},
					{ Inline: tx.method.toHex() },
					{ After: 1 }
				)
				.signAndSend($activeAccount.address, { signer: injector.signer });

			console.log('observable: ', observable);
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
			}
			loadingState = LoadingState.Success;
			step = 3;
		} catch (e) {
			loadingState = LoadingState.Error;
			console.error(e);
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
			Tap here
		</p>
	</div>

	{#if step === 1}
		<div class="content">
			<p class="description">
				As standard practice, this action is performed after the Bounty has been funded.
				<br /><br />
				However if you want to proceed and already have a list of curators to propose, it is possible
				to do so.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button disabled={!bountyInfo.id} on:click={() => proceed()} class="button-active"
					>PROCEED</button
				>
			</div>
		</div>
	{:else if step === 2}
		<div class="content">
			<div>
				<div>
					<p class="description mb-2">
						It is highly recommended to use a pure proxy multisig address for the curators!
					</p>
					<p class="text-xs my-1">Curator Address</p>
					<input
						bind:value={curatorAddress}
						class="border w-1/2 pt-1 pl-2 rounded-md bg-white mr-2"
						placeholder="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
					/>
					<p class="text-xs my-1">Curator Fee</p>
					<input
						bind:value={curatorFee}
						class="border pt-1 pl-2 rounded-md bg-white mr-2 w-1/3"
						placeholder="100.0000"
					/>
					<p class="text-xs mt-1">(total Bounty value: 100.000.0000 DOT)</p>
				</div>

				<div class = "mt-4">
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

				<hr class="border-white w-1/2 mt-5 mb-3" />

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
			<div class="flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={() => submit()} class="button-active">SUBMIT</button>
			</div>
		</div>
	{:else}
		<div class="content">
			<p class="description">
				A Curator Proposal Referendum for <br />
				{`"#${bountyInfo.id} ${bountyInfo.description}"`} <br />
				created successfully!
				<br /><br />
				Check the Referendum on
				<a href="/bs" class="link underline underline-offset-2">Polkassembly</a>. Please update the
				description if necessary and place the decision deposit within 7 days for the referendum to
				be valid.
				<br /> <br />
				You can go back to the list of all bounties.
			</p>

			<div class="buttons mt-5 flex">
				<button class="button-cancel mr-5">RETURN HOME</button>
			</div>
		</div>
	{/if}
</div>
<LoadingScreen bind:opened={showLoadingScreen} state={loadingState}></LoadingScreen>
