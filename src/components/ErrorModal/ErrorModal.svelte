<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { open, message } from './showErrorModal';
</script>

<Dialog bind:open={$open} title="Error">
	<output>
		{$message}
	</output>
</Dialog>
