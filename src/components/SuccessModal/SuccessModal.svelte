<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { open, title, message } from './showSuccessModal';
</script>

<Dialog bind:open={$open} title={$title}>
	<output>
		{$message}
	</output>
</Dialog>
