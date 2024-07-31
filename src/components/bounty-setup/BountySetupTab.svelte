<script lang="ts">
	let {
		bountySetupTabClicked,
		activeTab,
		tabName
	}: {
		bountySetupTabClicked: (tabName: string) => undefined;
		activeTab: string;
		tabName: string;
	} = $props();
</script>

<div>
	<button
		class="flex rounded-t-md justify-center items-center w-full h-full
    {activeTab !== tabName
			? 'bg-white text-gray-500'
			: 'bg-white border-x-2 border-t-2 border-t-gray-300 border-x-gray-300 zoom'}"
		onclick={() => {
			bountySetupTabClicked(tabName);
		}}
	>
		{tabName}
	</button>
</div>

<style>
	/* zoom the tab vertically to hide the border underneath */
	.zoom {
		z-index: 1;
		transform: scaleY(1.07);
	}
</style>
