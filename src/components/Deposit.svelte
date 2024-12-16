<script lang="ts">
	import { formatPlanckToDot } from '../utils/polkadot';

	export let getter: (() => bigint) | (() => Promise<bigint>);
	let deposit: bigint | null | undefined;

	$: {
		(async (input) => {
			try {
				deposit = undefined;

				const value = await input();

				const hasInputChangedMeanwhile = input !== getter;
				if (hasInputChangedMeanwhile) return;

				deposit = value;
			} catch (exception) {
				deposit = null;
				console.error(exception);
			}
		})(getter);
	}
</script>

{#if deposit === undefined}
	Calculating…
{:else if deposit === null}
	-
{:else}
	{formatPlanckToDot(deposit)} DOT
{/if}
