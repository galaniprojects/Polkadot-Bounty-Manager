export interface AccountInfo {
	address: string;
	name: string;
	source: SupportedSources;
}

export enum SupportedSources {
	PolkadotExtension = 'polkadot-js',
	NovaExtension = 'nova',
	TalismanExtension = 'talisman',
	WalletConnect = 'WalletConnect'
}
