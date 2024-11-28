<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BountyInfo } from '../../types/bounty';
	import { activeAccount, dotApi } from '../../stores';
	import { convertDotToPlanck, formatPlanckToDot } from '../../utils/polkadot';
	import { isInteger } from '../../utils/common';
	import { showErrorDialog } from '../../utils/loading-screen';
	import { goto } from '$app/navigation';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../utils/transaction';

	const dispatch = createEventDispatcher();
	function changeTab() {
		dispatch('changeTab', {
			tab: 'Approval'
		});
	}

	export let bountyInfo: BountyInfo | undefined;
	let success = false;
	let bountyValue: string | undefined;
	let bountyTitle = '';
	let fee = '-';
	let bondValue = '-';

	async function submit() {
		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}

		if (bountyTitle.length === 0) {
			showErrorDialog('Bounty title is empty');
			return;
		}
		if (!bountyValue) {
			showErrorDialog('Bounty value is invalid');
			return;
		}
		if (!isInteger(bountyValue)) {
			showErrorDialog('Bounty value is invalid');
			return;
		}

		let value = convertDotToPlanck(BigInt(bountyValue));
		let description = bountyTitle;
		let transaction = $dotApi.tx.Bounties.propose_bounty({
			value,
			description: Binary.fromText(description)
		});
		let result = await submitTransaction(transaction, 'Bounty creation success.');
		if (!result) {
			return;
		}

		let bountyEvent = result.events.find((event) => event.type === 'Bounties');
		if (!bountyEvent || bountyEvent.value.type !== 'BountyProposed') {
			return;
		}

		const innerValue = bountyEvent.value.value as { index: number };
		if ('index' in innerValue) {
			let bountyIndex = innerValue.index;
			bountyInfo = {
				id: bountyIndex,
				description: bountyTitle,
				value: BigInt(bountyValue)
			};

			// Set bounty-id in query parameters.
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set('bounty-id', String(bountyIndex));
			const url = new URL(window.location.toString());
			history.pushState({}, '', `${url.pathname}?${urlParams.toString()}`);
		}

		success = true;
	}
	let inputTimeout = setTimeout(() => {}, 4000);

	async function calculateBondAndFee() {
		await calculateBond();
		await calculateFee();
	}

	async function calculateFee() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let value = convertDotToPlanck(BigInt(bountyValue));
				let description = bountyTitle;
				let transaction = $dotApi.tx.Bounties.propose_bounty({
					value,
					description: Binary.fromText(description)
				});

				fee = (await calculateTransactionFee(transaction)) + ' DOT';
			} else {
				fee = '-';
			}
		} catch {
			fee = '-';
		}
	}

	async function calculateBond() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let value = convertDotToPlanck(BigInt(bountyValue));
				let description = bountyTitle;
				let transaction = $dotApi.tx.Bounties.propose_bounty({
					value,
					description: Binary.fromText(description)
				});
				const base = await $dotApi.constants.Bounties.BountyDepositBase();
				let bytesLen = BigInt(transaction.getEncodedData.length);
				const perByte = await $dotApi.constants.Bounties.DataDepositPerByte();
				bondValue = formatPlanckToDot(base + (bytesLen - 1n) * perByte) + ' DOT';
			} else {
				bondValue = '-';
			}
		} catch {
			bondValue = '-';
		}
	}

	function inputChange() {
		if (bountyValue && bountyTitle && $activeAccount) {
			fee = 'Calculating...';
			bondValue = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(() => void calculateBondAndFee(), 2000);
		} else {
			fee = '-';
			bondValue = '-';
		}
	}
</script>

<div>
	<div class="px-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-secondary">
		{#if !success}
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="rounded-md bg-gray-100 w-full md:w-1/2 pl-3 pt-1"
				placeholder="Give your Bounty a title"
			/>
			{#if false}
				<p class="text text-sm mt-1.5 text-white">
					<span class="opacity-50">Need more information about the Bounty Setup process? </span>
					<a href="#moreinfo">Tap here</a>
				</p>
			{/if}
		{:else if bountyInfo !== undefined}
			<p class="text-white">{`#${bountyInfo.id} ${bountyInfo.description}`}</p>
		{/if}
	</div>

	{#if success && bountyInfo !== undefined}
		<div
			class="bg-backgroundContent p-3 sm:pt-7 sm:pb-12 md:px-6 w-full box-border overflow-x-hidden"
		>
			<p>
				{`#${bountyInfo.id} ${bountyInfo.description}`}
				has been created successfully!
				<br /><br />
				You can either proceed to the Referendum <br />
				for Bounty Approval or return to the main page <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="flex-col space-y-2 sm:flex-row mt-10 sm:mt-40">
				<button on:click={() => goto('/curator-actions')} class="button-cancel mr-5"
					>RETURN HOME</button
				>
				<button on:click={changeTab} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div
			class="grid content-between sm:space-y-10 bg-backgroundContent p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden"
		>
			<div>
				<section class="space-y-1 sm:space-y-3">
					<p class="text-xs">Bounty value</p>
					<input
						bind:value={bountyValue}
						class="border pt-1 pl-2 w-full md:w-1/3 rounded-md bg-white"
						placeholder="1000"
						on:input={inputChange}
					/>
				</section>
				<hr class="border-white my-5 sm:my-10 w-full md:w-1/2" />

				<div class="my-5 sm:my-10 h-24 space-y-2 sm:space-y-5">
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Bounty bond</p>
						<p class="value">{bondValue}</p>
					</section>
					<section class="space-y-1 sm:space-y-3">
						<p class="label text-xs">Estimated basic fee</p>
						<p class="value">{fee}</p>
					</section>
				</div>
			</div>
			<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
				<button on:click={() => goto('/curator-actions')} class="button-cancel">CANCEL</button>
				<button disabled={!bountyTitle || !bountyValue} on:click={submit} class="button-active"
					>SUBMIT</button
				>
			</div>
		</div>
	{/if}
</div>
