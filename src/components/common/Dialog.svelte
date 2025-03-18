<script lang="ts">
	import { clickAway, modalStyles as styles } from '../Modal/tools';
	import CloseModalButton from '../Modal/CloseModalButton.svelte';

	export let dialog: HTMLDialogElement;
	export let title = '';
</script>

<dialog bind:this={dialog} on:click={clickAway} class="dialogStyle">
	<div class={styles.dialog}>
	<CloseModalButton />

	<h2 class={styles.title}>
		{title}
	</h2>

	<slot />
</div>
</dialog>

<style>
	.dialogStyle{
		border-radius: 0.375rem;
	}
</style>
