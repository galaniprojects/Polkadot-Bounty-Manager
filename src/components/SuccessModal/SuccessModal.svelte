<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { modalStyles } from '../Modal/tools';
	import { open, title, message } from './showSuccessModal';
</script>

<Dialog bind:open={$open} title={$title}>
	<output class={modalStyles.output}>
		{$message}
	</output>
</Dialog>
