<script lang="ts">
	import ChildBountyCard from './ChildBountyCard.svelte';
	import CuratorItem from './CuratorItem.svelte';
	import InfoSvg from '../svg/InfoIcon.svelte';
	import LogoPolkassembly from '../svg/LogoPolkassembly.svelte';
	import LogoTreasuryIcon from '../svg/LogoTreasuryIcon.svelte';
	import LogoSubscan from '../svg/LogoSubscan.svelte';
	import type { Bounty } from '../../types/bounty';
	import AcceptCuratorRule from './AcceptCuratorRule.svelte';
	import MagnifyingIcon from '../svg/MagnifyingIcon.svelte';
	import AccordionItemHeader from './AccordionItemHeader.svelte';
	import { convertPlanckToDot } from '../../utils/polkadot';
	import { onMount } from 'svelte';
	import ChildBountiesSection from './ChildBountiesSection.svelte';

	export let bounty: Bounty;
	let acceptCuratorRuleDialogOpened = false;

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
	let expanded = false;

	function handleCuratorsToggleClick() {
		curatorsExpended = !curatorsExpended;
	}

	function handleToggleClick() {
		expanded = !expanded;
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
</script>

<div class="bg-curatorMainBackground overflow-x-hidden rounded-md my-6">
	<!-- Desktop design -->
	<div class="container mx-auto hidden lg:grid lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1">
		<AccordionItemHeader {bounty} {status}></AccordionItemHeader>

		<!-- Content Section -->
		{#if !expanded}
			<div class="p-3 pt-6 flex flex-col lg:flex-row justify-between text-white lg:pr-0 xl:pr-28">
				<div class="first-column flex flex-col gap-3 justify-start lg:ml-7 lg:flex-1">
					<section class="flex flex-col lg:flex-row space-x-10">
						<div>
							<p class="text-xs">Bounty Value</p>
							<p class="text-2xl"><span>{convertPlanckToDot(bounty.value)}</span> DOT</p>
						</div>

						<div class="curator-section mt-4 lg:ml-0 lg:mt-0 w-full lg:w-auto">
							<!-- CURATORS  -->
							<p class="text-xs">Curator ({curators.length})</p>
							<div class="flex items-center space-x-1">
								<p class="main-curator break-words lg:break-normal">{getCurator() || '-'}</p>
								<button class="material-symbols-outlined w-6 h-6">content_copy</button>
								<button
									class="material-symbols-outlined flex justify-center items-center border border-white text-white rounded-full w-5 h-5 text-lg ml-3"
									on:click={handleCuratorsToggleClick}
								>
									{#if curatorsExpended}
										keyboard_arrow_up
									{:else}
										keyboard_arrow_down
									{/if}
								</button>
							</div>

							{#if curatorsExpended}
								<div class="mt-1">
									{#each curators as curator, index}
										<CuratorItem {index} {curator} />
									{/each}
								</div>
							{/if}
						</div>

						<div class="ml-2 mt-4 lg:mt-0">
							<p class="text-xs">Curator Fee</p>
							<p class="text-md"><span>{convertPlanckToDot(bounty.fee)}</span> DOT</p>
						</div>
					</section>

					<section class="text-xs max-w-52">
						<p>Description</p>
						<p>
							This proposal stems from the need to enhance system upgrade testing procedures,
							minimizing feature regression. Recent discussions in various channels, spurred by …
						</p>
					</section>
				</div>

				<section class="flex flex-row-reverse xl:items-start space-x-4">
					<div class="flex flex-col items-end">
						{#if status === 'proposed' || status === 'approved' || status === 'funded'}
							<div
								class="flex lg:flex-col xl:flex-row xl:space-x-3 lg:space-y-2 items-end text-sm xl:mr-4 lg:mr-7"
							>
								<p class="text-center">Curator Rule</p>
								<div class="space-x-2">
									<button
										on:click={() => {
											window.location = '/';
										}}
										class="bg-accent rounded-md font-bold min-w-32 pt-1">PROPOSE</button
									>
									<button class="pt-1 w-5 h-5"><InfoSvg /></button>
								</div>
							</div>
						{/if}
						<div
							class="flex lg:flex-col xl:flex-row xl:space-x-3 lg:space-y-2 items-end text-sm xl:mr-4 lg:mr-7"
						>
							<p class="text-center">Add Beneficiary Claim Form</p>
							<div class="space-x-2">
								<button class="bg-accent rounded-md font-bold min-w-32 pt-1">ADD</button>
								<button class="pt-1 w-5 h-5"><InfoSvg /></button>
							</div>
						</div>
					</div>

					<!-- ToDo: change place after design final -->
					<!-- <p>Award Bounty</p> -->
					<!-- <button class="bg-accent rounded-md font-bold min-w-32 pt-1">READ FIRST</button> -->
				</section>
			</div>
			{#if status === 'active' || status === 'pending payout'}
				<ChildBountiesSection bounty={bounty} childBounties={bounty.childBounties} />
			{/if}
		{/if}
	</div>
</div>
{#if acceptCuratorRuleDialogOpened}
	<AcceptCuratorRule bind:open={acceptCuratorRuleDialogOpened} {bounty} />
{/if}

<style>
	hr {
		box-shadow: 0 -1px 0 0 gray;
	}
</style>
