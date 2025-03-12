import { writable } from 'svelte/store';
import coin from '../Input/coin.svg';
import coinInverted from './LogoPolkadot.svg';
import logoPaseo from './LogoPaseo.svg';
import paseoInverted from './LogoPaseoInverted.svg';
import { hideTestBar } from '../../utils/hideTestBar';

export const blockchains = [
	{
		id: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		label: 'Polkadot',
		logo: coin,
		invertedLogo: coinInverted,
		standard: true,
		endpoints: [
			'wss://polkadot-rpc.publicnode.com/',
			'wss://rpc.ibp.network/polkadot',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc-polkadot.luckyfriday.io',
			'wss://dot-rpc.stakeworld.io',
			'wss://polkadot.api.onfinality.io/public-ws'
		].sort(() => Math.sign(Math.random() - 0.5)),
		baseUrls: {
			doTreasury: 'https://polkadot.dotreasury.com',
			doTreasuryApi: 'https://polkadot-api.dotreasury.com',
			stateScanGraphqlApi: 'https://dot-gh-api.statescan.io/graphql',
			subScan: 'https://polkadot.subscan.io',
			subSquare: 'https://polkadot.subsquare.io',
			polkAssembly: 'https://polkadot.polkassembly.io'
		}
	} as const,
	{
		id: 'polkadot:77afd6190f1554ad45fd0d31aee62aac',
		label: 'Paseo',
		logo: logoPaseo,
		invertedLogo: paseoInverted,
		endpoints: ['wss://paseo-rpc.dwellir.com'],
		baseUrls: {
			subScan: 'https://paseo.subscan.io',
			subSquare: 'https://paseo.subsquare.io',
			polkAssembly: 'https://paseo.polkassembly.io'
		}
	} as const,
	...(hideTestBar
		? []
		: [
				{
					id: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
					label: 'ZombieNet',
					logo: coin,
					invertedLogo: coinInverted,
					endpoints: ['wss://rilt.kilt.io'],
					baseUrls: {
						doTreasury: 'https://polkadot.dotreasury.com',
						doTreasuryApi: 'https://polkadot-api.dotreasury.com',
						stateScanGraphqlApi: 'https://statescan.rilt.kilt.io/graphql',
						subScan: 'https://polkadot.subscan.io',
						subSquare: 'https://polkadot.subsquare.io',
						polkAssembly: 'https://polkadot.polkassembly.io'
					}
				} as const,
				{
					id: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
					label: 'Local',
					logo: coin,
					invertedLogo: coinInverted,
					endpoints: ['ws://localhost:8000'],
					baseUrls: {
						doTreasury: 'https://polkadot.dotreasury.com',
						doTreasuryApi: 'https://polkadot-api.dotreasury.com',
						stateScanGraphqlApi: 'https://dot-gh-api.statescan.io/graphql',
						subScan: 'https://polkadot.subscan.io',
						subSquare: 'https://polkadot.subsquare.io',
						polkAssembly: 'https://polkadot.polkassembly.io'
					}
				} as const
			])
];

export type Blockchain = (typeof blockchains)[number];

// exported only for chopsticks
export const endpointOverride = (() => {
	if (hideTestBar || typeof sessionStorage === 'undefined') {
		return null;
	}

	return sessionStorage.getItem('node');
})();

const current = blockchains.find(({ endpoints: [known] }) => endpointOverride?.startsWith(known));

if (endpointOverride && !current) {
	console.warn(`Connecting to Polkadot instead of stored "${endpointOverride}"`);
}

export const currentBlockchain = writable(current ?? blockchains[0]);
