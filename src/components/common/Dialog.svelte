<script lang="ts">
	import { writable } from 'svelte/store';
	import { clickAway, modalStyles as styles, showModal } from '../Modal/tools';
	import CloseModalButton from '../Modal/CloseModalButton.svelte';

	export let open = false;
	export let title = '';

	const openStore = writable(open);

	// bidirectional syncing
	$: openStore.set(open);
	openStore.subscribe((value) => {
		open = value;
	});
</script>

<dialog use:showModal={openStore} use:clickAway class={styles.dialog}>
	<CloseModalButton />

	<h2 class={styles.title}>
		{title}
	</h2>

	<slot />
</dialog>
