<script lang="ts">
	import { onMount } from 'svelte';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import Dialog from '../../common/Dialog.svelte';
	import { fetchMultisigSignatories } from '../fetch-signatories';
	import { maybeTransaction, submitTransaction } from '../../../utils/transaction';
	import { activeAccount, dotApi } from '../../../stores';
	import { getAllChildBountyCalls } from '../../../utils/getAllChildBountyCalls';
	import { isPositiveNumber } from '../../../utils/common';
	import Input from '../../Input/Input.module.css';
	import ExtendBountyLabel from '../../ExtendBountyLabel.svelte';
	import { Binary } from 'polkadot-api';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import type { Bounty } from '../../../types/bounty';

	export let open = false;
	export let curatorAddress = '';

	let signatories: { address: string; salary: number | '' }[] = [];
	let equalSalary: number | null = null;
	let totalSalary: number | null = null;
	let isSalaryCustom = false;

	onMount(async () => {
		const fetchedSignatories = await fetchMultisigSignatories(curatorAddress);
		signatories = fetchedSignatories.map((address) => ({ address, salary: '' }));
	});

	function applyEqualSalary() {
		if (equalSalary !== null && equalSalary > 0) {
			isSalaryCustom = false;
			signatories = signatories.map((s) => ({ ...s, salary: equalSalary as number }));
			calculateTotalFromEqualSalaries();
		}
	}

	function calculateTotalFromEqualSalaries() {
		totalSalary = signatories.reduce((sum, s) => sum + (s.salary || 0), 0);
	}

	function calculateEqualSalariesFromTotal() {
		if (totalSalary !== null && totalSalary > 0 && signatories.length > 0) {
			equalSalary = parseFloat((totalSalary / signatories.length).toFixed(4));
			signatories = signatories.map((s) => ({ ...s, salary: equalSalary as number }));
		}
	}

	function handleSignatoryChange(this: HTMLInputElement) {
		const index = parseInt(this.name);
		const parsedValue = parseFloat(this.value);

		const isValid = isPositiveNumber(this.value) && !isNaN(parsedValue);
		signatories[index].salary = !isValid ? '' : parsedValue;

		isSalaryCustom = signatories.some((s) => s.salary !== equalSalary);
		if (isSalaryCustom) {
			equalSalary = null;
			totalSalary = null;
		} else {
			calculateTotalFromEqualSalaries();
		}
	}

	$: if (isSalaryCustom) {
		totalSalary = signatories.reduce((sum, s) => sum + (s.salary || 0), 0);
	}

	const currentMonth = new Date().toLocaleDateString('en', { month: 'long' });
	let description: string = `${currentMonth} Salary`;

	export let bounty: Bounty;

	let curatorFee = '0';
	let extend = false;
	let nextAvailableChildBountyId: number;
	let childBountyId: number;

	(async () => {
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: isFormValid = signatories.some(({ salary }) => salary !== '' && salary > 0);

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			$activeAccount?.address &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...signatories
						.filter(({ salary }) => Boolean(salary))
						.flatMap(({ address, salary }, index) =>
							getAllChildBountyCalls({
								parent_bounty_id: bounty.id,
								child_bounty_id: childBountyId + index,
								title: `${description} for ${address}`, // TODO: People name
								value: String(salary || 0),
								curator: $activeAccount.address,
								beneficiary: address,
								fee: curatorFee
							})
						),
					...(!extend
						? []
						: [
								$dotApi.tx.Bounties.extend_bounty_expiry({
									bounty_id: bounty.id,
									remark: new Binary(new Uint8Array())
								}).decodedCall
							])
				]
			})
	);

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		if (!isFormValid) return;

		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}

		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		open = false;

		await submitTransaction(transaction);
	}
</script>

<Dialog bind:open title="SALARY PAYOUTS" backgroundColor="white" textColor="primary">
	<form class="mt-5 space-y-4" on:submit={submit}>
		<div>
			<p class="text-xs">Edit the suggested title if desired</p>
			<div class="flex items-baseline space-x-2">
				<div class="my-1">
					<input
						class={Input.input}
						bind:value={description}
						required
						placeholder="{currentMonth} Salary"
					/>
				</div>
				<p>for <em>Curator</em></p>
			</div>
		</div>

		<div class="space-y-1">
			<p class="text-xs">Enter an individual salary or the total payout</p>
			<div class="flex justify-between items-baseline relative">
				<input
					class={[Input.polkadot, 'max-w-32']}
					type="number"
					step="any"
					min="0"
					bind:value={equalSalary}
					placeholder="Individual"
					on:input={applyEqualSalary}
				/>
				<p>per signatory =</p>

				<input
					class={[Input.polkadot, 'max-w-32']}
					type="number"
					step="any"
					min="0"
					bind:value={totalSalary}
					placeholder="Total"
					on:input={calculateEqualSalariesFromTotal}
				/>
				<p>total</p>
			</div>
		</div>

		<ul class="space-y-1.5">
			{#each signatories as { address, salary }, index}
				<li class="flex justify-between relative">
					<CopyableAddress {address} />
					<input
						class={[Input.polkadot, 'max-w-52']}
						name={String(index)}
						type="number"
						step="any"
						min="0"
						value={salary !== '' ? salary : ''}
						placeholder="Enter salary"
						on:input={handleSignatoryChange}
					/>
				</li>
			{/each}
		</ul>

		<label class="block">
			<span class="text-xs block">Sub-curator fee per payout</span>
			<input
				bind:value={curatorFee}
				class={Input.polkadot}
				placeholder="00.00"
				required
				type="number"
				step="any"
				min="0"
				inputmode="decimal"
			/>
		</label>

		<p>
			<label class="inline-flex gap-4 items-center cursor-pointer">
				<input type="checkbox" bind:checked={extend} class={Input.switchInverted} />
				<ExtendBountyLabel />
			</label>
		</p>

		<p class="text-xs">
			For the highest likelihood of success, ensure that the signatories confirm the transaction as
			soon as possible
		</p>

		<button
			type="submit"
			class={[
				'w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button',
				!isFormValid && 'cursor-not-allowed opacity-50'
			]}
		>
			CREATE
		</button>
	</form>
</Dialog>
