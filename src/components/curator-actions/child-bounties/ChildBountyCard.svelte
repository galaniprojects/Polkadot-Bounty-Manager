<script lang="ts">
	import type { Bounty } from '../../../types/bounty';
	import { type ChildBounty, statusLabels } from '../../../types/child-bounty';
	import { activeAccount, showAllCuratorOptions } from '../../../stores';
	import { isCurator } from '../../../utils/isCurator';
	import AssignSubCurator from './operations/AssignSubCurator.svelte';
	import ReassignSubCurator from './operations/ReassignSubCurator.svelte';
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

	let assignSubCuratorDialog: HTMLDialogElement;
	let reassignSubCuratorDialog: HTMLDialogElement;
	let unassignSubCuratorDialog: HTMLDialogElement;
	let acceptSubCuratorRuleDialog: HTMLDialogElement;
	let closeDownChildBountyDialog: HTMLDialogElement;
	let awardChildBountyDialog: HTMLDialogElement;
	let claimChildBountyDialog: HTMLDialogElement;
	let batchDialog: HTMLDialogElement;
</script>

<div class="childContainer">
	<!-- Header Section -->
	<section class="header">
		<h2 class="title">#{childBounty.id} {childBounty.description}</h2>
		<div class="statusContainer">
			<span class="status" data-status={childBounty.status}>
				{statusLabels[childBounty.status]}
			</span>
		</div>
	</section>

	<!-- Child Bounty Card Content -->
	<div class="cardContent">
		<div class="cardDetails">
			<div class="elements">
				<div>
					<p class="text">Sub-curator</p>
					<CopyableAddress address={childBounty.curator} />
				</div>
				<div>
					<p class="text">Beneficiary</p>
					<CopyableAddress address={childBounty.beneficiary} />
				</div>
			</div>

			<div class="elements">
				<div>
					<p class="text">Sub-curator fee</p>
					<p><Currency value={childBounty.fee} /></p>
				</div>
				<div>
					<p class="text">Value</p>
					<p class="value"><Currency value={childBounty.value} /></p>
				</div>
			</div>
		</div>

		<details class="allDetails">
			<summary>
				<span>all child bounty details</span>
				<span class="material-symbols-outlined icon">keyboard_arrow_down</span>
			</summary>
			<div>
				<div>
					<p class="text">Award date:</p>
					<p>{childBounty.dateOfPayout || '-'}</p>
				</div>

				<div class="externalLinks">
					<ChildBountyExternalLinks dimension={10} childBountyId={childBounty.id} />
				</div>
			</div>
		</details>
	</div>

	<div class="actionsContainer">
		{#if $showAllCuratorOptions || (childBounty.status === 'Active' && isCurator(childBounty, $activeAccount))}
			<button
				on:click={() => {
					awardChildBountyDialog.showModal();
				}}
				class="buttons"
			>
				AWARD
			</button>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'PendingPayout' && $activeAccount !== undefined)}
			<button
				on:click={() => {
					claimChildBountyDialog.showModal();
				}}
				class="buttons"
			>
				CLAIM
			</button>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'Added' && isCurator(parentBounty, $activeAccount))}
			<div class="action">
				<p class="text">Sub-curator</p>
				<button
					on:click={() => {
						assignSubCuratorDialog.showModal();
					}}
					class="buttons"
				>
					ASSIGN
				</button>
			</div>
			<div class="action">
				<p class="text">Child bounty operations</p>

				<button
					on:click={() => {
						batchDialog.showModal();
					}}
					class="buttons"
				>
					BATCH CALL
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (childBounty.status === 'CuratorProposed' && isCurator(childBounty, $activeAccount))}
			<div class="action">
				<p class="text">Sub-curator role</p>
				<button
					on:click={() => {
						acceptSubCuratorRuleDialog.showModal();
					}}
					class="buttons"
				>
					ACCEPT
				</button>
			</div>
		{/if}

		{#if $showAllCuratorOptions || (['Active', 'CuratorProposed'].includes(childBounty.status) && isCurator(parentBounty, $activeAccount))}
			<div class="action">
				<p class="text">Sub-curator</p>
				<button
					on:click={() => {
						reassignSubCuratorDialog.showModal();
					}}
					class="buttons"
				>
					REASSIGN
				</button>
			</div>
		{/if}
	</div>

	{#if $showAllCuratorOptions || (['Active', 'CuratorProposed', 'Added'].includes(childBounty.status) && isCurator(parentBounty, $activeAccount))}
		<details class="closeChildBounty">
			<summary>
				<span>close child bounty</span>
				<span class="material-symbols-outlined icon">keyboard_arrow_down</span>
			</summary>
			<button
				on:click={() => {
					closeDownChildBountyDialog.showModal();
				}}
				class="closeDownButton"
			>
				CLOSE DOWN
			</button>
		</details>
	{/if}
</div>

<AssignSubCurator bind:dialog={assignSubCuratorDialog} {childBounty} {parentBounty} />
<ReassignSubCurator bind:dialog={reassignSubCuratorDialog} {childBounty} {parentBounty} />

<AcceptSubCuratorRole
	bind:dialog={acceptSubCuratorRuleDialog}
	{childBounty}
	parentCurator={parentBounty.curator}
/>

<CloseDownChildBounty bind:dialog={closeDownChildBountyDialog} {childBounty} {parentBounty} />

<AwardChildBounty bind:dialog={awardChildBountyDialog} {childBounty} />

<ClaimChildBounty bind:dialog={claimChildBountyDialog} {childBounty} />

<BatchChildBountyCalls bind:dialog={batchDialog} {childBounty} {parentBounty} />

<UnassignSubCurator bind:dialog={unassignSubCuratorDialog} {childBounty} {parentBounty} />

<style>
	details {
		text-align: center;
		border-radius: 0px 0px 6px 6px;
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		cursor: pointer;
		font-size: 12px;
		margin: -8px -8px 0px;
		padding-top: 8px;
	}

	details[open],
	summary {
		padding: 8px;
	}

	details[open] summary {
		margin-bottom: 8px;
	}

	.icon {
		font-size: 18px;
		transition: transform 0.3s ease;
	}

	details[open] .icon {
		transform: rotate(180deg);
	}

	.closeChildBounty {
		background-color: theme('colors.backgroundChildBountyCloseDown');
		padding: 8px 8px 0;
	}

	.childContainer {
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

	.statusContainer {
		display: flex;
		justify-content: end;
		background-color: theme('colors.backgroundChildBountyDetails');
	}

	.status {
		font-size: 10px;
		color: theme('colors.textPrimary');
		flex-shrink: 0;
		width: 120px;
		height: 20px;
		padding: 3px 8px;
	}

	.cardContent {
		display: flex;
		flex-direction: column;
		margin: 8px 10px 0px;
		gap: 12px;
		border-radius: 0px 0px 6px 6px;
		background-color: theme('colors.backgroundChildBountyDetails');
	}

	.allDetails {
		background-color: theme('colors.backgroundChildBountyExpand');
		padding-top: 8px;
	}

	.cardDetails {
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
	}

	.externalLinks {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.actionsContainer,
	.action {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.actionsContainer {
		margin: 15px 8px;
		gap: 18px;
	}

	.buttons,
	.closeDownButton {
		color: white;
		border-radius: 10px;
		width: 100%;
		height: 40px;
		background-color: theme('colors.backgroundButtonDark');
	}

	.closeDownButton {
		background-color: theme('colors.backgroundCloseChildBountyButton');
	}

	.buttons,
	.closeDownButton {
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.buttons:hover,
	.closeDownButton:hover {
		transform: scale(1.02);
	}

	[data-status='Active'],
	[data-status='Added'],
	[data-status='PendingPayout'] {
		background-color: theme('colors.statusLightGreen');
		color: white;
	}

	[data-status='CuratorProposed'] {
		background-color: theme('colors.statusDarkYellow');
		color: white;
	}

	[data-status='Claimed'],
	[data-status='Canceled'] {
		background-color: theme('colors.statusDarkGreen');
		color: white;
	}
</style>
