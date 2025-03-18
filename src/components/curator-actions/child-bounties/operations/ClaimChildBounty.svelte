<script lang="ts">
	import Dialog from '../../../common/Dialog.svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { dotApi } from '../../../../stores';
	import Fee from '../../../Fee.svelte';
	import { submitTransaction } from '../../../../utils/transaction';
	import CopyableAddress from '../../../common/CopyableAddress.svelte';

	export let dialog: HTMLDialogElement;
	export let childBounty: ChildBounty;

	$: transaction = $dotApi.tx.ChildBounties.claim_child_bounty({
		child_bounty_id: childBounty.id,
		parent_bounty_id: childBounty.parentBounty
	});

	async function submit() {
		const successful = await submitTransaction(transaction);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="CLAIM CHILD BOUNTY AWARD">
	<div class="space-y-8">
		<p class="p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
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
				<CopyableAddress address={childBounty.beneficiary} />
			</div>
		{/if}

		<div class="space-y-2">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</div>
	</div>

	<button on:click={submit} class="w-full md:w-fit mt-10 h-12 button-popup"> SIGN </button>
</Dialog>
