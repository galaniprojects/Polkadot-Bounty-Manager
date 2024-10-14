<script lang="ts">
	import CuratorItem from './CuratorItem.svelte';
	import InfoSvg from '../svg/InfoIcon.svelte';
	import type { Bounty } from '../../types/bounty';
	import AcceptCuratorRule from './AcceptCuratorRole.svelte';
	import AccordionItemHeader from './AccordionItemHeader.svelte';
	import { convertPlanckToDot } from '../../utils/polkadot';
	import { onMount } from 'svelte';
	import ChildBountiesSection from './ChildBountiesSection.svelte';
	import { goto } from '$app/navigation';
	import AwardBounty from './AwardBounty.svelte';
	import { truncateString } from '../../utils/common';
	import LogoTreasuryWhite from '../svg/curator-actions-logo/LogoTreasuryWhite.svelte';
	import LogoPolkassemblyWhite from '../svg/curator-actions-logo/LogoPolkassemblyWhite.svelte';
	import LogoSubscanWhite from '../svg/curator-actions-logo/LogoSubscanWhite.svelte';
	import LogoSubsquareWhite from '../svg/curator-actions-logo/LogoSubsquareWhite.svelte';

	export let bounty: Bounty;
	let acceptCuratorRuleDialogOpen = false;
	let awardBountyDialogOpen = false;

	let status: 'proposed' | 'approved' | 'funded' | 'curator proposed' | 'active' | 'pending payout';

	onMount(() => {
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
				return;
			}
			if ('CuratorProposed' in bounty.status) {
				status = 'curator proposed';
				return;
			}
			if ('PendingPayout' in bounty.status) {
				status = 'pending payout';
				return;
			}
		}
	});

	let curators = [
		{ name: '13iTojfEzgwRKzvEkuAm2xrtm' },
		{ name: 'Nick_dot_play' },
		{ name: '12BJP1geE8wAq1wjUtdvNdNz' },
		{ name: '13mscy5gwheBhwgPJApclOKw' },
		{ name: 'AppliedBC Labs' },
		{ name: '13msAmDwBgwhjLePJApctfQoi' },
		{ name: 'Rekt Street Capital' },
		{ name: '13mYAmgswnDc3GpR1ApctW9Gy' },
		{ name: 'Khastor' },
		{ name: '13mscyw5fekWGwpR1ApctqOP8' },
		{ name: 'AppliedBC Labs' },
		{ name: '13mscy5wffy43rkWRApctMW89' }
	];

	let curatorsExpended = false;
	let detailsExpended = false;
	let expanded = false;

	function handleCuratorsToggleClick() {
		curatorsExpended = !curatorsExpended;
	}

	function getCurator(): string | undefined {
		if (typeof bounty.status === 'object') {
			if ('Active' in bounty.status) {
				return bounty.status.Active.curator;
			}
			if ('CuratorProposed' in bounty.status) {
				return bounty.status.CuratorProposed.curator;
			}
			if ('PendingPayout' in bounty.status) {
				return bounty.status.PendingPayout.curator;
			}
		}
	}

	function handleMoreDetailsToggleClick() {
		detailsExpended = !detailsExpended;
	}
</script>

