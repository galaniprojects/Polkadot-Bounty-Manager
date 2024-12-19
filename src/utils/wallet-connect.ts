import { PUBLIC_WALLET_CONNECT_PROJECT_ID as projectId } from '$env/static/public';
import { type AccountWithSigner } from '../types/account';
import { WalletConnect } from '@reactive-dot/wallet-walletconnect';
import { type PolkadotSigner } from 'polkadot-api';
import { walletConnect as wcConnection } from '../stores';
import { convertToPolkadotAddress } from './polkadot';

export async function walletConnect(): Promise<AccountWithSigner[]> {
	const wc = createWCConnection();
	wcConnection.set(wc);
	await wc.initialize();

	let accounts = await wc.getAccounts();
	if (accounts.length === 0) {
		await wc.connect();
	}
	accounts = await wc.getAccounts();

	return accounts.map(
		({ id, polkadotSigner }) =>
			<AccountWithSigner>{
				name: 'Account',
				address: convertToPolkadotAddress(id.split(':')[2]),
				source: 'WalletConnect',
				polkadotSigner: polkadotSigner as PolkadotSigner
			}
	);
}

export function createWCConnection() {
	return new WalletConnect({
		projectId,
		providerOptions: {
			metadata: {
				name: 'Bounty Manager',
				description: 'DAPP for managing polkadot bounties',
				url: 'https://bountymanager.io',
				icons: []
			}
		},
		chainIds: [
			'polkadot:91b171bb158e2d3848fa23a9f1c25182' //polkadot
			// 'polkadot:77afd6190f1554ad45fd0d31aee62aac' // Paseo
		]
	});
}
