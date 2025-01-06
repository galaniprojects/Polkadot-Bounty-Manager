import type { PolkadotSigner } from 'polkadot-api/pjs-signer';

export interface AccountInfo {
	address: string;
	name: string;
	source: 'polkadot-js' | 'nova' | 'talisman' | 'WalletConnect';
}

export interface AccountWithSigner extends AccountInfo {
	polkadotSigner: PolkadotSigner;
}
