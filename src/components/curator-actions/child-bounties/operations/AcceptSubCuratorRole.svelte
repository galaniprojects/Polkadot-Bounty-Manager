<script lang="ts">
	import { dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import ToggleIcon from '../../../svg/ToggleIcon.svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { calculateDeposit } from '../../operations/AcceptCuratorRole.svelte';
	import Dialog from '../../../common/Dialog.svelte';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = false;
	export let childBounty: ChildBounty;
	export let parentCurator: string | undefined;

	let fee = '-';
	let deposit = '-';
	let isToggled = false;

	onMount(async () => {
		await calculateFeeAndDeposit();
	});

	async function acceptCuratorRole() {
		open = false;
		const transaction = $dotApi.tx.ChildBounties.accept_curator({
			parent_bounty_id: childBounty.parentBounty,
			child_bounty_id: childBounty.id
		});
		await submitTransaction(transaction);
	}

	async function calculateFeeAndDeposit() {
		try {
			const transaction = $dotApi.tx.ChildBounties.accept_curator({
				parent_bounty_id: childBounty.parentBounty,
				child_bounty_id: childBounty.id
			});
			fee = (await calculateTransactionFee(transaction)) + ' DOT';
			if (parentCurator && parentCurator === childBounty.curator) {
				deposit = '0';
			} else {
				deposit = calculateDeposit(childBounty.fee);
			}
		} catch (e) {
			console.error(e);
			fee = '-';
			deposit = '-';
		}
	}
</script>

<Dialog bind:open title="ACCEPT SUB-CURATOR ROLE" backgroundColor="white" textColor="primary">
	<section class="space-y-5">
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{#if childBounty.description !== undefined}
				{childBounty.description}
			{/if}
		</p>

		<div>
			<p class="text-xs">Accept Sub-curator role</p>
			<div class="flex justify-between items-start">
				<p>I agree</p>
				<span class="custom-toggle"><ToggleIcon bind:checked={isToggled} /></span>
			</div>
		</div>

		<div class="flex space-x-24">
			<div>
				<p class="text-xs">Calculated Fee</p>
				<p>{fee}</p>
			</div>
			<div>
				<p class="text-xs">Estimated deposit</p>
				<p>{deposit} DOT</p>
			</div>
		</div>
	</section>

	<button
		on:click={acceptCuratorRole}
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
