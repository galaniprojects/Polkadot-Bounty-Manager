<script lang="ts">
	import type { Bounty } from '../../../../types/bounty';
	import { convertFormattedDotToPlanck } from '../../../../utils/polkadot';
	import { dotApi } from '../../../../stores';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { isPositiveNumber } from '../../../../utils/common';
	import PolkaCoin from '../../../svg/PolkaCoin.svg';
	import Dialog from '../../../common/Dialog.svelte';
	import { Binary } from 'polkadot-api';
	import { maybeTransaction, submitTransaction } from '../../../../utils/transaction';
	import Fee from '../../../Fee.svelte';

	export let open = true;
	export let bounty: Bounty;

	let bountyValue = '';
	let bountyTitle = '';

	$: transaction = maybeTransaction(
		() =>
			bountyTitle &&
			isPositiveNumber(bountyValue) &&
			$dotApi.tx.ChildBounties.add_child_bounty({
				parent_bounty_id: bounty.id,
				value: convertFormattedDotToPlanck(bountyValue),
				description: Binary.fromText(bountyTitle)
			})
	);

	async function submit() {
		open = false;
		if (bountyTitle.length === 0) {
			showErrorDialog('Bounty title is empty');
			return;
		}
		if (!isPositiveNumber(bountyValue)) {
			showErrorDialog('Bounty value is invalid');
			return;
		}
		if (!transaction) {
			showErrorDialog('An internal error has happened');
			return;
		}

		await submitTransaction(transaction);
	}

	$: isFormValid = bountyValue && bountyValue.trim() !== '' && bountyTitle.trim() !== '';
</script>

<Dialog
	bind:open
	title="ADD NEW CHILD BOUNTY"
	backgroundColor="childBountyBackground"
	textColor="primary"
>
	<div class="space-y-5">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
		</div>
		<p>
			Please use a descriptive title and add info about the task and beneficiary in the description.
		</p>
	</div>

	<div class="flex flex-col gap-6 mt-6">
		<section class="relative">
			<p class="text-xs">Value</p>
			<input
				bind:value={bountyValue}
				class="border border-black pt-1 pl-2 rounded-[3px] bg-white h-10 w-full"
				placeholder="00.00"
			/>
			<div class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"></div>
			<div class="absolute right-2 top-[26px]">
				<img src={PolkaCoin} width="20" height="20" alt="PolkaCoin" />
			</div>
		</section>
		<section>
			<p class="text-xs">Title</p>
			<input
				bind:value={bountyTitle}
				class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="Child bounty name"
			/>
		</section>
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p><Fee {transaction} /></p>
		</section>

		<button
			on:click={submit}
			class="{`w-full md:w-fit mt-10 h-12 ${isFormValid ? 'button-active' : 'cursor-not-allowed'}`}
		{!isFormValid ? 'button-active' : 'cursor-allowed'}"
			disabled={!isFormValid}
		>
			SIGN
		</button>
	</div>
</Dialog>
