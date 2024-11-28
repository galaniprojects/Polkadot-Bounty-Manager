export type SupportedWallets = 'Polkadot.js' | 'WalletConnect' | 'Nova Wallet' | 'Talisman';

export type WalletInfo = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
	name: SupportedWallets;
	action: 'Download' | 'Connect';
};
