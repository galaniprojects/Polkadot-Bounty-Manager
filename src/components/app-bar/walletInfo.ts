export type SupportedWallets = 'Polkadot.js' | 'WalletConnect' | 'Nova Wallet' | 'Talisman';

export type WalletInfo = {
	icon: string;
	name: SupportedWallets;
	action: 'Download' | 'Connect';
};
