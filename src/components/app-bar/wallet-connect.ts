import { walletConnectProvider, walletConnectSession, walletConnectSigner } from '../../stores';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import type { SessionTypes } from '@walletconnect/types';
import {
	POLKADOT_CHAIN_ID,
	WALLET_CONNECT_SOURCE,
	WalletConnectSigner
} from '../../utils/WcSigner';

export async function walletConnect(): Promise<InjectedAccountWithMeta[]> {
	const projectId = '75706f3e77002695ab0d89128b3e35bc';
	const provider: UniversalProvider = await UniversalProvider.init({
		projectId: projectId,
		relayUrl: 'wss://relay.walletconnect.com'
	});
	walletConnectProvider.set(provider);

	const params = {
		requiredNamespaces: {
			polkadot: {
				methods: ['polkadot_signTransaction'],
				chains: [POLKADOT_CHAIN_ID],
				events: ['chainChanged", "accountsChanged']
			}
		}
	};
	const { uri, approval } = await provider.client.connect(params);

	const walletConnectModal = new WalletConnectModal({
		projectId: projectId,
		chains: [POLKADOT_CHAIN_ID],
		enableExplorer: false
	});

	if (uri) {
		walletConnectModal.openModal({ uri });
	} else {
		//ToDo error.
	}

	const wcSession: SessionTypes.Struct = await approval();
	walletConnectSession.set(wcSession);
	if (wcSession.peer.metadata.name !== 'Multix') {
		throw new Error('only Multix is supported');
	}

	const walletConnectAccount = Object.values(wcSession.namespaces)
		.map((namespace) => namespace.accounts)
		.flat();

	const accounts = walletConnectAccount.map((wcAccount) => {
		const address = wcAccount.split(':')[2];
		const accountWithMeta: InjectedAccountWithMeta = {
			address: address,
			meta: {
				source: WALLET_CONNECT_SOURCE
			}
		};
		return accountWithMeta;
	});

	const signer = new WalletConnectSigner(provider.client, wcSession);
	walletConnectSigner.set(signer);
	walletConnectModal.closeModal();
	return accounts;
}
