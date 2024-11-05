<script lang="ts">
	export let show: boolean;
	export let text: string;
</script>

<div class="relative">
	{#if show}
		<div class="tooltip show absolute bg-primary text-white rounded text-sm py-1 px-2 z-50">
			{text}
		</div>
	{/if}
</div>

<style>
	.tooltip {
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	.tooltip.show {
		opacity: 1;
	}
</style>
