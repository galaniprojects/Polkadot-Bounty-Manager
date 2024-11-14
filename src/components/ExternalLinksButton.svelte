<script lang="ts" context="module">
	export function openLinkNewTab(link: string) {
		let newTab = window.open(link, '_blank');
		if (newTab) {
			newTab.focus();
		}
	}
</script>

<script lang="ts">
	import ExternalLinksDialog from './ExternalLinksDialog.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let icon: any;
	export let url: string;
	export let dimension: number = 10;
	export let backgroundColor: string = 'curatorMainBackground';
	export let textColor: string = 'white';
	export let buttonStyle: string = 'bg-white text-accent';

	let externalLinksDialogOpen = false;

	function openExternalLinksDialog() {
		externalLinksDialogOpen = true;
	}

	function proceed() {
		openLinkNewTab(url);
		externalLinksDialogOpen = false;
	}
</script>

<ExternalLinksDialog
	bind:open={externalLinksDialogOpen}
	{url}
	on:proceed={proceed}
	{backgroundColor}
	{textColor}
	{buttonStyle}
/>

<button on:click={openExternalLinksDialog} class={`w-${dimension} h-${dimension}`}>
	<svelte:component this={icon} />
</button>
