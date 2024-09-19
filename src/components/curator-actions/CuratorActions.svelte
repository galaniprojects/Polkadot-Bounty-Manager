<script lang="ts">
	import { ApiPromise, WsProvider } from '@polkadot/api';
	import AccordionItem from './AccordionItem.svelte';
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { parseBounty } from '../../utils/common';

	let bounties: Array<Bounty> = [];
	let s = [1, 2, 3, 4, 5];

	onMount(async () => {
		// Query all bounties.
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await ApiPromise.create({ provider: wsProvider });
		let bountyNumber = Number((await api.query.bounties.bountyCount()).toString());
		for (let index = 0; index < bountyNumber; index++) {
			const bounty: Bounty | null = (
				await api.query.bounties.bounties(index)
			).toHuman() as unknown as Bounty;
			if (bounty != null) {
				bounties.push(parseBounty(bounty, index));
				bounties = bounties;
			}
		}
		console.log(bounties);
	});
</script>

<div class="main flex justify-center items-center">
	<div class="rounded-md p-6">
		<div class="flex justify-between">
			<h2 class="title mt-1 font-bold text-lg text-white">Curator Actions</h2>
			<button class="border-accent bg-accent rounded-md px-2 h-9 text-white font-bold text-base"
				>CREATE NEW BOUNTY</button
			>
		</div>

		{#each bounties as bounty}
			<div>
				<AccordionItem {bounty} />
			</div>
		{/each}
	</div>
</div>

<style>
	.main {
		@apply border border-y-accent border-x-0;
		background: linear-gradient(180deg, #311033 0%, #6c003d 100%);
	}

	.title {
		font-family: 'Secular One';
	}
</style>
