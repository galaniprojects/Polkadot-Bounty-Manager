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
	import { convertFormattedDotToPlanck, formatPlanckToDot } from '../../../utils/polkadot';
	import { onMount } from 'svelte';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;
	export let signatories: string[];

	interface Salary {
		address: string;
		salary: string;
		name: string;
	}

	let salaries = [] as Salary[];

	onMount(() => {
		salaries = signatories.map((address) => ({
			address,
			salary: '',
			name: $names[address]
		}));
	});

	$: payouts = salaries.filter(({ salary }) => {
		try {
			convertFormattedDotToPlanck(salary);
		} catch {
			return false;
		}
		return salary !== '' && convertFormattedDotToPlanck(salary) > 0n;
	});

	$: totalSalary = formatPlanckToDot(
		salaries.reduce((sum, { salary }) => {
			try {
				return sum + convertFormattedDotToPlanck(salary || '0');
			} catch {
				return sum;
			}
		}, 0n)
	);

	$: isSalaryCustom = salaries.some(({ salary }) => salary !== salaries[0]?.salary);

	let equalSalary: string = '';
	$: if (isSalaryCustom) {
		equalSalary = '';
	} else {
		equalSalary = salaries[0]?.salary;
	}

	function applyEqualSalary() {
		if (equalSalary !== '' && convertFormattedDotToPlanck(equalSalary) > 0) {
			salaries = salaries.map((salary) => ({ ...salary, salary: equalSalary }));
		}
	}

	const currentMonth = new Date().toLocaleDateString('en', { month: 'long' });

	let description = `${currentMonth} Salary`;
	let extend = false;
	let nextAvailableChildBountyId: number;
	let childBountyId: number;

	(async () => {
		void $dotApi.query.ChildBounties.ChildBountyCount.watchValue().forEach((value) => {
			nextAvailableChildBountyId = value;
			childBountyId = Math.max(childBountyId, nextAvailableChildBountyId);
		});
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: isFormValid =
		description &&
		payouts.length > 0 &&
		salaries.every(({ salary }) => isValidInput(salary)) &&
		isValidInput(equalSalary);

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

	function isValidInput(salary: string): boolean {
		if (salary === '') return true;
		try {
			convertFormattedDotToPlanck(salary);
			return true;
		} catch {
			return false;
		}
	}

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
					class={[Input.polkadot, 'grow shrink', isValidInput(equalSalary) ? '' : 'invalidInput']}
					step="any"
					min="0"
					bind:value={equalSalary}
					placeholder="Individual"
					on:input={applyEqualSalary}
				/>
				<p class="whitespace-nowrap">each =</p>

				<!--	eslint-disable svelte/no-reactive-reassign	-->
				<input
					class={[Input.polkadot, 'grow shrink', 'disabledInput']}
					type="string"
					step="any"
					disabled={true}
					min="0"
					required
					bind:value={totalSalary}
					placeholder="Total"
				/>
				<!--	eslint-enable svelte/no-reactive-reassign	-->
				<p>total</p>
			</div>
		</div>

		<ul class="space-y-1.5">
			{#each salaries as salary (salary.address)}
				<li class="flex items-center gap-4">
					<input
						class={[Input.polkadot, 'max-w-36', isValidInput(salary.salary) ? '' : 'invalidInput']}
						bind:value={salary.salary}
						type="text"
						step="any"
						placeholder="Enter salary"
					/>
					<CopyableAddress address={salary.address} />
				</li>
			{/each}
		</ul>

		<p>
			<label class="inline-flex gap-4 items-center cursor-pointer">
				<input type="checkbox" bind:checked={extend} class={Input.switch} />
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

<style>
	.invalidInput {
		background-color: #ff9e9e;
	}

	.disabledInput {
		border-color: lightGray;
	}
</style>
