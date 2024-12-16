<script lang="ts">
	import { type AnyTransaction, calculateTransactionFee } from '../utils/transaction';
	import { activeAccount } from '../stores';

	export let transaction: AnyTransaction | undefined;
	let pending: boolean;
	let fee: string | undefined;

	$: {
		pending = Boolean(transaction);
		if (!$activeAccount || !transaction) {
			fee = undefined;
		} else {
			(async (oldTransaction) => {
				const value = await calculateTransactionFee(oldTransaction);
				pending = false;

				const transactionHasChangedMeanwhile = oldTransaction !== transaction;
				if (transactionHasChangedMeanwhile) return;

				fee = value;
			})(transaction);
		}
	}
</script>

{#if fee === undefined}
	–
{:else if pending}
	Calculating…
{:else if fee}
	{fee} DOT
{/if}
