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
	import { firstValueFrom } from 'rxjs';
	import {
		hideLoadingDialog,
		showErrorDialog,
		showLoadingDialog
	} from '../../utils/loading-screen';
	import { getApi } from '../../utils/polkadot';

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
				const api = await getApi();
				let bountyDescription = (
					await firstValueFrom(api.query.bounties.bountyDescriptions(bountyId))
				).toHuman() as string;
				if (!bountyDescription) {
					showErrorDialog('Failed to load bounty info');
					return;
				}

				bountyInfo = {
					id: Number(bountyId),
					description: bountyDescription,
					value: undefined
				};
				hideLoadingDialog();
			} catch {
				showErrorDialog('Failed to load bounty info');
			}
		}
	});
</script>

<div class="main flex justify-center items-center md:py-20 lg:py-40">
	<div class="container setup-container max-w-screen-lg rounded-md">
		<h2 class="my-5 font-bold text-2xl text-white">Bounty Setup</h2>
		<div class="frame border-accent rounded-md">
			<div class="flex relative h-20 px-8 bg-primary rounded-md">
				<div class="w-1/6">
					<BountySetupTab {activeTab} tabName={TABS[0]} bountySetupTabClicked={changeTab} />
				</div>
				<div class="w-1/6">
					<BountySetupTab {activeTab} tabName={TABS[1]} bountySetupTabClicked={changeTab} />
				</div>
				<div class="w-1/4">
					<BountySetupTab {activeTab} tabName={TABS[2]} bountySetupTabClicked={changeTab} />
				</div>
			</div>

			{#if activeTab === TABS[0]}
				<div class="main-content grid p-4">
					<div class="rounded-t-md overflow-clip">
						<BountyCreation bind:bountyInfo on:changeTab={changeTabEvent} />
					</div>
				</div>
			{:else if activeTab === TABS[1]}
				<div class="main-content grid p-4">
					<div class="rounded-t-md overflow-clip">
						<ApprovalReferendum bind:bountyInfo on:changeTab={changeTabEvent} />
					</div>
				</div>
			{:else}
				<div class="main-content grid p-4">
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
		@apply border border-y-accent border-x-0;
		background: linear-gradient(180deg, #311033 0%, #6c003d 100%);
	}
	.main-content {
		@apply rounded-b-md;
		background-color: theme('colors.backgroundContentWrapper');
	}

	.frame {
		border-width: 1px;
	}
</style>
