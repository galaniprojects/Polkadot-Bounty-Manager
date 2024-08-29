<script lang="ts">
	import { ApiRx, WsProvider } from '@polkadot/api';
	import { web3FromAddress } from '@polkadot/extension-dapp';
	import { firstValueFrom } from 'rxjs';
	import LoadingScreen from '../LoadingScreen.svelte';
	import { LoadingState } from '../LoadingScreen.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { BountyInfo } from './BountySetup.svelte';
	import { activeAccount } from '../../stores';
	import { isInteger, dryRunAndSubmitTransaction, addDecimalsToDot } from '../../utils';

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Approval'
		});
	}

	export let bountyInfo: BountyInfo;

	let success = false;
	let loadingState = LoadingState.Loading;
	let showLoadingScreen = false;
	let bountyValue: string | undefined = undefined;
	let bountyTitle = '';
	let errorMessage: string | undefined;
	let fee = '-';

	function showError(message: string) {
		showLoadingScreen = true;
		loadingState = LoadingState.Error;
		errorMessage = message;
	}

	async function submit() {
		loadingState = LoadingState.Loading;
		showLoadingScreen = true;
		errorMessage = undefined;
		try {
			if (!$activeAccount) {
				showError('wallet is not connected');
				return;
			}
			const wsProvider = new WsProvider('ws://localhost:8000');
			const injector = await web3FromAddress($activeAccount.address);
			const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));

			if (bountyTitle.length === 0) {
				showError('bounty title is empty');
				return;
			}
			if (!bountyValue) {
				showError('Bounty value is invalid');
				return;
			}
			if (!isInteger(bountyValue)) {
				showError('Bounty value is invalid');
				return;
			}

			let v = addDecimalsToDot(BigInt(bountyValue));
			let description = bountyTitle;
			let transaction = api.tx.bounties.proposeBounty(v, description);

			const { errorMessage, result } = await dryRunAndSubmitTransaction(
				api,
				transaction,
				$activeAccount.address,
				injector.signer
			);
			if (errorMessage) {
				showError(errorMessage);
				return;
			}

			let bountyEvent = result!.findRecord('bounties', 'BountyProposed');
			let bountyIndex = bountyEvent?.event.data[0].toJSON();
			bountyInfo = {
				id: bountyIndex as number,
				description: bountyTitle,
				value: BigInt(bountyValue)
			};
			loadingState = LoadingState.Success;
			success = true;
		} catch (e) {
			console.error(e);
			showError(`${e}`);
		}
	}
	let inputTimeout = setTimeout(() => {}, 4000);

	async function calculateFee() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				const wsProvider = new WsProvider('ws://localhost:8000');
				const api = await firstValueFrom(ApiRx.create({ provider: wsProvider }));
				let v = addDecimalsToDot(BigInt(bountyValue));
				let transaction = api.tx.bounties.proposeBounty(v, bountyTitle);

				let observableFee = transaction.paymentInfo($activeAccount.address);
				
				const paymentInfo = await firstValueFrom(observableFee);
				fee =
					(paymentInfo.partialFee.toNumber() / 10000000000).toString() +
					' DOT';
			} else {
				fee = '-';
			}
		} catch (e) {
			fee = '-';
		}
	}

	function inputChange() {
		if (bountyValue && bountyTitle && $activeAccount) {
			fee = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(calculateFee, 2000);
		} else {
			fee = '-';
		}
	}
</script>

<div>
	<div class="top-bar flex justify-between">
		{#if !success}
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="rounded-md bg-gray-100 w-1/2 pl-3 pt-1"
				placeholder="Give your Bounty a title"
			/>
			<p class="text text-sm mt-1.5 text-white">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				<a href="#moreinfo">Tap here</a>
			</p>
		{:else}
			<p class="text-white">{`#${bountyInfo.id} ${bountyInfo.description}`}</p>
		{/if}
	</div>

	{#if success}
		<div class="content">
			<p>
				{`#${bountyInfo.id} ${bountyInfo.description}`}
				created successfully!
				<br /><br />
				You can either proceed to 2 Referendum <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button on:click={changeTab} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="grid content-between content">
			<div>
				<p class="text-xs">Bounty value</p>
				<div class="flex mt-2">
					<input
						bind:value={bountyValue}
						class="border pt-1 pl-2 w-1/4 rounded-md bg-white"
						placeholder="1000"
						on:input={inputChange}
					/>
				</div>
				<hr class="border-white mt-5 mb-1 w-1/2" />

				<p class="text-xs">Bounty description</p>
				<textarea
					class="border border-borderColor pt-1 pl-2 w-1/2 h-28 rounded-md bg-white mt-2e mr-2 mt-2"
					placeholder="Your Bounty description goes here"
				/>

				<hr class=" border-white mt-5 mb-2 w-1/2" />
				<!-- <p class="text-xs mb-2">Submit with account</p> -->
				<!---->
				<!-- <select class="border pt-1 pl-2 w-1/4 rounded-md" name="accounts" id="accounts"> -->
				<!-- 	<option value="alice">Alice</option> -->
				<!-- 	<option value="bob">Bob</option> -->
				<!-- </select> -->
				<div class="mt-5 mb-10 h-24">
					<section class="mb-3">
						<p class="label text-xs">Bounty Bond</p>
						<p class="value"><span>1,067.0000</span> DOT</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="buttons flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button disabled={!bountyTitle || !bountyValue} on:click={submit} class="button-active"
					>SUBMIT</button
				>
			</div>
		</div>
	{/if}
</div>
<LoadingScreen bind:errorMessage bind:opened={showLoadingScreen} state={loadingState}
></LoadingScreen>
