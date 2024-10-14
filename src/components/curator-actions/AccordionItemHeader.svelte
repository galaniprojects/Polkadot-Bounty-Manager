<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import { onMount } from 'svelte';
	import { WsProvider, ApiPromise } from '@polkadot/api';
	import { truncateString } from '../../utils/common';
	import LogoSubsquareWhite from '../svg/curator-actions-logo/LogoSubsquareWhite.svelte';
	import LogoTreasuryWhite from '../svg/curator-actions-logo/LogoTreasuryWhite.svelte';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logo/LogoPolkassemblyWhite.svelte';
	import LogoSubscanWhite from '../svg/curator-actions-logo/LogoSubscanWhite.svelte';

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

		<!-- <div class="hidden lg:flex gap-2 mt-3 lg:mt-0">
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoTreasuryWhite />
			</button>
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoPolkassemblyWhite />
			</button>
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoSubscanWhite />
			</button>
			<button class="w-5 h-5 lg:w-6 lg:h-6">
				<LogoSubsquareWhite />
			</button>
		</div> -->
	</div>

	<div class="flex flex-col lg:flex-row lg:justify-start text-xs lg:pl-12 lg:mt-0">
		<section class="flex space-x-1 mr-0 lg:w-52">
			<p>Proposer:</p>
			<p>{truncateString(bounty.proposer, 8)}</p>
		</section>

		<!-- <section class="hidden lg:flex space-x-1 mr-0 lg:mr-4">
			<p>Status:</p>
			<p>{status}</p>
		</section> -->

		<!-- <section class="hidden lg:flex space-x-1 mt-1 lg:mt-0 lg:w-64">
			<p>Created:</p>
			<p>8th August 2024</p>
		</section>

		<section class="hidden lg:flex space-x-1 mt-1 lg:mt-0">
			<p>Expiration date:</p>
			<p>27th September 2024</p>
		</section> -->
	</div>
</section>
