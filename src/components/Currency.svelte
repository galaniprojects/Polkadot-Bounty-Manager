<script lang="ts">
	import { get } from 'svelte/store';
	import { formatPlanckToDot } from '../utils/polkadot';
	import { blockChainMeta } from '../stores';

	export let value: bigint;
</script>

{formatPlanckToDot(value)}
{get(blockChainMeta).symbol}
