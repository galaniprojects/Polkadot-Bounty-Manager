<script lang="ts">
	import { onMount } from 'svelte';

	let isExpanded = false;
	let isOverflowing = false;
	let container: any;
	export let description: string;

	function checkOverflow() {
		if (container) {
			isOverflowing = container.scrollHeight > container.clientHeight;
		}
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	onMount(checkOverflow);
</script>
<p>
  Description
</p>
<div bind:this={container} class="content-container {isExpanded ? 'expanded' : ''}">
	{@html description}
</div>

{#if isOverflowing}
	<div class="w-full flex justify-end">
		<button class="expand-button" on:click={toggleExpand}>
			{isExpanded ? 'Show Less <' : 'Show More >'}
		</button>
	</div>
{/if}

<style>
	.content-container {
		max-height: 100px;
		overflow: hidden;
		transition: max-height 0.3s ease;
	}

	.expanded {
		max-height: none;
	}

	.expand-button {
		margin-top: 10px;
	}
</style>
