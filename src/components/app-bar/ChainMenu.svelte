<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import { initializeApi } from '../../utils/initializeApi';
	import { activeAccount } from '../../stores';
	import { updateAccountMultisigsOnBlockchain } from '../curator-actions/updateAccountMultisigsOnBlockchain';
	import Dropdown from '../common/DropdownMenu.svelte';
	import type { Labeled } from '../common/labeled';
	import { type Blockchain, blockchains, currentBlockchain } from './blockchains';

	let visible = false;

	onMount(() => {
		visible = true;
	});

	async function handleChainChange(chain: Labeled) {
		const blockchain = chain as Blockchain;
		const { standard, endpoints } = blockchain;

		if (standard) {
			sessionStorage.removeItem('node');
		} else {
			sessionStorage.setItem('node', endpoints[0]);
		}

		$currentBlockchain = blockchain;
		await initializeApi(endpoints);

		if ($activeAccount) {
			await updateAccountMultisigsOnBlockchain($activeAccount);
		}

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
		backgroundColorContainer="bg-backgroundButtonLight"
		height="h-[50px]"
		positionOverlay="-mt-[50px]"
	/>
{/if}
