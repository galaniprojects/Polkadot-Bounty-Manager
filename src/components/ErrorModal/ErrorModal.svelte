<script lang="ts" module>
	import Dialog from '../common/Dialog.svelte';

	let message = '';
	let open = false;

	export function show(messageString: string) {
		message = messageString;
		open = true;
	}
</script>

<Dialog bind:open title="Error">
	<output>
		{message}
	</output>
</Dialog>
