<script lang="ts">
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import Dialog from '../../common/Dialog.svelte';
	import { maybeTransaction, submitTransaction } from '../../../utils/transaction';
	import { activeAccount, dotApi } from '../../../stores';
	import { getAllChildBountyCalls } from '../../../utils/getAllChildBountyCalls';
	import Input from '../../Input/Input.module.css';
	import ExtendBountyLabel from '../../ExtendBountyLabel.svelte';
	import Fee from '../../Fee.svelte';
	import { Binary } from 'polkadot-api';
	import { showErrorModal } from '../../modals';
	import { names } from '../../../utils/people';
	import type { Bounty } from '../../../types/bounty';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;
	export let signatories: string[];

	interface Salary {
		address: string;
		salary: number | null;
		name: string;
	}

	interface Payout extends Salary {
		salary: number;
	}

	$: salaries = signatories.map((address) => ({
		address,
		salary: null,
		name: $names[address]
	})) as Salary[];

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
			// eslint-disable-next-line svelte/no-reactive-reassign
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
	let extend = false;
	let nextAvailableChildBountyId: number;
	let childBountyId: number;

	(async () => {
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: isFormValid = description && payouts.length > 0;

	$: transaction = maybeTransaction(
		() =>
			isFormValid &&
			bounty.curator &&
			$dotApi.tx.Utility.batch_all({
				calls: [
					...payouts.flatMap(({ address, salary, name = address }, index) =>
						getAllChildBountyCalls({
							parent_bounty_id: bounty.id,
							child_bounty_id: childBountyId + index,
							title: `${description} for ${name}`,
							value: String(salary),
							curator: bounty.curator as string,
							beneficiary: address,
							fee: '0'
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
			showErrorModal('Wallet is not connected');
			return;
		}

		if (!transaction) {
			showErrorModal('An internal error has happened');
			return;
		}

		const successful = await submitTransaction(transaction, bounty);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="SALARY PAYOUTS">
	<p>#{bounty.id} {bounty.description ?? ''}</p>

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
			<div class="flex items-center gap-2">
				<input
					class={[Input.polkadot, 'grow shrink']}
					type="number"
					step="any"
					min="0"
					bind:value={equalSalary}
					placeholder="Individual"
					on:input={applyEqualSalary}
				/>
				<p class="whitespace-nowrap">each =</p>

				<!--	eslint-disable svelte/no-reactive-reassign	-->
				<input
					class={[Input.polkadot, 'grow shrink']}
					type="number"
					step="any"
					min="0"
					required
					bind:value={totalSalary}
					placeholder="Total"
					on:input={calculateEqualSalariesFromTotal}
				/>
				<!--	eslint-enable svelte/no-reactive-reassign	-->
				<p>total</p>
			</div>
		</div>

		<ul class="space-y-1.5">
			{#each salaries as { address, salary } (address)}
				<li class="flex gap-4">
					<input
						class={[Input.polkadot, 'max-w-36']}
						bind:value={salary}
						type="number"
						step="any"
						min="0"
						placeholder="Enter salary"
					/>
					<CopyableAddress {address} />
				</li>
			{/each}
		</ul>

		<p>
			<label class="inline-flex gap-4 items-center cursor-pointer">
				<input type="checkbox" bind:checked={extend} class={Input.switchInverted} />
				<ExtendBountyLabel />
			</label>
		</p>

		<section class="mt-10">
			<p class="text-xs">Estimated basic fee</p>
			<p><Fee {transaction} /></p>
		</section>

		<p class="text-xs">
			For the highest likelihood of success, ensure that the signatories confirm the transaction as
			soon as possible
		</p>

		<button
			type="submit"
			class={[
				'w-full md:w-fit mt-10 h-12 bg-backgroundButtonDark px-10 pt-1 rounded-md text-white',
				!isFormValid && 'cursor-not-allowed opacity-50'
			]}
		>
			CREATE
		</button>
	</form>
</Dialog>
