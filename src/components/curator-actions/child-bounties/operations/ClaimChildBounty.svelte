<script lang="ts">
	import Dialog from '../../../common/Dialog.svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import PolkadotIcon from '../../../common/PolkadotIcon.svelte';
	import { truncateString } from '../../../../utils/common';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = true;
	export let childBounty: ChildBounty;

	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		const transaction = $dotApi.tx.ChildBounties.claim_child_bounty({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		});
		await submitTransaction(transaction, 'Child bounty successfully claimed');
	}

	async function calculateFee() {
		try {
			const transaction = $dotApi.tx.ChildBounties.claim_child_bounty({
				child_bounty_id: childBounty.id,
				parent_bounty_id: childBounty.parentBounty
			});
			fee = (await calculateTransactionFee(transaction)) + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<Dialog bind:open title="CLAIM CHILD BOUNTY AWARD" backgroundColor="white" textColor="primary">
	<div class="space-y-8">
		<p class="p-1 text-white bg-curatorMainBackground">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<div class="space-y-2">
			<p class="text-xs">What is this action?</p>
			<p class="text-xs">
				This is a permissionless action and can be executed by anyone in favour of the beneficiary.
				The funds will be transferred to the beneficiary’s address.
			</p>
		</div>
		{#if childBounty.beneficiary}
			<div class="space-y-2">
				<p class="text-xs">Beneficiary account</p>
				<div class="flex">
					<div class="w-5 h-5">
						<PolkadotIcon address={childBounty.beneficiary} />
					</div>
					<p>{truncateString(childBounty.beneficiary, 13)}</p>
				</div>
			</div>
		{/if}
		<div class="space-y-2">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</div>
	</div>

	<button on:click={submit} class="w-full md:w-fit mt-10 h-12 basic-button bg-curatorMainBackground"
		>SIGN</button
	>
</Dialog>
