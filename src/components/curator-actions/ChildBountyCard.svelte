<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChildBounty } from '../../types/child-bounty';
	import LogoPolkassembly from '../svg/LogoPolkassembly.svelte';
	import LogoSubscan from '../svg/LogoSubscan.svelte';
	import LogoTreasuryIcon from '../svg/LogoTreasuryIcon.svelte';
	import { truncateString } from '../../utils/common';
	import { convertPlanckToDot } from '../../utils/polkadot';

	export let childBounty: ChildBounty;
	let status: Status;

	// export let id: string | number = '>>>>';
	export let beneficiary: string = '';
	export let dateCreated: string = '';
	export let dateOfPayout: string = '';
	export let timeUntilPayout: string = '';
	export let onAssign: () => void = () => {};

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
		}
		if (typeof childBounty.status === 'object') {
			if ('Active' in childBounty.status) {
				status = 'active';
				return;
			}
			if ('CuratorProposed' in childBounty.status) {
				status = 'sub-curator proposed';
				return;
			}
			if ('PendingPayout' in childBounty.status) {
				status = 'pending payout';
				return;
			}
		}
	});

	function getCurator() {
		if (childBounty.status === 'Added') {
			return '-';
		}
		if (typeof childBounty.status === 'object') {
			if ('Active' in childBounty.status) {
				return childBounty.status.Active.curator;
			}

			if ('CuratorProposed' in childBounty.status) {
				return childBounty.status.CuratorProposed.curator;
			}
			if ('PendingPayout' in childBounty.status) {
				return childBounty.status.PendingPayout.curator;
			}
		}
	}

	function getButtonText(status: Status): string {
		switch (status) {
			case 'added':
				return 'ASSIGN';
			case 'sub-curator proposed':
				return 'ACCEPT';
			case 'active':
				return 'AWARD';
			default:
				return '';
		}
	}
</script>

<div class="bg-white pb-3 lg:w-full xl:w-full mb-3">
	<!-- Header Section -->
	<div
		class="flex flex-col lg:flex-row justify-between text-white pl-6 pr-3 pt-1 min-h-6 {statusColorClass}"
	>
		<div class="flex flex-col lg:flex-row items-start lg:items-center">
			<div class="flex flex-col lg:w-60 mb-2 lg:mb-0">
				<span class="text-sm">#{childBounty.id} {childBounty.description}</span>
			</div>

			<div class="flex flex-col lg:w-52 xl:w-[270px] mb-2 lg:mb-0">
				{#if dateCreated}
					<p class="text-xs">Created: {dateCreated}</p>
				{/if}
			</div>

			<div class="flex flex-col lg:w-80 mb-2 lg:mb-0">
				{#if dateOfPayout}
					<p class="text-xs">Date of payout: {dateOfPayout}</p>
				{/if}
			</div>
		</div>

		<span class="status justify-end items-center text-xs flex-shrink-0">{status}</span>
	</div>

	<!-- Child Bounty Card Content -->
	<div class="flex flex-col lg:flex-row justify-between pr-6 pt-1 pl-4">
		<div class="mt-3 flex flex-col lg:flex-row items-start lg:space-x-3">
			<div class="flex flex-col lg:w-60">
				<section>
					<p class="text-xs">Value</p>
					<p class="text-sm">{convertPlanckToDot(childBounty.value)}</p>
				</section>
				<section class="text-xs mt-3">
					<p>Description</p>
					<p>This is a child bounty whose proposer address is shown in on-chain info…</p>
				</section>
			</div>

			<div class="flex flex-col lg:w-48 xl:w-64">
				{#if typeof childBounty.status === 'object'}
					<section>
						<p class="text-xs">Sub-Curator</p>
						<p class="sub-curator text-sm">{truncateString(getCurator() || '-', 9)}</p>
					</section>
				{/if}
				{#if beneficiary}
					<section class="mt-3">
						<p class="text-xs">Beneficiary</p>
						<p class="beneficiary text-sm">{beneficiary}</p>
					</section>
				{/if}
			</div>

			<div class="flex flex-col xl:w-60 mt-3 lg:mt-0">
				<section>
					<p class="text-xs">Sub-curator Fee</p>
					<p class="text-sm">{convertPlanckToDot(childBounty.fee)}</p>
				</section>
			</div>
		</div>

		<!-- Action Buttons -->
		<div
			class="mt-4 lg:mt-0 flex lg:flex-col space-y-4 lg:space-y-2 lg:space-x-4 xl:flex-row lg:mr-2"
		>
			<div class="flex space-x-2">
				{#if status === 'added'}
					<p class="lg:mt-3 xl:mt-4">Sub-curator</p>
				{/if}
				<div class="flex lg:flex-col xl:flex-row flex-wrap space-x-4">
					<div class="space-y-3">
						{#if getButtonText(status) !== ''}
							<div class="mt-3">
								<button
									on:click={onAssign}
									class="{statusColorClass} text-white rounded-md font-bold pt-1 px-4 min-w-32"
								>
									{getButtonText(status)}
								</button>
							</div>
						{/if}

						{#if status === 'added' || status === 'sub-curator proposed' || status === 'active'}
							<button
								class="border border-{statusColorClass} text-{statusColorClass} rounded-md font-bold pt-1 px-4 min-w-32"
							>
								CLOSE
							</button>
						{/if}
					</div>

					<!-- Apply flex-wrap to this div for wrapping the icons -->
					<div class="flex gap-2 mt-3 flex-wrap">
						<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoTreasuryIcon /></button>
						<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoPolkassembly /></button>
						<button class="w-5 h-5 lg:w-6 lg:h-6"><LogoSubscan /></button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.status {
		font-family: 'Overpass Italic';
	}

	.active {
		background-color: theme('colors.childBountyOrange');
	}

	.pending-payout {
		background-color: theme('colors.childBountyGreen');
	}

	.sub-curator-proposed {
		background-color: theme('colors.childBountyGray');
		opacity: 1;
	}

	.added {
		background-color: theme('colors.childBountyGray');
		opacity: 1;
	}
</style>
