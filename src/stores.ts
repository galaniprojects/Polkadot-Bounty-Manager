import { writable } from 'svelte/store';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import UniversalProvider from '@walletconnect/universal-provider';
import type { SessionTypes } from '@walletconnect/types';
import { WalletConnectSigner } from './utils/WcSigner';
import type { LoadingDialogState } from './types/loading-screen';

// Session.
export const isLoggedIn = writable(false);

const addresses: InjectedAccountWithMeta[] = [];
export const loggedAccounts = writable(addresses);

let account: InjectedAccountWithMeta | undefined;
export const activeAccount = writable(account);

export const usedExtension = writable('');

// WalletConnect.
let provider: UniversalProvider | undefined;
export const walletConnectProvider = writable(provider);

let session: SessionTypes.Struct | undefined;
export const walletConnectSession = writable(session);

let signer: WalletConnectSigner | undefined;
export const walletConnectSigner = writable(signer);

// Loading Dialog.
const state: LoadingDialogState = {
	open: false,
	status: 'loading',
	title: '',
	successMessage: '',
	errorMessage: ''
};
export const loadingDialogState = writable(state);
