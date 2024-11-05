import { writable } from 'svelte/store';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import UniversalProvider from '@walletconnect/universal-provider';
import type { SessionTypes } from '@walletconnect/types';
import { WalletConnectSigner } from './utils/WcSigner';
import type { LoadingDialogState } from './types/loading-screen';
import type { Bounty } from './types/bounty';
import type { BlockInfo } from './utils/polkadot';
import { PUBLIC_NODE_ENDPOINT } from '$env/static/public'

export const nodeEndpoint = writable(PUBLIC_NODE_ENDPOINT );

export const api = writable();

// Session.
export const activeAccount = writable<InjectedAccountWithMeta | undefined>(undefined);

export const usedExtension = writable<string>('');

// WalletConnect.
export const walletConnectProvider = writable<UniversalProvider | undefined>(undefined);

export const walletConnectSession = writable<SessionTypes.Struct | undefined>(undefined);

export const walletConnectSigner = writable<WalletConnectSigner | undefined>(undefined);

// Loading Dialog.
const state: LoadingDialogState = {
	open: false,
	status: 'loading',
	title: '',
	successMessage: '',
	errorMessage: ''
};
export const loadingDialogState = writable(state);

export const bounties = writable<Bounty[]>([]);

// Bounties and child bounties that are related to the active account.
export const activeAccountBounties = writable<Bounty[]>([]);

// misc
export const showAllBounties = writable<boolean>(false);
export const showAllCuratorOptions = writable<boolean>(false);
export const currentBlock = writable<BlockInfo | undefined>(undefined);
