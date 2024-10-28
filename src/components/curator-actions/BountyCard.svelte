<script lang="ts">
	import type { Bounty } from '../../types/bounty';
	import AcceptCuratorRule from './AcceptCuratorRole.svelte';
	import { convertPlanckToDot, getCurrentBlock } from '../../utils/polkadot';
	import { onMount } from 'svelte';
	import ChildBountiesSection from './child-bounties/ChildBountiesSection.svelte';
	import { goto } from '$app/navigation';
	import AwardBounty from './AwardBounty.svelte';
	import LogoTreasuryWhite from '../svg/curator-actions-logo/LogoTreasuryWhite.svelte';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logo/LogoPolkassemblyWhite.svelte';
	import LogoSubscanWhite from '../svg/curator-actions-logo/LogoSubscanWhite.svelte';
	import LogoSubsquareWhite from '../svg/curator-actions-logo/LogoSubsquareWhite.svelte';
	import BountyCardHeader from './BountyCardHeader.svelte';
	import ExtendBounty from './ExtendBounty.svelte';
	import { activeAccount, showAllCuratorOptions } from '../../stores';
	import { formatDate } from '../../utils/common';

	export let bounty: Bounty;

	let acceptCuratorRuleDialogOpen = false;
	let awardBountyDialogOpen = false;
	let curatorsExpended = false;
	let detailsExpended = false;
	export let expanded: boolean;

	let extendBountyDialogOpen = false;
	let expiryDate: string | undefined = undefined;

	let status: 'proposed' | 'approved' | 'funded' | 'curator proposed' | 'active' | 'pending payout';
	let curator: string | undefined = undefined;

	onMount(async () => {
		if (bounty.status === 'Proposed') {
			status = 'proposed';
			return;
		}
		if (bounty.status === 'Approved') {
			status = 'approved';
			return;
		}
		if (bounty.status === 'Funded') {
			status = 'funded';
			return;
		}
		if (typeof bounty.status === 'object') {
			if ('Active' in bounty.status) {
				status = 'active';
				curator = bounty.status.Active.curator;
				let currentBlockInfo = await getCurrentBlock();
				let blocksToExpire =
					Number(bounty.status.Active.updateDue.replaceAll(',', '')) - currentBlockInfo.blockNumber;
				expiryDate = formatDate(new Date(currentBlockInfo.timestamp + blocksToExpire * 6000));
				return;
			}
			if ('CuratorProposed' in bounty.status) {
				status = 'curator proposed';
				curator = bounty.status.CuratorProposed.curator;
				return;
			}
			if ('PendingPayout' in bounty.status) {
				curator = bounty.status.PendingPayout.curator;
				status = 'pending payout';
				return;
			}
		}
	});

	function handleCuratorsToggleClick() {
		curatorsExpended = !curatorsExpended;
	}

	function handleMoreDetailsToggleClick() {
		detailsExpended = !detailsExpended;
	}
</script>

