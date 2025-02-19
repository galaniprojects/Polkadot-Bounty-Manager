<script lang="ts">
	import CloseIcon from '../svg/CloseIcon.svg';
	import { onDestroy } from 'svelte';

	export let open = false;
	export let title = '';
	export let dismissable = true;

	const classList = typeof document === 'undefined' ? undefined : document.body.classList;
	$: if (open) {
		classList?.add('overflow-hidden');
	} else {
		classList?.remove('overflow-hidden');
	}
	onDestroy(() => {
		classList?.remove('overflow-hidden');
	});
</script>

{#if open}
	<div class="flex justify-center fixed inset-0 w-screen z-10 bg-black bg-opacity-60"></div>
	<div
		class="flex justify-center fixed inset-0 w-screen z-20 items-center md:py-40 overflow-y-auto"
	>
		<div
			class="w-full s:w-[400px] md:w-[490px] min-h-52 h-fit p-3 pt-2 md:px-7 md:py-6 rounded-md text-textPrimary bg-backgroundApp"
		>
			<div class="flex justify-end">
				{#if dismissable}
					<button on:click={() => (open = false)}>
						<img src={CloseIcon} alt="Close icon" height="30" width="30" />
					</button>
				{/if}
			</div>
			<div>
				<p class="text-2xl pt-1 md:pt-0">
					{title}
				</p>
			</div>

			<slot></slot>
		</div>
	</div>
{/if}
