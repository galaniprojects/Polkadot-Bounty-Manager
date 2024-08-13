<script lang="ts">
	export let bountySetupTabClicked: (tabName: string) => undefined;
	export let activeTab: string;
	export let tabName: string;
</script>

<div class="tab-bar rounded-md">
	<button
		class="text-2xl flex justify-center items-center w-full h-full
    {activeTab !== tabName ? ' text-gray-400 ' : ' text-white pb-5 border-b-accent border-b-4'}"
		on:click={() => {
			bountySetupTabClicked(tabName);
		}}
	>
		{tabName}
	</button>
</div>
