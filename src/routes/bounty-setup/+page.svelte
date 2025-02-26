<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { activeAccount, dotApi } from '../../stores';
	import { convertFormattedDotToPlanck } from '../../utils/polkadot';
	import { isPositiveNumber } from '../../utils/common';
	import { showErrorModal } from '../../components/ErrorModal/showErrorModal';
	import { Binary } from 'polkadot-api';
	import Fee from '../../components/Fee.svelte';
	import Input from '../../components/Input/Input.module.css';
	import { maybeTransaction, submitTransaction } from '../../utils/transaction';
	import { bountyInfo } from './_bountyInfo';
	import Currency from '../../components/Currency.svelte';

	let bountyValue: string | undefined;
	let bountyTitle = '';
	let bondValue: bigint | string = '-';

	$: transaction = maybeTransaction(
		() =>
			bountyValue &&
			isPositiveNumber(bountyValue) &&
			bountyTitle &&
			$dotApi.tx.Bounties.propose_bounty({
				value: convertFormattedDotToPlanck(bountyValue),
				description: Binary.fromText(bountyTitle)
			})
	);

	async function submit() {
		if (!$activeAccount) {
			showErrorModal('Wallet is not connected');
			return;
		}

		if (bountyTitle.length === 0) {
			showErrorModal('Bounty title is empty');
			return;
		}
		if (!bountyValue) {
			showErrorModal('Bounty value is invalid');
			return;
		}
		if (!isPositiveNumber(bountyValue)) {
			showErrorModal('Bounty value is invalid');
			return;
		}
		if (!transaction) {
			showErrorModal('An internal error has happened');
			return;
		}

		const result = await submitTransaction(transaction, 'Bounty creation success.');
		if (!result) {
			return;
		}

		const bountyEvent = result.events.find(({ type }) => type === 'Bounties');
		if (!bountyEvent || bountyEvent.value.type !== 'BountyProposed') {
			return;
		}

		const innerValue = bountyEvent.value.value as { index: number };
		if ('index' in innerValue) {
			const bountyIndex = innerValue.index;
			$bountyInfo = {
				id: bountyIndex,
				description: bountyTitle,
				value: BigInt(bountyValue)
			};

			const url = new URL(page.url);
			url.searchParams.set('bounty-id', String(bountyIndex));
			await goto(url);
		}

		await goto('/bounty-setup/success');
	}

	$: (async () => {
		try {
			bondValue = '-';
			if (!bountyTitle) return;

			bondValue = 'Calculating…';
			const base = await $dotApi.constants.Bounties.BountyDepositBase();
			const bytesLen = BigInt(Binary.fromText(bountyTitle).asBytes().length);
			const perByte = await $dotApi.constants.Bounties.DataDepositPerByte();
			bondValue = base + bytesLen * perByte;
		} catch {
			bondValue = '-';
		}
	})();
</script>

<div class="px-3 py-5 sm:pt-7 sm:pb-10 md:p-6 bg-backgroundButtonLight">
	<input
		bind:value={bountyTitle}
		class="{Input.input} title"
		placeholder="Give your Bounty a title"
	/>
	{#if false}
		<p class="text text-sm mt-1.5 text-white">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			<a href="#moreinfo">Tap here</a>
		</p>
	{/if}
</div>

<div
	class="grid content-between sm:space-y-10 bg-backgroundApp p-3 pb-7 sm:pt-7 sm:pb-10 md:px-6 w-full box-border overflow-x-hidden"
>
	<div>
		<section class="space-y-1 sm:space-y-3">
			<p class="text-xs">Bounty value</p>
			<input bind:value={bountyValue} class="{Input.polkadot} value" placeholder="1000.00" />
		</section>
		<hr class="border-backgroundButtonLight my-5 sm:my-10 w-full md:w-1/2" />

		<div class="my-5 sm:my-10 h-24 space-y-2 sm:space-y-5">
			<section class="space-y-1 sm:space-y-3">
				<p class="label text-xs">Bounty bond</p>
				<p class="value">
					{#if typeof bondValue === 'string'}
						{bondValue}
					{:else}
						<Currency value={bondValue} />
					{/if}
				</p>
			</section>
			<section class="space-y-1 sm:space-y-3">
				<p class="label text-xs">Estimated basic fee</p>
				<p class="value"><Fee {transaction} /></p>
			</section>
		</div>
	</div>
	<div class="flex-col space-y-2 sm:flex-row sm:space-x-2">
		<a href="/curator-actions" class="button-cancel h-12 inline-flex items-center">CANCEL</a>
		<button disabled={!bountyTitle || !bountyValue} on:click={submit} class="button-active h-12">
			SUBMIT
		</button>
	</div>
</div>

<style>
	@media (width > 768px /* md */) {
		.title {
			max-width: 50%;
		}
		.value {
			max-width: 33%;
		}
	}
</style>
