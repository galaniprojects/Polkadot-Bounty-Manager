<script lang="ts" context="module">
	export function openLinkNewTab(link: string) {
		const newTab = window.open(link, '_blank');
		if (newTab) {
			newTab.focus();
		}
	}
</script>

<script lang="ts">
	import ExternalLinksModal from './ExternalLinksModal.svelte';

	export let icon: string;
	export let url: string;
	export let dimension: number = 10;

	let externalLinksDialog: HTMLDialogElement;

	function openExternalLinksDialog() {
		externalLinksDialog.showModal();
	}

	function proceed() {
		openLinkNewTab(url);
		externalLinksDialog.close();
	}
</script>

<ExternalLinksModal bind:dialog={externalLinksDialog} {url} {proceed} />

<button on:click={openExternalLinksDialog} class={`w-${dimension} h-${dimension}`}>
	<img src={icon} alt="" />
</button>
