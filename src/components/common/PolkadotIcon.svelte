<script lang="ts">
	import { polkadotIcon } from '@polkadot/ui-shared';

	export let address: string;
</script>

<svg
	width="100%"
	height="100%"
	viewBox="0 0 64 64"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
>
	{#each polkadotIcon(address, { isAlternative: false }) as icon (icon)}
		<circle cx={icon.cx} cy={icon.cy} fill={icon.fill} r={icon.r}></circle>
	{/each}
</svg>
