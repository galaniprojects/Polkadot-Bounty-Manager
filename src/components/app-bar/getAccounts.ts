import { connectInjectedExtension } from 'polkadot-api/pjs-signer';
import { getWalletConnectAccounts } from '../../utils/getWalletConnectAccounts';
import { convertToPolkadotAddress } from '../../utils/polkadot';
import type { WalletInfo } from './walletInfo';

const APP_NAME = 'Bounty Manager';

export async function getAccounts(source: WalletInfo['source']) {
	if (source === 'WalletConnect') {
		return await getWalletConnectAccounts();
	}

	const injectedExtension = await connectInjectedExtension(source, APP_NAME);
	const injectedAccounts = injectedExtension.getAccounts();
	return injectedAccounts.map(({ address, name = 'Account', polkadotSigner }) => ({
		name,
		source,
		polkadotSigner,
		address: convertToPolkadotAddress(address)
	}));
}
