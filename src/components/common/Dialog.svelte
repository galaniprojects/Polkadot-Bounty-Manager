<script lang="ts">
	import { clickAway, modalStyles as styles } from '../Modal/tools';
	import CloseModalButton from '../Modal/CloseModalButton.svelte';

	export let dialog: HTMLDialogElement;
	export let title = '';
</script>

<dialog bind:this={dialog} on:click={clickAway} class={styles.dialog}>
	<CloseModalButton />

	<h2 class={styles.title}>
		{title}
	</h2>

	<slot />
</dialog>
