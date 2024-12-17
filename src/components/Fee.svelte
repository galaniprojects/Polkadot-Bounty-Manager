<script lang="ts">
	import { type AnyTransaction, calculateTransactionFee } from '../utils/transaction';
	import { activeAccount } from '../stores';

	export let transaction: AnyTransaction | undefined;
	let fee = '-';

	$: {
		(async (oldTransaction) => {
			fee = '-';
			if (!$activeAccount || !oldTransaction) return;

			fee = 'Calculating…';
			const value = await calculateTransactionFee(oldTransaction);

			const transactionHasChangedMeanwhile = oldTransaction !== transaction;
			if (transactionHasChangedMeanwhile) return;

			fee = `${value} DOT`;
		})(transaction);
	}
</script>

{fee}
