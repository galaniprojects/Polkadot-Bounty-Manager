import { writable } from 'svelte/store';
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types'

export const isLoggedIn = writable(false);
const addresses: InjectedAccountWithMeta[] = [];
export const loggedAccounts = writable(addresses);
let account: InjectedAccountWithMeta | undefined;
export const activeAccount = writable(account);
export const usedExtension = writable('');
