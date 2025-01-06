import type { AccountInfo } from '../../types/account';

export type WalletInfo = {
	icon: string;
	name: string;
	available: boolean;
	source: AccountInfo['source'];
	url?: string;
};
