<script lang="ts">
	export let bountySetupTabClicked: (tabName: string) => undefined;
	export let activeTab: string;
	export let tabName: string;
	export let tabNumber: number;
</script>

<div>
	<button
		class="flex rounded-t-md justify-center items-center w-full h-full
    {activeTab !== tabName
			? 'bg-white text-gray-500'
			: 'bg-white border-x-2 border-t-2 border-t-gray-300 border-x-gray-300 zoom'}"
		on:click={() => {
			bountySetupTabClicked(tabName);
		}}
	>
		<div class="circle">{tabNumber}</div>
		{tabName}
	</button>
</div>

<style>
	/* zoom the tab vertically to hide the border underneath */
	.zoom {
		z-index: 1;
		transform: scaleY(1.07);
	}
	.circle {
		margin-right: 5px;
		padding-top: 2px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
		background-color: theme('colors.accent');
		color: white;
		border-radius: 50%;
		font-size: 13px;
		font-weight: bold;
	}
</style>
