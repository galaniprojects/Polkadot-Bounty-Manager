<script lang="ts" context="module">
	export const TABS = ['Bounty Creation', 'Approval', 'Curator Proposal'];
	export type BountyTab = (typeof TABS)[number];
</script>

<script lang="ts">
	import ApprovalReferendum from './ApprovalReferendum.svelte';
	import BountyCreation from './BountyCreation.svelte';
	import BountySetupTab from './BountySetupTab.svelte';
	import CuratorProposal from './CuratorProposal.svelte';

	let activeTab = TABS[0];

	function onTabClick(tab: BountyTab) {
		activeTab = tab;
		return undefined;
	}
</script>

<div class="flex justify-center items-center md:py-20 lg:py-40">
	<div class="container setup-container max-w-screen-lg">
		<h2 class="my-5 font-bold text-2xl">Bounty Setup</h2>
		<div class="grid grid-cols-3 h-14 gap-3">
			<BountySetupTab
				{activeTab}
				tabName={TABS[0]}
				tabNumber={1}
				bountySetupTabClicked={onTabClick}
			/>
			<BountySetupTab
				{activeTab}
				tabName={TABS[1]}
				tabNumber={2}
				bountySetupTabClicked={onTabClick}
			/>
			<BountySetupTab
				{activeTab}
				tabName={TABS[2]}
				tabNumber={3}
				bountySetupTabClicked={onTabClick}
			/>
		</div>

		{#if activeTab === TABS[0]}
			<div class="main-content grid bg-white border-2 border-gray-300 p-4">
				<div class="rounded-t-md bg-gray-100 overflow-clip">
					<BountyCreation />
				</div>
			</div>
		{:else if activeTab === TABS[1]}
			<div class="main-content grid bg-white border-2 border-gray-300 p-4">
				<div class="rounded-t-md bg-gray-100 overflow-clip">
					<ApprovalReferendum />
				</div>
			</div>
		{:else}
			<div class="main-content grid bg-white border-2 border-gray-300 p-4">
				<div class="rounded-t-md bg-gray-100 overflow-clip">
					<CuratorProposal />
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.setup-container {
		min-height: 800px;
	}

	.main-content {
		background-color: theme('colors.backgroundContentWrapper');
	}
</style>
