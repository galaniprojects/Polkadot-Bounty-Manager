<script lang="ts">
	import { convertPlanckToDot, getApi } from '../../../utils/polkadot';
	import BountyDialog from '../../BountyDialog.svelte';
	import type { ChildBounty } from '../../../types/child-bounty';
	import { firstValueFrom } from 'rxjs';
	import { activeAccount } from '../../../stores';
	import { onMount } from 'svelte';

	export let open = true;
	export let childBounty: ChildBounty;

	let beneficiary = '';
	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const api = await getApi();

			let transaction = api.tx.childBounties.awardChildBounty(
				childBounty.parentBounty,
				childBounty.id,
				$activeAccount.address
			);
			let observableFee = transaction.paymentInfo($activeAccount.address);

			const paymentInfo = await firstValueFrom(observableFee);
			fee = convertPlanckToDot(paymentInfo.partialFee.toNumber()).toString() + ' DOT';
		} catch (e) {
			console.error(e);
			fee = '--';
		}
	}
</script>

<BountyDialog
	bind:open
	title="CLAIM CHILD BOUNTY AWARD"
	backgroundColor="white"
	textColor="primary"
>
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
		<div class="space-y-2">
			<p class="text-xs">Beneficiary account</p>
			<p>{beneficiary}</p>
		</div>
		<div class="space-y-2">
			<p class="text-xs">Calculated Fee:</p>
			<p>{fee}</p>
		</div>
	</div>

	<button class="w-full md:w-fit mt-10 h-12 basic-button bg-curatorMainBackground">SIGN</button>
</BountyDialog>
