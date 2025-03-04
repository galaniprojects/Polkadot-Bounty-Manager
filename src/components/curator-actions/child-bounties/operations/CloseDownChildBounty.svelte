<script lang="ts">
	import { dotApi } from '../../../../stores';
	import Input from '../../../Input/Input.module.css';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import Dialog from '../../../common/Dialog.svelte';
	import { submitTransaction } from '../../../../utils/transaction';
	import { batchExtendBounty } from '../../../../utils/batchExtendBounty';
	import ExtendBountyLabel from '../../../ExtendBountyLabel.svelte';
	import Fee from '../../../Fee.svelte';
	import type { Bounty } from '../../../../types/bounty';

	export let dialog: HTMLDialogElement;
	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let extend = false;

	$: transaction = batchExtendBounty(
		extend && childBounty.parentBounty,
		$dotApi.tx.ChildBounties.close_child_bounty({
			child_bounty_id: childBounty.id,
			parent_bounty_id: childBounty.parentBounty
		})
	);

	let isToggled = false;

	async function submit() {
		const successful = await submitTransaction(transaction, undefined, parentBounty);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="Close Down Child Bounty">
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
			<label class="flex justify-between items-start cursor-pointer">
				<span>Close down anyway</span>
				<input type="checkbox" bind:checked={isToggled} class={Input.switch} />
			</label>
		</div>

		<label class="flex items-center justify-between cursor-pointer">
			<ExtendBountyLabel />
			<input type="checkbox" bind:checked={extend} class={Input.switch} />
		</label>

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
		class="{`w-full md:w-fit h-12 mt-10 ${isToggled ? 'button-popup' : 'opacity-50 cursor-not-allowed'}`}
  {!isToggled ? 'button-popup' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
