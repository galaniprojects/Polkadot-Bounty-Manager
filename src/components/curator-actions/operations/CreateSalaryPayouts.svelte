<script lang="ts">
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import Dialog from '../../common/Dialog.svelte';
	import { maybeTransaction, submitTransaction } from '../../../utils/transaction';
	import { activeAccount, dotApi } from '../../../stores';
	import { getAllChildBountyCalls } from '../../../utils/getAllChildBountyCalls';
	import Input from '../../Input/Input.module.css';
	import ExtendBountyLabel from '../../ExtendBountyLabel.svelte';
	import { Binary } from 'polkadot-api';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import type { Bounty } from '../../../types/bounty';

	export let open = false;
	export let bounty: Bounty;
	export let signatories: string[];

	interface Salary {
		address: string;
		salary: number | null;
	}

	interface Payout {
		address: string;
		salary: number;
	}

	$: salaries = signatories.map((address) => ({ address, salary: null })) as Salary[];
	$: payouts = salaries.filter(({ salary }) => salary !== null && salary > 0) as Payout[];

	$: totalSalary = salaries.reduce((sum, { salary }) => sum + (salary || 0), 0) || null;

	$: isSalaryCustom = salaries.some(({ salary }) => salary !== salaries[0]?.salary);

	let equalSalary: number | null = null;
	$: if (isSalaryCustom) {
		equalSalary = null;
	} else if (totalSalary !== null) {
		equalSalary = salaries[0]?.salary;
	}

	function applyEqualSalary() {
		if (equalSalary !== null && equalSalary > 0) {
			salaries = salaries.map((salary) => ({ ...salary, salary: equalSalary }));
		}
	}

	function calculateEqualSalariesFromTotal() {
		if (totalSalary !== null && totalSalary > 0 && salaries.length > 0) {
			equalSalary = parseFloat((totalSalary / salaries.length).toFixed(4));
			applyEqualSalary();
		}
	}

	const currentMonth = new Date().toLocaleDateString('en', { month: 'long' });

	let description = `${currentMonth} Salary`;
	let curatorFee: number | null = 0;
	let extend = false;
	let nextAvailableChildBountyId: number;
	let childBountyId: number;

	(async () => {
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: isFormValid = description && curatorFee !== null && payouts.length > 0;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			$activeAccount?.address &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...payouts.flatMap(({ address, salary }, index) =>
						getAllChildBountyCalls({
							parent_bounty_id: bounty.id,
							child_bounty_id: childBountyId + index,
							title: `${description} for ${address}`, // TODO: People name
							value: String(salary),
							curator: $activeAccount.address,
							beneficiary: address,
							fee: String(curatorFee)
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
					required
					bind:value={totalSalary}
					placeholder="Total"
					on:input={calculateEqualSalariesFromTotal}
				/>
				<p>total</p>
			</div>
		</div>

		<ul class="space-y-1.5">
			{#each salaries as { address, salary }}
				<li class="flex justify-between relative">
					<CopyableAddress {address} />
					<input
						class={[Input.polkadot, 'max-w-52']}
						bind:value={salary}
						type="number"
						step="any"
						min="0"
						placeholder="Enter salary"
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
