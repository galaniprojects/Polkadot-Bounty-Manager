<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Binary } from 'polkadot-api';
	import { activeAccount, bounties, dotApi } from '../../../../stores';
	import { isPositiveNumber } from '../../../../utils/common';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { convertFormattedDotToPlanck } from '../../../../utils/polkadot';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { getBountyCuratorError } from '../getBountyCuratorError';
	import Input from '../../../../components/Input/Input.module.css';
	import ExtendBountyLabel from '../../../../components/ExtendBountyLabel.svelte';
	import Fee from '../../../../components/Fee.svelte';

	const { searchParams } = page.url;
	const bountyId = parseInt(searchParams.get('bounty-id') ?? '');
	$: bounty = $bounties.find(({ id }) => id === bountyId);
	$: error = getBountyCuratorError(bountyId, $bounties, bounty, $activeAccount?.address);

	let childBounties = [
		{
			value: searchParams.get('value') ?? '',
			title: searchParams.get('title') ?? ''
		},
		{ value: '', title: '' }
	];

	$: isFormValid =
		childBounties.length > 0 &&
		childBounties.every(({ title, value }) => title.trim().length > 0 && isPositiveNumber(value));

	function validateBountyValue(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Bounty value is invalid');
	}

	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...childBounties.map(
						({ title, value }) =>
							$dotApi.tx.ChildBounties.add_child_bounty({
								parent_bounty_id: bountyId,
								value: convertFormattedDotToPlanck(value),
								description: Binary.fromText(title.trim())
							}).decodedCall
					),
					...(!extend
						? []
						: [
								$dotApi.tx.Bounties.extend_bounty_expiry({
									bounty_id: bountyId,
									remark: new Binary(new Uint8Array())
								}).decodedCall
							])
				]
			})
	);

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		const success = await submitTransaction(transaction, undefined, bounty);
		if (success) {
			await goto('/curator-actions');
		}
	}
</script>

<div class="bg-backgroundBounty p-5 m-3 rounded-md">
	<h1 class="text-2xl">ADD MULTIPLE NEW CHILD BOUNTIES</h1>

	{#if error}
		<p class="my-2 p-2 text-white bg-childBountyOrange">
			{error}
		</p>
	{/if}

	{#if bounty && !error}
		<p class="my-2 p-1">
			#{bounty.id}
			{bounty.description ?? ''}
		</p>

		<form onsubmit={submit} class="mt-4 flex flex-col gap-6">
			<div class="grid cardsGrid gap-6">
				{#each childBounties as child, index}
					<fieldset class="bg-white -mt-3 p-5 lg:w-full rounded-md shadow-lg">
						<legend class="relative top-7">Child bounty #{index + 1}</legend>

						<div class="flex flex-col gap-6 mt-6">
							<label>
								<span class="text-xs block">Value</span>
								<input
									bind:value={child.value}
									class={Input.polkadot}
									placeholder="00.00"
									required
									oninput={validateBountyValue}
									inputmode="decimal"
								/>
							</label>

							<label>
								<span class="text-xs block">Title</span>
								<input
									bind:value={child.title}
									class={Input.input}
									placeholder="Child bounty name"
									required
								/>
							</label>

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
						</div>
					</fieldset>
				{/each}

				{#if childBounties.length < 10}
					<p class="bg-white p-5 rounded-md shadow-lg grid place-items-center">
						<button
							type="button"
							class="py-2 px-4 rounded-md border border-backgroundButtonDark text-backgroundButtonDark font-bold"
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
					<input type="checkbox" bind:checked={extend} class={Input.switch} />
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
					class={[
						'w-full md:w-fit h-12 button-active',
						!isFormValid && 'cursor-not-allowed opacity-50'
					]}
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
