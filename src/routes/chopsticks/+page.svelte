<script lang="ts">
	import '../../app.css';
	import { api, nodeEndpoint } from '../../stores';
	import { goto } from '$app/navigation';
	import { getApi } from '../../utils/polkadot';
	import { firstValueFrom } from 'rxjs';

	let days: number = 1;
	let hours = 1;
	let mins = 1;
	let blocks = 1;

	let nodeEndpointInput = '';

	async function fastForward(blocks: number) {
		const api = await getApi();
		let number = (await firstValueFrom(api.rpc.chain.getHeader())).number.toNumber();
		await firstValueFrom(
			api.rpc('dev_newBlock', {
				count: 1,
				unsafeBlockHeight: number + blocks
			})
		);
	}

	async function fastForwardDays() {
		fastForward((days * 24 * 60 * 60) / 6 - 3);
	}

	async function fastForwardHours() {
		fastForward((hours * 60 * 60) / 6 - 3);
	}

	async function fastForwardMinutes() {
		fastForward((mins * 60) / 6 - 3);
	}

	async function fastForwardBlocks() {
		fastForward(blocks);
	}

	async function changeEndpoint() {
		nodeEndpoint.set(nodeEndpointInput);
		api.set(undefined);
	}
</script>

<div class="p-40">
	<h1 class="m-5 text-2xl font-bold">Fast Forward</h1>
	<div class="flex m-5 gap-3">
		<input bind:value={days} class="border pt-1 pl-2 w-1/4 rounded-md bg-white" />
		<button on:click={fastForwardDays} class="button-active min-w-40">DAYS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white" bind:value={hours} />
		<button on:click={fastForwardHours} class="button-active min-w-40">HOURS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white" bind:value={mins} />
		<button on:click={fastForwardMinutes} class="button-active min-w-40">MINUTES</button>
	</div>

	<div class="flex m-5 gap-3 items-center">
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white" bind:value={blocks} />
		<button on:click={fastForwardBlocks} class="button-active min-w-40">BLOCKS </button>
		<p>(*6 seconds)</p>
	</div>

	<hr class="border-gray mt-5 mb-1 w-1/2" />

	<div class="m-5 gap-5">
		<p class="text-sm">Current node endpoint: {$nodeEndpoint}</p>
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white" bind:value={nodeEndpointInput} />
		<button on:click={changeEndpoint} class="mx-5 button-active min-w-40">Change </button>
	</div>
	<button class="button-active mx-5" on:click={() => goto('/curator-actions')}>
		=> Curator Actions</button
	>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
