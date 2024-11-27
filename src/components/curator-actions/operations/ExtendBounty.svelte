<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { activeAccount, dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { formatDate } from '../../../utils/common';
	import Dialog from '../../common/Dialog.svelte';
	import { Binary } from 'polkadot-api';
	import { calculateTransactionFee, submitTransaction } from '../../../utils/transaction';

	export let open = false;
	export let bounty: Bounty;

	let fee = '-';
	let expiryDate: string;

	onMount(async () => {
		await calculateFee();
		if (bounty.expiryDate) {
			expiryDate = formatDate(bounty.expiryDate);
		} else {
			expiryDate = '-';
		}
	});

	async function submit() {
		open = false;
		const transaction = $dotApi.tx.Bounties.extend_bounty_expiry({
			bounty_id: bounty.id,
			remark: new Binary(new Uint8Array())
		});
		submitTransaction(transaction, 'Your bounty has been extended');
	}

	async function calculateFee() {
		if (!$activeAccount) {
			fee = '-';
			return;
		}
		try {
			const transaction = $dotApi.tx.Bounties.extend_bounty_expiry({
				bounty_id: bounty.id,
				remark: new Binary(new Uint8Array())
			});
			fee = await calculateTransactionFee(transaction);
		} catch (e) {
			console.error(e);
			fee = '-';
		}
	}
</script>

<Dialog bind:open title="EXTEND BOUNTY">
	<section class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			{#if bounty.description !== undefined}
				<span>{bounty.description}</span>
			{/if}
		</div>

		<div class="flex justify-between">
			<div>
				<p class="text-xs">Expiration date</p>
				<p>
					{expiryDate}
				</p>
			</div>

			<div>
				<p class="text-xs">Expiry Date after Extension</p>
				<span>
					{(() => {
						// TODO: Maybe get date from chain.
						var today = new Date();
						var afterNintyDays = new Date();
						afterNintyDays.setDate(today.getDate() + 90);
						return formatDate(afterNintyDays);
					})()}
				</span>
			</div>
		</div>

		<div>
			<p class="text-xs">Estimated Basic Fee</p>
			<p>{fee}</p>
		</div>
	</section>

	<button
		on:click={submit}
		class="w-full md:w-fit mt-10 h-12 px-10 rounded-md text-white bg-extendButtonBackground"
		>SIGN</button
	>
</Dialog>
