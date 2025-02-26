<script lang="ts" module>
	import Dialog from '../common/Dialog.svelte';

	let title = '';
	let message = '';
	let open = false;

	export function show(titleString: string, messageString: string) {
		title = titleString;
		message = messageString;
		open = true;
	}
</script>

<Dialog bind:open {title}>
	<output>
		{message}
	</output>
</Dialog>
