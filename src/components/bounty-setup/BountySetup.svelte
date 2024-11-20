<script lang="ts" context="module">
	export const TABS = ['Creation', 'Approval', 'Curator Proposal'];
	export const TABS_QUERY_PARAMS = ['creation', 'approval', 'curator-proposal'];
	export type BountyTab = (typeof TABS)[number];
	export type BountyInfo = {
		id?: number;
		description?: string;
		value?: bigint;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import ApprovalReferendum from './ApprovalReferendum.svelte';
	import BountyCreation from './BountyCreation.svelte';
	import BountySetupTab from './BountySetupTab.svelte';
	import CuratorProposal from './CuratorProposal.svelte';
	import {
		hideLoadingDialog,
		showErrorDialog,
		showLoadingDialog
	} from '../../utils/loading-screen';
	import { dotApi } from '../../stores';

	let bountyInfo: BountyInfo = {};

	let activeTab = TABS[0];
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	function changeTabEvent(event: any) {
		changeTab(event.detail.tab);
	}

	function changeTab(tab: BountyTab) {
		activeTab = tab;

		const urlParams = new URLSearchParams(window.location.search);

		if (tab === TABS[0]) {
			urlParams.set('step', TABS_QUERY_PARAMS[0]);
		} else if (tab === TABS[1]) {
			urlParams.set('step', TABS_QUERY_PARAMS[1]);
		} else if (tab === TABS[2]) {
			urlParams.set('step', TABS_QUERY_PARAMS[2]);
		}
		const url = new URL(window.location.toString());
		history.pushState({}, '', `${url.pathname}?${urlParams.toString()}`);

		return undefined;
	}
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);

		let step = urlParams.get('step');
		if (step) {
			if (step === TABS_QUERY_PARAMS[0]) {
				activeTab = TABS[0];
			} else if (step === TABS_QUERY_PARAMS[1]) {
				activeTab = TABS[1];
			} else if (step === TABS_QUERY_PARAMS[2]) {
				activeTab = TABS[2];
			}
		}

		let bountyId = urlParams.get('bounty-id');
		if (bountyId) {
			showLoadingDialog('Loading bounty info');
			try {
				const bountyDescription = await $dotApi.query.Bounties.BountyDescriptions.getValue(
					Number(bountyId)
				);
				if (!bountyDescription) {
					showErrorDialog('Failed to load bounty info');
					return;
				}

				bountyInfo = {
					id: Number(bountyId),
					description: bountyDescription.asText(),
					value: undefined
				};
				hideLoadingDialog();
			} catch {
				showErrorDialog('Failed to load bounty info');
			}
		}
	});
</script>

<div
	class="main border border-y-accent border-x-0 flex justify-center items-center md:py-20 lg:py-40"
>
	<div class="container setup-container max-w-screen-lg rounded-md p-4 space-y-5">
		<h2 class="font-bold text-lg sm:text-2xl text-white text-start">Bounty Setup</h2>
		<div class="border border-accent rounded-md overflow-clip">
			<div class="flex relative h-16 sm:h-20 px-2 md:px-8 bg-primary rounded-md">
				<div class="w-1/3 md:w-1/6">
					<BountySetupTab {activeTab} tabName={TABS[0]} bountySetupTabClicked={changeTab} />
				</div>
				<div class="w-1/3 md:w-1/6">
					<BountySetupTab {activeTab} tabName={TABS[1]} bountySetupTabClicked={changeTab} />
				</div>
				<div class="w-1/3 md:w-1/4">
					<BountySetupTab {activeTab} tabName={TABS[2]} bountySetupTabClicked={changeTab} />
				</div>
			</div>

			{#if activeTab === TABS[0]}
				<div class="rounded-md bg-backgroundContentWrapper flex-col p-4">
					<div class="rounded-t-md overflow-clip">
						<BountyCreation bind:bountyInfo on:changeTab={changeTabEvent} />
					</div>
				</div>
			{:else if activeTab === TABS[1]}
				<div class="rounded-md bg-backgroundContentWrapper flex-col p-4">
					<div class="rounded-t-md overflow-clip">
						<ApprovalReferendum bind:bountyInfo on:changeTab={changeTabEvent} />
					</div>
				</div>
			{:else}
				<div class="rounded-md bg-backgroundContentWrapper flex-col p-4 sm:min-h-[500px]">
					<div class="rounded-t-md overflow-clip">
						<CuratorProposal bind:bountyInfo />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.main {
		background: linear-gradient(180deg, #311033 0%, #6c003d 100%);
	}
</style>
