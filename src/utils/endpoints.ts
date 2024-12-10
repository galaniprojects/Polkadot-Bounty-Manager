import { PUBLIC_NODE_ENDPOINT } from '$env/static/public';

const overrideEndpoints = PUBLIC_NODE_ENDPOINT && PUBLIC_NODE_ENDPOINT.length > 0;

export const endpoints = overrideEndpoints
	? [PUBLIC_NODE_ENDPOINT]
	: [
			'wss://polkadot-rpc.publicnode.com/',
			'wss://rpc.ibp.network/polkadot',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc-polkadot.luckyfriday.io',
			'wss://dot-rpc.stakeworld.io',
			'wss://polkadot.api.onfinality.io/public-ws'
		].sort(() => Math.sign(Math.random() - 0.5));
