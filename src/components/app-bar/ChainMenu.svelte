<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import { initializeApi } from '../../utils/initializeApi';
	import { getEndpoint } from '../../utils/endpoints';
	import Dropdown from '../common/DropdownMenu.svelte';
	import type { Labeled } from '../common/labeled';
	import { type Blockchain, blockchains, currentBlockchain } from './blockchains';

	let visible = false;

	onMount(() => {
		const isPaseoSelected = sessionStorage.getItem('node') === blockchains[1].endpoint;
		$currentBlockchain = isPaseoSelected ? blockchains[1] : blockchains[0];
		visible = true;
	});

	async function handleChainChange(chain: Labeled) {
		$currentBlockchain = chain as Blockchain;
		sessionStorage.setItem('node', $currentBlockchain.endpoint);
		await initializeApi([getEndpoint()]);
		await fetchBountiesAndChildBounties();
	}
</script>

{#if visible}
	<Dropdown
		items={blockchains}
		selectedItem={$currentBlockchain}
		change={handleChainChange}
		widthContainer="w-[70px]"
		widthDropdown="w-[200px]"
		textAlign="text-start"
		useLogos={true}
		bgColor="pink"
	/>
{/if}
