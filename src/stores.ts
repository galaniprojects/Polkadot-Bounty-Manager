import { writable } from 'svelte/store';
import type { LoadingDialogState } from './types/loading-screen';
import type { Bounty } from './types/bounty';
import { createTypedApi, type BlockInfo } from './utils/polkadot';
import { PUBLIC_NODE_ENDPOINT } from '$env/static/public';
import type { AccountInfo } from './types/account';
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import { type PolkadotSigner } from 'polkadot-api';
import type { WalletConnect } from '@reactive-dot/wallet-walletconnect';

export const nodeEndpoint = writable(PUBLIC_NODE_ENDPOINT);

export const dotApi = writable(createTypedApi(PUBLIC_NODE_ENDPOINT));

// Session.
export const activeAccount = writable<AccountInfo | undefined>(undefined);
export const usedExtension = writable<string | undefined>(undefined);
export const injectedPolkadotAccount = writable<InjectedPolkadotAccount | undefined>(undefined);
export const walletConnect = writable<WalletConnect | undefined>();

// WalletConnect.
export const walletConnectPolkadotSigner = writable<PolkadotSigner | undefined>(undefined);

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

// Misc
export const showAllBounties = writable<boolean>(false);
export const showAllCuratorOptions = writable<boolean>(false);
export const currentBlock = writable<BlockInfo | undefined>(undefined);
