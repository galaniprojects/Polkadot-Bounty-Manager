<script lang="ts">
	import Dialog from '../common/Dialog.svelte';
	import { modalStyles } from '../Modal/tools';
	import { dialog, title, message } from './showSuccessModal';
</script>

<Dialog bind:dialog={$dialog} title={$title}>
	<output class={modalStyles.output}>
		{$message}
	</output>
</Dialog>
