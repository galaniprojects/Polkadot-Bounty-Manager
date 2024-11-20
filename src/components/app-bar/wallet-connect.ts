import { SupportedSources, type AccountInfo } from '../../types/account';
import { WalletConnect } from '@reactive-dot/wallet-walletconnect';
import { type PolkadotSigner } from 'polkadot-api';
import { walletConnect as wcConnection } from '../../stores';
import { convertToPolkadotAddress } from '../../utils/polkadot';

export async function walletConnect(): Promise<(AccountInfo & { signer: PolkadotSigner })[]> {
	const projectId = '75706f3e77002695ab0d89128b3e35bc';
	const wc = new WalletConnect({
		projectId: projectId,
		providerOptions: {
			metadata: {
				name: 'Bounty Manager',
				description: 'DAPP for managing polkadot bounties',
				url: 'http://bountymanager.io',
				icons: []
			}
		},
		chainIds: [
			'polkadot:91b171bb158e2d3848fa23a9f1c25182' // Polkadot
		]
	});
	wcConnection.set(wc);

	await wc.initialize();
	await wc.connect();
	const accounts = await wc.getAccounts();
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
