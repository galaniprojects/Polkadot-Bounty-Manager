<script lang="ts">
	import { formatPlanckToDot, isValidAddress } from '../../../../utils/polkadot';
	import Dialog from '../../../common/Dialog.svelte';
	import { activeAccount, dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { MultiAddress } from '@polkadot-api/descriptors';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = true;
	export let childBounty: ChildBounty;

	let beneficiary = '';
	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		if (!isValidAddress(beneficiary)) {
			showErrorDialog('Beneficiary address is invalid');
			return;
		}

		const transaction = $dotApi.tx.ChildBounties.award_child_bounty({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id,
			beneficiary: MultiAddress.Id(beneficiary)
		});
		await submitTransaction(transaction, 'Child bounty has been awarded and can now be claimed');
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '--';
			return;
		}
		try {
			const transaction = $dotApi.tx.ChildBounties.award_child_bounty({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id,
				beneficiary: MultiAddress.Id($activeAccount.address)
			});
			fee = await calculateTransactionFee(transaction);
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<Dialog bind:open title="AWARD CHILD BOUNTY" backgroundColor="white" textColor="primary">
	<div class="grid">
		<p class="space-x-1 mb-7 p-1 text-white bg-childBountyGreen">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<section>
			<p class="text-xs">Child bounty value</p>
			<p><span>{formatPlanckToDot(childBounty.value)}</span> DOT</p>
		</section>
		<div class="mt-5">
			<p class="text-xs">Beneficiary account address</p>
			<input
				bind:value={beneficiary}
				class="border border-primary rounded-[3px] bg-white pl-2 pt-1 h-10 w-full text-primary"
				placeholder=""
			/>
		</div>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee</p>
			<p>{fee}</p>
		</section>

		<button
			on:click={submit}
			disabled={beneficiary.length === 0}
			class="w-full md:w-fit mt-10 h-12 bg-childBountyGreen basic-button {beneficiary.length === 0
				? 'opacity-50 cursor-not-allowed'
				: ''}"
		>
			SIGN
		</button>
	</div>
</Dialog>
