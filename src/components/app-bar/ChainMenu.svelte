<script lang="ts">
	import Dropdown, { type Labeled } from '../common/DropdownMenu.svelte';
	import coin from '../Input/coin.svg';
	import logoPaseo from './LogoPaseo.svg';
	import coinInverted from './LogoPolkadot.svg';
	import paseoInverted from './LogoPaseoInverted.svg';

	const chains: Labeled[] = [
		{ label: 'Polkadot', logo: coin, invertedLogo: coinInverted },
		{ label: 'Paseo', logo: logoPaseo, invertedLogo: paseoInverted }
	];

	let selectedChain: Labeled = chains[0];

	function handleChainChange(chain: Labeled) {
		selectedChain = chain;
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
