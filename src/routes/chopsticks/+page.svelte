<script lang="ts">
	import '../../app.css';
	import { nodeEndpoint, showAllBounties, showAllCuratorOptions } from '../../stores';
	import { initializeApi } from '../../utils/initializeApi';
	import TestBar from '../../components/TestBar.svelte';
	import { onMount } from 'svelte';
	import { createClient } from 'polkadot-api';
	import { getWsProvider } from 'polkadot-api/ws-provider/web';
	import { PUBLIC_HIDE_TEST_BAR } from '$env/static/public';
	import { goto } from '$app/navigation';

	let days: number = 1;
	let hours = 1;
	let mins = 1;
	let current = 0;
	$: target = String(current + (((days * 24 + hours) * 60 + mins) * 60) / 6);
	$: client = createClient(getWsProvider($nodeEndpoint));

	let nodeEndpointInput = '';

	function updateCurrentBlock() {
		(async () => {
			current = (await client.getBlockHeader()).number;
		})();
	}

	onMount(async () => {
		if (PUBLIC_HIDE_TEST_BAR.toLocaleLowerCase() !== 'false') {
			await goto('/404');
			return;
		}
		updateCurrentBlock();
		const interval = setInterval(updateCurrentBlock, 6000);

		return new Promise(() => {
			clearInterval(interval);
		});
	});

	async function sleep() {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	async function goToBlock(unsafeBlockHeight: number) {
		await client._request('dev_newBlock', [{ count: 1, unsafeBlockHeight }]);
		updateCurrentBlock();
	}

	async function fastForward(blocks: number) {
		const { number } = await client.getBlockHeader();
		await goToBlock(number + blocks);
	}

	async function fastForwardDays() {
		await fastForward((days * 24 * 60 * 60) / 6 - 1);
		await sleep();
		await fastForward(1);
	}

	async function fastForwardHours() {
		await fastForward((hours * 60 * 60) / 6 - 1);
		await sleep();
		await fastForward(1);
	}

	async function fastForwardMinutes() {
		await fastForward((mins * 60) / 6 - 1);
		await sleep();
		await fastForward(1);
	}

	async function fastForwardBlocks() {
		await fastForward(1);
	}

	async function handleGoToBlock() {
		const targetNumber = Number(target.replace(/\D/g, ''));
		await goToBlock(targetNumber - 1);
		await sleep();
		await fastForward(1);
	}

	async function changeEndpoint() {
		nodeEndpoint.set(nodeEndpointInput);
		sessionStorage.setItem('node', nodeEndpointInput);
		await initializeApi([nodeEndpointInput]);
	}
</script>

<div class="bg-backgroundBounty py-40 md:px-40">
	<div class="ml-5">
		<TestBar />
	</div>
	<h1 class="m-5 text-2xl font-bold">Fast Forward</h1>
	<div class="flex m-5 gap-3">
		<input bind:value={days} class="border pt-1 pl-2 w-1/4 rounded-md min-w-40" />
		<button on:click={fastForwardDays} class="button-active min-w-40">DAYS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md min-w-40" bind:value={hours} />
		<button on:click={fastForwardHours} class="button-active min-w-40">HOURS</button>
	</div>

	<div class="flex m-5 gap-3">
		<input class="border pt-1 pl-2 w-1/4 rounded-md min-w-40" bind:value={mins} />
		<button on:click={fastForwardMinutes} class="button-active min-w-40">MINUTES</button>
	</div>

	<div class="flex m-5 gap-3 items-center">
		<button on:click={fastForwardBlocks} class="button-active min-w-40">1 BLOCK </button>
		<p>(*6 seconds)</p>
	</div>

	<div class="m-5 gap-3">
		<p class="text-sm block">{current} is the current block</p>
		<input class="border pt-1 pl-2 w-1/4 rounded-md min-w-40" bind:value={target} />
		<button on:click={handleGoToBlock} class="button-active min-w-40">TO BLOCK</button>
	</div>

	<hr class="border-gray mt-5 mb-1 w-1/2" />

	<div class="m-5 gap-5">
		<p class="text-sm">Current node endpoint: {$nodeEndpoint}</p>
		<input class="border pt-1 pl-2 w-1/4 rounded-md min-w-40" bind:value={nodeEndpointInput} />
		<button on:click={changeEndpoint} class="mx-5 button-active min-w-40">Change </button>
	</div>
	<a class="button-active mx-5" href="/curator-actions">=> Curator Actions</a>

	<div class="mt-5 sm:flex flex-col sm:flex-row">
		<label class="flex gap-3 mx-4">
			<input type="checkbox" bind:checked={$showAllBounties} />
			<p>all bounties</p>
		</label>
		<label class="flex gap-3">
			<input type="checkbox" bind:checked={$showAllCuratorOptions} />
			<p>all options</p>
		</label>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
