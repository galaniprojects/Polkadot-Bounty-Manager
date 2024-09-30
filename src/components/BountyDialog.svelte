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
	<div class="flex justify-center fixed inset-0 w-screen h-screen z-10 py-52">
		<div
			class="w-[363px] md:w-[490px] h-fit p-6 pt-2 md:px-7 md:py-6 rounded-md text-white bg-curatorMainBackground"
		>
			<div class="flex justify-end">
				{#if dismissable}
					<button on:click={() => (opened = false)}>
						<CloseIcon />
					</button>
				{/if}
			</div>
			<div>
				<p class="text-2xl">
					{title}
				</p>
			</div>

			<slot></slot>
		</div>
	</div>
{/if}

<style>
	.behind-dialog-color {
		background-color: rgba(0, 0, 0, 0.66);
	}
</style>
