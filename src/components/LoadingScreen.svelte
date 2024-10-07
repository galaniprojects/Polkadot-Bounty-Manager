<script lang="ts">
	import type { LoadingDialogState } from '../types/loading-screen';
	import BountyDialog from './BountyDialog.svelte';

	export let dialogState: LoadingDialogState;
</script>

<BountyDialog
	bind:open={dialogState.open}
	title={dialogState.title}
	dismissable={!(dialogState.status === 'loading')}
>
	<div class="h-full gap-3">
		{#if dialogState.status === 'loading'}
			<p class="mt-1">This might take a moment</p>
			<span class="loader"></span>
		{/if}
		{#if dialogState.status === 'success'}
			<p>{dialogState.successMessage}</p>
		{/if}
		{#if dialogState.status === 'error'}
			<p>
				<span class="text-accent font-bold">Error: </span>
				{dialogState.errorMessage}
			</p>
		{/if}
	</div>
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
