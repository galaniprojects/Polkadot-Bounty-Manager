<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import { initializeApi } from '../../utils/initializeApi';
	import { getEndpoint } from '../../utils/endpoints';
	import Dropdown from '../common/DropdownMenu.svelte';
	import coin from '../Input/coin.svg';
	import logoPaseo from './LogoPaseo.svg';
	import coinInverted from './LogoPolkadot.svg';
	import paseoInverted from './LogoPaseoInverted.svg';
	import type { Labeled } from '../common/labeled';

	const chains = [
		{
			label: 'Polkadot',
			logo: coin,
			invertedLogo: coinInverted,
			endpoint: ''
		},
		{
			label: 'Paseo',
			logo: logoPaseo,
			invertedLogo: paseoInverted,
			endpoint: 'wss://paseo-rpc.dwellir.com'
		}
	];

	let visible = false;
	let selectedChain = chains[0];

	onMount(() => {
		const isPaseoSelected = sessionStorage.getItem('node') === chains[1].endpoint;
		selectedChain = isPaseoSelected ? chains[1] : chains[0];
		visible = true;
	});

	async function handleChainChange(chain: Labeled) {
		selectedChain = chain as typeof selectedChain;
		sessionStorage.setItem('node', selectedChain.endpoint);
		await initializeApi([getEndpoint()]);
		await fetchBountiesAndChildBounties();
	}
</script>

{#if visible}
	<Dropdown
		items={chains}
		selectedItem={selectedChain}
		change={handleChainChange}
		widthContainer="w-[70px]"
		widthDropdown="w-[200px]"
		textAlign="text-start"
		useLogos={true}
		bgColor="pink"
	/>
{/if}
