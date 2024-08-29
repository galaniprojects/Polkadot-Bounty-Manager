<script context="module" lang="ts">
	export enum LoadingState {
		Loading,
		Success,
		Error
	}
</script>

<script lang="ts">
	import BountyDialog from './BountyDialog.svelte';
	export let state: LoadingState = LoadingState.Loading;
	export let opened = true;
	export let errorMessage = '';
</script>

<BountyDialog
	bind:opened
	title="Submitting Transaction"
	dismissable={!(state === LoadingState.Loading)}
>
	<div class="flex h-full justify-center items-center gap-3 px-7">
		{#if state === LoadingState.Loading}
			<p class="mt-1">This might take a moment</p>
			<span class="loader"></span>
		{/if}
		{#if state === LoadingState.Success}
			<p>Operation Success</p>
		{/if}
		{#if state === LoadingState.Error}
			<p>
				<span class="text-accent font-bold">Error: </span>
				{#if !errorMessage}
					Something went wrong
				{:else}
					 {errorMessage}
				{/if}
			</p>
		{/if}
	</div>

	<div></div>
</BountyDialog>

<style>
	.loader {
		width: 30px;
		height: 30px;
		border: 5px solid theme('colors.darkgray');
		border-bottom-color: theme('colors.primary');
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
