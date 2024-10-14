<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { onMount } from 'svelte';
	import { WsProvider, ApiPromise } from '@polkadot/api';
	import { truncateString } from '../../utils/common';

	export let bounty: Bounty;
	export let status: string;

	onMount(async () => {
		// Query all bounties.
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await ApiPromise.create({ provider: wsProvider });
		let bountyDescription = (
			await api.query.bounties.bountyDescriptions(bounty.id)
		).toHuman() as string;
		bounty.description = bountyDescription;
	});
</script>

<section class="text-white max-h-20 px-5 lg:px-10 my-4">
	<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center">
		<span class="text-xl lg:text-2xl">
			#{`${bounty.id}`}
			{`${bounty.description}`}
		</span>
	</div>

	<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:pl-12 lg:mt-0">
		<section class="flex space-x-1 mr-0 lg:w-52">
			<p>Proposer:</p>
			<p>{truncateString(bounty.proposer, 8)}</p>
		</section>
	</div>
</section>
