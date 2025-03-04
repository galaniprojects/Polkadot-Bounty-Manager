<script lang="ts">
	import Currency from './Currency.svelte';

	export let getter: (() => bigint) | (() => Promise<bigint>);
	let deposit: bigint | string = '-';

	$: getDeposit(getter).catch(() => {});

	async function getDeposit(input: typeof getter) {
		try {
			deposit = 'Calculating…';

			const value = await input();

			const hasInputChangedMeanwhile = input !== getter;
			if (hasInputChangedMeanwhile) return;

			deposit = value;
		} catch (exception) {
			deposit = '-';
			console.error(exception);
		}
	}
</script>

{#if typeof deposit === 'string'}
	{deposit}
{:else}
	<Currency value={deposit} />
{/if}
