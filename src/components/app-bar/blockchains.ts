import { writable } from 'svelte/store';
import coin from '../Input/coin.svg';
import coinInverted from './LogoPolkadot.svg';
import logoPaseo from './LogoPaseo.svg';
import paseoInverted from './LogoPaseoInverted.svg';
import { PUBLIC_STATESCAN_API_URL } from '$env/static/public';
import { hideTestBar } from '../../utils/hideTestBar';

const stateScanUrl: string = PUBLIC_STATESCAN_API_URL;

export const blockchains = [
	{
		id: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		label: 'Polkadot',
		logo: coin,
		invertedLogo: coinInverted,
		endpoint: '',
		baseUrls: {
			doTreasury: 'https://polkadot.dotreasury.com',
			doTreasuryApi: 'https://polkadot-api.dotreasury.com',
			stateScanGraphqlApi: stateScanUrl,
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
		endpoint: 'wss://paseo-rpc.dwellir.com',
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
					endpoint: 'wss://rilt.kilt.io',
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
					endpoint: 'ws://localhost:8000',
					baseUrls: {
						doTreasury: 'https://polkadot.dotreasury.com',
						doTreasuryApi: 'https://polkadot-api.dotreasury.com',
						subScan: 'https://polkadot.subscan.io',
						subSquare: 'https://polkadot.subsquare.io',
						polkAssembly: 'https://polkadot.polkassembly.io'
					}
				} as const
			])
];

export type Blockchain = (typeof blockchains)[number];

export const currentBlockchain = writable(blockchains[0]);
