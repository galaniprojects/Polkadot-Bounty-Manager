<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { dotApi } from '../../../stores';
	import { onMount } from 'svelte';
	import { formatDate } from '../../../utils/common';
	import Dialog from '../../common/Dialog.svelte';
	import { Binary } from 'polkadot-api';
	import { submitTransaction } from '../../../utils/transaction';
	import { extendedExpiry } from '../../../utils/batchExtendBounty';
	import Fee from '../../Fee.svelte';

	export let dialog: HTMLDialogElement;
	export let bounty: Bounty;

	$: transaction = $dotApi.tx.Bounties.extend_bounty_expiry({
		bounty_id: bounty.id,
		remark: new Binary(new Uint8Array())
	});

	let expiryDate: string;

	onMount(() => {
		if (bounty.expiryDate) {
			expiryDate = formatDate(bounty.expiryDate);
		} else {
			expiryDate = '-';
		}
	});

	async function submit() {
		const successful = await submitTransaction(transaction, undefined, bounty);
		if (successful) {
			dialog.close();
		}
	}
</script>

<Dialog bind:dialog title="EXTEND BOUNTY">
	<section class="space-y-10">
		<div class="space-x-1">
			<span>#{bounty.id}</span>
			<span>{bounty.description ?? ''}</span>
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
				<span>{extendedExpiry()}</span>
			</div>
		</div>

		<div>
			<p class="text-xs">Estimated basic fee</p>
			<p><Fee {transaction} /></p>
		</div>
	</section>

	<button
		on:click={submit}
		class="w-full md:w-fit mt-10 h-12 px-10 rounded-md text-white bg-extendButtonBackground"
	>
		SIGN
	</button>
</Dialog>
