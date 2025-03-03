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

		{#if dialogState.status === 'error'}
			<span>{dialogState.errorMessage}</span>
		{/if}
	</div>

	{#if dialogState.status === 'success'}
		<p class="mb-3 text-xl">{dialogState.successMessage}</p>
		{#if dialogState.callData}
			<div class="flex items-center">
				<p>Call Data:</p>
				<button
					onclick={async () => {
						if (dialogState.callData) await navigator.clipboard.writeText(dialogState.callData);
					}}
					class="ml-2"
				>
					<span class="material-symbols-outlined place-self-center mb-1 text-lg">
						content_copy
					</span>
				</button>
			</div>
			<div
				class="mt-1 bg-lightGray max-w-[400px] max-h-[100px] overflow-y-scroll break-all rounded-md p-2"
			>
				<p>{dialogState.callData}</p>
			</div>
		{/if}
	{/if}
</Dialog>

<style>
	.loader {
		width: 50px;
		height: 50px;
		border: 7px solid theme('colors.backgroundButtonLight');
		border-bottom-color: theme('colors.backgroundButtonDark');
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
