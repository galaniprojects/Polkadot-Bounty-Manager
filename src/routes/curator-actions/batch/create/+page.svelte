<script lang="ts">
	import { page } from '$app/state';
	import { Binary } from 'polkadot-api';
	import { activeAccount, bounties, dotApi } from '../../../../stores';
	import { isPositiveNumber } from '../../../../utils/common';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { convertFormattedDotToPlanck } from '../../../../utils/polkadot';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { getBountyCuratorError } from '../getBountyCuratorError';
	import PolkaCoin from '../../../../components/svg/PolkaCoin.svg';
	import ToggleIcon from '../../../../components/ToggleIcon.svelte';
	import ExtendBountyLabel from '../../../../components/ExtendBountyLabel.svelte';
	import Fee from '../../../../components/Fee.svelte';

	const bountyId = parseInt(page.url.searchParams.get('bounty-id') ?? '');
	$: bounty = $bounties.find(({ id }) => id === bountyId);
	$: error = getBountyCuratorError(bountyId, $bounties, bounty, $activeAccount?.address);

	let childBounties = [
		{
			value: '',
			title: ''
		}
	];

	$: isFormValid = childBounties.every(
		({ title, value }) => title.trim().length > 0 && isPositiveNumber(value)
	);

	function validateBountyValue(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Bounty value is invalid');
	}

	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...(!extend
						? []
						: [
								$dotApi.tx.Bounties.extend_bounty_expiry({
									bounty_id: bountyId,
									remark: new Binary(new Uint8Array())
								}).decodedCall
							]),
					...childBounties.map(
						({ title, value }) =>
							$dotApi.tx.ChildBounties.add_child_bounty({
								parent_bounty_id: bountyId,
								value: convertFormattedDotToPlanck(value),
								description: Binary.fromText(title.trim())
							}).decodedCall
					)
				]
			})
	);

	async function submit() {
		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		await submitTransaction(transaction);
	}
</script>

<div class="bg-childBountyBackground p-5 m-3 rounded-md">
	<h1 class="text-2xl">ADD MULTIPLE NEW CHILD BOUNTIES</h1>

	{#if error}
		<p class="my-2 p-2 text-white bg-childBountyOrange">
			{error}
		</p>
	{/if}

	{#if bounty && !error}
		<p class="my-2 p-1 text-white bg-childBountyGray">
			#{bounty.id}
			{bounty.description ?? ''}
		</p>

		<form onsubmit={submit} class="mt-4 flex flex-col gap-6">
			<div class="grid cardsGrid gap-6">
				{#each childBounties as child, index}
					<fieldset class="bg-white -mt-3 p-5 lg:w-full rounded-md shadow-lg">
						<legend class="relative top-7">Child bounty #{index + 1}</legend>

						<div class="flex flex-col gap-6 mt-6">
							<label class="relative">
								<span class="text-xs block">Value</span>
								<input
									bind:value={child.value}
									class="border border-black pt-1 pl-2 rounded-[3px] bg-white h-10 w-full"
									placeholder="00.00"
									required
									oninput={validateBountyValue}
									inputmode="decimal"
								/>
								<span
									class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"
								></span>
								<span class="absolute right-2 top-[26px]">
									<img src={PolkaCoin} width="20" height="20" alt="PolkaCoin" />
								</span>
							</label>

							<label>
								<span class="text-xs block">Title</span>
								<input
									bind:value={child.title}
									class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
									placeholder="Child bounty name"
									required
								/>
							</label>

							{#if index > 0}
								<p class="text-right">
									<button
										type="button"
										class="underline text-sm"
										onclick={() => {
											childBounties = childBounties.toSpliced(index, 1);
										}}
									>
										Remove
									</button>
								</p>
							{/if}
						</div>
					</fieldset>
				{/each}

				{#if childBounties.length < 10}
					<p class="bg-white p-5 lg:w-full rounded-md shadow-lg grid place-items-center">
						<button
							type="button"
							class="py-2 px-4 rounded-md border border-childBountyGray text-childBountyGray font-bold"
							onclick={() => {
								childBounties = [...childBounties, { value: '', title: '' }];
							}}
						>
							ADD
						</button>
					</p>
				{/if}
			</div>

			<p>
				<label class="inline-flex gap-4 items-center cursor-pointer">
					<ToggleIcon bind:checked={extend} />
					<ExtendBountyLabel />
				</label>
			</p>

			<div>
				<p class="text-xs">Estimated basic fee:</p>
				<p><Fee {transaction} /></p>
			</div>

			<p>
				<button
					type="submit"
					class={['w-full md:w-fit h-12 button-active', !isFormValid && 'cursor-not-allowed opacity-50']}
				>
					SIGN
				</button>
			</p>
		</form>
	{/if}
</div>

<style>
	.cardsGrid {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-auto-rows: 1fr;
	}
</style>
