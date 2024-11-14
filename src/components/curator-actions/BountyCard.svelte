<script lang="ts">
	import { BountyStatus, type Bounty } from '../../types/bounty';
	import { convertPlanckToDot } from '../../utils/polkadot';
	import ChildBountiesSection from './child-bounties/ChildBountiesSection.svelte';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import BountyOperations from './BountyOperations.svelte';
	import ExternalLinks from './ExternalLinks.svelte';
	import { parse } from 'marked';
	import DOMPurify from 'dompurify';
	import BountyDescription from './BountyDescription.svelte';
	import CopyableAddress from '../common/CopyableAddress.svelte';
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import AwardBounty from './operations/AwardBounty.svelte';
	import { formatDate } from '../../utils/common';

	export let bounty: Bounty;

	let detailsExpanded = false;
	export let expanded: boolean;

	let description: string | undefined;
	let awardBountyDialogOpen = false;

	$: if (expanded) {
		const bountyId = bounty.id;

		try {
			const url = `https://polkadot.subsquare.io/api/treasury/bounties/${bountyId}`;
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						return;
					}
					return response.json();
				})
				.then(async (data) => {
					try {
						description = await parse(data.content);
					} catch {
						console.error('no description found, skip.');
					}
				});
		} catch {
			description = undefined;
		}
	}

	function expandBounty() {
		expanded = !expanded;
	}

	function handleMoreDetailsToggleClick() {
		detailsExpanded = !detailsExpanded;
	}
</script>

<div class="bg-curatorMainBackground overflow-hidden rounded-md my-6">
	<!-- Header Section -->
	<BountyCardHeader {bounty} bind:isParentExpanded={expanded}></BountyCardHeader>

	<!-- Content Section -->
	{#if expanded}
		<!-- Desktop design -->
		<div class="bg-curatorCarousel xl:pt-6 text-white w-full p-0 sm:p-3">
			<div class="hidden lg:flex lg:flex-col gap-3 justify-start lg:ml-7">
				<section class="flex flex-col lg:flex lg:flex-row lg:justify-between">
					<section class="flex flex-col lg:flex-row">
						<div class="lg:w-[250px] xl:w-[490px]">
							<p class="text-xs">Value</p>
							<p class="text-2xl"><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
						</div>

						<div class="mt-4 lg:mt-0 lg:w-32 xl:w-40">
							<p class="text-xs">Curator Fee</p>
							<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
						</div>
						{#if bounty.curator}
							<div class="mt-4 lg:mt-0">
								<p class="text-xs">Curator</p>
								<CopyableAddress address={bounty.curator} />
							</div>
						{/if}
						{#if bounty.beneficiary}
							<div class="mt-4 lg:mt-0">
								<p class="text-xs">Beneficiary</p>
								<CopyableAddress address={bounty.beneficiary} />
							</div>
						{/if}
					</section>
					<div class="flex justify-center lg:mr-12 2xl:mr-44">
						<ExternalLinks dimension={6} bountyId={bounty.id} />
					</div>
				</section>
				<section class="flex-col lg:flex lg:flex-row lg:justify-between">
					<section class="flex justify-start">
						{#if description}
							<div class=" text-xs lg:w-[250px] xl:w-[490px] pr-3">
								<BountyDescription description={DOMPurify.sanitize(description)} />
							</div>
						{/if}
						<div class="flex justify-between lg:space-x-8 xl:space-x-16">
							{#if bounty.expiryDate != undefined}
								<section class="flex-col text-start">
									<p class="text-xs">Expiration date</p>
									<p>{formatDate(bounty.expiryDate)}</p>
								</section>
							{/if}
						</div>
					</section>
				</section>
			</div>
		</div>

		<!-- Mobile design -->
		<div class="lg:hidden">
			<div class="grid space-y-5 bg-curatorCarousel px-[10px] py-5 text-white">
				<div>
					<p class="text-xs">Value</p>
					<p class="text-2xl"><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
				</div>
			</div>
			<div class="flex justify-center items-center text-white">
				{#if !detailsExpanded}
					<div class="bg-curatorCarousel max-w-fit rounded-b-md max-h-[24px]">
						<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
							more details
						</button>
						<button
							class="material-symbols-outlined align-top w-6 h-6"
							on:click={handleMoreDetailsToggleClick}
						>
							keyboard_arrow_down
						</button>
					</div>
				{/if}
			</div>

			{#if detailsExpanded}
				<div class="bg-curatorCarousel text-white px-[10px] pb-6 space-y-5">
					<div class="space-y-1">
						<p class="text-xs">Curator Fee</p>
						<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
					</div>
					{#if bounty.curator}
						<div class="space-y-1">
							<p class="text-xs">Curator</p>
							<CopyableAddress address={bounty.curator} />
						</div>
					{/if}
					{#if description}
						<section class="text-xs space-y-1">
							<BountyDescription description={DOMPurify.sanitize(description)} />
						</section>
					{/if}
					<div class="flex justify-between">
						{#if bounty.expiryDate}
							<section class="flex-col text-start">
								<p class="text-xs">Expiration date</p>
								<p>{formatDate(bounty.expiryDate)}</p>
							</section>
						{/if}
					</div>
					<div class="flex justify-center items-center">
						<ExternalLinks dimension={10} bountyId={bounty.id} />
					</div>
				</div>
				<div class="flex justify-center items-center">
					{#if detailsExpanded}
						<div class="text-white bg-curatorCarousel max-w-fit rounded-b-md max-h-[24px]">
							<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
								less details
							</button>
							<button
								class="material-symbols-outlined align-top w-6 h-6"
								on:click={handleMoreDetailsToggleClick}
							>
								keyboard_arrow_up
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Buttons/Actions Section -->
		<BountyOperations {bounty} />

		<div class="w-full pr-6">
			{#if bounty.status === BountyStatus.Active}
				<ChildBountiesSection {bounty} />
			{/if}
		</div>

		<div
			class="flex flex-col space-y-1 px-3 pt-0 lg:pt-3 lg:justify-end lg:mr-10 lg:space-y-3 2xl:pr-36"
		>
			{#if $showAllCuratorOptions || (bounty.status === BountyStatus.Active && bounty.childBounties.length === 0 && $activeAccount && bounty.curator === $activeAccount.address)}
				<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
					<p class="pt-2 text-sm text-white">Award bounty</p>
					<button
						class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-5"
						on:click={() => {
							awardBountyDialogOpen = true;
						}}>READ FIRST</button
					>
				</div>
			{/if}
		</div>

		<!-- Footer Section-->
		<div class="flex justify-end px-5 my-4 lg:px-10">
			<button class="flex items-center pt-5 pb-1" on:click={expandBounty}>
				<p class="text-white text-xs">close bounty view</p>
				<span class="material-symbols-outlined text-white text-3xl"> keyboard_arrow_up </span>
			</button>
		</div>
	{/if}
</div>

{#if awardBountyDialogOpen}
	<AwardBounty bind:open={awardBountyDialogOpen} {bounty} />
{/if}
