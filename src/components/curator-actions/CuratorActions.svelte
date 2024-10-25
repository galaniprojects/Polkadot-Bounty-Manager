<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bounty } from '../../types/bounty';
	import { activeAccount, activeAccountBounties, bounties, showAllBounties } from '../../stores';
	import type { ChildBounty } from '../../types/child-bounty';
	import { parseBounty, parseChildBounty } from '../../utils/common';
	import { firstValueFrom } from 'rxjs';
	import {
		hideLoadingDialog,
		showErrorDialog,
		showLoadingDialog
	} from '../../utils/loading-screen';
	import { goto } from '$app/navigation';
	import { getApi } from '../../utils/polkadot';
	import BountyCard from './BountyCard.svelte';

	onMount(async () => {
		if ($bounties.length !== 0) {
			return;
		}
		showLoadingDialog('Loading...');
		try {
			const api = await getApi();
			const parsedBounties: Bounty[] = [];

			// Query all bounties.
			const unparsedBounties = await firstValueFrom(api.query.bounties.bounties.entries());
			for (let unparsedBounty of unparsedBounties) {
				let index = Number((unparsedBounty[0].toHuman()! as string[])[0].replace(',', ''));
				parsedBounties.push(parseBounty(unparsedBounty[1].toHuman(), index));
			}

			parsedBounties.sort((bounty1, bounty2) => {
				if (bounty1.id > bounty2.id) {
					return -1;
				} else {
					return 1;
				}
			});

			// Query bounty description.
			const bountiesDescriptions = await firstValueFrom(
				api.query.bounties.bountyDescriptions.entries()
			);
			for (let desc of bountiesDescriptions) {
				let index = Number((desc[0].toHuman()! as string[])[0].replace(',', ''));
				let description = desc[1].toHuman() as string;
				let bounty = parsedBounties.find((bounty) => bounty.id == index);
				if (bounty) {
					bounty.description = description;
				}
			}

			// Query child bounties.
			let childBounties: ChildBounty[] = [];
			const unparsedChildBounties = await firstValueFrom(
				api.query.childBounties.childBounties.entries()
			);
			for (let childBounty of unparsedChildBounties) {
				let id = Number((childBounty[0].toHuman()! as string[])[1].replace(',', ''));
				childBounties.push(parseChildBounty(childBounty[1].toHuman(), id));
			}

			for (let i = 0; i < parsedBounties.length; i++) {
				parsedBounties[i].childBounties = childBounties.filter((childBounty) => {
					return childBounty.parentBounty === parsedBounties[i].id;
				});
			}

			// Query child bounty description.
			const childBountiesDescriptions = await firstValueFrom(
				api.query.childBounties.childBountyDescriptions.entries()
			);
			for (let desc of childBountiesDescriptions) {
				let index = Number((desc[0].toHuman()! as string[])[0].replace(',', ''));
				let description = desc[1].toHuman() as string;
				let childBounty = childBounties.find((childBounty) => childBounty.id == index);
				if (childBounty) {
					childBounty.description = description;
				}
			}

			bounties.set(parsedBounties);
		} catch (e) {
			console.error(e);
			showErrorDialog('Error while loading bounty details');
		}
		hideLoadingDialog();
	});
</script>

<div class="main bg-primary flex justify-center items-center overflow-x-hidden">
	<div class="w-full rounded-md px-3 py-6 sm:px-12 sm:pt-2 sm:pb-2">
		<div class="actions-container flex justify-between lg:px-8 lg:py-6 items-center rounded-md">
			<div class="hidden space-x-5 items-center lg:inline-flex">
				<h2 class="title mt-1 text-3xl text-white">Create new bounty here</h2>
				<span class="material-symbols-outlined text-white text-xl"> arrow_forward_ios </span>
			</div>
			<button
				on:click={() => {
					goto('/bounty-setup');
				}}
				class="border-accent bg-accent rounded-md w-full h-12 lg:max-w-64 text-white font-bold self-center"
				>NEW BOUNTY</button
			>
		</div>
		<div class="min-h-[70vh]">
			{#each $showAllBounties ? $bounties : $activeAccountBounties as bounty}
				<div>
					<BountyCard {bounty} />
				</div>
			{/each}
		</div>
		{#if $activeAccountBounties.length === 0}
			<div class="h-[70vh]">
				{#if $activeAccount}
					<div class="lg:mt-40 mt-10 flex justify-center text-white">
						Connected Address does not have any bounties or child bounties.
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.actions-container {
		background-color: #836fac40;
	}

	.title {
		font-family: 'Overpass';
	}
</style>