<div class="bg-curatorMainBackground overflow-x-hidden rounded-md my-6">
	<AccordionItemHeader {bounty} {status}></AccordionItemHeader>

	<!-- Content Section -->
	<div class="bg-curatorCarousel xl:pt-6 text-white w-full p-3">
		<!-- Desktop design -->
		<div class="hidden lg:flex lg:flex-col gap-3 justify-start lg:ml-7">
			<section class="flex flex-col lg:flex lg:flex-row lg:justify-between">
				<section class="flex flex-col lg:flex-row">
					<div class="xl:w-[490px]">
						<p class="text-xs">Remaining Balance</p>
						<p class="text-2xl"><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
					</div>

					<div class="mt-4 lg:mt-0">
						<p class="text-xs">Curator Fee</p>
						<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
					</div>
				</section>
				<div
					class="bounty-button-container lg:flex lg:flex-row lg:justify-end lg:space-x-3 xl:mr-44"
				>
					<p class="hidden text-center lg:inline-flex">Curators</p>
					<div class="space-x-2">
						<button
							on:click={handleCuratorsToggleClick}
							class="w-full md:w-fit button-popup font-bold rounded-md pt-1"
						>
							SHOW <span class="lg:hidden">CURATORS</span>
						</button>
					</div>
				</div>
			</section>
			<section class="flex-col lg:flex lg:flex-row lg:justify-between">
				<section class="flex justify-start">
					<div class="text-xs xl:w-[490px] pr-3">
						<p>Description</p>
						<p>
							This proposal stems from the need to enhance system upgrade testing procedures,
							minimizing feature regression. Recent discussions in various channels, spurred by …
						</p>
					</div>
					<div class="flex justify-between space-x-16">
						<section>
							<p class="text-xs">Created</p>
							<p>8th Aug 2024</p>
						</section>

						<section class="flex-col text-start">
							<p class="text-xs">Expiration date</p>
							<p>27th Sep 2024</p>
						</section>
					</div>
				</section>
				<div class="flex justify-center space-x-2 xl:mr-44">
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

		<!-- No Design currently, therefore commented out
		ToDo: rework desing after design on invision exists -->
		<!-- <section class="flex flex-row-reverse xl:items-start space-x-4">
			<div class="flex flex-col items-end space-y-7">
				{#if status === 'proposed' || status === 'approved' || status === 'funded'}
					<div class="bounty-button-container">
						<p class="text-center">Curator Role</p>
						<div class="space-x-2">
							<button
								on:click={() => {
									goto('/');
								}}
								class="bounty-button">PROPOSE</button
							>
							<button class="pt-1 w-5 h-5"><InfoSvg /></button>
						</div>
					</div>
				{/if}

				<div class="bounty-button-container">
					<p class="text-center">Curator Role</p>
					<div class="space-x-2">
						<button
							on:click={() => {
								acceptCuratorRuleDialogOpen = true;
							}}
							class="bounty-button">ACCEPT</button
						>
						<button class="pt-1 w-5 h-5"><InfoSvg /></button>
					</div>
				</div>
			</div>
		</section> -->
	</div>

	<!-- Mobile design -->
	<div class="lg:hidden">
		<div class="grid space-y-5 bg-curatorCarousel px-[10px] py-5 text-white">
			<button
				on:click={handleCuratorsToggleClick}
				class="w-full md:w-fit h-12 button-popup font-bold rounded-md"
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
					<section>
						<p class="text-xs">Created</p>
						<p>8th Aug 2024</p>
					</section>

					<section class="flex-col text-end">
						<p class="text-xs">Expiration date</p>
						<p>27th Sep 2024</p>
					</section>
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

	<section
		class="flex flex-col space-y-1 px-3 py-5 xl:pr-48 lg:flex-row lg:space-x-3 lg:justify-end"
	>
		<p class="pt-2 text-sm text-white">
			<span class="lg:hidden">Add</span> Beneficiary Claim Form
		</p>
		<button class="w-full h-12 button-popup font-bold rounded-md md:w-fit lg:h-auto lg:pt-1"
			><span class="lg:hidden">BENEFICIARY CLAIM FORM</span>
			<span class="hidden lg:inline-flex">ADD</span></button
		>
	</section>

	<div class="w-full pr-6">
		{#if status === 'active'}
			<ChildBountiesSection {bounty} childBounties={bounty.childBounties} />
		{/if}
	</div>
</div>
{#if acceptCuratorRuleDialogOpen}
	<AcceptCuratorRule bind:open={acceptCuratorRuleDialogOpen} {bounty} />
{/if}
{#if awardBountyDialogOpen}
	<AwardBounty bind:open={awardBountyDialogOpen} {bounty} />
{/if}

<style>
	.bounty-button {
		@apply bg-accent rounded-md font-bold min-w-32 pt-1;
	}

	.bounty-button-container {
		@apply flex lg:flex-col xl:flex-row xl:space-x-3 lg:space-y-2 items-end text-sm;
	}
</style>
