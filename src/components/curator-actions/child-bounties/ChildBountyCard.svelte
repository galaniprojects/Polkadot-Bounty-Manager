<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { type ChildBounty, statusLabels } from '../../../types/child-bounty';
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import AssignSubCurator from './operations/AssignSubCurator.svelte';
	import AcceptSubCuratorRole from './operations/AcceptSubCuratorRole.svelte';
	import AwardChildBounty from './operations/AwardChildBounty.svelte';
	import BatchChildBountyCalls from './operations/BatchChildBountyCalls.svelte';
	import ChildBountyExternalLinks from './ChildBountyExternalLinks.svelte';
	import ClaimChildBounty from './operations/ClaimChildBounty.svelte';
	import CloseDownChildBounty from './operations/CloseDownChildBounty.svelte';
	import CopyableAddress from '../../common/CopyableAddress.svelte';
	import Currency from '../../Currency.svelte';
	import UnassignSubCurator from './operations/UnassignSubCurator.svelte';

	export let childBounty: ChildBounty;
	export let parentBounty: Bounty;

	let assignSubCuratorOpen = false;
	let unassignSubCuratorOpen = false;
	let AcceptSubCuratorRoleOpen = false;
	let closeDownChildBountyOpen = false;
	let awardChildBountyOpen = false;
	let claimChildBountyOpen = false;
	let batchOpen = false;

	let detailsExpanded = false;
	let closeDownExpanded = false;

	function handleMoreDetailsToggleClick() {
		detailsExpanded = !detailsExpanded;
	}

	function initiateCloseDownToggleClick() {
		closeDownExpanded = !closeDownExpanded;
	}
</script>

