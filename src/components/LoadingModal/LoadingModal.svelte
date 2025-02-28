<script lang="ts">
	import { modalStyles, showModal } from '../Modal/tools';
	import { title, open } from './loadingModalStores';

	function preventCloseOnEscKey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
		}
	}

	$effect(() => {
		if ($open) {
			document.addEventListener('keydown', preventCloseOnEscKey);
		} else {
			document.removeEventListener('keydown', preventCloseOnEscKey);
		}

		return () => {
			document.removeEventListener('keydown', preventCloseOnEscKey);
		};
	});
</script>

<dialog use:showModal={open} class={modalStyles.dialog}>
	<h2 class={modalStyles.title}>
		{$title}
	</h2>

	<div class="text-center">
		<p class={modalStyles.output}>This might take a moment</p>
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
