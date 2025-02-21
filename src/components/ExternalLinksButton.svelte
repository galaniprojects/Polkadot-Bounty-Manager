<script lang="ts" context="module">
	export function openLinkNewTab(link: string) {
		const newTab = window.open(link, '_blank');
		if (newTab) {
			newTab.focus();
		}
	}
</script>

<script lang="ts">
	import ExternalLinksDialog from './ExternalLinksDialog.svelte';

	export let icon: string;
	export let url: string;
	export let dimension: number = 10;

	let externalLinksDialogOpen = false;

	function openExternalLinksDialog() {
		externalLinksDialogOpen = true;
	}

	function proceed() {
		openLinkNewTab(url);
		externalLinksDialogOpen = false;
	}
</script>

<ExternalLinksDialog bind:open={externalLinksDialogOpen} {url} {proceed} />

<button on:click={openExternalLinksDialog} class={`w-${dimension} h-${dimension}`}>
	<img src={icon} alt="" />
</button>