<div class="child-container">
	<!-- Header Section -->
	<div class="header">
		<h2 class="title">#{childBounty.id} {childBounty.description}</h2>
		<div class="status-container">
			<span class="status" data-status={childBounty.status}>
				{statusLabels[childBounty.status]}
			</span>
		</div>
	</div>

	<!-- Child Bounty Card Content -->
	<div class="card-content">
		<section class="card-details">
			<div class="elements">
				<div>
					<p class="text">Sub-Curator</p>
					<CopyableAddress address={childBounty.curator || '-'} />
				</div>
				<div>
					<p class="text">Beneficiary</p>
					<CopyableAddress address={childBounty.beneficiary || '-'} />
				</div>
			</div>

			<div class="elements">
				<div>
					<p class="text">Sub-curator Fee</p>
					<p><Currency value={childBounty.fee} />DOT</p>
				</div>
				<div>
					<p class="text">Value</p>
					<p class="value"><Currency value={childBounty.value} />DOT</p>
				</div>
			</div>
		</section>

		{#if !detailsExpanded}
			<div class="expand-details">
				<button class="text" on:click={handleMoreDetailsToggleClick}>
					all child bounty details
				</button>

				<button class="material-symbols-outlined" on:click={handleMoreDetailsToggleClick}>
					keyboard_arrow_down
				</button>
			</div>
		{/if}

		{#if detailsExpanded}
			<div class="all-details">
				<div>
					<p class="text">Award date:</p>
					<p>{childBounty.dateOfPayout || '-'}</p>
				</div>

				<div class="external-links">
					<ChildBountyExternalLinks dimension={10} childBountyId={childBounty.id} />
				</div>
			</div>
			<div class="expand-details">
				<button class="text" on:click={handleMoreDetailsToggleClick}> show less details </button>
				<button class="material-symbols-outlined" on:click={handleMoreDetailsToggleClick}>
					keyboard_arrow_up
				</button>
			</div>
		{/if}
	</div>
	<div class="actions-container">
		{#if $showAllCuratorOptions || (childBounty.status === 'Active' && childBounty.curator === $activeAccount?.address)}
			<button on:click={() => (awardChildBountyOpen = true)} class="buttons"> AWARD </button>
		{/if}

		{#if $showAllCuratorOptions || childBounty.status === 'PendingPayout'}
			<button on:click={() => (claimChildBountyOpen = true)} class="buttons"> CLAIM </button>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'Added' && $activeAccount?.address === parentBounty.curator)}
			<div class="action">
				<p class="text">Sub-curator</p>
				<button on:click={() => (assignSubCuratorOpen = true)} class="buttons"> ASSIGN </button>
			</div>
			<div class="action">
				<p class="text">Child bounty operations</p>

				<button on:click={() => (batchOpen = true)} class="buttons"> BATCH CALL </button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'CuratorProposed' && childBounty.curator === $activeAccount?.address)}
			<div class="action">
				<p class="text">Sub-curator role</p>
				<button on:click={() => (AcceptSubCuratorRoleOpen = true)} class="buttons"> ACCEPT </button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (['Active', 'SubCuratorProposed'].includes(childBounty.status) && parentBounty.curator === $activeAccount?.address)}
			<div class="action">
				<p class="text">Sub-curator</p>
				<button on:click={() => (unassignSubCuratorOpen = true)} class="buttons"> UNASSIGN </button>
			</div>
		{/if}
	</div>

	{#if $showAllCuratorOptions || (['Active', 'CuratorProposed', 'Added'].includes(childBounty.status) && parentBounty.curator === $activeAccount?.address)}
		{#if !closeDownExpanded}
			<div class="close-down-expand">
				<button class="text" on:click={initiateCloseDownToggleClick}> close child bounty </button>

				<button class="material-symbols-outlined" on:click={initiateCloseDownToggleClick}>
					keyboard_arrow_down
				</button>
			</div>
		{/if}

		{#if closeDownExpanded}
			{#if $showAllCuratorOptions || (parentBounty.curator === $activeAccount?.address && childBounty.status !== 'PendingPayout')}
				<div class="close-down-expanded">
					<div class="close-down">
						<button class="text" on:click={initiateCloseDownToggleClick}>
							close child bounty
						</button>

						<button class="material-symbols-outlined" on:click={initiateCloseDownToggleClick}>
							keyboard_arrow_up
						</button>
					</div>
					<button on:click={() => (closeDownChildBountyOpen = true)} class="close-down-button">
						CLOSE DOWN
					</button>
				</div>
			{/if}
		{/if}
	{/if}
</div>

{#if assignSubCuratorOpen}
	<AssignSubCurator bind:open={assignSubCuratorOpen} {childBounty} />
{/if}

{#if AcceptSubCuratorRoleOpen}
	<AcceptSubCuratorRole
		bind:open={AcceptSubCuratorRoleOpen}
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
	.child-container {
		background-color: theme('colors.backgroundBounty');
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
	}

	.header {
		display: flex;
		flex-direction: column;
		padding: 16px 11px 0px;
		background-color: theme('colors.backgroundBounty');
	}

	.title {
		font-size: 18px;
		word-break: break-word;
	}

	.status-container {
		display: flex;
		justify-content: end;
		background-color: theme('colors.backgroundChildBountyDetails');
	}

	.status {
		font-size: 10px;
		color: white;
		flex-shrink: 0;
		width: 120px;
		height: 20px;
		padding: 3px 8px;
	}

	.card-content,
	.all-details {
		display: flex;
		flex-direction: column;
		background-color: theme('colors.backgroundChildBountyDetails');
		margin: 8px 10px 0px;
		gap: 12px;
	}

	.card-content {
		border-radius: 0px 0px 6px 6px;
	}

	.card-details {
		display: flex;
		justify-content: space-between;
		padding: 12px 6px 0px;
	}

	.elements {
		display: flex;
		flex-direction: column;
		row-gap: 18px;
	}

	.text {
		font-size: 12px;
		line-height: 14px;
	}

	.value {
		font-weight: 700;
		line-height: normal;
	}

	.expand-details,
	.close-down-expand,
	.close-down-expanded,
	.close-down {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0px 0px 6px 6px;
	}

	.expand-details {
		background-color: theme('colors.backgroundChildBountyExpand');
	}

	.close-down-expand,
	.close-down-expanded {
		background-color: theme('colors.backgroundChildBountyCloseDown');
	}

	.close-down-expanded {
		flex-direction: column;
		gap: 8px;
		padding: 0px 8px 8px;
	}

	.external-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.actions-container,
	.action {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.actions-container {
		margin: 15px 8px;
		gap: 18px;
	}

	.buttons,
	.close-down-button {
		color: white;
		border-radius: 10px;
		width: 100%;
		height: 40px;
		background-color: theme('colors.backgroundButtonDark');
	}

	.close-down-button {
		background-color: theme('colors.backgroundCloseChildBountyButton');
	}

	.buttons,
	.close-down-button {
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.buttons:hover,
	.close-down-button:hover {
		transform: scale(1.02);
	}

	[data-status='Active'] {
		background-color: theme('colors.childBountyGreen');
	}

	[data-status='PendingPayout'] {
		background-color: theme('colors.curatorMainBackground');
	}

	[data-status='CuratorProposed'],
	[data-status='Added'],
	[data-status='Claimed'],
	[data-status='Canceled'] {
		background-color: theme('colors.childBountyGray');
	}
</style>
