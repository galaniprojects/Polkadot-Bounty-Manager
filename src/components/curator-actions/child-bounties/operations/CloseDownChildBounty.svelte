<script lang="ts">
	import { dotApi } from '../../../../stores';
	import ToggleIcon from '../../../ToggleIcon.svelte';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import Dialog from '../../../common/Dialog.svelte';
	import { submitTransaction } from '../../../../utils/transaction';
	import Fee from '../../../Fee.svelte';

	export let open = false;
	export let childBounty: ChildBounty;

	$: transaction = $dotApi.tx.ChildBounties.close_child_bounty({
		child_bounty_id: childBounty.id,
		parent_bounty_id: childBounty.parentBounty
	});

	let isToggled = false;

	async function submit() {
		open = false;
		await submitTransaction(transaction);
	}
</script>

<Dialog bind:open title="Close Down Child Bounty">
	<section class="space-y-5">
		<div class="space-x-1">
			<span>#{childBounty.id}</span>
			<span>{childBounty.description ?? ''}</span>
		</div>
		<div class="m-y-4">
			<p>
				Only close a child bounty after communicating with the sub-curator and the projected
				beneficiary. The funds will be reallocated to the parent bounty.
			</p>
		</div>

		<div>
			<p class="text-xs">I understand</p>
			<div class="flex justify-between items-start">
				<p>Close down anyway</p>
				<ToggleIcon bind:checked={isToggled} />
			</div>
		</div>

		<div class="flex space-x-24">
			<div>
				<p class="text-xs">Estimated basic fee</p>
				<p><Fee {transaction} /></p>
			</div>
		</div>
	</section>

	<button
		on:click={submit}
		disabled={!isToggled}
		class="{`w-full md:w-fit mt-10 ${isToggled ? 'button-popup' : 'opacity-50 cursor-not-allowed'}`}
  {!isToggled ? 'button-popup' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
