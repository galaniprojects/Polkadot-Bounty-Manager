<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBountiesAndChildBounties } from '../../utils/fetch-bounties';
	import { initializeApi } from '../../utils/initializeApi';
	import { endpoints } from '../../utils/endpoints';
	import Dropdown from '../common/DropdownMenu.svelte';
	import coin from '../Input/coin.svg';
	import logoPaseo from './LogoPaseo.svg';
	import coinInverted from './LogoPolkadot.svg';
	import paseoInverted from './LogoPaseoInverted.svg';
	import type { Labeled } from './labeled';

	const chains = [
		{
			label: 'Polkadot',
			logo: coin,
			invertedLogo: coinInverted,
			endpoint: endpoints[0]
		},
		{
			label: 'Paseo',
			logo: logoPaseo,
			invertedLogo: paseoInverted,
			endpoint: 'wss://paseo-rpc.dwellir.com'
		}
	];

	const isPaseoSelected =
		typeof sessionStorage !== 'undefined' && sessionStorage.getItem('node') === chains[1].endpoint;
	let selectedChain = isPaseoSelected ? chains[1] : chains[0];

	onMount(() => {
		const isPaseoSelected = sessionStorage.getItem('node') === chains[1].endpoint;
		selectedChain = isPaseoSelected ? chains[1] : chains[0];
	});

	async function handleChainChange(chain: Labeled) {
		selectedChain = chain as typeof selectedChain;
		sessionStorage.setItem('node', selectedChain.endpoint);
		await initializeApi([selectedChain.endpoint]);
		await fetchBountiesAndChildBounties();
	}
</script>

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
