<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChildBounty } from '../../../types/child-bounty';
	import LogoPolkassembly from '../../svg/LogoPolkassembly.svelte';
	import LogoSubscan from '../../svg/LogoSubscan.svelte';
	import LogoTreasuryIcon from '../../svg/LogoTreasuryIcon.svelte';
	import { truncateString } from '../../../utils/common';
	import { convertPlanckToDot } from '../../../utils/polkadot';
	import AssignSubCurator from '.././child-bounties/AssignSubCurator.svelte';
	import AcceptSubCuratorRule from '../child-bounties/AcceptSubCuratorRole.svelte';
	import CloseDownChildBounty from '../child-bounties/CloseDownChildBounty.svelte';
	import AwardChildBounty from '../child-bounties/AwardChildBounty.svelte';
	import LogoSubsquarePink from '../../svg/curator-actions-logo/LogoSubsquarePink.svelte';
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import { getBountyCurator } from '../../../utils/bounties';

	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;
	let status: Status;
	let subCurator: string;

	export let beneficiary: string = '';
	export let dateCreated: string = '';
	export let dateOfPayout: string = '';

	let assignSubCuratorOpen = false;
	let acceptSubCuratorRuleOpen = false;
	let closeDownChildBountyOpen = false;
	let awardChildBountyOpen = false;
	let detailsExpended = false;

	type Status = 'added' | 'active' | 'sub-curator proposed' | 'pending payout';

	let statusColorClass = '';

	$: switch (status) {
		case 'added':
			statusColorClass = 'added';
			break;
		case 'sub-curator proposed':
			statusColorClass = 'sub-curator-proposed';
			break;
		case 'active':
			statusColorClass = 'active';
			break;
		case 'pending payout':
			statusColorClass = 'pending-payout';
			break;
		default:
			statusColorClass = 'added';
	}

	onMount(() => {
		if (childBounty.status === 'Added') {
			status = 'added';
		} else if (typeof childBounty.status === 'object') {
			if ('Active' in childBounty.status) {
				status = 'active';
				subCurator = childBounty.status.Active.curator;
			} else if ('CuratorProposed' in childBounty.status) {
				status = 'sub-curator proposed';
				subCurator = childBounty.status.CuratorProposed.curator;
			} else if ('PendingPayout' in childBounty.status) {
				subCurator = childBounty.status.PendingPayout.curator;
				status = 'pending payout';
			}
		}
	});

	function getCurator() {
		if (childBounty.status === 'Added') {
			return '-';
		} else if (typeof childBounty.status === 'object') {
			if ('Active' in childBounty.status) {
				return childBounty.status.Active.curator;
			} else if ('CuratorProposed' in childBounty.status) {
				return childBounty.status.CuratorProposed.curator;
			} else if ('PendingPayout' in childBounty.status) {
				return childBounty.status.PendingPayout.curator;
			}
		}
	}

	function handleMoreDetailsToggleClick() {
		detailsExpended = !detailsExpended;
	}
</script>

