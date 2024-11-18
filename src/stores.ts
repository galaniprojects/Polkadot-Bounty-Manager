import { writable } from 'svelte/store';
import type { LoadingDialogState } from './types/loading-screen';
import type { Bounty } from './types/bounty';
import type { BlockInfo } from './utils/polkadot';
import { PUBLIC_NODE_ENDPOINT } from '$env/static/public';
import type { AccountInfo } from './types/account';
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import {
	createClient,
	type PolkadotSigner
} from 'polkadot-api';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { dot } from '@polkadot-api/descriptors';

const sdkProvider = withPolkadotSdkCompat(getWsProvider(PUBLIC_NODE_ENDPOINT));
export const provider = writable(sdkProvider);

const sdkClient = createClient(sdkProvider);
export const client = writable(sdkClient);

export const nodeEndpoint = writable(PUBLIC_NODE_ENDPOINT);

const api = sdkClient.getTypedApi(dot);
export const dotApi = writable(api);

// Session.
export const activeAccount = writable<AccountInfo | undefined>(undefined);
export const usedExtension = writable<string | undefined>(undefined);
export const injectedPolkadotAccount = writable<InjectedPolkadotAccount | undefined>(undefined);

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
