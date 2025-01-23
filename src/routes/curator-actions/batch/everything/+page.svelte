<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Binary } from 'polkadot-api';
	import { activeAccount, bounties, dotApi } from '../../../../stores';
	import { isPositiveNumber } from '../../../../utils/common';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import { isValidAddress } from '../../../../utils/polkadot';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { getBountyCuratorError } from '../getBountyCuratorError';
	import { getAllChildBountyCalls } from '../../../../utils/getAllChildBountyCalls';
	import Input from '../../../../components/Input/Input.module.css';
	import ToggleIcon from '../../../../components/ToggleIcon.svelte';
	import ExtendBountyLabel from '../../../../components/ExtendBountyLabel.svelte';
	import Fee from '../../../../components/Fee.svelte';

	const { searchParams } = page.url;
	const bountyId = parseInt(searchParams.get('bounty-id') ?? '');
	$: bounty = $bounties.find(({ id }) => id === bountyId);
	$: error = getBountyCuratorError(bountyId, $bounties, bounty, $activeAccount?.address);

	let childBountyId: number;
	let nextAvailableChildBountyId: number;

	(async () => {
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		const external = parseInt(searchParams.get('child-bounty-id') ?? '');
		childBountyId = !Number.isNaN(external) ? external : nextAvailableChildBountyId;
	})();

	let childBounties = [
		{
			value: searchParams.get('value') ?? '',
			title: searchParams.get('title') ?? '',
			fee: searchParams.get('fee') ?? '',
			beneficiary: searchParams.get('beneficiary') ?? ''
		},
		{ value: '', title: '', fee: '', beneficiary: '' }
	];

	$: isFormValid =
		childBounties.length > 0 &&
		childBounties.every(
			({ title, value, fee, beneficiary }) =>
				title.trim().length > 0 &&
				isPositiveNumber(value) &&
				isPositiveNumber(fee) &&
				isValidAddress(beneficiary)
		);

	function validateBountyValue(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Bounty value is invalid');
	}

	function validateFee(this: HTMLInputElement) {
		this.setCustomValidity(isPositiveNumber(this.value) ? '' : 'Fee value is invalid');
	}

	function validateAddress(this: HTMLInputElement) {
		this.setCustomValidity(isValidAddress(this.value) ? '' : 'Beneficiary address is invalid');
	}

	let extend = false;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			$activeAccount?.address &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...childBounties.flatMap(({ title, value, fee, beneficiary }, index) =>
						getAllChildBountyCalls({
							parent_bounty_id: bountyId,
							child_bounty_id: childBountyId + index,
							title,
							value,
							curator: $activeAccount.address,
							beneficiary,
							fee
						})
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

	async function submit() {
		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		const success = await submitTransaction(transaction);
		if (success) {
			await goto('/curator-actions');
		}
	}
</script>

<div class="bg-childBountyBackground p-5 m-3 rounded-md">
	<h1 class="text-2xl">BATCH ALL CALLS FOR MULTIPLE CHILD BOUNTIES</h1>

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
			<section>
				<h3 class="text-xs">Executed actions:</h3>

				<ol class="text-xs mt-2 ml-4 list-decimal">
					<li>Create a new child bounty.</li>
					<li>Assign the connected account as sub-curator.</li>
					<li>Accept the sub-curator role.</li>
					<li>Award the child bounty to the provided beneficiary.</li>
					<li>Claim the child bounty.</li>
				</ol>
			</section>

			<p class="text-xs border border-red text-red rounded-[3px] p-2 max-w-lg">
				Currently, the child bounty’s index is estimated by incrementing the highest available on
				the blockchain. To create multiple bounties in one batch transaction, Bounty Manager
				increments this index by 1 for each additional bounty. <br /> Please note: if multiple child
				bounties are assigned the same index, or if another bounty creates a child between this transaction’s
				creation and confirmation, this transaction will fail.
			</p>

			<label class="block w-full sm:max-w-40">
				<span class="text-xs block">Starting Child Bounty Index</span>
				<input
					type="number"
					min={nextAvailableChildBountyId}
					bind:value={childBountyId}
					class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
					required
				/>
			</label>

			<div class="grid cardsGrid gap-6">
				{#each childBounties as child, index}
					<fieldset class="bg-white -mt-3 p-5 lg:w-full rounded-md shadow-lg">
						<legend class="relative top-7">Child bounty #{index + 1}</legend>

						<div class="flex flex-col gap-6 mt-6">
							<label class="relative">
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

							<label class="relative">
								<span class="text-xs block">Sub-curator fee</span>
								<input
									bind:value={child.fee}
									class={Input.polkadot}
									placeholder="00.00"
									required
									oninput={validateFee}
									inputmode="decimal"
								/>
							</label>

							<label>
								<span class="text-xs block">Beneficiary account address</span>
								<input
									bind:value={child.beneficiary}
									class={Input.input}
									required
									oninput={validateAddress}
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
							class="py-2 px-4 rounded-md border border-childBountyGray text-childBountyGray font-bold"
							onclick={() => {
								childBounties = [
									...childBounties,
									{ value: '', title: '', fee: '', beneficiary: '' }
								];
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

			<p class="text-xs">
				For the highest likelihood of success, ensure that the signatories confirm the transaction
				as soon as possible
			</p>

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
