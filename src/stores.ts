import { writable } from 'svelte/store';
import type { LoadingDialogState } from './types/loading-screen';
import type { Bounty } from './types/bounty';
import { type ApiType } from './utils/createTypedApi';
import type { AccountInfo } from './types/account';
import { type PolkadotSigner } from 'polkadot-api';
import type { WalletConnect } from '@reactive-dot/wallet-walletconnect';

export const dotApi = writable<ApiType>();

export const blockChainMeta = writable<{
	ss58Format: number;
	decimals: number;
	multiplier: bigint;
	symbol: string;
}>();

// Session.
export const activeAccount = writable<AccountInfo | undefined>();

// WalletConnect.
export const walletConnect = writable<WalletConnect | undefined>();

export const polkadotSigner = writable<PolkadotSigner | undefined>();

// Loading Dialog.
const state: LoadingDialogState = {
	open: false,
	status: 'loading',
	title: '',
	successMessage: '',
	errorMessage: ''
};
export const loadingDialogState = writable(state);

// All bounties.
export const bounties = writable<Bounty[]>([]);

// Bounties and child bounties that are related to the active account.
export const activeAccountBounties = writable<Bounty[]>([]);

// For testing.
export const showAllBounties = writable<boolean>(false);
export const showAllCuratorOptions = writable<boolean>(false);
