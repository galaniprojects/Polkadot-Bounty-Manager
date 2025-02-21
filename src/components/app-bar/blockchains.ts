import { writable } from 'svelte/store';
import coin from '../Input/coin.svg';
import coinInverted from './LogoPolkadot.svg';
import logoPaseo from './LogoPaseo.svg';
import paseoInverted from './LogoPaseoInverted.svg';

export const blockchains = [
	{
		id: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		label: 'Polkadot',
		logo: coin,
		invertedLogo: coinInverted,
		endpoint: ''
	} as const,
	{
		id: 'polkadot:77afd6190f1554ad45fd0d31aee62aac',
		label: 'Paseo',
		logo: logoPaseo,
		invertedLogo: paseoInverted,
		endpoint: 'wss://paseo-rpc.dwellir.com'
	} as const
];

export type Blockchain = (typeof blockchains)[number];

export const currentBlockchain = writable(blockchains[0]);
