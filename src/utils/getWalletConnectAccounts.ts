import { PUBLIC_WALLET_CONNECT_PROJECT_ID as projectId } from '$env/static/public';
import { type AccountWithSigner } from '../types/account';
import { WalletConnect } from '@reactive-dot/wallet-walletconnect';
import { type PolkadotSigner } from 'polkadot-api';
import { walletConnect } from '../stores';
import { convertToPolkadotAddress } from './polkadot';
import { get } from 'svelte/store';
import { currentBlockchain } from '../components/app-bar/blockchains';

export async function getWalletConnectAccounts(): Promise<AccountWithSigner[]> {
	const connection = createConnection();
	walletConnect.set(connection);
	await connection.initialize();

	let accounts = await connection.getAccounts();
	if (accounts.length === 0) {
		await connection.connect();
	}
	accounts = await connection.getAccounts();

	return accounts.map(
		({ id, name = 'Account', polkadotSigner }) =>
			<AccountWithSigner>{
				name,
				address: convertToPolkadotAddress(id.split(':')[2]),
				source: 'WalletConnect',
				polkadotSigner: polkadotSigner as PolkadotSigner
			}
	);
}

function createConnection() {
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
		chainIds: [get(currentBlockchain).id]
	});
}
