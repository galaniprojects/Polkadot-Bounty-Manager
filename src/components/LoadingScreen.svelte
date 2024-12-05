<script lang="ts">
	import type { LoadingDialogState } from '../types/loading-screen';
	import Dialog from './common/Dialog.svelte';

	export let dialogState: LoadingDialogState;
</script>

<Dialog
	bind:open={dialogState.open}
	title={dialogState.title}
	dismissable={!(dialogState.status === 'loading')}
>
	<div class="mt-5 place-self-center text-xl">
		{#if dialogState.status === 'loading'}
			<div class="flex-col space-y-3 text-center">
				<p>This might take a moment</p>
				<span class="loader"></span>
			</div>
		{/if}
		{#if dialogState.status === 'success'}
			<p>{dialogState.successMessage}</p>
		{/if}

		{#if dialogState.status === 'error'}
			<span>{dialogState.errorMessage}</span>
		{/if}
	</div>
</Dialog>

<style>
	.loader {
		width: 50px;
		height: 50px;
		border: 7px solid var(--color-darkgray);
		border-bottom-color: var(--color-primary);
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
