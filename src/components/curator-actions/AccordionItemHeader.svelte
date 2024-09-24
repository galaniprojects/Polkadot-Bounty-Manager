<script lang="ts">
	import LogoPolkassembly from '../svg/LogoPolkassembly.svelte';
	import LogoTreasuryIcon from '../svg/LogoTreasuryIcon.svelte';
	import LogoSubscan from '../svg/LogoSubscan.svelte';
	import type { Bounty } from '../../types/bounty';
	import { onMount } from 'svelte';
	import { WsProvider, ApiPromise } from '@polkadot/api';

	let bountyDetails = {
		title: 'Community Event Activity Bounty'
	};

	export let bounty: Bounty;

	onMount(async () => {
		// Query all bounties.
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await ApiPromise.create({ provider: wsProvider });
		let bountyDescription = (
			await api.query.bounties.bountyDescriptions(bounty.id)
		).toHuman() as string;
		bountyDetails.title = bountyDescription;
		bounty.description = bountyDescription;
	});
</script>

<section class="text-white max-h-20 px-5 lg:px-10 my-4">
	<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center">
		<span class="text-xl lg:text-2xl">
			#{`${bounty.id}`}
			{`${bountyDetails.title}`}
		</span>

		<div class="flex gap-2 mt-3 lg:mt-0">
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoTreasuryIcon />
			</button>
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoPolkassembly />
			</button>
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoSubscan />
			</button>
		</div>
	</div>

	<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:pl-12 mt-3 lg:mt-0">
		<section class="flex space-x-1 mr-0 lg:mr-4">
			<p>Proposer:</p>
			<p>JDoe_Chain</p>
		</section>

		<section class="flex space-x-1 mt-1 lg:mt-0 lg:ml-7">
			<p>Created:</p>
			<p>8th August 2024</p>
		</section>

		<section class="flex space-x-1 mt-1 lg:mt-0 lg:ml-40">
			<p>Expiration date:</p>
			<p>27th September 2024</p>
		</section>
	</div>
</section>
