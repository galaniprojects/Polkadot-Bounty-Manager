<script lang="ts">
	import { modalStyles } from '../Modal/tools';
	import { dialog as ref, title, message } from './loadingModalStores';
</script>

<dialog bind:this={$ref} class={modalStyles.dialog}>
	<h2 class={modalStyles.title}>
		{$title}
	</h2>

	<div class="text-center">
		<!-- message gotta change according to where the dialog is called -->
		<p class={modalStyles.output}>{$message}</p>
		<span class="loader mt-3"></span>
	</div>
</dialog>

<style>
	.loader {
		width: 50px;
		height: 50px;
		border: 7px solid theme('colors.backgroundButtonLight');
		border-bottom-color: theme('colors.backgroundButtonDark');
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
