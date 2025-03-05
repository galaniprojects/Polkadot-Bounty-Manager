<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { modalStyles } from '../Modal/tools';
	import { dialog, title, message, callData } from './showSuccessModal';
</script>

<Dialog bind:dialog={$dialog} title={$title}>
	<output class={modalStyles.output}>
		{$message}
	</output>

	{#if $callData}
		<div class="flex items-center">
			<p>Call Data:</p>
			<button
				onclick={async () => {
					await navigator.clipboard.writeText($callData);
				}}
				class="ml-2"
			>
				<span class="material-symbols-outlined place-self-center mb-1 text-lg">content_copy</span>
			</button>
		</div>
		<div
			class="mt-1 bg-lightGray max-w-[400px] max-h-[100px] overflow-y-scroll break-all rounded-md p-2"
		>
			<p>{$callData}</p>
		</div>
	{/if}
</Dialog>
