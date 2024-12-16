<script lang="ts">
	import '../../app.css';
	import { dotApi, nodeEndpoint, showAllBounties, showAllCuratorOptions } from '../../stores';
	import TestBar from '../../components/TestBar.svelte';
	import { get } from 'svelte/store';
	import { createClient } from 'polkadot-api';
	import { getWsProvider } from 'polkadot-api/ws-provider/web';
	import { createTypedApi } from '../../utils/polkadot';

	let days: number = 1;
	let hours = 1;
	let mins = 1;

	let nodeEndpointInput = '';

	async function fastForward(blocks: number) {
		const sdkProvider = getWsProvider(get(nodeEndpoint));
		const sdkClient = createClient(sdkProvider);
		const { number } = await sdkClient.getBlockHeader();
		await sdkClient._request('dev_newBlock', [
			{
				count: 1,
				unsafeBlockHeight: number + blocks
			}
		]);
	}

	async function fastForwardDays() {
		await fastForward((days * 24 * 60 * 60) / 6 - 3);
	}

	async function fastForwardHours() {
		await fastForward((hours * 60 * 60) / 6 - 3);
	}

	async function fastForwardMinutes() {
		await fastForward((mins * 60) / 6 - 3);
	}

	async function fastForwardBlocks() {
		await fastForward(1);
	}

	function changeEndpoint() {
		nodeEndpoint.set(nodeEndpointInput);
		sessionStorage.setItem('node', nodeEndpointInput);
		dotApi.set(createTypedApi([nodeEndpointInput]));
	}
</script>

<div class="bg-primary py-40 md:px-40">
	<div class="ml-5">
		<TestBar />
	</div>
	<h1 class="m-5 text-2xl font-bold">Fast Forward</h1>
	<div class="flex m-5 gap-3">
		<input bind:value={days} class="border pt-1 pl-2 w-1/4 rounded-md bg-white min-w-40" />
		<button on:click={fastForwardDays} class="button-active min-w-40">DAYS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white min-w-40" bind:value={hours} />
		<button on:click={fastForwardHours} class="button-active min-w-40">HOURS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md bg-white min-w-40" bind:value={mins} />
		<button on:click={fastForwardMinutes} class="button-active min-w-40">MINUTES</button>
	</div>

	<div class="flex m-5 gap-3 items-center">
		<button on:click={fastForwardBlocks} class="button-active min-w-40">1 BLOCK </button>
		<p>(*6 seconds)</p>
	</div>

	<hr class="border-gray mt-5 mb-1 w-1/2" />

	<div class="m-5 gap-5 text-white">
		<p class="text-sm">Current node endpoint: {$nodeEndpoint}</p>
		<input
			class="border pt-1 pl-2 w-1/4 rounded-md bg-white min-w-40"
			bind:value={nodeEndpointInput}
		/>
		<button on:click={changeEndpoint} class="mx-5 button-active min-w-40">Change </button>
	</div>
	<a class="button-active mx-5" href="/curator-actions">=> Curator Actions</a>

	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<p class="text-white">all bounties</p>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<p class="text-white">all options</p>
		</label>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
