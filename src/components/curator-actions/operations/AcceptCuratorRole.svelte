<script lang="ts" context="module">
	/**
	 * @param fee fee in planck.
	 * @returns deposit as a string in dots.
	 **/
	export function calculateDeposit(fee: bigint): string {
		if (fee < convertDotToPlanck(20n)) {
			return '10';
		} else if (fee > convertDotToPlanck(400n)) {
			return '200';
		} else {
			return formatPlanckToDot(fee / BigInt(2));
		}
	}
</script>

<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { activeAccount, dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import ToggleIcon from '../../svg/ToggleIcon.svelte';
	import Dialog from '../../common/Dialog.svelte';
	import { calculateTransactionFee, submitTransaction } from '../../../utils/transaction';
	import { convertDotToPlanck, formatPlanckToDot } from '../../../utils/polkadot';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let deposit = '=';
	let isToggled = false;

	onMount(async () => {
		await calculateFeeAndDeposit();
	});

	async function acceptCuratorRole() {
		open = false;
		const transaction = $dotApi.tx.Bounties.accept_curator({
			bounty_id: bounty.id
		});
		const result = submitTransaction(transaction);

		if (result == undefined) {
			showErrorDialog('Internal error');
			return;
		}
	}

	async function calculateFeeAndDeposit() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const transaction = $dotApi.tx.Bounties.accept_curator({
				bounty_id: bounty.id
			});

			fee = (await calculateTransactionFee(transaction)) + ' DOT';

			deposit = calculateDeposit(bounty.fee);
		} catch (e) {
			console.error(e);
			fee = '-';
			deposit = '-';
		}
	}
</script>

<Dialog bind:open title="ACCEPT CURATOR ROLE">
	<section class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<div>
			<p class="text-xs">Accept Curator role</p>
			<div class="flex justify-between items-start">
				<p>I agree</p>
				<ToggleIcon bind:checked={isToggled} />
			</div>
		</div>

		<div class="flex space-x-24">
			<div>
				<p class="text-xs">Estimated basic fee</p>
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
		class="w-full md:w-fit mt-10 h-12 button-popup {isToggled
			? 'button-popup'
			: 'opacity-50 cursor-not-allowed'}">SIGN</button
	>
</Dialog>
