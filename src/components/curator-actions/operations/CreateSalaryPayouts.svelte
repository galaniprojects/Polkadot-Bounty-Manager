<script lang="ts">
	import { onMount } from 'svelte';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import Dialog from '../../common/Dialog.svelte';
	import { fetchMultisigSignatories } from '../fetch-signatories';
	import { submitTransaction } from '../../../utils/transaction';
	import { activeAccount, dotApi } from '../../../stores';
	import { convertFormattedDotToPlanck, isValidAddress } from '../../../utils/polkadot';
	import { isPositiveNumber } from '../../../utils/common';
	import type { ChildBounty } from '../../../types/child-bounty';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { Binary } from 'polkadot-api';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import type { Bounty } from '../../../types/bounty';

	export let open = false;
	export let curatorAddress = '';

	let signatories: { address: string; salary: number | '' }[] = [];
	let equalSalary: number | '' = '';
	let totalSalary: number | '';
	let isSalaryCustom = false;

	onMount(async () => {
		const fetchedSignatories = await fetchMultisigSignatories(curatorAddress);
		signatories = fetchedSignatories.map((address) => ({ address, salary: '' }));
	});

	const applyEqualSalary = () => {
		if (equalSalary !== '') {
			isSalaryCustom = false;
			signatories = signatories.map((s) => ({ ...s, salary: equalSalary }));
			calculateTotalFromEqualSalaries();
		}
	};

	const calculateTotalFromEqualSalaries = () => {
		totalSalary = signatories.reduce((sum, s) => sum + (s.salary || 0), 0);
	};

	const calculateEqualSalariesFromTotal = () => {
		if (totalSalary !== '' && signatories.length) {
			equalSalary = Math.floor((totalSalary as number) / signatories.length);
			signatories = signatories.map((s) => ({ ...s, salary: equalSalary }));
		}
	};

	const handleSignatoryChange = (index: number, value: string) => {
		const parsedValue = parseFloat(value);
		signatories[index].salary = isNaN(parsedValue) ? '' : parsedValue;

		const hasCustomSalaries = signatories.some((s) => s.salary !== equalSalary);
		if (hasCustomSalaries) {
			isSalaryCustom = true;
			equalSalary = '';
			totalSalary = '';
		} else {
			isSalaryCustom = false;
			calculateTotalFromEqualSalaries();
		}
	};

	$: if (isSalaryCustom) {
		totalSalary = signatories.reduce((sum, s) => sum + (s.salary || 0), 0);
	}

	const getCurrentMonth = (): string => {
		const date = new Date();
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		return monthNames[date.getMonth()];
	};

	let currentMonth: string = `${getCurrentMonth()} Salary`;

	export let childBounty: ChildBounty;
	export let bounty: Bounty;

	let beneficiary = '';
	let curatorFee = '';
	let extend = false;
	let nextAvailableChildBountyId: number;
	let childBountyId: number;

	(async () => {
		nextAvailableChildBountyId = await $dotApi.query.ChildBounties.ChildBountyCount.getValue();
		childBountyId = nextAvailableChildBountyId;
	})();

	$: transactions = signatories.map(({ address, salary }, childBountyId) => {
		if (!$activeAccount || !isValidAddress(beneficiary) || !isPositiveNumber(curatorFee))
			return null;

		const create = $dotApi.tx.ChildBounties.add_child_bounty({
			parent_bounty_id: bounty.id,
			value: convertFormattedDotToPlanck(String(salary || 0)),
			description: Binary.fromText(`${currentMonth} - ${childBountyId + 1}`)
		});

		const propose = $dotApi.tx.ChildBounties.propose_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id + childBountyId,
			curator: MultiAddress.Id($activeAccount.address),
			fee: convertFormattedDotToPlanck(String(curatorFee))
		});

		const accept = $dotApi.tx.ChildBounties.accept_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id + childBountyId
		});

		const award = $dotApi.tx.ChildBounties.award_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id + childBountyId,
			beneficiary: MultiAddress.Id(address)
		});

		const claim = $dotApi.tx.ChildBounties.claim_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id + childBountyId
		});

		const extendTx = $dotApi.tx.Bounties.extend_bounty_expiry({
			bounty_id: childBounty.parentBounty,
			remark: new Binary(new Uint8Array())
		});

		return $dotApi.tx.Utility.batch_all({
			calls: [
				create.decodedCall,
				propose.decodedCall,
				accept.decodedCall,
				award.decodedCall,
				claim.decodedCall,
				...(extend ? [extendTx.decodedCall] : [])
			]
		});
	});

	async function submit() {
		open = false;

		if (!$activeAccount) {
			showErrorDialog('Wallet is not connected');
			return;
		}

		if (!transactions.length) {
			showErrorDialog('No transactions to submit.');
			return;
		}

		for (const transaction of transactions) {
			if (!transaction) continue;

			try {
				await submitTransaction(transaction);
			} catch (error) {
				showErrorDialog('Failed to process transaction for a signatory');
				return;
			}
		}

		showErrorDialog('All transactions have been processed successfully!');
	}
</script>

<Dialog bind:open title="SALARY PAYOUTS" backgroundColor="white" textColor="primary">
	<div class="mt-5 space-y-4">
		<div>
			<p class="text-xs">Edit the suggested title if desired</p>
			<div class="flex items-baseline space-x-2">
				<div class="my-1">
					<input
						class="border border-black pt-1 pl-2 rounded-[3px] bg-white h-10 text-primary"
						bind:value={currentMonth}
						placeholder={`${getCurrentMonth()} Salary`}
					/>
				</div>
				<p>for Curator</p>
			</div>
		</div>

		<div class="space-y-1">
			<p class="text-xs">Enter an individual salary or the total payout</p>
			<div class="flex justify-between items-baseline relative">
				<input
					class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-[30%] text-primary"
					type="number"
					bind:value={equalSalary}
					placeholder="Individual salary"
					on:input={applyEqualSalary}
				/>
				<p>per / signatory =</p>

				<input
					class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-[30%] text-primary"
					type="number"
					bind:value={totalSalary}
					placeholder="Total salary"
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
						class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 text-primary"
						type="number"
						value={salary !== '' ? salary : ''}
						placeholder="Enter salary"
						on:input={(e) => handleSignatoryChange(index, e.currentTarget.value)}
					/>
				</li>
			{/each}
		</ul>

		<p>Total: {totalSalary || 0}</p>
		<button on:click={submit} class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button">
			CREATE
		</button>
	</div>
</Dialog>
