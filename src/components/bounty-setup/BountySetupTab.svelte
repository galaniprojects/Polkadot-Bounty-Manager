<script lang="ts">
	export let bountySetupTabClicked: (tabName: string) => undefined;
	export let activeTab: string;
	export let tabName: string;
</script>

<div class="tab-bar rounded-md w-full h-full">
	<button
		class="text-2xl flex justify-center items-center w-full h-full pt-2
    {activeTab !== tabName
			? 'text-gray-400 border-b-transparent border-b-4'
			: 'text-white border-b-accent border-b-4'}"
		on:click={() => {
			bountySetupTabClicked(tabName);
		}}
	>
		{tabName}
	</button>
</div>
