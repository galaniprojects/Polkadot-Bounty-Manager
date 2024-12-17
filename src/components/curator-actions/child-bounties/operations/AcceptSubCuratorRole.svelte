<script lang="ts">
	import { dotApi } from '../../../../stores';
	import ToggleIcon from '../../../ToggleIcon.svelte';
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

<Dialog bind:open title="ACCEPT SUB-CURATOR ROLE" backgroundColor="white" textColor="primary">
	<section class="space-y-5">
		<p class="p-1 text-white bg-childBountyGray">
			#{childBounty.id}
			{childBounty.description ?? ''}
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
		class="w-full md:w-fit mt-10 h-12 bg-childBountyGray basic-button
		{!isToggled ? 'basic-button opacity-50' : 'cursor-allowed'}"
	>
		SIGN
	</button>
</Dialog>

<style>
	.custom-toggle {
		--toggle-background: rgba(101, 112, 139, 0.5);
		--switch-background: theme('colors.white');
		--switch-checked-background: theme('colors.childBountyGray');
	}
</style>
