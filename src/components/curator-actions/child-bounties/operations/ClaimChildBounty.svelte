<script lang="ts">
	import Dialog from '../../../common/Dialog.svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { dotApi } from '../../../../stores';
	import Fee from '../../../Fee.svelte';
	import { submitTransaction } from '../../../../utils/transaction';
	import CopyableAddress from '../../../common/CopyableAddress.svelte';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import ToggleIcon from '../../../ToggleIcon.svelte';

	export let open = true;
	export let childBounty: ChildBounty;
	let extend = false;

	$: transaction = batchExtendBounty(
		extend && childBounty.parentBounty,
		$dotApi.tx.ChildBounties.claim_child_bounty({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		})
	);

	async function submit() {
		open = false;
		await submitTransaction(transaction, 'Child bounty successfully claimed');
	}
</script>

<Dialog bind:open title="CLAIM CHILD BOUNTY AWARD" backgroundColor="white" textColor="primary">
	<div class="space-y-8">
		<p class="p-1 text-white bg-curatorMainBackground">
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

		<label class="space-y-2 flex gap-4 items-center cursor-pointer">
			<ToggleIcon bind:checked={extend} inverted />
			<ExtendBountyLabel />
		</label>

		<div class="space-y-2">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</div>
	</div>

	<button
		on:click={submit}
		class="w-full md:w-fit mt-10 h-12 basic-button bg-curatorMainBackground"
	>
		SIGN
	</button>
</Dialog>
