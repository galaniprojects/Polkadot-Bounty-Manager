<script lang="ts">
	import Dialog from '../../common/Dialog.svelte';
	import { dotApi } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import { submitTransaction } from '../../../utils/transaction';
	import Fee from '../../Fee.svelte';

	export let open = true;
	export let bounty: Bounty;

	$: transaction = $dotApi.tx.Bounties.claim_bounty({
		bounty_id: bounty.id
	});

	async function claimBounty() {
		open = false;
		await submitTransaction(transaction);
	}
</script>

<Dialog bind:open title="CLAIM BOUNTY AWARD">
	<div class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
		</div>
		<div class="space-y-2">
			<p class="text-xs">What is this action?</p>
			<p class="text-xs">
				This is a permissionless action and can be executed by anyone in favour of the beneficiary.
				The funds will be transferred to the beneficiary’s address.
			</p>
		</div>
		{#if bounty.beneficiary}
			<div class="space-y-2">
				<p class="text-xs">Beneficiary account</p>
				<CopyableAddress address={bounty.beneficiary} />
			</div>
		{/if}
		<div class="space-y-2">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</div>
	</div>

	<button on:click={claimBounty} class="w-full md:w-fit mt-10 h-12 button-popup">SIGN</button>
</Dialog>
