<script lang="ts">
	import { type ChildBounty, statusLabels } from '../../../types/child-bounty';
	import AssignSubCurator from './operations/AssignSubCurator.svelte';
	import AcceptSubCuratorRule from './operations/AcceptSubCuratorRole.svelte';
	import CloseDownChildBounty from './operations/CloseDownChildBounty.svelte';
	import AwardChildBounty from './operations/AwardChildBounty.svelte';
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import ClaimChildBounty from './operations/ClaimChildBounty.svelte';
	import ChildBountyExternalLinks from './ChildBountyExternalLinks.svelte';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import BatchChildBountyCalls from './operations/BatchChildBountyCalls.svelte';
	import UnassignSubCurator from './operations/UnassignSubCurator.svelte';
	import { formatPlanckToDot } from '../../../utils/polkadot';

	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let assignSubCuratorOpen = false;
	let unassignSubCuratorOpen = false;
	let acceptSubCuratorRuleOpen = false;
	let closeDownChildBountyOpen = false;
	let awardChildBountyOpen = false;
	let claimChildBountyOpen = false;
	let batchOpen = false;

	let detailsExpended = false;

	function handleMoreDetailsToggleClick() {
		detailsExpended = !detailsExpended;
	}
</script>

<div class="childContainer bg-white pb-3 lg:w-full rounded-md shadow-lg mt-6">
	<!-- Header Section -->
	<div
		class="flex justify-between gap-4 text-white rounded-t-md px-[10px] pt-2 pb-0 lg:pl-4 lg:pr-3 min-h-6"
		data-status={childBounty.status}
	>
		<div class="flex flex-col lg:flex-row items-start lg:items-center">
			<div class="flex flex-col lg:w-[400px] xl:w-[650px] mb-2 lg:mb-0">
				<span class="text-sm">#{childBounty.id} {childBounty.description}</span>
			</div>
		</div>

		<span class="status justify-end items-center text-xs flex-shrink-0 mr-0 sm:mr-5">
			{statusLabels[childBounty.status]}
		</span>
	</div>

	<!-- Child Bounty Card Content -->
	<div class="flex flex-col lg:flex-row justify-between lg:pr-6 lg:pt-1 lg:pl-4">
		<div class="bg-childBountyHeaderBackground lg:bg-white">
			<div class="mx-2 mb-3 lg:mx-0 flex flex-col space-y-3 lg:flex-row items-start">
				<div class="mt-3 flex flex-col lg:w-[250px] pr-3">
					<section class="space-y-2 lg:space-y-0">
						<p class="text-xs">Value</p>
						<p>{formatPlanckToDot(childBounty.value)} DOT</p>
					</section>
				</div>

				<div class="hidden lg:flex flex-col lg:w-40 xl:w-44 lg:mt-0">
					<section>
						<p class="text-xs">Sub-curator Fee</p>
						<p>{formatPlanckToDot(childBounty.fee)} DOT</p>
					</section>
					{#if childBounty.dateOfPayout}
						<section class="lg:mt-3">
							<p class="text-xs">Award date</p>
							<p>{childBounty.dateOfPayout}</p>
						</section>
					{/if}
				</div>
				<div>
					<div class="flex flex-col w-full lg:w-48 xl:w-62 space-y-3">
						{#if childBounty.curator}
							<section>
								<p class="text-xs">Sub-Curator</p>
								<CopyableAddress address={childBounty.curator || '-'} />
							</section>
						{/if}

						{#if childBounty.beneficiary}
							<section>
								<p class="text-xs">Beneficiary</p>
								<CopyableAddress address={childBounty.beneficiary} />
							</section>
						{/if}
					</div>
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
					<p class="">{formatPlanckToDot(childBounty.fee)} DOT</p>
				</section>
				<div class="flex flex-col">
					<div class="flex flex-col lg:w-52 xl:w-[270px] mb-2 lg:mb-0"></div>

					<div class="flex flex-col lg:w-80 mb-2 lg:mb-0">
						{#if childBounty.dateOfPayout}
							<p class="text-xs">Award date:</p>
							<p>{childBounty.dateOfPayout}</p>
						{/if}
					</div>
				</div>
				<div class="mt-3 flex-wrap flex justify-center items-center">
					<ChildBountyExternalLinks dimension={10} childBountyId={childBounty.id} />
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

		<div class="space-y-3 p-2 2xl:mr-[140px]">
			{#if $showAllCuratorOptions || (childBounty.status === 'Added' && $activeAccount?.address === parentBounty.curator)}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
					<p class="text-xs lg:text-base lg:pt-2">Sub-curator</p>

					<button
						on:click={() => (assignSubCuratorOpen = true)}
						class="text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32"
						data-status={childBounty.status}
					>
						ASSIGN
					</button>
				</div>
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
					<p class="text-xs lg:text-base lg:pt-2">All operations</p>

					<button
						on:click={() => (batchOpen = true)}
						class="text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32"
						data-status={childBounty.status}
					>
						BATCH
					</button>
				</div>
			{/if}

			<div class="flex justify-end">
				<div class="hidden lg:flex lg:flex-row lg:items-center lg:justify-end lg:mr-4">
					<ChildBountyExternalLinks dimension={6} childBountyId={childBounty.id} />
				</div>
			</div>

			{#if $showAllCuratorOptions || (childBounty.status === 'CuratorProposed' && childBounty.curator === $activeAccount?.address)}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
					<p class="text-xs lg:text-base lg:pt-2">Sub-curator role</p>
					<button
						on:click={() => (acceptSubCuratorRuleOpen = true)}
						data-status={childBounty.status}
						class="text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32"
					>
						ACCEPT
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || (parentBounty.curator === $activeAccount?.address && childBounty.status !== 'PendingPayout')}
				<div
					class="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:justify-end"
				>
					<button
						id="close"
						data-status={childBounty.status}
						on:click={() => (closeDownChildBountyOpen = true)}
						class="bg-transparent border rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-7 lg:min-w-32"
					>
						CLOSE DOWN
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || (['Active', 'SubCuratorProposed'].includes(childBounty.status) && parentBounty.curator === $activeAccount?.address)}
				<div
					class="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:justify-end"
				>
					<button
						id="close"
						data-status={childBounty.status}
						on:click={() => (unassignSubCuratorOpen = true)}
						class="bg-transparent border rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-7 lg:min-w-32"
					>
						UNASSIGN
					</button>
				</div>
			{/if}

			<!-- TODO: only when active?  -->
			{#if $showAllCuratorOptions || (childBounty.status === 'Active' && childBounty.curator === $activeAccount?.address)}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end">
					<button
						on:click={() => (awardChildBountyOpen = true)}
						data-status={childBounty.status}
						class="text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32"
					>
						AWARD
					</button>
				</div>
			{/if}

			{#if $showAllCuratorOptions || childBounty.status === 'PendingPayout'}
				<div class="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-end">
					<button
						on:click={() => (claimChildBountyOpen = true)}
						data-status={childBounty.status}
						class="text-white rounded-md font-bold pt-1 w-full h-12 lg:w-fit lg:h-fit lg:min-w-32"
					>
						CLAIM
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
	<AcceptSubCuratorRule
		bind:open={acceptSubCuratorRuleOpen}
		{childBounty}
		parentCurator={parentBounty.curator}
	/>
{/if}

{#if closeDownChildBountyOpen}
	<CloseDownChildBounty bind:open={closeDownChildBountyOpen} {childBounty} />
{/if}

{#if awardChildBountyOpen}
	<AwardChildBounty bind:open={awardChildBountyOpen} {childBounty} />
{/if}

{#if claimChildBountyOpen}
	<ClaimChildBounty bind:open={claimChildBountyOpen} {childBounty} />
{/if}

{#if batchOpen}
	<BatchChildBountyCalls bind:open={batchOpen} {childBounty} />
{/if}

{#if unassignSubCuratorOpen}
	<UnassignSubCurator bind:open={unassignSubCuratorOpen} {childBounty} />
{/if}

<style>
	.status {
		font-style: italic;
	}

	[data-status='Active'] {
		background-color: theme('colors.childBountyGreen');
	}
	#close[data-status='Active'] {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGreen');
		color: theme('colors.childBountyGreen');
	}

	[data-status='PendingPayout'] {
		background-color: theme('colors.curatorMainBackground');
	}
	#close[data-status='PendingPayout'] {
		background-color: theme('colors.transparent');
		border-color: theme('colors.curatorMainBackground');
		color: theme('colors.curatorMainBackground');
	}

	[data-status='CuratorProposed'] {
		background-color: theme('colors.childBountyGray');
	}
	#close[data-status='CuratorProposed'] {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGray');
		color: theme('colors.childBountyGray');
	}

	[data-status='Added'] {
		background-color: theme('colors.childBountyGray');
	}
	#close[data-status='Added'] {
		background-color: theme('colors.transparent');
		border-color: theme('colors.childBountyGray');
		color: theme('colors.childBountyGray');
	}

	.childContainer {
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}
</style>
