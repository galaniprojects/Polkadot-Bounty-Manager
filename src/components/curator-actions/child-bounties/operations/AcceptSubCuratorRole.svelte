<script lang="ts">
	import { dotApi } from '../../../../stores';
	import Input from '../../../Input/Input.module.css';
	import type { ChildBounty } from '../../../../types/child-bounty';
	import { calculateDeposit } from '../../operations/calculateDeposit';
	import Dialog from '../../../common/Dialog.svelte';
	import { submitTransaction } from '../../../../utils/transaction';
	import Fee from '../../../Fee.svelte';
	import Deposit from '../../../Deposit.svelte';

	export let open = false;
	export let childBounty: ChildBounty;
	export let parentCurator: string | undefined;

	$: transaction = $dotApi.tx.ChildBounties.accept_curator({
		parent_bounty_id: childBounty.parentBounty,
		child_bounty_id: childBounty.id
	});

	let isToggled = false;

	async function acceptCuratorRole() {
		open = false;
		await submitTransaction(transaction);
	}

	function calculateChildBountyDeposit(parent: string | undefined, child: ChildBounty) {
		if (parent && parent === child.curator) {
			return 0n;
		}
		return calculateDeposit(child.fee);
	}
</script>

<Dialog bind:open title="ACCEPT SUB-CURATOR ROLE">
	<section class="space-y-5">
		<p class="p-1">
			#{childBounty.id}
			{childBounty.description ?? ''}
		</p>

		<div>
			<p class="text-xs">Accept Sub-curator role</p>
			<label class="flex justify-between items-start cursor-pointer">
				<span>I agree</span>
				<input type="checkbox" bind:checked={isToggled} class={Input.switch} />
			</label>
		</div>

		<div class="flex space-x-24">
			<div>
				<p class="text-xs">Estimated basic fee</p>
				<p><Fee {transaction} /></p>
			</div>
			<div>
				<p class="text-xs">Estimated deposit</p>
				<p>
					<Deposit getter={() => calculateChildBountyDeposit(parentCurator, childBounty)} />
				</p>
			</div>
		</div>
	</section>

	<button
		on:click={acceptCuratorRole}
		disabled={!isToggled}
		class="mt-10 h-12 button-popup
		{!isToggled ? 'opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>
