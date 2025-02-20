import { PUBLIC_NODE_ENDPOINT } from '$env/static/public';
import { hideTestBar } from './hideTestBar';

export function getEndpoint() {
	const storedEndpoint =
		(typeof sessionStorage !== 'undefined' && sessionStorage.getItem('node')) || undefined;

	return (!hideTestBar && storedEndpoint) || PUBLIC_NODE_ENDPOINT;
}

export const customEndpoint = getEndpoint();

const overrideEndpoints = PUBLIC_NODE_ENDPOINT !== 'RANDOM';

export const endpoints = overrideEndpoints
	? [customEndpoint]
	: [
			'wss://polkadot-rpc.publicnode.com/',
			'wss://rpc.ibp.network/polkadot',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc-polkadot.luckyfriday.io',
			'wss://dot-rpc.stakeworld.io',
			'wss://polkadot.api.onfinality.io/public-ws'
		].sort(() => Math.sign(Math.random() - 0.5));
