<script context="module">
	export const TABS = ['Bounty Creation', 'Referendum', 'Curator Proposal'];
	export type BountyTab = (typeof TABS)[number];
</script>

<script lang="ts">
	import BountyCreation from './BountyCreation.svelte';
	import BountySetupTab from './BountySetupTab.svelte';
	let activeTab = TABS[2];

	function onTabClick(tab: BountyTab) {
		activeTab = tab;
		return undefined;
	}
</script>

<div class="flex justify-center items-center md:py-20 lg:py-40 bg-cyan-50">
	<div class="container max-w-screen-lg">
		<h2 class="my-5 font-bold text-2xl ">Bounty Setup</h2>
		<div class="grid grid-cols-3 h-14 gap-3">
			<BountySetupTab {activeTab} tabName={TABS[0]} bountySetupTabClicked={onTabClick} />
			<BountySetupTab {activeTab} tabName={TABS[1]} bountySetupTabClicked={onTabClick} />
			<BountySetupTab {activeTab} tabName={TABS[2]} bountySetupTabClicked={onTabClick} />
		</div>
		<div class="grid bg-white border-2 border-gray-300 p-4">
			<div class="rounded-t-md bg-gray-100 overflow-clip">
				<BountyCreation />
			</div>
		</div>
	</div>
</div>
