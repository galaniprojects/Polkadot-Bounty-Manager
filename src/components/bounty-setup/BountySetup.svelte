<script context="module">
	export const TABS = ['Bounty Creation', 'Referendum', 'Curator Proposal'];
	export type BountyTab = (typeof TABS)[number];
</script>

<script lang="ts">
	import BountySetupTab from './BountySetupTab.svelte';
	let activeTab = TABS[2];

	function onTabClick(tab: BountyTab) {
		activeTab = tab;
		return undefined;
	}
</script>

<div class="flex justify-center items-center md:py-20 lg:py-40 bg-cyan-50">
	<div class="container">
		<h2 class="my-5 font-bold"> 
			Bounty Setup
		</h2>
		<div class="grid grid-cols-3 h-14 gap-3">
			<BountySetupTab {activeTab} tabName={TABS[0]} bountySetupTabClicked={onTabClick} />
			<BountySetupTab {activeTab} tabName={TABS[1]} bountySetupTabClicked={onTabClick} />
			<BountySetupTab {activeTab} tabName={TABS[2]} bountySetupTabClicked={onTabClick} />
		</div>
		<div class="grid h-100 w-100 bg-white border-2 border-gray-300 ">
			<h1>placeholder</h1>
		</div>
	</div>
</div>
