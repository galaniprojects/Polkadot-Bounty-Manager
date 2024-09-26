<script lang="ts">
	import { ApiPromise, WsProvider } from '@polkadot/api';
	import AccordionItem from './AccordionItem.svelte';
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import type { ChildBounty } from '../../types/child-bounty';
	import { parseBounty, parseChildBounty } from '../../utils/common';
	import {
		hideLoadingDialog,
		showErrorDialog,
		showLoadingDialog
	} from '../../utils/loading-screen';

	let bounties: Bounty[] = [];

	onMount(async () => {
		showLoadingDialog('Loading...');
		try {
			const wsProvider = new WsProvider('ws://localhost:8000');
			const api = await ApiPromise.create({ provider: wsProvider });

			// Query all bounties.
			const unparsedBounties = await api.query.bounties.bounties.entries();
			for (let unparsedBounty of unparsedBounties) {
				let index = Number((unparsedBounty[0].toHuman() as unknown as any)[0].replace(',', ''));
				bounties.push(parseBounty(unparsedBounty[1].toHuman(), index));
			}

			bounties.sort((bounty1, bounty2) => {
				if (bounty1.id > bounty2.id) {
					return -1;
				} else {
					return 1;
				}
			});

			// Query bounty description.
			const bountiesDescriptions = await api.query.bounties.bountyDescriptions.entries();
			for (let desc of bountiesDescriptions) {
				let index = Number((desc[0].toHuman() as unknown as any)[0].replace(',', ''));
				let description = desc[1].toHuman() as string;
				let bounty = bounties.find((bounty) => bounty.id == index);
				if (bounty) {
					bounty.description = description;
				}
			}

			// Query child bounties.
			let childBounties: ChildBounty[] = [];
			const unparsedChildBounties = await api.query.childBounties.childBounties.entries();
			for (let childBounty of unparsedChildBounties) {
				let id = Number((childBounty[0].toHuman() as unknown as any)[1].replace(',', ''));
				childBounties.push(parseChildBounty(childBounty[1].toHuman(), id));
			}

			for (let i = 0; i < bounties.length; i++) {
				bounties[i].childBounties = childBounties.filter((childBounty) => {
					return childBounty.parentBounty === bounties[i].id;
				});
			}

			// Query child bounty description.
			const childBountiesDescriptions =
				await api.query.childBounties.childBountyDescriptions.entries();
			for (let desc of childBountiesDescriptions) {
				let index = Number((desc[0].toHuman() as unknown as any)[0].replace(',', ''));
				let description = desc[1].toHuman() as string;
				let childBounty = childBounties.find((childBounty) => childBounty.id == index);
				if (childBounty) {
					childBounty.description = description;
				}
			}

			bounties = bounties;
		} catch (e) {
			console.error(e);
			showErrorDialog('Error while loading bounty details');
		}
		hideLoadingDialog();
	});
</script>

<div class="main flex justify-center items-center overflow-x-hidden">
	<div class="rounded-md p-6">
		<div class="flex justify-between">
			<h2 class="title mt-1 font-bold text-lg text-white">Curator Actions</h2>
			<button
				on:click={() => {
					window.location = '/';
				}}
				class="border-accent bg-accent rounded-md px-2 h-9 text-white font-bold text-base"
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
