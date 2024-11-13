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

	export let url: string;
	export let icon: any;
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

<ExternalLinksDialog bind:open={externalLinksDialogOpen} {url} on:proceed={proceed} />

<button on:click={openExternalLinksDialog} class={`w-${dimension} h-${dimension}`}>
	<svelte:component this={icon} />
</button>
