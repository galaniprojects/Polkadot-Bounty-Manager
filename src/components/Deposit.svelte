<script lang="ts">
	import { formatPlanckToDot } from '../utils/polkadot';

	export let getter: (() => bigint) | (() => Promise<bigint>);
	let deposit = '-';

	$: {
		(async (input) => {
			try {
				deposit = 'Calculating…';

				const value = await input();

				const hasInputChangedMeanwhile = input !== getter;
				if (hasInputChangedMeanwhile) return;

				deposit = `${formatPlanckToDot(value)} DOT`;
			} catch (exception) {
				deposit = '-';
				console.error(exception);
			}
		})(getter);
	}
</script>

{deposit}
