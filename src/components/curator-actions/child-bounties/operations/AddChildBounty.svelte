<script lang="ts">
	import type { Bounty } from '../../../../types/bounty';
	import { convertDotToPlanck } from '../../../../utils/polkadot';
	import { activeAccount, dotApi } from '../../../../stores';
	import { onMount } from 'svelte';
	import { showErrorDialog } from '../../../../utils/loading-screen';
	import { isInteger } from '../../../../utils/common';
	import PolkaCoin from '../../../svg/PolkaCoin.svg';
	import Dialog from '../../../common/Dialog.svelte';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../../../utils/transaction';

	export let open = true;
	export let bounty: Bounty;

	let bountyValue: string | undefined;
	let bountyTitle = '';
	let bountyDescription = '';

	let fee = '-';

	onMount(async () => {
		await calculateFee();
	});

	async function submit() {
		open = false;
		if (bountyTitle.length === 0) {
			showErrorDialog('Bounty title is empty');
			return;
		}
		if (!bountyValue || !isInteger(bountyValue)) {
			showErrorDialog('Bounty value is invalid');
			return;
		}

		let value = convertDotToPlanck(BigInt(bountyValue));
		const transaction = $dotApi.tx.ChildBounties.add_child_bounty({
			parent_bounty_id: bounty.id,
			value,
			description: Binary.fromText(bountyTitle)
		});

		await submitTransaction(transaction);
	}

	async function calculateFee() {
		try {
			if (bountyValue && bountyTitle && $activeAccount) {
				let value = convertDotToPlanck(BigInt(bountyValue));
				const transaction = $dotApi.tx.ChildBounties.add_child_bounty({
					parent_bounty_id: bounty.id,
					value,
					description: Binary.fromText(bountyTitle)
				});
				fee = (await calculateTransactionFee(transaction)) + ' DOT';
			} else {
				fee = '-';
			}
		} catch {
			fee = '-';
		}
	}

	let inputTimeout = setTimeout(() => {}, 4000);
	function inputChange() {
		if (bountyValue && bountyTitle && $activeAccount) {
			fee = 'Calculating...';
			clearTimeout(inputTimeout);
			inputTimeout = setTimeout(() => void calculateFee(), 2000);
		} else {
			fee = '-';
		}
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
			{#if bounty.description}
				<span>{bounty.description}</span>
			{/if}
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
				placeholder="0"
				on:input={inputChange}
			/>
			<div class="border border-accent absolute right-9 top-9 transform -translate-y-1/2 h-6"></div>
			<div class="absolute right-2 top-[26px]"><img src={PolkaCoin} width="20" height="20" /></div>
		</section>
		<section>
			<p class="text-xs">Title</p>
			<input
				bind:value={bountyTitle}
				on:input={inputChange}
				class="border border-black rounded-[3px] bg-white pl-2 pt-1 h-10 w-full"
				placeholder="Child bounty name"
			/>
		</section>
		{#if false}
			<section class="scrollbar">
				<p class="text-xs">Description</p>
				<textarea
					bind:value={bountyDescription}
					on:input={inputChange}
					class="scrollbar border border-black rounded-[3px] bg-white h-40 w-full p-2"
					placeholder="Description"
				/>
			</section>
		{/if}
		<section class="mt-10">
			<p class="text-xs">Estimated basic fee:</p>
			<p>{fee}</p>
		</section>

		<button
			on:click={submit}
			class="{`w-full md:w-fit mt-10 h-12 ${isFormValid ? 'button-active' : 'cursor-not-allowed'}`}
		{!isFormValid ? 'button-active' : 'cursor-allowed'}"
			disabled={!isFormValid}>SIGN</button
		>
	</div>
</Dialog>