<div class="bg-curatorMainBackground overflow-hidden rounded-md my-6">
	<!-- Header Section -->
	<BountyCardHeader {bounty} {status} bind:isParentExpanded={expanded}></BountyCardHeader>

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

						<div class="mt-4 lg:mt-0">
							<p class="text-xs">Curator Fee</p>
							<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
						</div>
					</section>
					<section
						class="bounty-button-container lg:flex lg:justify-end lg:space-x-3 lg:mr-12 2xl:mr-44"
					>
						<p class="hidden text-center lg:inline-flex">Curators</p>
						<div class="space-x-2">
							<button
								on:click={handleCuratorsToggleClick}
								class="w-full button-popup font-bold rounded-md pt-1 lg:min-w-32 lg:h-fit"
							>
								SHOW <span class="lg:hidden">CURATORS</span>
							</button>
						</div>
					</section>
				</section>
				<section class="flex-col lg:flex lg:flex-row lg:justify-between">
					<section class="flex justify-start">
						<div class="text-xs lg:w-[250px] xl:w-[490px] pr-3">
							<p>Description</p>
							<p>
								This proposal stems from the need to enhance system upgrade testing procedures,
								minimizing feature regression. Recent discussions in various channels, spurred by …
							</p>
						</div>
						<div class="flex justify-between lg:space-x-8 xl:space-x-16">
							{#if expiryDate != undefined}
								<section class="flex-col text-start">
									<p class="text-xs">Expiration date</p>
									<p>{expiryDate}</p>
								</section>
							{/if}
						</div>
					</section>
					<div class="flex justify-center space-x-2.5 lg:mr-12 2xl:mr-44">
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoTreasuryWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoPolkassemblyWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoSubscanWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoSubsquareWhite />
						</button>
					</div>
				</section>
			</div>
		</div>

		<!-- Mobile design -->
		<div class="lg:hidden">
			<div class="grid space-y-5 bg-curatorCarousel px-[10px] py-5 text-white">
				<button
					on:click={handleCuratorsToggleClick}
					class="w-full lg:w-fit h-12 button-popup font-bold rounded-md"
					>SHOW CURATORS
				</button>
				<div>
					<p class="text-xs">Remaining Balance</p>
					<p class="text-2xl"><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
				</div>
			</div>
			<div class="flex justify-center items-center text-white">
				{#if !detailsExpended}
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

			{#if detailsExpended}
				<div class="bg-curatorCarousel text-white px-[10px] pb-6 space-y-5">
					<div class="space-y-1">
						<p class="text-xs">Curator Fee</p>
						<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
					</div>
					<section class="text-xs space-y-1">
						<p>Description</p>
						<p>
							This proposal stems from the need to enhance system upgrade testing procedures,
							minimizing feature regression. Recent discussions in various channels, spurred by …
						</p>
					</section>
					<div class="flex justify-between">
						{#if expiryDate}
							<section class="flex-col text-end">
								<p class="text-xs">Expiration date</p>
								<p>{expiryDate}</p>
							</section>
						{/if}
					</div>
					<div class="flex justify-center items-center space-x-5">
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoTreasuryWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoPolkassemblyWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoSubscanWhite />
						</button>
						<button class="w-10 h-10 lg:w-6 lg:h-6">
							<LogoSubsquareWhite />
						</button>
					</div>
				</div>
				<div class="flex justify-center items-center">
					{#if detailsExpended}
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
		<section
			class="flex flex-col space-y-1 px-3 pt-5 lg:justify-end lg:mr-12 lg:space-y-3 2xl:pr-36"
		>
			{#if false}
				<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
					<p class="pt-2 text-sm text-white">
						<span class="lg:hidden">Add</span> Beneficiary Claim Form
					</p>
					<button
						class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:min-w-32"
					>
						<span class="lg:hidden">BENEFICIARY CLAIM FORM</span>
						<span class="hidden lg:inline-flex">ADD</span>
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || status === 'proposed' || status === 'approved' || status === 'funded'}
				<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
					<p class="pt-2 text-sm text-white">Curator Role</p>

					<button
						class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-7"
						on:click={() => {
							goto(`/bounty-setup?step=curator-proposal&bounty-id=${bounty.id}`);
						}}
						>PROPOSE
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || (status === 'curator proposed' && $activeAccount && curator === $activeAccount.address)}
				<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
					<p class="pt-2 text-sm text-white">Curator Role</p>
					<button
						class="w-full h-12 button-popup font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
						on:click={() => {
							acceptCuratorRuleDialogOpen = true;
						}}>ACCEPT</button
					>
				</div>
			{/if}

			<!-- Add logic/functionality -->
			<div class="flex flex-col space-y-1 lg:flex-row lg:space-x-3 lg:justify-end">
				<p class="pt-2 text-sm text-white">Extend Bounty</p>
				<button
					class="w-full h-12 px-10 bg-extendButtonBackground text-white font-bold rounded-md lg:w-fit lg:h-auto lg:pt-1 lg:max-w-32 lg:px-9"
					on:click={() => {
						extendBountyDialogOpen = true;
					}}>EXTEND</button
				>
			</div>
		</section>

		{#if $showAllCuratorOptions || status === 'proposed' || status === 'approved' || status === 'funded'}
			<div class="w-full pr-6">
				{#if status === 'active'}
					<ChildBountiesSection {bounty} childBounties={bounty.childBounties} />
				{/if}
			</div>
		{/if}

		<!-- Footer Section-->
		<div class="flex justify-end px-5 my-4 lg:px-10">
			<button class="flex items-center pt-5 pb-1" on:click={() => (expanded = !expanded)}>
				<p class="text-white text-xs">close bounty view</p>
				<span class="material-symbols-outlined text-white text-3xl"> keyboard_arrow_up </span>
			</button>
		</div>
	{/if}
</div>

{#if acceptCuratorRuleDialogOpen}
	<AcceptCuratorRule bind:open={acceptCuratorRuleDialogOpen} {bounty} />
{/if}
{#if awardBountyDialogOpen}
	<AwardBounty bind:open={awardBountyDialogOpen} {bounty} />
{/if}
{#if extendBountyDialogOpen}
	<ExtendBounty bind:open={extendBountyDialogOpen} {bounty} />
{/if}
