<script lang="ts">
	import { type ChildBounty, statusLabels } from '../../../types/child-bounty';
	import AssignSubCurator from './operations/AssignSubCurator.svelte';
	import AcceptSubCuratorRule from './operations/AcceptSubCuratorRole.svelte';
	import CloseDownChildBounty from './operations/CloseDownChildBounty.svelte';
	import AwardChildBounty from './operations/AwardChildBounty.svelte';
	import { showAllCuratorOptions } from '../../../stores';
	import type { Bounty } from '../../../types/bounty';
	import ClaimChildBounty from './operations/ClaimChildBounty.svelte';
	import ChildBountyExternalLinks from './ChildBountyExternalLinks.svelte';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import BatchChildBountyCalls from './operations/BatchChildBountyCalls.svelte';
	import UnassignSubCurator from './operations/UnassignSubCurator.svelte';
	import Currency from '../../Currency.svelte';
	import { isCurator } from '../../../utils/isCurator';

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
	let closeDownExpended = false;

	function handleMoreDetailsToggleClick() {
		detailsExpended = !detailsExpended;
	}

	function initiateCloseDownToggleClick() {
		closeDownExpended = !closeDownExpended;
	}
</script>

<div class="childContainer bg-backgroundBounty">
	<!-- Header Section -->
	<div class="flex flex-col rounded-t-md pt-[16px] px-[11px] bg-backgroundBounty">
		<span class="text-[18px] break-word">#{childBounty.id} {childBounty.description}</span>
		<div class="flex justify-end bg-backgroundChildBountyDetails">
			<span
				class="status justify-end items-center text-xs flex-shrink-0 text-white rounded-md pt-1.5 px-3"
				data-status={childBounty.status}
			>
				{statusLabels[childBounty.status]}
			</span>
		</div>
	</div>

	<!-- Child Bounty Card Content -->
	<div
		class="flex flex-col bg-backgroundChildBountyDetails mt-2 mx-[10px] space-y-3 py-[12px] px-[6px]"
	>
		<div class="space-y-3">
			<div class="flex justify-between">
				<section>
					<p class="text-xs">Value</p>
					<p><Currency value={childBounty.value} /></p>
				</section>
				<section>
					<p class="text-xs">Sub-curator Fee</p>
					<p><Currency value={childBounty.fee} /></p>
				</section>
			</div>

			<div class="flex-col space-y-2">
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

		{#if !detailsExpended}
			<div class="flex items-center justify-center bg-backgroundChildBountyExpand rounded-b-md">
				<button class="text-xs" on:click={handleMoreDetailsToggleClick}>
					all child bounty details
				</button>

				<button class="material-symbols-outlined" on:click={handleMoreDetailsToggleClick}>
					keyboard_arrow_down
				</button>
			</div>
		{/if}

		{#if detailsExpended}
			<div class="flex flex-col bg-backgroundChildBountyDetails space-y-3">
				<div>
					{#if childBounty.dateOfPayout}
						<p class="text-xs">Award date:</p>
						<p>{childBounty.dateOfPayout}</p>
					{/if}
				</div>

				<div class="flex-wrap flex justify-center items-center">
					<ChildBountyExternalLinks dimension={10} childBountyId={childBounty.id} />
				</div>
			</div>
			<div class="flex justify-center items-center bg-backgroundChildBountyExpand rounded-b-md">
				<button class="text-xs" on:click={handleMoreDetailsToggleClick}> show less details </button>
				<button class="material-symbols-outlined" on:click={handleMoreDetailsToggleClick}>
					keyboard_arrow_up
				</button>
			</div>
		{/if}
	</div>
	<div class="space-y-3 mx-[8px] my-[15px]">
		{#if $showAllCuratorOptions || (childBounty.status === 'Added' && isCurator(parentBounty))}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator</p>
				<button
					on:click={() => (assignSubCuratorOpen = true)}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					ASSIGN
				</button>
			</div>
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Child bounty operations</p>

				<button
					on:click={() => (batchOpen = true)}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					BATCH CALL
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'CuratorProposed' && isCurator(childBounty))}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator role</p>
				<button
					on:click={() => (acceptSubCuratorRuleOpen = true)}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					ACCEPT
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (['Active', 'SubCuratorProposed'].includes(childBounty.status) && isCurator(parentBounty))}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator</p>
				<button
					on:click={() => (unassignSubCuratorOpen = true)}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					UNASSIGN
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'Active' && isCurator(childBounty))}
			<button
				on:click={() => (awardChildBountyOpen = true)}
				class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
			>
				AWARD
			</button>
		{/if}

		{#if $showAllCuratorOptions || childBounty.status === 'PendingPayout'}
			<button
				on:click={() => (claimChildBountyOpen = true)}
				class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
			>
				CLAIM
			</button>
		{/if}
	</div>

	{#if !closeDownExpended}
		<div class="flex items-center justify-center bg-backgroundChildBountyCloseDown rounded-b-md">
			<button class="text-xs" on:click={initiateCloseDownToggleClick}>
				initiate child bounty closedown
			</button>

			<button class="material-symbols-outlined" on:click={initiateCloseDownToggleClick}>
				keyboard_arrow_down
			</button>
		</div>
	{/if}

	{#if closeDownExpended}
		{#if $showAllCuratorOptions || (isCurator(parentBounty) && childBounty.status !== 'PendingPayout')}
			<p class="text-xs">initiate child bounty closedown</p>
			<div class="flex gap-2">
				<button
					on:click={() => (closeDownChildBountyOpen = true)}
					class="bg-backgroundCloseChildBountyButton text-white rounded-[10px] w-2/3 h-10"
				>
					CLOSE DOWN
				</button>

				<button
					on:click={initiateCloseDownToggleClick}
					class="bg-backgroundButtonDark text-white rounded-[10px] w-1/3 h-10"
				>
					CANCEL
				</button>
			</div>
		{/if}
	{/if}
</div>

{#if assignSubCuratorOpen}
	<AssignSubCurator bind:open={assignSubCuratorOpen} {childBounty} {parentBounty} />
{/if}
{#if acceptSubCuratorRuleOpen}
	<AcceptSubCuratorRule
		bind:open={acceptSubCuratorRuleOpen}
		{childBounty}
		parentCurator={parentBounty.curator}
	/>
{/if}

{#if closeDownChildBountyOpen}
	<CloseDownChildBounty bind:open={closeDownChildBountyOpen} {childBounty} {parentBounty} />
{/if}

{#if awardChildBountyOpen}
	<AwardChildBounty bind:open={awardChildBountyOpen} {childBounty} />
{/if}

{#if claimChildBountyOpen}
	<ClaimChildBounty bind:open={claimChildBountyOpen} {childBounty} />
{/if}

{#if batchOpen}
	<BatchChildBountyCalls bind:open={batchOpen} {childBounty} {parentBounty} />
{/if}

{#if unassignSubCuratorOpen}
	<UnassignSubCurator bind:open={unassignSubCuratorOpen} {childBounty} {parentBounty} />
{/if}

<style>
	.status {
		font-style: italic;
	}

	[data-status='Active'] {
		background-color: theme('colors.childBountyGreen');
	}

	[data-status='PendingPayout'] {
		background-color: theme('colors.curatorMainBackground');
	}

	[data-status='CuratorProposed'] {
		background-color: theme('colors.childBountyGray');
	}

	[data-status='Added'] {
		background-color: theme('colors.childBountyGray');
	}

	[data-status='Claimed'] {
		background-color: theme('colors.childBountyGray');
	}
	[data-status='Canceled'] {
		background-color: theme('colors.childBountyGray');
	}

	.childContainer {
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}

	.break-word {
		word-break: break-word;
	}
</style>
