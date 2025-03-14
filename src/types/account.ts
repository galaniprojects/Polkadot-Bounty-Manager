import type { PolkadotSigner } from 'polkadot-api/pjs-signer';

export interface AccountInfo {
	address: string;
	name: string;
	source: 'polkadot-js' | 'nova' | 'talisman' | 'WalletConnect' | 'mimir';
	// The multisigs that this account is part of.
	multisigs?: MultisigInfo[];
}

export interface MultisigInfo {
	address: string;
	signatories: string[];
	threshold: number;
}

export interface AccountWithSigner extends AccountInfo {
	polkadotSigner: PolkadotSigner;
}
