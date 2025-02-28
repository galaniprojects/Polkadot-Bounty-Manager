<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { modalStyles } from '../Modal/tools';
	import { open, message } from './showErrorModal';
</script>

<Dialog bind:open={$open} title="Error">
	<output class={modalStyles.output}>
		{$message}
	</output>
</Dialog>
