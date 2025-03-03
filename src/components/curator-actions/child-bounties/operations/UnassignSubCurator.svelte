<script lang="ts">
	import { dotApi } from '../../../../stores';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import Dialog from '../../../common/Dialog.svelte';
	import Input from '../../../Input/Input.module.css';
	import { submitTransaction } from '../../../../utils/transaction';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import CopyableAddress from '../../../common/CopyableAddress.svelte';
	import type { Bounty } from '../../../../types/bounty';

	export let open = true;
	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let extend = false;

	$: transaction = batchExtendBounty(
		extend && childBounty.parentBounty,
		$dotApi.tx.ChildBounties.unassign_curator({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		})
	);

	let isToggled = false;

	async function unassignSubCurator() {
		open = false;
		await submitTransaction(transaction, undefined, parentBounty);
	}
</script>

<Dialog bind:open title="UNASSIGN SUB-CURATOR">
	<div>
		<p class="p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
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
			<label class="flex justify-between items-start cursor-pointer">
				<span>Unassign anyway</span>
				<input type="checkbox" bind:checked={isToggled} class={Input.switch} />
			</label>
		</div>

		<label class="my-4 flex items-center justify-between cursor-pointer">
			<ExtendBountyLabel />
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
		</label>

		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</section>
	</div>

	<button
		on:click={unassignSubCurator}
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 button-popup
		{!isToggled ? 'opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
