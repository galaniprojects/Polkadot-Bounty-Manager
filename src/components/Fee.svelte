<script lang="ts">
	import { type AnyTransaction } from '../utils/transaction';
	import { activeAccount } from '../stores';
	import Currency from './Currency.svelte';

	export let transaction: AnyTransaction | undefined;
	let fee: string | bigint = '-';

	$: getFee(transaction).catch(() => {});

	async function getFee(oldTransaction: typeof transaction) {
		fee = '-';
		if (!$activeAccount || !oldTransaction) return;

		fee = 'Calculating…';
		const value = await oldTransaction.getPaymentInfo($activeAccount.address);

		const transactionHasChangedMeanwhile = oldTransaction !== transaction;
		if (transactionHasChangedMeanwhile) return;

		fee = value.partial_fee;
	}
</script>

{#if typeof fee === 'string'}
	{fee}
{:else}
	<Currency value={fee} />
{/if}
