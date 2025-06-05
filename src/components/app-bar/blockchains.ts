import { writable } from 'svelte/store';
import coin from '../Input/coin.svg';
import coinInverted from './LogoPolkadot.svg';
import kusama from './LogoKusama.svg';
import kusamaInverted from './LogoKusamaInverted.svg';
// import logoPaseo from './LogoPaseo.svg';
// import paseoInverted from './LogoPaseoInverted.svg';
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
			subSquareApi: 'https://polkadot-api.subsquare.io',
			polkAssembly: 'https://polkadot.polkassembly.io'
		}
	} as const,
	{
		id: 'polkadot:b0a8d493285c2df73290dfb7e61f870f',
		label: 'Kusama',
		logo: kusama,
		invertedLogo: kusamaInverted,
		endpoints: ['wss://kusama-rpc.dwellir.com'],
		descriptorsGetter: async () => (await import('@polkadot-api/descriptors')).kusama,
		baseUrls: {
			doTreasury: 'https://kusama.dotreasury.com',
			doTreasuryApi: 'https://kusama-api.dotreasury.com',
			stateScanGraphqlApi: 'https://ksm-gh-api.statescan.io/graphql',
			subScan: 'https://kusama.subscan.io',
			subSquare: 'https://kusama.subsquare.io',
			subSquareApi: 'https://kusama-api.subsquare.io',
			polkAssembly: 'https://kusama.polkassembly.io'
		}
	} as const,
	// {
	// 	id: 'polkadot:77afd6190f1554ad45fd0d31aee62aac',
	// 	label: 'Paseo',
	// 	logo: logoPaseo,
	// 	invertedLogo: paseoInverted,
	// 	endpoints: ['wss://paseo-rpc.dwellir.com'],
	//  descriptorsGetter: async () => (await import('@polkadot-api/descriptors')).paseo,
	// 	baseUrls: {
	// 		subScan: 'https://paseo.subscan.io',
	// 		subSquare: 'https://paseo.subsquare.io',
	// 		polkAssembly: 'https://paseo.polkassembly.io'
	// 	}
	// } as const,
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
						stateScanGraphqlApi: 'https://statescan.rilt.kilt.io/graphql'
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
						subSquareApi: 'https://polkadot-api.subsquare.io',
						polkAssembly: 'https://polkadot.polkassembly.io'
					}
				} as const
			])
];

export type Blockchain = (typeof blockchains)[number];

const endpointOverride =
	hideTestBar || typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem('node');

const current = blockchains.find(({ endpoints: [known] }) => endpointOverride?.startsWith(known));

if (endpointOverride && !current) {
	console.warn(`Connecting to Polkadot instead of stored "${endpointOverride}"`);
}

export const currentBlockchain = writable(current ?? blockchains[0]);
