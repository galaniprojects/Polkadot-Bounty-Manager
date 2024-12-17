<script lang="ts">
	import { type AnyTransaction } from '../utils/transaction';
	import { activeAccount } from '../stores';
	import { formatPlanckToDot } from '../utils/polkadot';

	export let transaction: AnyTransaction | undefined;
	let fee = '-';

	$: {
		(async (oldTransaction) => {
			fee = '-';
			if (!$activeAccount || !oldTransaction) return;

			fee = 'Calculating…';
			const value = await oldTransaction.getPaymentInfo($activeAccount.address);

			const transactionHasChangedMeanwhile = oldTransaction !== transaction;
			if (transactionHasChangedMeanwhile) return;

			fee = `${formatPlanckToDot(value.partial_fee)} DOT`;
		})(transaction);
	}
</script>

{fee}
