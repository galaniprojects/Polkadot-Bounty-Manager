<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { dotApi } from '../../../stores';
	import Deposit from '../../Deposit.svelte';
	import { showErrorDialog } from '../../../utils/loading-screen';
	import Input from '../../../components/Input/Input.module.css';
	import Dialog from '../../common/Dialog.svelte';
	import { submitTransaction } from '../../../utils/transaction';
	import Fee from '../../Fee.svelte';
	import { calculateDeposit } from './calculateDeposit';

	export let open = false;
	export let bounty: Bounty;

	$: transaction = $dotApi.tx.Bounties.accept_curator({
		bounty_id: bounty.id
	});

	let isToggled = false;

	async function acceptCuratorRole() {
		open = false;
		const result = await submitTransaction(transaction);

		if (result === undefined) {
			showErrorDialog('Internal error');
		}
	}
</script>

<Dialog bind:open title="ACCEPT CURATOR ROLE">
	<section class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
		</div>

		<div>
			<p class="text-xs">Accept curator role</p>
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
			{#if bounty.fee}
				<div>
					<p class="text-xs">Estimated deposit</p>
					<p><Deposit getter={() => calculateDeposit(bounty.fee)} /></p>
				</div>
			{/if}
		</div>
	</section>

	<button
		on:click={acceptCuratorRole}
		disabled={!isToggled}
		class="w-full md:w-fit mt-10 h-12 button-popup {isToggled
			? 'button-popup'
			: 'opacity-50 cursor-not-allowed'}"
	>
		SIGN
	</button>
</Dialog>
