<script lang="ts">
	import { clickAway, modalStyles as styles } from '../Modal/tools';
	import CloseModalButton from '../Modal/CloseModalButton.svelte';

	export let dialog: HTMLDialogElement;
	export let title = '';
</script>

<dialog bind:this={dialog} onclick={clickAway} class={styles.dialog}>
	<div class={styles.innerWrapper}>
		<CloseModalButton />

		<h2 class={styles.title}>
			{title}
		</h2>

		<slot />
	</div>
</dialog>
