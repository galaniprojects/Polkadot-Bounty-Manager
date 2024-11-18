import { SupportedSources, type AccountInfo } from '../../types/account';
import { WalletConnect } from '@reactive-dot/wallet-walletconnect';
import type { PolkadotSigner } from 'polkadot-api';

export async function walletConnect(): Promise<(AccountInfo & { signer: PolkadotSigner })[]> {
	const projectId = '75706f3e77002695ab0d89128b3e35bc';
	let wc = new WalletConnect({
		projectId: projectId,
		providerOptions: {
			metadata: {
				name: 'Bounty Manager',
				description: 'DAPP for managing polkadot bounties',
				url: 'http://bountymanager.io',
				icons: ['BOUNTY_MANAGER']
			}
		},
		chainIds: [
			'polkadot:91b171bb158e2d3848fa23a9f1c25182' // Polkadot
		]
	});
	await wc.initialize();

	await wc.connect();
	let accounts = await wc.getAccounts();
	const accountsInfo = accounts.map((wcAccount) => {
		const address = wcAccount.id.split(':')[2];
		const acc: AccountInfo & { signer: PolkadotSigner } = {
			name: 'Account',
			address: address,
			source: SupportedSources.WalletConnect,
			signer: wcAccount.polkadotSigner as PolkadotSigner
		};
		return acc;
	});

	return accountsInfo;

	// const projectId = '75706f3e77002695ab0d89128b3e35bc';
	// const provider: UniversalProvider = await UniversalProvider.init({
	// 	projectId: projectId,
	// 	relayUrl: 'wss://relay.walletconnect.com'
	// });
	// walletConnectProvider.set(provider);
	//
	// const params = {
	// 	requiredNamespaces: {
	// 		polkadot: {
	// 			methods: ['polkadot_signTransaction'],
	// 			chains: [POLKADOT_CHAIN_ID],
	// 			events: ['chainChanged", "accountsChanged']
	// 		}
	// 	}
	// };
	// const { uri, approval } = await provider.client.connect(params);
	//
	// const walletConnectModal = new WalletConnectModal({
	// 	projectId: projectId,
	// 	chains: [POLKADOT_CHAIN_ID],
	// 	enableExplorer: false
	// });
	//
	// if (uri) {
	// 	walletConnectModal.openModal({ uri });
	// } else {
	// 	//ToDo error.
	// }
	//
	// const wcSession: SessionTypes.Struct = await approval();
	// walletConnectSession.set(wcSession);
	// if (wcSession.peer.metadata.name !== 'Multix') {
	// 	throw new Error('only Multix is supported');
	// }
	//
	// const walletConnectAccount = Object.values(wcSession.namespaces)
	// 	.map((namespace) => namespace.accounts)
	// 	.flat();
	//
	// const accounts = walletConnectAccount.map((wcAccount) => {
	// 	const address = wcAccount.split(':')[2];
	// 	const accountWithMeta: AccountInfo = {
	// 		name: "Account",
	// 		address: address,
	// 		source: SupportedSources.WalletConnect
	// 	};
	// 	return accountWithMeta;
	// });
	//
	// // const signer = new WalletConnectSigner(provider.client, wcSession);
	// // walletConnectSigner.set(signer);
	// walletConnectModal.closeModal();
	// return accounts;
}
