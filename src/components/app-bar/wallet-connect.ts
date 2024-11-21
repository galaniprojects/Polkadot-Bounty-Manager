import { SupportedSources, type AccountInfo } from '../../types/account';
import { WalletConnect } from '@reactive-dot/wallet-walletconnect';
import { type PolkadotSigner } from 'polkadot-api';
import { walletConnect as wcConnection } from '../../stores';
import { convertToPolkadotAddress } from '../../utils/polkadot';

const PROJECT_ID = '75706f3e77002695ab0d89128b3e35bc';
export async function walletConnect(): Promise<(AccountInfo & { signer: PolkadotSigner })[]> {
	const wc = createWCConnection();
	wcConnection.set(wc);

	await wc.initialize();
	let accounts = await wc.getAccounts();
	if (accounts.length === 0) {
		await wc.connect();
	}
	accounts = await wc.getAccounts();
	const accountsInfo = accounts.map((wcAccount) => {
		const address = wcAccount.id.split(':')[2];
		const account: AccountInfo & { signer: PolkadotSigner } = {
			name: 'Account',
			address: convertToPolkadotAddress(address),
			source: SupportedSources.WalletConnect,
			signer: wcAccount.polkadotSigner as PolkadotSigner
		};
		return account;
	});
	return accountsInfo;
}

export function createWCConnection() {
	return new WalletConnect({
		projectId: PROJECT_ID,
		providerOptions: {
			metadata: {
				name: 'Bounty Manager',
				description: 'DAPP for managing polkadot bounties',
				url: 'http://bountymanager.io',
				icons: []
			}
		},
		chainIds: [
			'polkadot:91b171bb158e2d3848fa23a9f1c25182', //polkadot
			'polkadot:77afd6190f1554ad45fd0d31aee62aac' // Paseo
		]
	});
}
