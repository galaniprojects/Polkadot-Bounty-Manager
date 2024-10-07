<script lang="ts">
	import CloseIcon from './svg/CloseIcon.svelte';

	export let open = true;
	export let title = '';
	export let dismissable = true;
	export let backgroundColor = 'curatorMainBackground';
	export let textColor: string = 'white';

	const colorVariants = {
		white: 'fill-white',
		primary: 'fill-primary'
	};

	function isValidColor(color: string): color is 'white' | 'primary' {
		return color === 'white' || color === 'primary';
	}

	function getColorClass(color: string): string {
		if (isValidColor(color)) {
			return colorVariants[color];
		}
		return colorVariants['white'];
	}
</script>

{#if open}
	<div
		class="flex justify-center fixed inset-0 w-screen h-screen z-9 behind-dialog-color opacity-40"
	></div>
	<div class="flex justify-center fixed inset-0 w-screen h-screen z-10 py-52">
		<div
			class={`w-[363px] md:w-[490px] min-h-52 h-fit p-6 pt-2 md:px-7 md:py-6 rounded-md text-${textColor} bg-${backgroundColor}`}
		>
			<div class="flex justify-end">
				{#if dismissable}
					<button class={getColorClass(textColor)} on:click={() => (open = false)}>
						<CloseIcon />
					</button>
				{/if}
			</div>
			<div>
				<p class="text-2xl">
					{title}
				</p>
			</div>

			<slot></slot>
		</div>
	</div>
{/if}

<style>
	.behind-dialog-color {
		background-color: rgba(0, 0, 0, 0.66);
	}
</style>
