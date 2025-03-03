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
	import Currency from '../../Currency.svelte';

	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let assignSubCuratorDialog: HTMLDialogElement;
	let unassignSubCuratorDialog: HTMLDialogElement;
	let acceptSubCuratorRuleDialog: HTMLDialogElement;
	let closeDownChildBountyDialog: HTMLDialogElement;
	let awardChildBountyDialog: HTMLDialogElement;
	let claimChildBountyDialog: HTMLDialogElement;
	let batchDialog: HTMLDialogElement;

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
		{#if $showAllCuratorOptions || (childBounty.status === 'Added' && $activeAccount?.address === parentBounty.curator)}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator</p>
				<button
					on:click={() => {
						assignSubCuratorDialog.showModal();
					}}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					ASSIGN
				</button>
			</div>
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Child bounty operations</p>

				<button
					on:click={() => {
						batchDialog.showModal();
					}}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					BATCH CALL
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'CuratorProposed' && childBounty.curator === $activeAccount?.address)}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator role</p>
				<button
					on:click={() => {
						acceptSubCuratorRuleDialog.showModal();
					}}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					ACCEPT
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (['Active', 'SubCuratorProposed'].includes(childBounty.status) && parentBounty.curator === $activeAccount?.address)}
			<div class="flex flex-col gap-[8px]">
				<p class="text-xs">Sub-curator</p>
				<button
					on:click={() => {
						unassignSubCuratorDialog.showModal();
					}}
					class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
				>
					UNASSIGN
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'Active' && childBounty.curator === $activeAccount?.address)}
			<button
				on:click={() => {
					awardChildBountyDialog.showModal();
				}}
				class="text-white bg-backgroundButtonDark rounded-[10px] w-full h-10"
			>
				AWARD
			</button>
		{/if}

		{#if $showAllCuratorOptions || childBounty.status === 'PendingPayout'}
			<button
				on:click={() => {
					claimChildBountyDialog.showModal();
				}}
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
		{#if $showAllCuratorOptions || (parentBounty.curator === $activeAccount?.address && childBounty.status !== 'PendingPayout')}
			<p class="text-xs">initiate child bounty closedown</p>
			<div class="flex gap-2">
				<button
					on:click={() => {
						closeDownChildBountyDialog.showModal();
					}}
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

<AssignSubCurator bind:dialog={assignSubCuratorDialog} {childBounty} />
<AcceptSubCuratorRule
	bind:dialog={acceptSubCuratorRuleDialog}
	{childBounty}
	parentCurator={parentBounty.curator}
/>
<CloseDownChildBounty bind:dialog={closeDownChildBountyDialog} {childBounty} />
<AwardChildBounty bind:dialog={awardChildBountyDialog} {childBounty} />
<ClaimChildBounty bind:dialog={claimChildBountyDialog} {childBounty} />
<BatchChildBountyCalls bind:dialog={batchDialog} {childBounty} />
<UnassignSubCurator bind:dialog={unassignSubCuratorDialog} {childBounty} />

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
