<script lang="ts">
	import { dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import Dialog from '../../../common/Dialog.svelte';
	import ToggleIcon from '../../../svg/ToggleIcon.svelte';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';
	import CopyableAddress from '../../../common/CopyableAddress.svelte';

	export let open = true;
	export let childBounty: ChildBounty;

	let fee = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFee();
	});

	async function unassignSubCurator() {
		open = false;
		const transaction = $dotApi.tx.ChildBounties.unassign_curator({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		});
		await submitTransaction(transaction);
	}

	async function calculateFee() {
		try {
			const transaction = $dotApi.tx.ChildBounties.unassign_curator({
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

<Dialog bind:open title="UNASSIGN SUB-CURATOR" backgroundColor="white" textColor="primary">
	<div>
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>
		<section class="mt-10 space-y-1">
			<p class="text-xs">Please note</p>
			<p class="text-red bg-white rounded-sm p-2 border border-red">
				Un-assigning a sub-curator should only happen if it is deemed necessary or flagged by the
				community.
			</p>
			<p>You will be able to assign a new sub-curator soon after the un-assignment is executed.</p>
		</section>

		<div class="my-4">
			<p class="text-xs">Unassign sub-curator</p>
			<CopyableAddress address={childBounty.curator} />
		</div>

		<div class="my-4">
			<p class="text-xs">I understand</p>
			<div class="flex justify-between items-start">
				<p>Unassign anyway</p>
				<span class="custom-toggle"><ToggleIcon bind:checked={isToggled} /></span>
			</div>
		</div>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p>{fee}</p>
		</section>
	</div>

	<button
		on:click={unassignSubCurator}
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{!isToggled ? 'basic-button opacity-50' : 'cursor-allowed'}">SIGN</button
	>
</Dialog>

<style>
	.custom-toggle {
		--toggle-background: rgba(101, 112, 139, 0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.childBountyGray');
	}
</style>
