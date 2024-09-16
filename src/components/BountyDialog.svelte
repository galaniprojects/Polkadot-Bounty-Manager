<script lang="ts">
	import CloseIcon from './svg/CloseIcon.svelte';

	export let opened = true;
	export let title = '';
	export let dismissable = true;
</script>

{#if opened}
	<div
		class="flex justify-center fixed inset-0 w-screen h-screen z-9 behind-dialog-color opacity-40"
	></div>
	<div class=" flex justify-center fixed inset-0 w-screen h-screen z-10 py-52">
		<div
			class="w-[300px] md:w-[700px] h-[250px] shadow shadow-gray-500 rounded-md dialog-background-color"
		>
			<div class="flex justify-between">
				<p class="m-6 text-xl">
					{title}
				</p>
				{#if dismissable}
					<button class="m-4" on:click={() => (opened = false)}>
						>
						<CloseIcon />
					</button>
				{/if}
			</div>
			<div class="h-[120px]">
				<slot></slot>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-background-color {
		background-color: #e5e3ee;
	}
	.behind-dialog-color {
		background-color: rgba(0, 0, 0, 0.66);
	}
</style>