<div class="childContainer bg-white pb-3 lg:w-full rounded-md shadow-lg mt-6">
	<!-- Header Section -->
	<div
		class="flex justify-between gap-4 text-white rounded-t-md px-[10px] pt-2 pb-0 lg:pl-4 lg:pr-3 min-h-6 {statusColorClass}"
	>
		<div class="flex flex-col lg:flex-row items-start lg:items-center">
			<div class="flex flex-col lg:w-[400px] xl:w-[650px] mb-2 lg:mb-0">
				<span class="text-sm">#{childBounty.id} {childBounty.description}</span>
			</div>

			<div class="hidden lg:flex flex-col mb-2 lg:mb-0">
				{#if dateCreated}
					<p class="text-xs">created: {dateCreated}</p>
				{/if}
			</div>
		</div>

		<span class="status justify-end items-center text-xs flex-shrink-0 mr-0 sm:mr-5">{status}</span>
	</div>

	<!-- Child Bounty Card Content -->
	<div class="flex flex-col lg:flex-row justify-between lg:pr-6 lg:pt-1 lg:pl-4">
		<div class="bg-childBountyHeaderBackground lg:bg-white">
			<div class="mx-2 mb-3 lg:mx-0 flex flex-col space-y-3 lg:flex-row items-start">
				<div class="mt-3 flex flex-col lg:w-[270px] xl:w-[490px] pr-3">
					<section class="space-y-2 lg:space-y-0">
						<p class="text-xs">Value</p>
						<p class="text-base">{convertPlanckToDot(childBounty.value)} DOT</p>
					</section>
					<section class="hidden lg:flex flex-col lg:text-xs mt-3 space-y-2">
						<p>Description</p>
						<p>This is a child bounty whose proposer address is shown in on-chain info…</p>
					</section>
				</div>

				<div class="hidden lg:flex flex-col lg:w-32 xl:w-40 lg:mt-0">
					<section>
						<p class="text-xs">Sub-curator Fee</p>
						<p class="text-base">{convertPlanckToDot(childBounty.fee)} DOT</p>
					</section>
					<section class="lg:mt-3">
						<p class="text-xs">Award date</p>
						<p class="text-base">{dateOfPayout}</p>
					</section>
				</div>

				<div class="flex justify-between w-full lg:flex-col lg:w-48 xl:w-62">
					{#if typeof childBounty.status === 'object'}
						<section>
							<p class="text-xs">Sub-Curator</p>
							<p class="sub-curator text-base">{truncateString(getCurator() || '-', 9)}</p>
						</section>
					{/if}
					{#if beneficiary}
						<section class="lg:mt-3">
							<p class="text-xs">Beneficiary</p>
							<p class="beneficiary">{beneficiary}</p>
						</section>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex justify-center items-center text-primary lg:hidden">
			{#if !detailsExpended}
				<div class="bg-childBountyHeaderBackground max-w-fit rounded-b-md max-h-[24px]">
					<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
						more details
					</button>
					<button
						class="material-symbols-outlined align-top w-6 h-6 mr-2"
						on:click={handleMoreDetailsToggleClick}
					>
						keyboard_arrow_down
					</button>
				</div>
			{/if}
		</div>
		{#if detailsExpended}
			<div class="flex flex-col bg-childBountyHeaderBackground px-2 space-y-3 pb-5">
				<section>
					<p class="text-xs">Sub-curator Fee</p>
					<p class="">{convertPlanckToDot(childBounty.fee)}</p>
				</section>

				<section class="text-xs mt-3">
					<p>Description</p>
					<p>This is a child bounty whose proposer address is shown in on-chain info…</p>
				</section>
				<div class="flex justify-between">
					<div class="flex flex-col lg:w-52 xl:w-[270px] mb-2 lg:mb-0">
						{#if dateCreated}
							<p class="text-xs">added</p>
							<p class="">{dateCreated}</p>
						{/if}
					</div>

					<div class="flex flex-col lg:w-80 mb-2 lg:mb-0">
						{#if dateOfPayout}
							<p class="text-xs">Date of payout:</p>
							<p>{dateOfPayout}</p>
						{/if}
					</div>
				</div>
				<div class="mt-3 flex-wrap flex justify-center items-center space-x-5">
					<button class="w-10 h-10"><LogoTreasuryIcon /></button>
					<button class="w-10 h-10"><LogoPolkassembly /></button>
					<button class="w-10 h-10"><LogoSubscan /></button>
					<button class="w-10 h-10"><LogoSubsquarePink /></button>
				</div>
			</div>
		{/if}

		<div class="flex justify-center items-center">
			{#if detailsExpended}
				<div class="bg-childBountyHeaderBackground max-w-fit rounded-b-md max-h-[24px]">
					<button class="text-xs align-top mt-1 ml-2" on:click={handleMoreDetailsToggleClick}>
						less details
					</button>
					<button
						class="material-symbols-outlined align-top w-6 h-6 mr-2"
						on:click={handleMoreDetailsToggleClick}
					>
						keyboard_arrow_up
					</button>
				</div>
			{/if}
		</div>

		<div class="space-y-3 p-2 2xl:mr-32">
			{#if status === 'added'}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
					<p class="text-xs lg:text-base lg:pt-2">Sub-curator</p>

					<button
						on:click={() => (assignSubCuratorOpen = true)}
						class={`${statusColorClass} text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32`}
					>
						ASSIGN
					</button>
				</div>
			{/if}

			<div class="hidden lg:flex space-y-1 lg:flex-row lg:items-center lg:justify-end lg:gap-2.5">
				<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoTreasuryIcon /></button>
				<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoPolkassembly /></button>
				<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoSubscan /></button>

				<!-- ToDo: Fix the last icon -->
				<button class="w-5 h-5 lg:w-6 lg:h-6"> <LogoSubsquarePink /></button>
			</div>

			{#if $showAllCuratorOptions || (status === 'sub-curator proposed' && subCurator === $activeAccount.address)}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
					<p class="text-xs lg:text-base lg:pt-2">Sub-curator role</p>
					<button
						on:click={() => (acceptSubCuratorRuleOpen = true)}
						class={`${statusColorClass} text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32`}
					>
						ACCEPT
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || ($activeAccount && getBountyCurator(parentBounty) === $activeAccount.address)}
				<div
					class="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:justify-end"
				>
					<button
						id="close"
						on:click={() => (closeDownChildBountyOpen = true)}
						class={`bg-transparent border ${statusColorClass} rounded-md text-xs font-bold pt-1 w-1/2 h-10 lg:w-fit lg:h-fit lg:min-w-32`}
					>
						CLOSE DOWN
					</button>
				</div>
			{/if}

			<!-- TODO: only when active?  -->
			{#if $showAllCuratorOptions || (status === 'active' && getBountyCurator(parentBounty) === $activeAccount.address)}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end">
					<button
						on:click={() => (awardChildBountyOpen = true)}
						class={`${statusColorClass} text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32`}
					>
						AWARD
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
{#if assignSubCuratorOpen}
	<AssignSubCurator bind:open={assignSubCuratorOpen} {childBounty} />
{/if}
{#if acceptSubCuratorRuleOpen}
	<AcceptSubCuratorRule bind:open={acceptSubCuratorRuleOpen} {childBounty} />
{/if}

{#if closeDownChildBountyOpen}
	<CloseDownChildBounty bind:open={closeDownChildBountyOpen} {childBounty} />
{/if}

{#if awardChildBountyOpen}
	<AwardChildBounty bind:open={awardChildBountyOpen} {childBounty} />
{/if}

<style>
	.status {
		font-family: 'Overpass Italic';
	}

	.active {
		background-color: theme('colors.childBountyOrange');
	}
	#close.active {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyOrange');
		color: theme('colors.childBountyOrange');
	}

	.pending-payout {
		background-color: theme('colors.childBountyGreen');
	}
	#close.pending-payout {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGreen');
		color: theme('colors.childBountyGreen');
	}

	.sub-curator-proposed {
		background-color: theme('colors.childBountyGray');
	}
	#close.sub-curator-proposed {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGray');
		color: theme('colors.childBountyGray');
	}

	.added {
		background-color: theme('colors.childBountyGray');
	}
	#close.added {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGray');
		color: theme('colors.childBountyGray');
	}

	.childContainer {
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}
</style>
